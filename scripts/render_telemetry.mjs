#!/usr/bin/env node
// Builds assets/telemetry-dark.svg and assets/telemetry-light.svg from data/telemetry.json (written by telemetry.mjs).
// The only motion is the lines typing out, a pause, then a repeat. Viewers that block animation or ask for reduced
// motion get the finished text. A null number prints NOT READ; nothing is ever filled in from an older run.
import { readFileSync, writeFileSync } from "node:fs";

const at = (p) => new URL(`../${p}`, import.meta.url);
const D = JSON.parse(readFileSync(at("data/telemetry.json"), "utf8"));
// Subset of IBM Plex Mono 500 (SIL OFL 1.1, renamed per the licence, see scripts/fonts/OFL-IBMPlexMono.txt).
const FONT = readFileSync(at("scripts/fonts/hb-mono-500-subset.woff2")).toString("base64");
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,:;/-_>()+'%#=|$·";
const FS = 23, LH = 37, X0 = 44, W = 1000, CW = FS * 0.6;  // font size, line height, left margin, width; mono advance
const BONE = "#EAE6DF", AMBER = "#F2A541", INK = "#14161A", PAPER = "#F6F4EF";  // sampled from the brand art

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const g = new Date(D.generatedAt);
const pad = (n) => String(n).padStart(2, "0");
const stamp = `${g.getUTCDate()} ${MONTHS[g.getUTCMonth()]} ${g.getUTCFullYear()} ${pad(g.getUTCHours())}:${pad(g.getUTCMinutes())}`;
const num = (v) => (v === null || v === undefined ? "NOT READ" : v.toLocaleString("en-US"));
const dots = (label, value, width = 44) => `${label} ${".".repeat(Math.max(3, width - label.length - value.length - 2))} ${value}`;
const ours = D.dapp_index_ours;
const oursNote = !ours ? "" : ours.length ? `   ${ours.length} of them ours` : "   ours not listed";

const LINES = [  // [text, role]
  ["$ node scripts/telemetry.mjs", "cmd"],
  ["Public Sui testnet reads, EVE Frontier Stillness (Cycle 7)", "dim"],
  [`GENERATED ${stamp} UTC · DAILY JOB · PUBLIC CHAIN READS`, "dim"],
  ["", "gap"],
  [dots("killmails, last 24 h (chain time)", num(D.killmails_24h)), "val"],
  [dots("gate jumps, last 24 h (chain time)", num(D.gate_jumps_24h)), "val"],
  [dots("new structures anchored, last 24 h", num(D.structure_events_24h)), "val"],
  [dots("Dapp Index listings", num(D.dapp_index_listings_total)) + (D.dapp_index_listings_total === null ? "" : oursNote), "val"],
  [`${D.graphql_requests} GraphQL requests, ${D.run_seconds} s. Window ends at the time above.`, "dim"],
];
const MAX_CHARS = Math.floor((W - 2 * X0) / CW);  // 66: anything longer would run off the panel
for (const [txt] of LINES) {
  if (txt.length > MAX_CHARS) throw new Error(`line is ${txt.length} chars, over ${MAX_CHARS}: ${txt}`);
  for (const ch of txt) if (!GLYPHS.includes(ch)) throw new Error(`glyph "${ch}" is not in the font subset`);
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cut = (s, sep) => { const i = s.indexOf(sep); return [s.slice(0, i), s.slice(i + sep.length)]; };

function svg(mode) {
  const dark = mode === "dark";
  const bg = dark ? "#0B0C0F" : PAPER, fg = dark ? BONE : INK, dim = dark ? "#8A8F98" : "#5B6270", acc = dark ? AMBER : "#9A5A12";
  const H = 40 + LH * (LINES.length + 1) + 18, T = 18.0;  // T = one typing cycle, seconds
  const css = [], body = [];
  let t = 0.6;
  LINES.forEach(([txt, role], i) => {
    const y = 40 + LH * i + FS;
    if (role === "gap" || !txt) return;
    const n = txt.length, w = n * CW + 4;
    const dur = role !== "val" ? Math.max(0.25, n * 0.008) : Math.max(0.3, n * 0.0105);
    const a = (t / T) * 100, b = ((t + dur) / T) * 100;
    // The cover rect rests to the RIGHT of the text (text visible). The animation pulls it over the text and lets it
    // slide off one character per step, so with animation off the text simply shows.
    css.push(`@keyframes k${i}{0%,${a.toFixed(2)}%{transform:translateX(-${w.toFixed(0)}px)}${b.toFixed(2)}%,97%{transform:translateX(0)}100%{transform:translateX(-${w.toFixed(0)}px)}}` +
      `.c${i}{animation:k${i} ${T}s steps(${n},end) infinite}`);
    const color = { cmd: acc, dim, val: fg }[role];
    let tsp = esc(txt);
    if (role === "val") {  // label bright, dot leaders dim, value in the accent, any note dim
      const [label, rest] = cut(txt, " .");
      const [dotsPart, after] = cut(rest, ". ");
      const [value, note] = after.includes("   ") ? cut(after, "   ") : [after, null];
      tsp = `${esc(label)}<tspan fill="${dim}"> .${dotsPart}. </tspan><tspan fill="${acc}">${esc(value)}</tspan>` +
        (note === null ? "" : `<tspan fill="${dim}">   ${esc(note)}</tspan>`);
    }
    body.push(`<text x="${X0}" y="${y}" fill="${color}">${tsp}</text>` +
      `<rect class="c${i}" x="${(X0 - 2 + w).toFixed(0)}" y="${y - FS}" width="${(w + 4).toFixed(0)}" height="${LH}" fill="${bg}"/>`);
    t += dur + (role === "cmd" ? 0.4 : 0.12);
  });
  const yc = 40 + LH * LINES.length + FS, a = (t / T) * 100;
  css.push(`@keyframes cur{0%,${a.toFixed(2)}%{opacity:0}${(a + 0.01).toFixed(2)}%,100%{opacity:1}}.cur{animation:cur ${T}s step-end infinite}` +
    `@keyframes blink{50%{opacity:0}}.blink{animation:blink 1.1s step-end infinite}`);
  body.push(`<g class="cur"><text x="${X0}" y="${yc}" fill="${acc}">$</text>` +
    `<rect class="blink" x="${(X0 + 2 * CW).toFixed(0)}" y="${yc - FS + 3}" width="${CW.toFixed(0)}" height="${FS + 2}" fill="${fg}"/></g>`);
  const label = `Daily chain readout generated ${stamp} UTC: ${num(D.killmails_24h)} killmails, ${num(D.gate_jumps_24h)} gate jumps and ${num(D.structure_events_24h)} new structures on EVE Frontier Stillness in the last 24 hours; ${num(D.dapp_index_listings_total)} Dapp Index listings.`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">
<style>
@font-face { font-family: "HB Mono"; src: url(data:font/woff2;base64,${FONT}) format("woff2"); font-weight: 500; }
text { font-family: "HB Mono", "IBM Plex Mono", Consolas, monospace; font-size: ${FS}px; font-weight: 500; white-space: pre; }
${css.join("")}
@media (prefers-reduced-motion: reduce) { rect, g { animation: none !important; } }
</style>
<rect width="${W}" height="${H}" fill="${bg}"/>
${body.join("")}
</svg>
`;
}

for (const mode of ["dark", "light"]) {
  const out = at(`assets/telemetry-${mode}.svg`);
  writeFileSync(out, svg(mode));
  console.log(`assets/telemetry-${mode}.svg`, Math.round(readFileSync(out).length / 1024), "KB");
}
