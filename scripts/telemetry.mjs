#!/usr/bin/env node
// Daily telemetry for the profile README. Node 20+, no dependencies, no keys.
// Reads ONLY public endpoints and writes data/telemetry.json:
//   - Sui testnet GraphQL: EVE Frontier "Stillness" Cycle 7 world events (killmails, gate jumps, new structures)
//   - the same endpoint: the EVE Frontier Dapp Index registry object (one dynamic field per listing)
// Honesty rules: a number that cannot be read COMPLETELY is written as null (the panel prints NOT READ); nothing is
// carried over from an older run. If nothing at all can be read, the script exits 1 and writes nothing, so the
// daily Action has nothing to commit.
import { mkdirSync, writeFileSync } from "node:fs";

const ENDPOINT = "https://graphql.testnet.sui.io/graphql";
const WORLD = "0x7be18d6294e533bedd9a5d70a96ce8d9d4b87a7c74188ba65d3fe966bbed9d92"; // Cycle 7 world package
const REGISTRY = "0x81bdd87afb38e560c04aca9afa64775bd8b2af1a644a7424c64511ed9ba8916b"; // Dapp Index DappRegistry
const OUR_SLUGS = ["honey-badger-war-room", "honey-badger-bounty-board"];
const TENANT = "stillness"; // the world package also carries other game tenants; only Stillness is counted
const STRUCTURE_TYPES = ["assembly::AssemblyCreatedEvent", "storage_unit::StorageUnitCreatedEvent",
  "gate::GateCreatedEvent", "turret::TurretCreatedEvent", "network_node::NetworkNodeCreatedEvent"];
const MAX_REQUESTS = 60, GAP_MS = 350, PAGE = 50, WINDOW_H = 24;

const started = Date.now();
const until = started, since = started - WINDOW_H * 3600_000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let requests = 0, lastStart = 0;

// One POST to GraphQL: paced (one start per GAP_MS), 3 tries with backoff, hard budget across the whole run.
async function gql(query, variables) {
  for (let attempt = 1; ; attempt++) {
    if (requests >= MAX_REQUESTS) throw new Error(`request budget of ${MAX_REQUESTS} used up`);
    await sleep(Math.max(0, lastStart + GAP_MS - Date.now()));
    lastStart = Date.now(); requests++;
    try {
      const res = await fetch(ENDPOINT, { method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ query, variables }), signal: AbortSignal.timeout(20_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      if (body.errors?.length) throw new Error(body.errors.map((e) => e.message).join("; "));
      return body.data;
    } catch (err) {
      if (attempt >= 3) throw err;
      await sleep(1500 * attempt);
    }
  }
}

// True when any { tenant } inside the event names another game tenant.
const foreign = (v) => !!v && typeof v === "object" &&
  ((typeof v.tenant === "string" && v.tenant !== TENANT) || Object.values(v).some(foreign));

// Every Stillness event of one type whose CHAIN time (checkpoint timestamp) is inside the window.
// Pages newest-first (last:50, before:cursor) until a page reaches past the window start.
const Q_EVENTS = `query($t:String!,$b:String){events(filter:{type:$t},last:${PAGE},before:$b){pageInfo{hasPreviousPage startCursor}nodes{timestamp contents{json}}}}`;
async function eventsInWindow(type, maxPages) {
  const out = [];
  let before = null;
  for (let page = 0; page < maxPages; page++) {
    const { events } = await gql(Q_EVENTS, { t: `${WORLD}::${type}`, b: before });
    let reachedStart = false;
    for (const n of events.nodes) {
      const t = Date.parse(n.timestamp);
      if (!Number.isFinite(t)) throw new Error(`${type}: event without a chain timestamp`);
      if (t < since) reachedStart = true;
      else if (t <= until && !foreign(n.contents?.json)) out.push(n.contents?.json ?? {});
    }
    if (reachedStart || !events.pageInfo.hasPreviousPage) return out;
    before = events.pageInfo.startCursor;
  }
  throw new Error(`${type}: more than ${maxPages * PAGE} events in ${WINDOW_H} h, count would be incomplete`);
}

// The registry keeps one dynamic field per listing; its value is the DappListing struct (with a `slug`).
const Q_REGISTRY = `query($id:SuiAddress!,$a:String){object(address:$id){asMoveObject{dynamicFields(first:50,after:$a){pageInfo{hasNextPage endCursor}nodes{value{...on MoveValue{json}}}}}}}`;
async function registrySlugs() {
  const slugs = [];
  let after = null;
  for (let page = 0; page < 4; page++) {
    const fields = (await gql(Q_REGISTRY, { id: REGISTRY, a: after })).object?.asMoveObject?.dynamicFields;
    if (!fields) throw new Error("registry object not found");
    for (const n of fields.nodes) slugs.push(n.value?.json?.slug ?? null);
    if (!fields.pageInfo.hasNextPage) return slugs;
    after = fields.pageInfo.endCursor;
  }
  throw new Error("registry has more than 200 listings, count would be incomplete");
}

const notRead = {};
async function read(name, fn) {
  try { return await fn(); } catch (err) { notRead[name] = String(err.message ?? err); return null; }
}

const slugs = await read("dapp_index_listings_total", registrySlugs);
const kills = await read("killmails_24h", () => eventsInWindow("killmail::KillmailCreatedEvent", 8));
const jumps = await read("gate_jumps_24h", () => eventsInWindow("gate::JumpEvent", 36));
// New structures anchored: all five "created" event types, de-duplicated by the structure's game key.
const structures = await read("structure_events_24h", async () => {
  const keys = new Set();
  for (const type of STRUCTURE_TYPES) {
    for (const j of await eventsInWindow(type, 6)) keys.add(j.assembly_key?.item_id ?? JSON.stringify(j));
  }
  return keys.size;
});

const iso = (ms) => new Date(ms).toISOString().replace(/\.\d+Z$/, "Z");
const data = {
  generatedAt: iso(started),
  window: { hours: WINDOW_H, from: iso(since), to: iso(until), clock: "chain time (checkpoint timestamp)" },
  killmails_24h: kills?.length ?? null,
  gate_jumps_24h: jumps?.length ?? null,
  structure_events_24h: structures,
  structure_events_meaning: "new structures anchored (assembly, storage unit, gate, turret, network node), distinct",
  dapp_index_listings_total: slugs?.length ?? null,
  dapp_index_ours: slugs ? OUR_SLUGS.filter((s) => slugs.includes(s)) : null,
  graphql_requests: requests,
  run_seconds: Math.round((Date.now() - started) / 1000),
  not_read: notRead,
  source: `Sui testnet GraphQL ${ENDPOINT}: events of world package ${WORLD} (tenant ${TENANT}) and dynamic fields of Dapp Index registry ${REGISTRY}. Public reads, no keys.`,
};
const values = [data.killmails_24h, data.gate_jumps_24h, data.structure_events_24h, data.dapp_index_listings_total];
console.log(JSON.stringify(data, null, 2));
if (values.every((v) => v === null)) {
  console.error("Nothing could be read; data/telemetry.json left unchanged.");
  process.exit(1);
}
mkdirSync(new URL("../data/", import.meta.url), { recursive: true });
writeFileSync(new URL("../data/telemetry.json", import.meta.url), JSON.stringify(data, null, 2) + "\n");
