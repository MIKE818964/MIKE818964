<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/hero-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/hero-light.svg">
  <img alt="Honey Badger. Game mods, servers and tools." src="assets/hero-dark.svg" width="100%">
</picture>

I'm Honey Badger. I've been writing code since 1996. These days I build mods, servers and tools for the games I play, on my own. The screenshots below come straight from the projects.

### COMM-LINK

**24 Oct 2026.** The War Room and the Bounty Board are registered on the EVE Frontier Dapp Index.<br>
**22 Oct 2026.** Shipped the War Room depth release for Cycle 7 on Stillness.<br>
**10 Oct 2026.** Named the Rust server Honey Badger and put my first plugin on it.<br>
**2 Oct 2026.** Battle Aura 3.1.1 for WoW Forever uploaded to CurseForge. WoWInterface has it too.<br>
**29 Sep 2026.** Republished the Bounty Board contract for Cycle 7.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/telemetry-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/telemetry-light.svg">
  <img alt="War Room engine check from 24 Oct 2026: 2,780 Cycle 7 killmails held, 1,261 gate jumps in the last 24 hours by chain time." src="assets/telemetry-dark.svg" width="100%">
</picture>

<sub>Numbers from one run of the War Room engine's own check tool on 24 Oct 2026. A snapshot, not a live feed.</sub>

### THE ARMORY

#### War Room &nbsp;<sub>EVE Frontier</sub>

PvP intel built from public chain events. It shows kills and killers, and how late each killmail reached the chain, which is often hours. The chain doesn't show who is online, and neither does the War Room.

<a href="https://honeybadger.software/frontier/warroom/"><img src="assets/warroom-map.jpg" width="100%" alt="War Room map: kill markers, live feed on the left, top hunter's dossier on the right"></a>
<a href="https://honeybadger.software/frontier/warroom/"><img src="assets/warroom-kills.jpg" width="33.3%" alt="Kill board"></a><a href="https://honeybadger.software/frontier/warroom/"><img src="assets/warroom-dossier.jpg" width="33.3%" alt="Pilot dossier"></a><a href="https://honeybadger.software/frontier/warroom/"><img src="assets/warroom-history.jpg" width="33.3%" alt="Chain Chronicle history"></a>

<sub>Kills: top hunters, streaks, late arrivals. &nbsp; Dossier: kills, losses, same-wallet characters, last signed action. &nbsp; History: the last 24 hours, split into parts of the day.</sub>

#### Bounty Board &nbsp;<sub>EVE Frontier</sub>

Post a bounty on any pilot. If the target loses a ship before it runs out, the contract lets the killer claim it, with the game's own killmail as proof. No platform fee, just network gas. Nobody has collected one yet, so that last step is still untested. "Earned" on the board means a kill qualified, not that it was paid.

<a href="https://honeybadger.software/frontier/bounty/"><img src="assets/bounty-board.jpg" width="100%" alt="Honey Badger Bounty Board: wanted list on the left, post-a-bounty panel on the right"></a>

#### Honey Badger &nbsp;<sub>Rust server</sub>

My own Rust server, running Carbon. The HUD across the top of these frames is mine. The gate and the vault were placed by my build plugin from saved layouts.

<img src="assets/rust-gate-sign.jpg" width="33.3%" alt="Rust: the gate with its painted sign, Honey Badger HUD across the top"><img src="assets/rust-gate-plaza.jpg" width="33.3%" alt="Rust: gate plaza with lit doorways and barricades"><img src="assets/rust-vault.jpg" width="33.3%" alt="Rust: vault interior with the painted vault door and team score bar">

<sub>Build: places whole structures from saved layouts. &nbsp; Map Forge: edits terrain layers and saves a new .map. &nbsp; DPS HUD: damage, headshots, last hit, target, accuracy. &nbsp; TDM: two-team deathmatch.</sub>

#### Battle Aura &nbsp;<sub>WoW Forever</sub>

