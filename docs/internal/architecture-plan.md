# Firecrawl Extension Architecture Plan

## Goals
- Manifest V3 extension targeting Chromium and Firefox via Plasmo.
- Provide quick access to Firecrawl scrape for the active tab, including crawl kick-off.
- Allow copy-to-clipboard and download flows (Markdown first, JSON/ZIP ready).
- Encourage functional, Remeda-powered implementation with clear module boundaries.

## High-Level Flow
1. **Popup UI**
   - React component (`src/popup/index.tsx`) renders controls for API key entry, format selection, scrape/crawl triggers, and result actions.
   - Uses `@plasmohq/storage` hooks for persisting user API key and preferences.
   - Uses `chrome.tabs.query` to capture the active tab URL when the popup opens.
   - Sends commands to the background via typed messaging helpers.

2. **Background Service Worker**
   - Message handlers live in `src/background/messages/*.ts` and share utilities under `src/lib`.
   - `scrape` handler builds Firecrawl request payload from message body + defaults, performs `fetch` to `https://api.firecrawl.dev/v2/scrape`, returns typed payload.
   - `crawl-start` handler posts to `/v2/crawl` and returns job id.
   - `crawl-status` handler polls `/v2/crawl/:id` for status updates.
   - All handlers pull the API key either from the message or storage helper (storage fallback ensures future automation).

3. **Shared Utilities (`src/lib`)**
   - `firecrawl.ts`: request builders, runtime type guards, Remeda-based extraction helpers for various formats.
   - `storage.ts`: wrappers around `@plasmohq/storage` for API key & user preference persistence.
   - `messaging.ts`: thin layer exporting typed request/response contracts consumed by UI.
   - `download.ts`: client utilities to create Blob URLs and trigger downloads with future-ready hooks for JSON/ZIP branches.

4. **Content Scripts (Optional Expansion)**
   - Reserve `src/contents/control.tsx` for an optional floating action button (not built immediately) to reuse messaging layer.
   - Manifest/world configuration keeps path ready without impacting the first milestone.

## Data Contracts
- **ScrapeRequest**: `{ url: string; formats: FirecrawlFormatSpec[]; options: Partial<FirecrawlScrapeOptions>; apiKey?: string; }`
- **ScrapeResponse**: `{ success: true; primaryFormat: ResolvedFormat; payload: ResolvedPayload; raw: FirecrawlScrapeResponse; } | { success: false; error: string; status?: number; }`
- **CrawlStartResponse**: `{ success: true; id: string } | { success: false; error: string; status?: number }`
- **CrawlStatusResponse**: Mirrors Firecrawl status payload with strong typing for `status`, `completedAt`, `data`, `next` parameters.

All contracts share discriminated unions to keep UI logic simple.

## Permissions & Manifest Overrides
- `permissions`: `['activeTab', 'tabs', 'downloads', 'storage']`
- `host_permissions`: `['https://api.firecrawl.dev/*']`
- Provide Firefox-specific UUID via env or default.
- Add `default_popup` pointing to generated popup bundle.

## Storage Strategy
- API key stored in local storage namespace via `@plasmohq/storage`. We avoid public env vars to keep secrets out of bundles.
- User preferences (formats, toggles like `onlyMainContent`) stored alongside API key for quick reuse.

## Result Handling Plan
- Background returns both the raw Firecrawl response and a curated `primaryFormat` + content string.
- Popup uses Remeda `pipe` + `pick` to locate markdown first, with fallbacks for JSON (`JSON.stringify`) and binary attachments (future zip support hooking into `download.ts`).
- Clipboard uses `navigator.clipboard.writeText` within user gesture scope.
- Download uses `chrome.downloads.download` with Blob URLs; architecture allows branching on selected format.

## Future-Proofing Hooks
- `src/lib/firecrawl.ts` exposes generic format normalization so adding JSON/ZIP is data-driven.
- Messaging namespacing (`firecrawl:scrape`, `firecrawl:crawl:start`, etc.) leaves room for extract/search endpoints.
- Optional content-script UI stub ensures quick iteration toward on-page controls without refactoring core logic.

## Testing & Dev Loop
- `npm run dev` -> `plasmo dev` for live-reload.
- Provide mock helper using MSW or local fixtures (optional) for offline UI development.
- Manual test checklist: popup render, API key persistence, scrape success/error, crawl start/status, clipboard, download.

