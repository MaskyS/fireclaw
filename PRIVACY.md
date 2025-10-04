# Privacy Policy

**Last Updated:** October 4, 2025

Fireclaw is a browser extension that helps you scrape and crawl websites using the Firecrawl API. Your privacy is important to us.

## Data Collection

**We do not collect, store, or share any of your personal data.** This extension operates entirely locally in your browser, with the exception of API calls to Firecrawl for scraping/crawling functionality.

## Permissions

The extension requests the following permissions:

### activeTab
- **Purpose:** Access the URL and title of the currently active tab
- **Usage:** Required to send the current page URL to Firecrawl for scraping/crawling
- **Data Access:** Only when you explicitly click the extension icon

### tabs
- **Purpose:** Query information about the active browser tab
- **Usage:** Required to detect which page you want to scrape
- **Data Access:** Only reads tab URL and title, no browsing history

### downloads
- **Purpose:** Save scraped content to your computer
- **Usage:** Downloads scraped/crawled content as files (Markdown, JSON, HTML, etc.)
- **Data Access:** Only creates files when you initiate a scrape/crawl

### storage
- **Purpose:** Store your settings and API key locally
- **Usage:** Saves your Firecrawl API key and format preferences in your browser's local storage
- **Data Storage:** All data stays on your device, never transmitted to us

### Host Permissions (https://api.firecrawl.dev/*)
- **Purpose:** Communicate with Firecrawl's API
- **Usage:** Sends scrape/crawl requests to Firecrawl's servers
- **Data Transmitted:** Page URLs you choose to scrape and your Firecrawl API key

## Third-Party Services

This extension uses the **Firecrawl API** to perform web scraping and crawling. When you use the extension:

- The URL of the page you want to scrape is sent to Firecrawl's servers
- Your Firecrawl API key is transmitted with each request for authentication
- Firecrawl processes the request and returns the scraped content

Firecrawl's data handling is governed by their own privacy policy. Please review [Firecrawl's Privacy Policy](https://firecrawl.dev/privacy) for more information.

## Data Storage

The following data is stored **locally in your browser only**:

- Your Firecrawl API key
- Your format preferences (Markdown, HTML, JSON, etc.)
- Other scraping options you configure

**This data never leaves your device** except for the API key, which is sent to Firecrawl servers only for authentication purposes.

## No Analytics or Tracking

We do not use any analytics, tracking, or telemetry services. We have no way to know:

- Which websites you scrape
- How often you use the extension
- What content you extract
- Any other usage information

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be reflected in this document with an updated "Last Updated" date.

## Contact

If you have questions about this privacy policy, please open an issue on our [GitHub repository](https://github.com/MaskyS/fireclaw).

## Your Rights

You have full control over your data:

- You can delete your API key and preferences at any time by clearing your browser's extension data
- You can uninstall the extension at any time
- No data persists on our servers (because we don't have any servers)
