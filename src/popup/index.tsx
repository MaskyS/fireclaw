import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import * as R from "remeda";
import { observer } from "mobx-react-lite";

import {
  DEFAULT_FORMAT_KEYS,
  formatKeysToSpecs,
  type FirecrawlFormatKey,
  type FirecrawlScrapeOptions,
  type ScrapeResponseBody,
  type CrawlStartResponseBody,
  type CrawlStatusResponseBody,
} from "~lib/firecrawl";
import {
  API_KEY_STORAGE_KEY,
  PREFS_STORAGE_KEY,
  type StoredPreferences,
} from "~lib/storage";
import {
  requestCrawlStart,
  requestCrawlStatus,
  requestScrape,
} from "~lib/messaging";
import { triggerDownload } from "~lib/download";
import { colors, font, radii, shadows, space } from "./design";
import {
  DEFAULT_CRAWL_FORM,
  type CrawlFormState,
  type CrawlStage,
  type CrawlStartFailure,
  type CrawlStartSuccess,
  type CrawlStatusFailure,
  type LastScrape,
  type ScrapeFailure,
  type ScrapeIntent,
  type ScrapeStage,
  type ScrapeSuccess,
  type SitemapMode,
  type ViewMode,
} from "./types";
import { PopupStore } from "./store";

const AVAILABLE_FORMAT_OPTIONS: ReadonlyArray<{
  key: FirecrawlFormatKey;
  label: string;
  helper: string;
  recommended?: boolean;
}> = [
  {
    key: "markdown",
    label: "Markdown",
    helper: "Clean, readable content ideal for notes",
    recommended: true,
  },
  {
    key: "html",
    label: "HTML",
    helper: "Rendered HTML without Firecrawl cleaning",
  },
  {
    key: "summary",
    label: "Summary",
    helper: "Firecrawl-generated overview",
  },
  {
    key: "links",
    label: "Links",
    helper: "Structured list of discovered links",
  },
  {
    key: "json",
    label: "JSON",
    helper: "Structured JSON payload (default schema)",
  },
];

const ensurePreferences = (prefs?: StoredPreferences): StoredPreferences => {
  const base = prefs ?? {};
  return {
    formats: base.formats?.length
      ? [...base.formats]
      : R.clone(DEFAULT_FORMAT_KEYS),
    onlyMainContent: base.onlyMainContent ?? true,
    includeTags: base.includeTags,
    excludeTags: base.excludeTags,
  };
};

const ensureFormats = (formats: FirecrawlFormatKey[]): FirecrawlFormatKey[] =>
  formats.length === 0 ? R.clone(DEFAULT_FORMAT_KEYS) : R.unique(formats);

const computeNextFormats = (
  currentFormats: FirecrawlFormatKey[],
  format: FirecrawlFormatKey,
) =>
  ensureFormats(
    currentFormats.includes(format)
      ? currentFormats.filter((item) => item !== format)
      : [...currentFormats, format],
  );

const isScrapeFailure = (value: ScrapeResponseBody): value is ScrapeFailure =>
  value.ok === false;

const isCrawlStartFailure = (
  value: CrawlStartResponseBody,
): value is CrawlStartFailure => value.ok === false;

const isCrawlStatusFailure = (
  value: CrawlStatusResponseBody,
): value is CrawlStatusFailure => value.ok === false;

const formatLabelMap = new Map(
  AVAILABLE_FORMAT_OPTIONS.map((format) => [format.key, format.label]),
);

const formatLabel = (key: FirecrawlFormatKey) =>
  formatLabelMap.get(key) ??
  key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());

const previewSnippet = (content: string, expanded: boolean) => {
  if (expanded) {
    return content;
  }
  return content.length > 400 ? `${content.slice(0, 400)}…` : content;
};

