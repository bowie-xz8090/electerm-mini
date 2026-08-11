# electerm-mini

A trimmed desktop client based on [electerm](https://github.com/electerm/electerm), focused on **SSH / SFTP + AI Smart Shell**.

[![English](https://img.shields.io/badge/English-EN-blue)](README.md) [![中文](https://img.shields.io/badge/中文-Chinese-blue)](README_cn.md)

> This repository is **electerm-mini**. Upstream electerm still provides the full multi-protocol client. See [electerm.org](https://electerm.org) for the original product.
<img width="2560" height="1380" alt="image" src="https://github.com/user-attachments/assets/d83f51af-df04-464b-acaa-30e7e7ee5bb1" />
<img width="2560" height="1380" alt="image" src="https://github.com/user-attachments/assets/daa57218-97f1-4f55-bee2-3dae4886f0df" />
<img width="2560" height="1380" alt="image" src="https://github.com/user-attachments/assets/92d01364-18be-414a-b318-8d165ff55eb0" />

## What is kept

- **SSH** terminal sessions (password / key, bookmarks, quick connect)
- **SFTP** dual-pane file manager (local ↔ remote, transfers, history)
- **AI Smart Shell** (command suggestions / AI assistant; configure in Settings → AI)
- **UI / terminal themes**
- **Settings**: General, Terminal, Data sync, AI
- Deep link for `ssh://` (and `electerm://`)

## What is trimmed (vs upstream electerm)

Not exposed in Mini UI / packaging focus:

- Telnet, Serial, RDP, VNC, Spice, standalone FTP sessions
- Local terminal / web session types
- MCP widgets and many non-core panels
- Store / Snap / winget distribution of the **full** electerm product (use upstream for those)

Packaging also drops unused natives where possible (e.g. `serialport`) and stubs heavy front-end modules (RDP/VNC/Spice wasm) to reduce installer size. **Electron itself still dominates binary size.**

## Requirements

- Node.js 18+ recommended (upstream docs mention 24.x)
- Windows / macOS / Linux (this fork is primarily used and packaged on **Windows**)

## Development

```bash
git clone <this-repo>
cd electerm-mini

npm config set legacy-peer-deps true
npm i

# Terminal 1 — Vite on http://127.0.0.1:5570
npm start

# Terminal 2 — Electron app
npm run app
```

Dev data directory (isolated from installed electerm): `.electerm-mini-dev-data`

Packaged Mini stores user data under `%AppData%/electerm-mini` (not `%AppData%/electerm`), so it will not reuse the full electerm profile.

```bash
npm run lint
npm run fix
```

## Build & package (Windows)

Requires [Yarn](https://yarnpkg.com/) for `yarn autoclean` during `prepare-file`.

```bash
# Compile frontend + prepare work/app
npm run b

# Copy electron-builder config to project root
npm run pb

# NSIS installer → dist/electerm-mini-*-win-x64-installer.exe
node build/bin/build-win-nsis.js

# Or portable / tar.gz style
node build/bin/build-win-portable.js
```

Equivalent one-liner after `npm run b && npm run pb`:

```bash
./node_modules/.bin/electron-builder --win nsis
```

Outputs:

| Path | Description |
|------|-------------|
| `dist/electerm-mini-*-installer.exe` | Windows installer |
| `dist/win-unpacked/electerm-mini.exe` | Unpacked executable |

## Mini feature gate

Runtime gate: `src/client/common/mini-features.js` (`MINI_MODE = true`).

Identity / data dir: `src/app/common/mini-identity.js`.

Pack slim helpers: `build/bin/mini-slim.js` (used by `npm run prepare-file`).

Vite stubs for unused session types: `build/vite/conf.js`.

## Upstream

- Source project: [electerm/electerm](https://github.com/electerm/electerm)
- License: MIT (same as upstream)
- Issues / features for the **full** client: please use [upstream](https://github.com/electerm/electerm)

## License

MIT
