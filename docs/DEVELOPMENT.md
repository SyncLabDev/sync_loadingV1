# Development Guide

Guide for developers modifying the HORIZON frontend, running tests, and compiling production builds.

---

## Prerequisites

- **Node.js**: v20.x or v22.x LTS
- **Package Manager**: `pnpm` (v10+ recommended)

---

## Setup & Local Dev Server

1. Navigate to the `web/` directory:
   ```bash
   cd web
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the Vite development server:
   ```bash
   pnpm dev
   ```
4. Open the displayed URL in your browser (typically `http://localhost:5173`).

---

## The SYNC DEV Controller

When running in browser development mode (`import.meta.env.DEV`), HORIZON automatically injects the **SYNC DEV / HORIZON** interactive floating controller:

- **Progress Slider**: Test 0% to 100% loading progress smoothly.
- **Milestone Stepper**: Step through all configured stages (`WORLD`, `IDENTITY`, `ASSETS`, `INTERFACE`, `SESSION`).
- **Chapter Switcher**: Trigger immediate chapter changes to verify transitions.
- **Media Error Simulator**: Simulate video or image 404/decode failures to test fallback gradients.
- **Completion Trigger**: Preview the asymmetric wedge retraction animation without connecting to FiveM.

> [!NOTE]
> The dev controller is strictly stripped from production builds by Vite dead-code elimination.

---

## Simulating FiveM Events via Console

You can simulate native FiveM engine messages directly in your browser developer console:

```javascript
// Simulate progress update
window.postMessage({ eventName: 'loadProgress', loadFraction: 0.75 }, '*');

// Simulate initialization functions
window.postMessage({ eventName: 'startInitFunction', functionName: 'InitSession' }, '*');

// Simulate custom completion export
window.postMessage({ eventName: 'sync_loading:complete' }, '*');
```

---

## Available Scripts

| Command | Purpose |
| :--- | :--- |
| `pnpm dev` | Starts Vite local development server with HMR and mock controller |
| `pnpm build` | Compiles TypeScript and builds production assets into `web/dist/` |
| `pnpm typecheck` | Runs `tsc` to validate all TypeScript types |
| `pnpm lint` | Runs ESLint across React and TypeScript code |
| `pnpm test` | Runs unit tests using Vitest and React Testing Library |
| `pnpm test:e2e` | Runs Playwright end-to-end loading screen tests |
| `pnpm check:lua` | Validates Lua AST in `config.lua`, `client/main.lua`, and `server/main.lua` |
| `pnpm check:package` | Validates that required build artifacts are present and ready for release |

---

## Compiling for FiveM Production

Before releasing your resource or deploying changes to a live server:

```bash
cd web
pnpm check:lua
pnpm typecheck
pnpm test
pnpm build
pnpm check:package
```

The output in `web/dist/` is directly referenced by `fxmanifest.lua` and will be loaded by FiveM clients.