const formatTimestamp = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const parseOptionalInteger = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseOptionalNumber = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const linesToList = (value: string) =>
  value
    .split(/\n|,/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

const buildCrawlOptions = (
  form: CrawlFormState,
  scrapeOptions: FirecrawlScrapeOptions,
): Record<string, unknown> =>
  R.pipe(
    {
      prompt: form.prompt,
      includePaths: linesToList(form.includePaths),
      excludePaths: linesToList(form.excludePaths),
      limit: parseOptionalInteger(form.limit),
      maxDiscoveryDepth: parseOptionalInteger(form.maxDiscoveryDepth),
      delay: parseOptionalNumber(form.delay),
      maxConcurrency: parseOptionalInteger(form.maxConcurrency),
      scrapeOptions,
      sitemap: form.sitemap,
      ignoreQueryParameters: form.ignoreQueryParameters,
      crawlEntireDomain: form.crawlEntireDomain,
      allowExternalLinks: form.allowExternalLinks,
      allowSubdomains: form.allowSubdomains,
    },
    (options) =>
      R.mapValues(options, (value) => {
        if (Array.isArray(value)) {
          return value.length > 0 ? value : undefined;
        }
        if (typeof value === "string") {
          const trimmed = value.trim();
          return trimmed.length > 0 ? trimmed : undefined;
        }
        return value;
      }),
    (options) => R.pickBy(options, (value) => value !== undefined),
  ) as Record<string, unknown>;

const Popup = () => {
  const [tabUrl, setTabUrl] = useState("");
  const [tabTitle, setTabTitle] = useState("");
  const [apiKey, setApiKey, { isLoading: isApiLoading }] = useStorage<string>(
    API_KEY_STORAGE_KEY,
    (stored) => stored ?? "",
  );
  const [prefs, setPrefs] = useStorage<StoredPreferences>(
    PREFS_STORAGE_KEY,
    (initial) => ensurePreferences(initial),
  );

  const storeRef = useRef<PopupStore | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = new PopupStore();
  }
  const store = storeRef.current!;

  const [apiKeyDraft, setApiKeyDraft] = useState("");

  useEffect(() => {
    if (!isApiLoading) {
      setApiKeyDraft(apiKey);
    }
  }, [isApiLoading, apiKey]);

  const trimmedStoredKey = apiKey.trim();
  const effectiveApiKey = trimmedStoredKey;
  const isApiConfigured = trimmedStoredKey.length > 0;
  const [apiEditorVisible, setApiEditorVisible] = useState(false);

  useEffect(() => {
    const fontLinkId = "firecrawl-ibm-plex-sans";
    if (!document.getElementById(fontLinkId)) {
      const link = document.createElement("link");
      link.id = fontLinkId;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap";
      document.head.append(link);
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) {
        return;
      }
      setTabUrl(tab.url ?? "");
      setTabTitle(tab.title ?? "");
    });
  }, []);

  useEffect(() => {
    if (!isApiLoading) {
      setApiEditorVisible(!isApiConfigured);
    }
  }, [isApiLoading, isApiConfigured]);

  useEffect(() => () => store.dispose(), [store]);

  const normalizedPrefs = useMemo(
    () => ensurePreferences(prefs),
    [
      prefs?.formats,
      prefs?.onlyMainContent,
      prefs?.includeTags,
      prefs?.excludeTags,
    ],
  );

  const formatsSignature = useMemo(
    () => JSON.stringify(normalizedPrefs.formats),
    [normalizedPrefs.formats],
  );

  const activeFormats = useMemo<FirecrawlFormatKey[]>(
    () => [...normalizedPrefs.formats],
    [formatsSignature],
  );

  const useMainContent = normalizedPrefs.onlyMainContent ?? true;

  const requestOptions = useMemo<FirecrawlScrapeOptions>(
    () =>
      R.pipe(
        {
          formats: formatKeysToSpecs(activeFormats),
          onlyMainContent: useMainContent,
        },
        (value) => R.pickBy(value, (entry) => entry !== undefined),
      ) as FirecrawlScrapeOptions,
    [formatsSignature, useMainContent],
  );

  const optionsOpen = store.optionsOpen;
  const optionsNotice = store.optionsNotice;
  const previewExpanded = store.previewExpanded;
  const scrapeStage = store.scrapeStage;
  const crawlStage = store.crawlStage;
  const lastScrape = store.lastScrape;
  const crawlStatus = store.crawlStatus;
  const currentView = store.view;
  const crawlForm = store.crawlForm;
  const toastMessage = store.toastMessage;

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      store.clearToast();
    }, 1_000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toastMessage, store]);

  const toggleFormat = async (format: FirecrawlFormatKey) => {
    const removalAttemptsLast =
      activeFormats.length === 1 && activeFormats[0] === format;
    const nextFormats = computeNextFormats(activeFormats, format);

    if (removalAttemptsLast) {
      store.setNotice(
        "At least one format must remain selected. Markdown restored.",
      );
    } else {
      store.clearNotice();
    }

    await setPrefs((current) => {
      const base = ensurePreferences(current);
      return {
        ...base,
        formats: nextFormats,
      };
    });
  };

  const toggleMainContent = async () => {
    await setPrefs((current) => {
      const base = ensurePreferences(current);
      return {
        ...base,
        onlyMainContent: !(base.onlyMainContent ?? true),
      };
    });
  };

  const withScrapePrechecks = async <T,>(
    intent: ScrapeIntent,
    action: () => Promise<T>,
  ): Promise<T | undefined> => {
    if (!tabUrl) {
      store.scrapeFailed(
        intent,
        "Unable to detect the active tab URL. Refresh and try again.",
      );
      return undefined;
    }

    if (!effectiveApiKey) {
      store.scrapeFailed(intent, "Add your Firecrawl API key first.");
      return undefined;
    }

    store.scrapeStarted(intent);

    try {
      return await action();
    } catch (error) {
      store.scrapeFailed(
        intent,
        error instanceof Error ? error.message : "Unexpected error",
      );
      return undefined;
    }
  };

  const handleScrape = async () => {
    const response = await withScrapePrechecks("preview", () =>
      requestScrape({
        url: tabUrl,
        apiKey: effectiveApiKey,
        options: requestOptions,
      }),
    );

    if (!response) {
      return;
    }

    if (isScrapeFailure(response)) {
      store.scrapeFailed("preview", response.error, response);
      return;
    }

    store.scrapeSucceeded("preview", response, "Scrape completed.");

    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(response.primary);
        store.scrapeNote("preview", "Scrape copied to clipboard.");
        store.showToast("Scrape copied to clipboard.");
      } catch (error) {
        store.showToast(
          error instanceof Error
            ? `Scrape ready. Copy failed: ${error.message}`
            : "Scrape ready. Unable to auto-copy.",
        );
      }
    } else {
      store.showToast("Scrape ready. Copy from the preview.");
    }
  };

  const handleCopy = async () => {
    if (!store.lastScrape) {
      store.scrapeFailed("copy", "Scrape the page first to copy content.");
      return;
    }

    try {
      await navigator.clipboard.writeText(store.lastScrape.primary);
      store.scrapeNote("copy", "Copied to clipboard.");
      store.showToast("Copied to clipboard.");
    } catch (error) {
      store.scrapeFailed(
        "copy",
        error instanceof Error
          ? `Copy failed: ${error.message}`
          : "Copy failed",
      );
      store.showToast(
        error instanceof Error
          ? `Copy failed: ${error.message}`
          : "Copy failed",
      );
    }
  };

  const handleDownload = async () => {
    if (!store.lastScrape) {
      store.scrapeFailed(
        "download",
        "Scrape the page first to download content.",
      );
      return;
    }

    if (!tabUrl) {
      store.scrapeFailed(
        "download",
        "Unable to detect the active tab URL. Refresh and try again.",
      );
      return;
    }

    try {
      const { filename } = await triggerDownload({
        sourceUrl: tabUrl,
        content: store.lastScrape.primary,
        mimeType: store.lastScrape.mimeType,
        format: store.lastScrape.format,
      });

      store.scrapeNote("download", `Download started (${filename}).`);
      store.showToast(`Download started (${filename})`);
    } catch (error) {
      store.scrapeFailed(
        "download",
        error instanceof Error
          ? `Download failed: ${error.message}`
          : "Download failed",
      );
      store.showToast(
        error instanceof Error
          ? `Download failed: ${error.message}`
          : "Download failed",
      );
    }
  };

  const refreshCrawlStatus = useCallback(
    async (id: string, key: string) => {
      try {
        const status = await requestCrawlStatus({ id, apiKey: key });
        store.setCrawlStatus(status);
        if (!isCrawlStatusFailure(status)) {
          const summary = `Crawl status: ${status.status ?? 'unknown'}`
          if (summary !== store.toastMessage) {
            store.showToast(summary)
          }
        } else {
          const errorSummary = `Crawl status error: ${status.error}`
          if (errorSummary !== store.toastMessage) {
            store.showToast(errorSummary)
          }
        }
      } catch (error) {
        store.setCrawlStatus({
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to fetch crawl status",
        });
        const errorSummary =
          error instanceof Error
            ? error.message
            : 'Unable to fetch crawl status'
        if (errorSummary !== store.toastMessage) {
          store.showToast(errorSummary)
        }
      }
    },
    [store],
  );

  const handleCrawlStart = async () => {
    if (!tabUrl) {
      store.crawlFailed("Unable to detect the active tab URL.");
      return;
    }

    if (!effectiveApiKey) {
      store.crawlFailed("Add your Firecrawl API key first.");
      return;
    }

    store.crawlStarted();

    const preparedOptions = buildCrawlOptions(store.crawlForm, requestOptions);

    try {
      const response = await requestCrawlStart({
        url: tabUrl,
        apiKey: effectiveApiKey,
        options: preparedOptions,
      });

      if (isCrawlStartFailure(response)) {
        store.crawlFailed(response.error, response);
        return;
      }

      store.crawlSucceeded(response);
      store.showToast("Crawl started.");
      await refreshCrawlStatus(response.id, effectiveApiKey);
    } catch (error) {
      const errorSummary =
        error instanceof Error ? error.message : "Unable to start crawl job";
      store.crawlFailed(errorSummary);
      store.showToast(errorSummary);
    }
  };

  const isScraping = scrapeStage.tag === "loading";
  const isCrawling = crawlStage.tag === "loading";

  const crawlJobId =
    crawlStage.tag === "success" ? crawlStage.payload.id : undefined;

  const crawlStatusSummary = useMemo(() => {
    if (!crawlStatus) {
      return undefined;
    }

    if (isCrawlStatusFailure(crawlStatus)) {
      return `Error: ${crawlStatus.error}`;
    }

    const status = crawlStatus.status ?? "unknown";
    return `Status: ${status}`;
  }, [crawlStatus]);

  const formatSummary = useMemo(() => {
    if (activeFormats.length === 0) {
      return "No formats selected";
    }
    const primaryLabel = formatLabel(activeFormats[0]);
    const remaining = activeFormats.length - 1;
    return remaining > 0 ? `${primaryLabel} +${remaining} more` : primaryLabel;
  }, [activeFormats]);

  const renderScrapeOptions = () => (
    <section style={styles.card}>
      <button
        style={{
          ...styles.disclosure,
          ...(optionsOpen ? styles.disclosureActive : {}),
        }}
        onClick={() => {
          store.toggleOptions();
        }}
        type="button"
      >
        <span>Scrape options</span>
        <span style={styles.disclosureSummary}>{formatSummary}</span>
      </button>
      {optionsOpen ? (
        <div style={styles.optionsBody}>
          <ul style={styles.formatList}>
            {AVAILABLE_FORMAT_OPTIONS.map((format) => {
              const checked = activeFormats.includes(format.key);
              return (
                <li key={format.key} style={styles.formatItem}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        void toggleFormat(format.key);
                      }}
                    />
                    <div style={styles.formatLabelGroup}>
                      <span style={styles.formatLabelText}>{format.label}</span>
                      {format.recommended ? (
                        <span style={styles.recommendedBadge}>Recommended</span>
                      ) : null}
                    </div>
                  </label>
                  <p style={styles.formatHelper}>{format.helper}</p>
                </li>
              );
            })}
          </ul>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={useMainContent}
              onChange={() => {
                void toggleMainContent();
              }}
            />
            <span style={styles.formatLabelText}>Only main content</span>
          </label>
          {optionsNotice ? <p style={styles.notice}>{optionsNotice}</p> : null}
        </div>
      ) : null}
    </section>
  );

  const renderResultCard = () => {
    if (!lastScrape) {
      return null;
    }

    const totalLength = lastScrape.primary.length;
    const hasOverflow = totalLength > 400;
    const preview = previewSnippet(lastScrape.primary, previewExpanded);

    return (
      <section style={styles.card}>
        <header style={styles.resultHeader}>
          <div style={styles.resultHeading}>
            <span style={styles.resultBadge}>
              {formatLabel(lastScrape.format)}
            </span>
            <span style={styles.resultMeta}>
              Retrieved {formatTimestamp(lastScrape.timestamp)}
            </span>
          </div>
          <div style={styles.resultActions}>
            <button
              style={styles.secondaryButton}
              onClick={() => {
                void handleCopy();
              }}
              type="button"
            >
              Copy
            </button>
            <button
              style={styles.secondaryButton}
              onClick={() => {
                void handleDownload();
              }}
              type="button"
            >
              Download
            </button>
          </div>
        </header>
        <div style={styles.previewContainer}>
          <pre style={styles.preview}>{preview}</pre>
          {hasOverflow ? (
            <button
              style={styles.linkButton}
              onClick={() => {
                store.togglePreview();
              }}
              type="button"
            >
              {previewExpanded ? "Show less" : "Show more"}
            </button>
          ) : null}
        </div>
      </section>
    );
  };

  const renderScrapeView = () => (
    <>
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Scrape</h2>
        </div>
        <div>
          <p style={styles.microcopy}>Uses 1 Firecrawl credit</p>
          <button
            style={{
              ...styles.primaryButton,
              ...(isScraping ? styles.primaryButtonBusy : {}),
            }}
            disabled={isScraping || !tabUrl}
            onClick={() => {
              void handleScrape();
            }}
            type="button"
          >
            {isScraping ? "Scraping…" : "Scrape page"}
          </button>
          {scrapeStage.tag === "error" ? (
            <p style={styles.error}>{scrapeStage.message}</p>
          ) : null}
          {scrapeStage.tag === "success" && scrapeStage.note ? (
            <p style={styles.success}>{scrapeStage.note}</p>
          ) : null}
        </div>
      </section>
      {renderScrapeOptions()}
      {renderResultCard()}
    </>
  );

  const renderCrawlView = () => (
    <section style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Crawl</h2>
        <p style={styles.cardSubtitle}>
          Launch a job for the active domain. Runs from the current URL
        </p>
      </div>
      <div>
        <button
          style={{
            ...styles.primaryButton,
            ...(isCrawling ? styles.primaryButtonBusy : {}),
          }}
          disabled={isCrawling || !tabUrl}
          onClick={() => {
            void handleCrawlStart();
          }}
          type="button"
        >
          {isCrawling ? "Starting crawl…" : "Start crawl"}
        </button>
        <div style={styles.formStack}>
          <label style={styles.fieldLabel}>
            <span>Prompt (optional)</span>
            <textarea
              rows={2}
              style={styles.textarea}
              placeholder="Summarize product docs…"
              value={crawlForm.prompt}
              onChange={(event) => {
                store.updateCrawlForm("prompt", event.target.value);
              }}
            />
          </label>
          <div style={styles.fieldRow}>
            <label style={styles.fieldLabel}>
              <span>Max pages</span>
              <input
                style={styles.input}
                type="number"
                min={1}
                placeholder="100"
                value={crawlForm.limit}
                onChange={(event) => {
                  store.updateCrawlForm("limit", event.target.value);
                }}
              />
            </label>
            <label style={styles.fieldLabel}>
              <span>Max depth</span>
              <input
                style={styles.input}
                type="number"
                min={0}
                placeholder="1"
                value={crawlForm.maxDiscoveryDepth}
                onChange={(event) => {
                  store.updateCrawlForm(
                    "maxDiscoveryDepth",
                    event.target.value,
                  );
                }}
              />
            </label>
          </div>
          <div style={styles.fieldRow}>
            <label style={styles.fieldLabel}>
              <span>Sitemap mode</span>
              <select
                style={styles.select}
                value={crawlForm.sitemap}
                onChange={(event) => {
                  store.updateCrawlForm(
                    "sitemap",
                    event.target.value as SitemapMode,
                  );
                }}
              >
                <option value="include">Include sitemap</option>
                <option value="skip">Skip sitemap</option>
              </select>
            </label>
            <label style={styles.fieldLabel}>
              <span>Delay (seconds)</span>
              <input
                style={styles.input}
                type="number"
                min={0}
                step={0.1}
                placeholder="0.5"
                value={crawlForm.delay}
                onChange={(event) => {
                  store.updateCrawlForm("delay", event.target.value);
                }}
              />
            </label>
          </div>
          <div style={styles.fieldRow}>
            <label style={styles.fieldLabel}>
              <span>Max concurrency</span>
              <input
                style={styles.input}
                type="number"
                min={1}
                placeholder="4"
                value={crawlForm.maxConcurrency}
                onChange={(event) => {
                  store.updateCrawlForm("maxConcurrency", event.target.value);
                }}
              />
            </label>
          </div>
          <div style={styles.checkGrid}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={crawlForm.ignoreQueryParameters}
                onChange={(event) => {
                  store.updateCrawlForm(
                    "ignoreQueryParameters",
                    event.target.checked,
                  );
                }}
              />
              <span>Ignore query parameters</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={crawlForm.crawlEntireDomain}
                onChange={(event) => {
                  store.updateCrawlForm(
                    "crawlEntireDomain",
                    event.target.checked,
                  );
                }}
              />
              <span>Crawl entire domain</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={crawlForm.allowSubdomains}
                onChange={(event) => {
                  store.updateCrawlForm(
                    "allowSubdomains",
                    event.target.checked,
                  );
                }}
              />
              <span>Allow subdomains</span>
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={crawlForm.allowExternalLinks}
                onChange={(event) => {
                  store.updateCrawlForm(
                    "allowExternalLinks",
                    event.target.checked,
                  );
                }}
              />
              <span>Allow external links</span>
            </label>
          </div>
          <div style={styles.fieldRow}>
            <label style={styles.fieldLabel}>
              <span>Include paths (one per line)</span>
              <textarea
                rows={2}
                style={styles.textarea}
                placeholder="docs/.*"
                value={crawlForm.includePaths}
                onChange={(event) => {
                  store.updateCrawlForm("includePaths", event.target.value);
                }}
              />
            </label>
            <label style={styles.fieldLabel}>
              <span>Exclude paths (one per line)</span>
              <textarea
                rows={2}
                style={styles.textarea}
                placeholder="blog/.*"
                value={crawlForm.excludePaths}
                onChange={(event) => {
                  store.updateCrawlForm("excludePaths", event.target.value);
                }}
              />
            </label>
          </div>
        </div>
        {crawlStage.tag === "error" ? (
          <p style={styles.error}>{crawlStage.message}</p>
        ) : null}
        {crawlStage.tag === "success" ? (
          <p style={styles.success}>Crawl started.</p>
        ) : null}
        {crawlJobId ? (
          <div style={styles.crawlInfo}>
            <p style={styles.crawlText}>Job ID: {crawlJobId}</p>
            <button
              style={styles.linkButton}
              onClick={() => {
                if (!crawlJobId || !effectiveApiKey) {
                  return;
                }

                void refreshCrawlStatus(crawlJobId, effectiveApiKey);
              }}
              type="button"
            >
              Refresh status
            </button>
          </div>
        ) : null}
        {crawlStatusSummary ? (
          <p style={styles.muted}>{crawlStatusSummary}</p>
        ) : null}
      </div>
    </section>
  );

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Firecrawl Assist</h1>
        <div style={styles.headerSubtitle}>
          <span style={styles.headerSubtitleTitle}>
            {tabTitle || "Loading active tab…"}
          </span>
          <span style={styles.headerSubtitleUrl}>
            {tabUrl || "Detecting active tab…"}
          </span>
        </div>
      </header>

      <section style={styles.apiSection}>
        {apiEditorVisible ? (
          <div style={styles.apiEditor}>
            <label style={styles.apiLabel} htmlFor="firecrawl-api-key">
              Firecrawl API key
            </label>
            <input
              id="firecrawl-api-key"
              style={styles.input}
              placeholder="fc-..."
              value={apiKeyDraft}
              onChange={(event) => {
                setApiKeyDraft(event.target.value);
              }}
            />
            <p style={styles.helper}>Stored locally in your browser.</p>
            <div style={styles.apiActions}>
              <button
                style={styles.primaryButtonSmall}
                onClick={() => {
                  void (async () => {
                    const trimmed = apiKeyDraft.trim();
                    await setApiKey(trimmed);
                    setApiKeyDraft(trimmed);
                    store.clearNotice();
                    setApiEditorVisible(false);
                  })();
                }}
                type="button"
              >
                Save
              </button>
              {isApiConfigured ? (
                <button
                  style={styles.linkButton}
                  onClick={() => {
                    setApiEditorVisible(false);
                    setApiKeyDraft(apiKey);
                    store.clearNotice();
                  }}
                  type="button"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div style={styles.apiStatusRow}>
            <span style={styles.successPill}>✓ API key stored</span>
            <button
              style={styles.linkButton}
              onClick={() => {
                setApiEditorVisible(true);
                setApiKeyDraft(apiKey);
              }}
              type="button"
            >
              Edit
            </button>
          </div>
        )}
      </section>

      <nav style={styles.viewToggle}>
        <button
          style={{
            ...styles.viewButton,
            ...(currentView === "scrape" ? styles.viewButtonActive : {}),
          }}
          onClick={() => {
            store.setView("scrape");
          }}
          type="button"
        >
          Scrape
        </button>
        <button
          style={{
            ...styles.viewButton,
            ...(currentView === "crawl" ? styles.viewButtonActive : {}),
          }}
          onClick={() => {
            store.setView("crawl");
          }}
          type="button"
        >
          Crawl
        </button>
      </nav>

      {currentView === "scrape" ? renderScrapeView() : renderCrawlView()}
      {toastMessage ? <div style={styles.toast}>{toastMessage}</div> : null}
    </main>
  );
};

