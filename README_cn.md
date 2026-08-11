# electerm-mini

基于 [electerm](https://github.com/electerm/electerm) 的精简桌面客户端，聚焦 **SSH / SFTP + AI Smart Shell**。

[![English](https://img.shields.io/badge/English-EN-blue)](README.md) [![中文](https://img.shields.io/badge/中文-Chinese-blue)](README_cn.md)

> 本仓库为 **electerm-mini** 精简版。完整多协议客户端请使用上游 [electerm](https://github.com/electerm/electerm) / [electerm.org](https://electerm.org)。

## 保留功能

- **SSH** 终端会话（密码 / 密钥、书签、快速连接）
- **SFTP** 双栏文件管理（本地 ↔ 远程、传输与历史）
- **AI Smart Shell**（命令建议 / AI 助手；在「设置 → AI」中配置）
- **界面 / 终端主题**
- **设置**：通用、终端、数据同步、AI
- 深度链接：`ssh://`（及 `electerm://`）

## 相对上游已裁剪

Mini 界面与打包不再作为目标能力：

- Telnet、串口、RDP、VNC、Spice、独立 FTP 会话
- 本地终端 / Web 会话类型
- MCP 组件及大量非核心面板
- 完整版的 Microsoft Store / Snap / winget 分发（请走上游 electerm）

打包阶段会尽量去掉无用原生依赖（如 `serialport`），并 stub 掉 RDP/VNC/Spice 等重量前端模块以减小安装包。  
**体积大头仍是 Electron 运行时本身。**

## 环境要求

- 建议 Node.js 18+（上游文档亦提及 24.x）
- Windows / macOS / Linux（本仓库以 **Windows** 开发与打包为主）

## 开发

```bash
git clone <本仓库地址>
cd electerm-mini

npm config set legacy-peer-deps true
npm i

# 终端 1 — Vite：http://127.0.0.1:5570
npm start

# 终端 2 — Electron 应用
npm run app
```

开发数据目录（与已安装的 electerm 隔离）：`.electerm-mini-dev-data`

正式打包后的用户数据目录为 `%AppData%/electerm-mini`（不是 `%AppData%/electerm`），因此不会沿用完整版 electerm 的旧配置与会话。

```bash
npm run lint
npm run fix
```

## 构建与打包（Windows）

`prepare-file` 需要 [Yarn](https://yarnpkg.com/)（用于 `yarn autoclean`）。

```bash
# 编译前端并准备 work/app
npm run b

# 将 electron-builder 配置拷到项目根目录
npm run pb

# 打 NSIS 安装包 → dist/electerm-mini-*-win-x64-installer.exe
node build/bin/build-win-nsis.js

# 或便携 / tar.gz 类产物
node build/bin/build-win-portable.js
```

在 `npm run b && npm run pb` 之后也可：

```bash
./node_modules/.bin/electron-builder --win nsis
```

产物说明：

| 路径 | 说明 |
|------|------|
| `dist/electerm-mini-*-installer.exe` | Windows 安装包 |
| `dist/win-unpacked/electerm-mini.exe` | 免安装可执行文件 |

## Mini 门控相关代码

- 功能开关：`src/client/common/mini-features.js`（`MINI_MODE = true`）
- 身份与数据目录：`src/app/common/mini-identity.js`
- 打包瘦身：`build/bin/mini-slim.js`（由 `npm run prepare-file` 调用）
- Vite stub：`build/vite/conf.js`

## 上游项目

- 源项目：[electerm/electerm](https://github.com/electerm/electerm)
- 许可证：MIT（与上游一致）
- **完整版**问题与功能请到[上游仓库](https://github.com/electerm/electerm)反馈

## 许可证

MIT
