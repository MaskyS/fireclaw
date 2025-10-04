# Testing Guide

## Prerequisites
- Node.js 18+
- Firecrawl API key with remaining credits
- Chrome or Chromium-based browser with developer mode enabled

## Local Development Loop
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Plasmo development server:
   ```bash
   npm run dev
   ```
3. In Chrome, open `chrome://extensions`, enable **Developer mode**, then choose **Load unpacked** and select `build/chrome-mv3-dev`.
4. Pin the extension, open a tab to test, and click the icon to launch the popup.

## Manual Checks
- **API key persistence**: enter a key, close the popup, reopen, and verify the key is still stored.
- **Scrape preview**: run *Preview scrape* on a readable page; expect rendered snippet plus success toast.
- **Copy flow**: run *Copy* and paste the clipboard into a text editor—should match preview content.
- **Download flow**: run *Download* and confirm `.md`, `.html`, or `.json` files save with sanitized filenames.
- **Scrape options drawer**: expand the options, toggle additional formats, and verify Markdown stays selected when you deselect everything.
- **Format guard**: try unchecking the final format and confirm the Toast/notice warns you while Markdown is restored.
- **Result card actions**: after scraping, use the Copy and Download buttons without triggering another scrape request.
- **Crawl tab**: switch to the Crawl tab, adjust options (limit, sitemap, toggles), start a job, and refresh the status once the job ID appears.
- **Crawl flow**: start a crawl, note the job ID, and refresh status until completion.
- **Error handling**: try scraping without an API key and on a blocked domain to see inline errors.

## Production Build Smoke Test
1. Build the production bundle:
   ```bash
   npm run build -- --target=chrome-mv3
   ```
2. Load `build/chrome-mv3-prod` as an unpacked extension and repeat the manual checks.

Keep the dev server running while iterating; Plasmo will hot-reload the popup and background service worker automatically.