const styles: Record<string, CSSProperties> = {
  container: {
    fontFamily: font.family,
    minWidth: 360,
    maxWidth: 420,
    padding: space.lg,
    color: colors.accentBlack,
    backgroundColor: colors.backgroundBase,
  },
  header: {
    marginBottom: space.md,
  },
  title: {
    margin: 0,
    fontSize: font.size.xl,
    fontWeight: font.weight.semibold,
    letterSpacing: -0.1,
  },
  headerSubtitle: {
    marginTop: space.xs,
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    maxWidth: "100%",
  },
  headerSubtitleTitle: {
    fontSize: font.size.sm,
    color: colors.blackAlpha72,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  headerSubtitleUrl: {
    fontSize: font.size.xs,
    color: colors.blackAlpha40,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  apiSection: {
    marginBottom: space.lg,
  },
  apiEditor: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
  },
  apiLabel: {
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    color: colors.blackAlpha72,
  },
  card: {
    borderRadius: radii.md,
    padding: space.md,
    marginBottom: space.md,
    backgroundColor: colors.backgroundLighter,
    boxShadow: `0 12px 32px rgba(38, 38, 38, 0.06), inset 0 0 0 1px ${colors.borderFaint}`,
  },
  cardHeader: {
    marginBottom: space.sm,
    overflow: "hidden",
  },
  cardTitle: {
    margin: 0,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    letterSpacing: -0.1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  },
  cardSubtitle: {
    margin: `${space.xs}px 0 0`,
    fontSize: font.size.xs,
    color: colors.blackAlpha56,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  input: {
    width: "100%",
    padding: `${space.sm}px ${space.md}px`,
    borderRadius: radii.sm,
    border: `1px solid ${colors.borderMuted}`,
    fontSize: font.size.sm,
    backgroundColor: colors.backgroundBase,
    color: colors.accentBlack,
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: `${space.sm}px ${space.md}px`,
    borderRadius: radii.sm,
    border: `1px solid ${colors.borderMuted}`,
    fontSize: font.size.sm,
    backgroundColor: colors.backgroundBase,
    color: colors.accentBlack,
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: `${space.sm}px ${space.md}px`,
    borderRadius: radii.sm,
    border: `1px solid ${colors.borderMuted}`,
    fontSize: font.size.sm,
    resize: "vertical",
    backgroundColor: colors.backgroundBase,
    color: colors.accentBlack,
    boxSizing: "border-box",
  },
  helper: {
    margin: `${space.xs}px 0 0`,
    fontSize: font.size.xs,
    color: colors.blackAlpha56,
  },
  apiStatusRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.sm,
  },
  apiActions: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    marginTop: space.sm,
  },
  successPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: space.xs,
    padding: `${space.xs}px ${space.sm}px`,
    borderRadius: radii.lg,
    backgroundColor: colors.successTint,
    color: colors.success,
    fontSize: font.size.xs,
    fontWeight: font.weight.medium,
  },
  viewToggle: {
    display: "inline-flex",
    alignItems: "center",
    gap: space.xs,
    margin: `0 auto ${space.md}px`,
    padding: space.xs,
    borderRadius: radii.lg,
    backgroundColor: "#f4f4f5",
    boxShadow: "inset 0 1px 2px rgba(38, 38, 38, 0.06)",
    border: `1px solid ${colors.borderFaint}`,
    width: "fit-content",
  },
  viewButton: {
    padding: `${space.sm}px ${space.lg}px`,
    borderRadius: radii.sm,
    border: "none",
    backgroundColor: "transparent",
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    cursor: "pointer",
    color: colors.blackAlpha64,
    transition: "all 150ms ease",
    display: "flex",
    alignItems: "center",
    gap: space.xs,
    minWidth: 80,
    justifyContent: "center",
  },
  viewButtonActive: {
    backgroundColor: "#ffffff",
    color: colors.accentBlack,
    boxShadow: "0 6px 14px rgba(38, 38, 38, 0.12)",
    fontWeight: font.weight.semibold,
  },
  primaryButton: {
    width: "100%",
    padding: `${space.sm}px ${space.md}px`,
    borderRadius: radii.sm,
    border: "none",
    backgroundColor: colors.heat100,
    color: "#ffffff",
    fontSize: font.size.md,
    fontWeight: font.weight.medium,
    cursor: "pointer",
    boxShadow: "0 5px 15px rgba(250, 93, 25, 0.25)",
  },
  primaryButtonSmall: {
    padding: `${space.xs}px ${space.md}px`,
    borderRadius: radii.sm,
    border: "none",
    backgroundColor: colors.heat100,
    color: colors.accentBlack,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    cursor: "pointer",
    boxShadow: "0 8px 16px rgba(250, 93, 25, 0.2)",
  },
  toast: {
    position: "fixed",
    left: "50%",
    bottom: space.xl,
    transform: "translateX(-50%)",
    padding: `${space.sm}px ${space.lg}px`,
    borderRadius: radii.lg,
    backgroundColor: colors.accentBlack,
    color: colors.backgroundLighter,
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    boxShadow: "0 12px 32px rgba(38, 38, 38, 0.25)",
    zIndex: 9999,
  },
  primaryButtonBusy: {
    opacity: 0.8,
    cursor: "default",
  },
  secondaryButton: {
    padding: `${space.xs}px ${space.md}px`,
    borderRadius: radii.sm,
    border: `1px solid ${colors.borderMuted}`,
    backgroundColor: colors.backgroundBase,
    color: colors.blackAlpha72,
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    cursor: "pointer",
    boxShadow: `inset 0 0 0 1px ${colors.borderMuted}`,
  },
  linkButton: {
    padding: 0,
    border: "none",
    background: "none",
    color: colors.heat100,
    cursor: "pointer",
    fontSize: font.size.xs,
    fontWeight: font.weight.medium,
  },
  microcopy: {
    margin: `${space.xs}px 0 0`,
    fontSize: font.size.xs,
    color: colors.blackAlpha56,
  },
  error: {
    marginTop: space.sm,
    fontSize: font.size.xs,
    color: colors.danger,
    backgroundColor: colors.dangerTint,
    padding: `${space.xs}px ${space.sm}px`,
    borderRadius: radii.sm,
  },
  success: {
    marginTop: space.sm,
    fontSize: font.size.xs,
    color: colors.success,
    backgroundColor: colors.successTint,
    padding: `${space.xs}px ${space.sm}px`,
    borderRadius: radii.sm,
  },
  formStack: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    marginTop: space.sm,
  },
  fieldLabel: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    fontSize: font.size.xs,
    fontWeight: font.weight.medium,
    color: colors.blackAlpha72,
  },
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: space.sm,
    width: "100%",
  },
  disclosure: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.sm,
    padding: `${space.sm}px ${space.md}px`,
    borderRadius: radii.sm,
    border: `1px solid ${colors.borderFaint}`,
    backgroundColor: colors.backgroundLighter,
    cursor: "pointer",
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    color: colors.blackAlpha72,
  },
  disclosureActive: {
    borderColor: colors.heat40,
    boxShadow: `inset 0 0 0 1px ${colors.heat40}`,
  },
  disclosureSummary: {
    color: colors.blackAlpha56,
    fontSize: font.size.xs,
    fontWeight: font.weight.medium,
  },
  optionsBody: {
    marginTop: space.sm,
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
  },
  formatList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gap: space.sm,
  },
  formatItem: {
    border: `1px solid ${colors.borderMuted}`,
    borderRadius: radii.sm,
    padding: space.sm,
    backgroundColor: colors.backgroundBase,
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    color: colors.blackAlpha72,
  },
  checkGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: space.sm,
  },
  formatLabelGroup: {
    display: "flex",
    alignItems: "center",
    gap: space.xs,
  },
  formatLabelText: {
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
  },
  recommendedBadge: {
    padding: `${space.xs}px ${space.sm}px`,
    borderRadius: radii.lg,
    backgroundColor: colors.heat16,
    color: colors.heat100,
    fontSize: font.size.xs,
    fontWeight: font.weight.medium,
    border: `1px solid ${colors.heat40}`,
  },
  formatHelper: {
    margin: `${space.xs}px 0 0`,
    fontSize: font.size.xs,
    color: colors.blackAlpha56,
  },
  notice: {
    margin: 0,
    fontSize: font.size.xs,
    color: colors.warning,
    backgroundColor: colors.warningTint,
    padding: `${space.xs}px ${space.sm}px`,
    borderRadius: radii.sm,
  },
  resultHeader: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    marginBottom: space.sm,
  },
  resultHeading: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
  },
  resultBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: `${space.xs}px ${space.sm}px`,
    borderRadius: radii.lg,
    backgroundColor: colors.heat16,
    color: colors.heat100,
    fontSize: font.size.xs,
    fontWeight: font.weight.medium,
  },
  resultMeta: {
    fontSize: font.size.xs,
    color: colors.blackAlpha56,
  },
  resultActions: {
    display: "flex",
    gap: space.sm,
  },
  previewContainer: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
  },
  preview: {
    margin: 0,
    padding: space.sm,
    maxHeight: 200,
    overflow: "auto",
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceTint,
    border: `1px solid ${colors.borderMuted}`,
    fontSize: font.size.xs,
    whiteSpace: "pre-wrap",
  },
  crawlInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.sm,
    marginTop: space.sm,
  },
  crawlText: {
    fontSize: font.size.sm,
    margin: 0,
    color: colors.blackAlpha72,
  },
  muted: {
    marginTop: space.xs,
    fontSize: font.size.xs,
    color: colors.blackAlpha56,
  },
};

export default observer(Popup);