A personal damage meter with a battle scene behind the numbers. Total damage, biggest hit and DPS. Hits float up over the scene, and a banner marks a new personal best.

<a href="https://www.curseforge.com/wow/addons/battle-aura"><img src="assets/battle-aura-logo.jpg" width="36%" alt="Battle Aura logo"></a><a href="https://www.curseforge.com/wow/addons/battle-aura"><img src="assets/battle-aura-in-game.jpg" width="64%" alt="Battle Aura in a real fight in WoW Forever"></a>

<sub>[CurseForge](https://www.curseforge.com/wow/addons/battle-aura) &nbsp; [WoWInterface](https://www.wowinterface.com/downloads/info27234-BattleAura.html) &nbsp; [Source](https://github.com/honeybadger-software/battle-aura)</sub>

#### EVE Fleet Foreman &nbsp;<sub>EVE Online</sub>

Free mining helper. Ranks ores by ISK per m³ from Jita prices, tells you whether to refine or sell, and works out the fleet split from the Mining Ledger.

<a href="https://github.com/honeybadger-software/eve-fleet-foreman"><img src="assets/foreman-what-to-mine.jpg" width="50%" alt="Fleet Foreman: What to Mine table"></a><a href="https://github.com/honeybadger-software/eve-fleet-foreman"><img src="assets/foreman-refine.jpg" width="50%" alt="Fleet Foreman: Refine tab, sell raw or reprocess verdict for 100,000 Mercoxit"></a>

### ACTIVE DEPLOYMENTS

**War Room** &nbsp; PvP intel for EVE Frontier<br>
<sub>React 19, TypeScript, Vite. Reads Sui testnet through GraphQL and a gRPC-web stream, and falls back to polling when the stream drops. Source is private.</sub><br>
[honeybadger.software/frontier/warroom](https://honeybadger.software/frontier/warroom/)

**Bounty Board** &nbsp; on-chain bounties for EVE Frontier<br>
<sub>Move contract `hb_bounty::bounty_board` on Sui testnet (Stillness), React front end. Package `0xeb16...c7147`.</sub><br>
[honeybadger.software/frontier/bounty](https://honeybadger.software/frontier/bounty/) &nbsp; [source](https://github.com/honeybadger-software/eve-frontier-bounty-board)

**Honey Badger** &nbsp; modded Rust server<br>
<sub>C# plugins on Carbon, using the Oxide and Carbon plugin APIs. Listed in the Rust server browser under Modded. Source is private.</sub>

**Battle Aura** &nbsp; WoW Forever addon<br>
<sub>Lua on Blizzard's own damage meter API (C_DamageMeter), so it works with Forever's restricted combat data.</sub><br>
[curseforge.com/wow/addons/battle-aura](https://www.curseforge.com/wow/addons/battle-aura) &nbsp; [source](https://github.com/honeybadger-software/battle-aura)

**EVE Fleet Foreman** &nbsp; EVE Online mining tool<br>
<sub>Python and NiceGUI. CCP's ESI with EVE SSO (PKCE) for the ledger, Fuzzwork for prices. Windows .exe on the releases page.</sub><br>
[source and download](https://github.com/honeybadger-software/eve-fleet-foreman)

### SOFTWARE AND INDUSTRIAL

I also build tools for machines: J1 Bridge for the Snapmaker J1 and OrcaSlicer, a CAN-bus dash for the C7 Corvette, and plant-floor dashboards that read blenders and PLCs. More at [honeybadger.software/industrial](https://honeybadger.software/industrial).

### CONTACT

[honeybadger.software](https://honeybadger.software) &nbsp; [@HoneyBadgerMods](https://x.com/HoneyBadgerMods) on X &nbsp; HONEYBADGERSOFTWARE in EVE Frontier

<sub>EVE Frontier material is used with limited permission of CCP Games. Not affiliated with or endorsed by CCP Games, Facepunch or Blizzard.</sub>
