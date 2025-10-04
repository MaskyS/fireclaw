import type {
  CrawlStartResponseBody,
  CrawlStatusResponseBody,
  FirecrawlFormatKey,
  FirecrawlScrapeOptions,
  ScrapeResponseBody
} from '~lib/firecrawl'

export type ScrapeIntent = 'preview' | 'copy' | 'download'

export type ScrapeSuccess = Extract<ScrapeResponseBody, { ok: true }>
export type ScrapeFailure = Extract<ScrapeResponseBody, { ok: false }>

export type CrawlStartSuccess = Extract<CrawlStartResponseBody, { ok: true }>
export type CrawlStartFailure = Extract<CrawlStartResponseBody, { ok: false }>

export type CrawlStatusSuccess = Extract<CrawlStatusResponseBody, { ok: true }>
export type CrawlStatusFailure = Extract<CrawlStatusResponseBody, { ok: false }>

export type ScrapeStage =
  | { tag: 'idle' }
  | { tag: 'loading'; intent: ScrapeIntent }
  | { tag: 'success'; intent: ScrapeIntent; payload: ScrapeSuccess; note?: string }
  | { tag: 'error'; intent: ScrapeIntent; message: string; detail?: ScrapeFailure }

export type CrawlStage =
  | { tag: 'idle' }
  | { tag: 'loading' }
  | { tag: 'success'; payload: CrawlStartSuccess }
  | { tag: 'error'; message: string; detail?: CrawlStartFailure }

export type ViewMode = 'scrape' | 'crawl'
export type SitemapMode = 'include' | 'skip'

export type CrawlFormState = {
  prompt: string
  includePaths: string
  excludePaths: string
  limit: string
  maxDiscoveryDepth: string
  sitemap: SitemapMode
  ignoreQueryParameters: boolean
  crawlEntireDomain: boolean
  allowExternalLinks: boolean
  allowSubdomains: boolean
  delay: string
  maxConcurrency: string
}

export const DEFAULT_CRAWL_FORM: CrawlFormState = {
  prompt: '',
  includePaths: '',
  excludePaths: '',
  limit: '',
  maxDiscoveryDepth: '',
  sitemap: 'include',
  ignoreQueryParameters: false,
  crawlEntireDomain: false,
  allowExternalLinks: false,
  allowSubdomains: false,
  delay: '',
  maxConcurrency: ''
}

export type LastScrape = {
  primary: string
  format: FirecrawlFormatKey
  mimeType: ScrapeSuccess['mimeType']
  timestamp: string
  raw: ScrapeSuccess['raw']
  payload: ScrapeSuccess
}

export type PopupDerived = {
  requestOptions: FirecrawlScrapeOptions
}
