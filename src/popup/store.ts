import { makeAutoObservable } from 'mobx'
import * as R from 'remeda'

import type { CrawlStatusResponseBody } from '~lib/firecrawl'

import {
  DEFAULT_CRAWL_FORM,
  type CrawlFormState,
  type CrawlStage,
  type CrawlStartFailure,
  type CrawlStartSuccess,
  type LastScrape,
  type ScrapeFailure,
  type ScrapeIntent,
  type ScrapeStage,
  type ScrapeSuccess,
  type ViewMode
} from './types'

export class PopupStore {
  view: ViewMode = 'scrape'
  scrapeStage: ScrapeStage = { tag: 'idle' }
  crawlStage: CrawlStage = { tag: 'idle' }
  lastScrape?: LastScrape
  crawlStatus?: CrawlStatusResponseBody
  optionsOpen = false
  previewExpanded = false
  optionsNotice?: string
  crawlForm: CrawlFormState = R.clone(DEFAULT_CRAWL_FORM)
  private noticeTimer?: number
  toastMessage?: string

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  dispose() {
    if (this.noticeTimer !== undefined) {
      window.clearTimeout(this.noticeTimer)
      this.noticeTimer = undefined
    }
  }

  setView(view: ViewMode) {
    this.view = view
    this.optionsOpen = false
  }

  toggleOptions() {
    this.optionsOpen = !this.optionsOpen
  }

  closeOptions() {
    this.optionsOpen = false
  }

  togglePreview() {
    this.previewExpanded = !this.previewExpanded
  }

  collapsePreview() {
    this.previewExpanded = false
  }

  setNotice(message: string) {
    this.optionsNotice = message
    if (this.noticeTimer !== undefined) {
      window.clearTimeout(this.noticeTimer)
    }
    this.noticeTimer = window.setTimeout(() => {
      this.optionsNotice = undefined
      this.noticeTimer = undefined
    }, 3_000)
  }

  clearNotice() {
    this.optionsNotice = undefined
    if (this.noticeTimer !== undefined) {
      window.clearTimeout(this.noticeTimer)
      this.noticeTimer = undefined
    }
  }

  showToast(message: string) {
    if (this.toastMessage === message) {
      return
    }
    this.toastMessage = message
  }

  clearToast() {
    this.toastMessage = undefined
  }

  scrapeStarted(intent: ScrapeIntent) {
    this.scrapeStage = { tag: 'loading', intent }
    this.previewExpanded = false
  }

  scrapeFailed(intent: ScrapeIntent, message: string, detail?: ScrapeFailure) {
    this.scrapeStage = {
      tag: 'error',
      intent,
      message,
      detail
    }
  }

  scrapeSucceeded(intent: ScrapeIntent, payload: ScrapeSuccess, note?: string) {
    this.scrapeStage = {
      tag: 'success',
      intent,
      payload,
      note
    }
    this.lastScrape = {
      primary: payload.primary,
      format: payload.primaryFormat,
      mimeType: payload.mimeType,
      timestamp: new Date().toISOString(),
      raw: payload.raw,
      payload
    }
    this.previewExpanded = false
  }

  scrapeNote(intent: ScrapeIntent, note: string) {
    if (!this.lastScrape) {
      return
    }
    this.scrapeStage = {
      tag: 'success',
      intent,
      payload: this.lastScrape.payload,
      note
    }
  }

  crawlStarted() {
    this.crawlStage = { tag: 'loading' }
    this.crawlStatus = undefined
  }

  crawlFailed(message: string, detail?: CrawlStartFailure) {
    this.crawlStage = {
      tag: 'error',
      message,
      detail
    }
  }

  crawlSucceeded(payload: CrawlStartSuccess) {
    this.crawlStage = { tag: 'success', payload }
  }

  setCrawlStatus(payload: CrawlStatusResponseBody) {
    this.crawlStatus = payload
  }

  updateCrawlForm<Field extends keyof CrawlFormState>(
    field: Field,
    value: CrawlFormState[Field]
  ) {
    this.crawlForm[field] = value
  }

  resetCrawlForm() {
    this.crawlForm = R.clone(DEFAULT_CRAWL_FORM)
  }
}
