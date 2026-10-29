<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/hero-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/hero-light.svg">
  <img alt="Honey Badger. Game mods, servers and tools." src="assets/hero-dark.svg" width="100%">
</picture>

I'm Honey Badger, and I've been writing code since 1996 — two decades of game development and modding behind me. These days I build mods, servers and tools for the games I play, on my own.

<a href="https://honeybadger.software/frontier/warroom/"><img src="assets/warroom-map.jpg" width="100%" alt="The War Room for EVE Frontier: kill map in the middle, live feed on the left, top hunter's dossier on the right. Click to open it."></a>

<sub>The War Room, reading EVE Frontier's Stillness world from the chain. [Open it](https://honeybadger.software/frontier/warroom/).</sub>

### What's live

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/telemetry-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/telemetry-light.svg">
  <img alt="Daily chain readout for EVE Frontier Stillness: killmails, gate jumps and new structures in the last 24 hours, plus Dapp Index listings. The panel shows when it was generated." src="assets/telemetry-dark.svg" width="100%">
</picture>

<sub>Rebuilt once a day by a GitHub Action from public Sui testnet reads: <a href="scripts/telemetry.mjs">scripts/telemetry.mjs</a>, <a href=".github/workflows/telemetry.yml">the workflow</a>. Daily counts, not a live feed. If one read fails it shows NOT READ; if every read fails, yesterday's panel stays up.</sub>

**24 Oct 2026.** The War Room and the Bounty Board are registered on the EVE Frontier Dapp Index.<br>
**22 Oct 2026.** War Room got three levels of detail on every page, measured kill delays, a map of charted systems and a back-fill of older killmails.<br>
**10 Oct 2026.** Named the Rust server Honey Badger and put my first plugin on it.

<details><summary>Earlier</summary>

**2 Oct 2026.** Battle Aura 3.1.1 for WoW Forever uploaded to CurseForge. WoWInterface has it too.<br>
**29 Sep 2026.** Republished the Bounty Board contract for Cycle 7.

</details>

### Background

Game development and modding since the early 2000s, starting at Valve — Half-Life 2, Counter-Strike 1.6 and Source, and Black Mesa — and mod work since across Counter-Strike: Global Offensive, Dota, Garry's Mod, and Unity. The mods and tools below are where that leads today.

### The mods

#### War Room &nbsp;<sub>EVE Frontier</sub>

PvP intel built from public chain events. It shows kills and killers, and how late each killmail reached the chain, which is often hours. The chain doesn't show who is online, and neither does the War Room.

<a href="https://honeybadger.software/frontier/warroom/"><img src="assets/warroom-dossier-jet.jpg" width="100%" alt="War Room dossier for Jet: one character on this wallet, 0 kills and 9 losses over 24 days, last signed action 10 h 30 min ago, bounty marked EARNED - UNCOLLECTED, 0.2 SUI"></a>

React 19, TypeScript and Vite, reading Sui testnet through GraphQL and a gRPC-web stream, polling when the stream drops. &nbsp;[Open](https://honeybadger.software/frontier/warroom/) &nbsp;Source is private.

#### Bounty Board &nbsp;<sub>EVE Frontier</sub>

Post a bounty on any pilot. If the target loses a ship before it runs out, the contract lets the killer claim it, with the game's own killmail as proof. No platform fee, just network gas. Nobody has collected one yet, so that last step is still untested. "Earned" on the board means a kill qualified, not that it was paid.

<a href="https://honeybadger.software/frontier/bounty/"><img src="assets/bounty-board.jpg" width="100%" alt="Honey Badger Bounty Board: wanted list on the left, post-a-bounty panel on the right"></a>

Move contract `hb_bounty::bounty_board` on Sui testnet (Stillness), with a React front end. &nbsp;[Open](https://honeybadger.software/frontier/bounty/) &nbsp;[Source](https://github.com/honeybadger-software/eve-frontier-bounty-board)

#### Honey Badger &nbsp;<sub>Rust server</sub>

My own Rust server, running Carbon. The HUD across the top of these frames is mine. The gate and the vault were placed by my build plugin from saved layouts.

<a href="assets/full/rust-gate-sign-1920.jpg"><img src="assets/rust-gate-sign.jpg" width="50%" alt="Rust: the gate with its painted sign, Honey Badger HUD across the top. Click for full size."></a><a href="assets/full/rust-vault-1280.jpg"><img src="assets/rust-vault.jpg" width="50%" alt="Rust: vault interior with the painted vault door and team score bar. Click for full size."></a>

<sub>Build: places whole structures from saved layouts. &nbsp; Map Forge: edits terrain layers and saves a new .map. &nbsp; DPS HUD: damage, headshots, last hit, target, accuracy. &nbsp; TDM: two-team deathmatch.</sub>

C# plugins on Carbon, using the Oxide and Carbon plugin APIs. Listed in the Rust server browser under Modded, or from the F1 console: `client.connect 216.39.241.155:27915` &nbsp;Source is private.

#### Battle Aura &nbsp;<sub>WoW Forever</sub>

A personal damage meter with a battle scene behind the numbers. Total damage, biggest hit and DPS. Hits float up over the scene, and a banner marks a new personal best.

<a href="https://www.curseforge.com/wow/addons/battle-aura"><img src="assets/battle-aura-test-preview.gif" width="100%" alt="Battle Aura test preview: hit numbers rise off the sword, two orange crits, the combo counter climbs to 14, NEW BEST HIT banner, red hurt flash at the finish"></a>

<sub>The addon's built-in `/ba test` preview, drawn by running its own Lua over a real fight capture. &nbsp;<a href="assets/battle-aura-in-game.jpg">The still from that fight</a></sub>

Lua addon on Blizzard's own damage meter API (C_DamageMeter), so it works with Forever's restricted combat data. &nbsp;[CurseForge](https://www.curseforge.com/wow/addons/battle-aura) &nbsp;[WoWInterface](https://www.wowinterface.com/downloads/info27234-BattleAura.html) &nbsp;[Source](https://github.com/honeybadger-software/battle-aura)

#### EVE Fleet Foreman &nbsp;<sub>EVE Online</sub>

Free mining helper. Ranks ores by ISK per m³ from Jita prices, tells you whether to refine or sell, and works out the fleet split from the Mining Ledger.

<a href="https://github.com/honeybadger-software/eve-fleet-foreman"><img src="assets/foreman-what-to-mine.jpg" width="50%" alt="Fleet Foreman: What to Mine table"></a><a href="https://github.com/honeybadger-software/eve-fleet-foreman"><img src="assets/foreman-refine.jpg" width="50%" alt="Fleet Foreman: Refine tab, sell raw or reprocess verdict for 100,000 Mercoxit"></a>

Python and NiceGUI, with CCP's ESI and EVE SSO (PKCE) for the ledger and Fuzzwork for prices. &nbsp;[Download the Windows .exe](https://github.com/honeybadger-software/eve-fleet-foreman/releases/latest) &nbsp;[Source](https://github.com/honeybadger-software/eve-fleet-foreman)

### Software and industrial

I also build tools for machines: J1 Bridge for the Snapmaker J1 and OrcaSlicer, a CAN-bus dash for the C7 Corvette, and plant-floor dashboards that read blenders and PLCs. More at [honeybadger.software/industrial](https://honeybadger.software/industrial).

### Contact

[honeybadger.software](https://honeybadger.software) &nbsp; [@HoneyBadgerMods](https://x.com/HoneyBadgerMods) on X &nbsp; HONEYBADGERSOFTWARE in EVE Frontier

<sub>EVE Frontier material is used with limited permission of CCP Games. Not affiliated with or endorsed by CCP Games, Facepunch or Blizzard.</sub>
