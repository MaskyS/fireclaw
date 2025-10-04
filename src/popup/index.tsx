import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import * as R from "remeda";

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
  requestCreditUsage,
  requestScrape,
} from "~lib/messaging";
import { triggerDownload } from "~lib/download";
import { colors, font, radii, shadows, space } from "./design";
import {
  DEFAULT_CRAWL_FORM,
  createEmptyCrawlForm,
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

const queryClient = new QueryClient();

const usePopupLogic = () => {
  const [view, setViewState] = useState<ViewMode>("scrape");
  const [scrapeStage, setScrapeStage] = useState<ScrapeStage>({ tag: "idle" });
  const [crawlStage, setCrawlStage] = useState<CrawlStage>({ tag: "idle" });
  const [lastScrape, setLastScrape] = useState<LastScrape | undefined>(undefined);
  const [crawlStatus, setCrawlStatusState] = useState<CrawlStatusResponseBody | undefined>(
    undefined,
  );
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [optionsNotice, setOptionsNotice] = useState<string | undefined>(undefined);
  const noticeTimerRef = useRef<number | undefined>(undefined);
  const [crawlForm, setCrawlForm] = useState<CrawlFormState>(() => createEmptyCrawlForm());
  const [toastMessage, setToastMessage] = useState<string | undefined>(undefined);
  const [crawlData, setCrawlData] = useState<unknown[]>([]);
  const [hasDownloadedCrawl, setHasDownloadedCrawl] = useState(false);
  const [credits, setCredits] = useState<number | undefined>(undefined);

  const crawlJobId = useMemo(
    () => (crawlStage.tag === "success" ? crawlStage.payload.id : undefined),
    [crawlStage],
  );

  const isPolling = useMemo(() => {
    if (!crawlStatus || !crawlStatus.ok) {
      return false;
    }
    const status = crawlStatus.status;
    return status === "pending" || status === "processing";
  }, [crawlStatus]);

  const isCrawlComplete = useMemo(() => {
    if (!crawlStatus || !crawlStatus.ok) {
      return false;
    }
    return crawlStatus.status === "completed";
  }, [crawlStatus]);

  const setView = useCallback(
    (next: ViewMode) => {
      setViewState(next);
      setOptionsOpen(false);
    },
    [],
  );

  const toggleOptions = useCallback(() => {
    setOptionsOpen((current) => !current);
  }, []);

  const togglePreview = useCallback(() => {
    setPreviewExpanded((current) => !current);
  }, []);

  const setNotice = useCallback((message: string) => {
    setOptionsNotice(message);
    if (noticeTimerRef.current !== undefined) {
      window.clearTimeout(noticeTimerRef.current);
    }
    noticeTimerRef.current = window.setTimeout(() => {
      setOptionsNotice(undefined);
      noticeTimerRef.current = undefined;
    }, 3_000);
  }, []);

  const clearNotice = useCallback(() => {
    setOptionsNotice(undefined);
    if (noticeTimerRef.current !== undefined) {
      window.clearTimeout(noticeTimerRef.current);
      noticeTimerRef.current = undefined;
    }
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage((current) => (current === message ? current : message));
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(undefined);
  }, []);

  const scrapeStarted = useCallback((intent: ScrapeIntent) => {
    setScrapeStage({ tag: "loading", intent });
    setPreviewExpanded(false);
  }, []);

  const scrapeFailed = useCallback(
    (intent: ScrapeIntent, message: string, detail?: ScrapeFailure) => {
      setScrapeStage({
        tag: "error",
        intent,
        message,
        detail,
      });
    },
    [],
  );

  const scrapeSucceeded = useCallback(
    (intent: ScrapeIntent, payload: ScrapeSuccess, note?: string) => {
      setScrapeStage({
        tag: "success",
        intent,
        payload,
        note,
      });
      setLastScrape({
        primary: payload.primary,
        format: payload.primaryFormat,
        mimeType: payload.mimeType,
        timestamp: new Date().toISOString(),
        raw: payload.raw,
        payload,
      });
      setPreviewExpanded(false);
    },
    [],
  );

  const scrapeNote = useCallback(
    (intent: ScrapeIntent, note: string) => {
      if (!lastScrape) {
        return;
      }
      setScrapeStage({
        tag: "success",
        intent,
        payload: lastScrape.payload,
        note,
      });
    },
    [lastScrape],
  );

  const crawlStarted = useCallback(() => {
    setCrawlStage({ tag: "loading" });
    setCrawlStatusState(undefined);
    setHasDownloadedCrawl(false);
  }, []);

  const crawlFailed = useCallback(
    (message: string, detail?: CrawlStartFailure) => {
      setCrawlStage({
        tag: "error",
        message,
        detail,
      });
    },
    [],
  );

  const crawlSucceeded = useCallback((payload: CrawlStartSuccess) => {
    setCrawlStage({ tag: "success", payload });
  }, []);

  const setCrawlStatus = useCallback((payload: CrawlStatusResponseBody) => {
    setCrawlStatusState(payload);
    if (payload.ok && payload.payload?.data && Array.isArray(payload.payload.data)) {
      const data = payload.payload.data as unknown[];
      setCrawlData((current) => [...current, ...data]);
    }
  }, []);

  const updateCrawlForm: <Field extends keyof CrawlFormState>(
    field: Field,
    value: CrawlFormState[Field],
  ) => void = useCallback((field, value) => {
    setCrawlForm((current) => ({
      ...current,
      [field]: value,
    }));
  }, []);

  const resetCrawlForm = useCallback(() => {
    setCrawlForm(createEmptyCrawlForm());
  }, []);

  const resetCrawlData = useCallback(() => {
    setCrawlData([]);
  }, []);

  const markCrawlDownloaded = useCallback(() => {
    setHasDownloadedCrawl(true);
  }, []);

  const setCreditsAmount = useCallback((amount: number | undefined) => {
    setCredits(amount);
  }, []);

  const dispose = useCallback(() => {
    if (noticeTimerRef.current !== undefined) {
      window.clearTimeout(noticeTimerRef.current);
      noticeTimerRef.current = undefined;
    }
  }, []);

  return {
    view,
    setView,
    optionsOpen,
    toggleOptions,
    previewExpanded,
    togglePreview,
    optionsNotice,
    setNotice,
    clearNotice,
    scrapeStage,
    scrapeStarted,
    scrapeFailed,
    scrapeSucceeded,
    scrapeNote,
    lastScrape,
    crawlStage,
    crawlStarted,
    crawlFailed,
    crawlSucceeded,
    crawlStatus,
    setCrawlStatus,
    crawlJobId,
    isPolling,
    isCrawlComplete,
    crawlForm,
    updateCrawlForm,
    resetCrawlForm,
    crawlData,
    resetCrawlData,
    markCrawlDownloaded,
    hasDownloadedCrawl,
    showToast,
    clearToast,
    toastMessage,
    credits,
    setCredits: setCreditsAmount,
    dispose,
  } as const;
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

const extractDomain = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
};

const getStatusDotStyle = (status?: string): CSSProperties => {
  const getColor = (s?: string) => {
    if (s === "completed") return colors.success;
    if (s === "processing" || s === "pending") return colors.heat100;
    if (s === "failed") return colors.danger;
    return colors.blackAlpha40;
  };

  return {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: getColor(status),
    display: "inline-block",
    flexShrink: 0,
  };
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

  const lastCrawlStatusToastRef = useRef<string | undefined>(undefined);

  const {
    view: currentView,
    setView,
    optionsOpen,
    toggleOptions,
    previewExpanded,
    togglePreview,
    optionsNotice,
    setNotice,
    clearNotice,
    scrapeStage,
    scrapeStarted,
    scrapeFailed,
    scrapeSucceeded,
    scrapeNote,
    lastScrape,
    crawlStage,
    crawlStarted,
    crawlFailed,
    crawlSucceeded,
    crawlStatus,
    setCrawlStatus,
    crawlJobId,
    isPolling,
    isCrawlComplete,
    crawlForm,
    updateCrawlForm,
    resetCrawlForm,
    crawlData,
    resetCrawlData,
    markCrawlDownloaded,
    hasDownloadedCrawl,
    showToast,
    clearToast,
    toastMessage,
    credits,
    setCredits,
    dispose,
  } = usePopupLogic();

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

  useEffect(() => () => dispose(), [dispose]);

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


  const creditsQuery = useQuery({
    queryKey: ["credits", effectiveApiKey],
    queryFn: async () => {
      const result = await requestCreditUsage({ apiKey: effectiveApiKey });
      if (result.success && result.data) {
        return result.data.remainingCredits;
      }
      throw new Error(result.error ?? "Failed to fetch credits");
    },
    enabled: Boolean(effectiveApiKey),
    staleTime: 60_000,
    retry: 1,
  });

  useEffect(() => {
    if (!creditsQuery.isSuccess) {
      if (creditsQuery.isError) {
        console.warn("Failed to fetch credits", creditsQuery.error);
      }
      return;
    }

    setCredits(creditsQuery.data);
  }, [creditsQuery.isSuccess, creditsQuery.isError, creditsQuery.error, creditsQuery.data, setCredits]);

  const refreshCrawlStatus = useCallback(
    async (id: string, key: string) => {
      try {
        const status = await requestCrawlStatus({ id, apiKey: key });
        setCrawlStatus(status);
        if (!isCrawlStatusFailure(status)) {
          const summary = `Crawl status: ${status.status ?? "unknown"}`;
          if (summary !== lastCrawlStatusToastRef.current) {
            showToast(summary);
            lastCrawlStatusToastRef.current = summary;
          }
        } else {
          const errorSummary = `Crawl status error: ${status.error}`;
          if (errorSummary !== lastCrawlStatusToastRef.current) {
            showToast(errorSummary);
            lastCrawlStatusToastRef.current = errorSummary;
          }
        }
      } catch (error) {
        setCrawlStatus({
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to fetch crawl status",
        });
        const errorSummary =
          error instanceof Error
            ? error.message
            : "Unable to fetch crawl status";
        if (errorSummary !== lastCrawlStatusToastRef.current) {
          showToast(errorSummary);
          lastCrawlStatusToastRef.current = errorSummary;
        }
      }
    },
    [setCrawlStatus, showToast],
  );

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      clearToast();
    }, 3_000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toastMessage, clearToast]);

  // Auto-polling effect for crawl status
  useEffect(() => {
    if (!crawlJobId || !effectiveApiKey) {
      return;
    }

    // Poll immediately
    void refreshCrawlStatus(crawlJobId, effectiveApiKey);

    // Continue polling if crawl is in progress
    if (!isPolling) {
      return;
    }

    const interval = window.setInterval(() => {
      void refreshCrawlStatus(crawlJobId, effectiveApiKey);
    }, 3_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [crawlJobId, isPolling, effectiveApiKey, refreshCrawlStatus]);

  // Auto-download effect when crawl completes
  useEffect(() => {
    if (!isCrawlComplete || crawlData.length === 0 || hasDownloadedCrawl || !tabUrl) {
      return;
    }

    // Download all crawled data as JSON
    const downloadCrawlData = async () => {
      try {
        const content = JSON.stringify(crawlData, null, 2);
        const { filename } = await triggerDownload({
          sourceUrl: tabUrl,
          content,
          mimeType: "application/json",
          format: "json",
        });
        markCrawlDownloaded();
        showToast(`Crawl complete. Downloaded ${filename}`);
      } catch (error) {
        showToast(
          error instanceof Error ? `Download failed: ${error.message}` : "Download failed",
        );
      }
    };

    void downloadCrawlData();
  }, [
    isCrawlComplete,
    crawlData,
    hasDownloadedCrawl,
    tabUrl,
    markCrawlDownloaded,
    showToast,
  ]);

  const toggleFormat = async (format: FirecrawlFormatKey) => {
    const removalAttemptsLast =
      activeFormats.length === 1 && activeFormats[0] === format;
    const nextFormats = computeNextFormats(activeFormats, format);

    if (removalAttemptsLast) {
      setNotice("At least one format must remain selected. Markdown restored.");
    } else {
      clearNotice();
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
      scrapeFailed(
        intent,
        "Unable to detect the active tab URL. Refresh and try again.",
      );
      return undefined;
    }

    if (!effectiveApiKey) {
      scrapeFailed(intent, "Add your Firecrawl API key first.");
      return undefined;
    }

    scrapeStarted(intent);

    try {
      return await action();
    } catch (error) {
      scrapeFailed(
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
      scrapeFailed("preview", response.error, response);
      return;
    }

    scrapeSucceeded("preview", response, "Scrape completed.");
    void creditsQuery.refetch();

    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(response.primary);
        scrapeNote("preview", "Scrape copied to clipboard.");
        showToast("Scrape copied to clipboard.");
      } catch (error) {
        showToast(
          error instanceof Error
            ? `Scrape ready. Copy failed: ${error.message}`
            : "Scrape ready. Unable to auto-copy.",
        );
      }
    } else {
      showToast("Scrape ready. Copy from the preview.");
    }
  };

  const handleCopy = async () => {
    if (!lastScrape) {
      scrapeFailed("copy", "Scrape the page first to copy content.");
      return;
    }

    try {
      await navigator.clipboard.writeText(lastScrape.primary);
      scrapeNote("copy", "Copied to clipboard.");
      showToast("Copied to clipboard.");
    } catch (error) {
      scrapeFailed(
        "copy",
        error instanceof Error
          ? `Copy failed: ${error.message}`
          : "Copy failed",
      );
      showToast(
        error instanceof Error
          ? `Copy failed: ${error.message}`
          : "Copy failed",
      );
    }
  };

  const handleDownload = async () => {
    if (!lastScrape) {
      scrapeFailed(
        "download",
        "Scrape the page first to download content.",
      );
      return;
    }

    if (!tabUrl) {
      scrapeFailed(
        "download",
        "Unable to detect the active tab URL. Refresh and try again.",
      );
      return;
    }

    try {
      const { filename } = await triggerDownload({
        sourceUrl: tabUrl,
        content: lastScrape.primary,
        mimeType: lastScrape.mimeType,
        format: lastScrape.format,
      });

      scrapeNote("download", `Download started (${filename}).`);
      showToast(`Download started (${filename})`);
    } catch (error) {
      scrapeFailed(
        "download",
        error instanceof Error
          ? `Download failed: ${error.message}`
          : "Download failed",
      );
      showToast(
        error instanceof Error
          ? `Download failed: ${error.message}`
          : "Download failed",
      );
    }
  };

  const handleCrawlStart = async () => {
    if (!tabUrl) {
      crawlFailed("Unable to detect the active tab URL.");
      return;
    }

    if (!effectiveApiKey) {
      crawlFailed("Add your Firecrawl API key first.");
      return;
    }

    crawlStarted();
    lastCrawlStatusToastRef.current = undefined;
    resetCrawlData();

    const preparedOptions = buildCrawlOptions(crawlForm, requestOptions);

    try {
      const response = await requestCrawlStart({
        url: tabUrl,
        apiKey: effectiveApiKey,
        options: preparedOptions,
      });

      if (isCrawlStartFailure(response)) {
        crawlFailed(response.error, response);
        return;
      }

      crawlSucceeded(response);
      showToast("Crawl started.");
      void creditsQuery.refetch();
      await refreshCrawlStatus(response.id, effectiveApiKey);
    } catch (error) {
      const errorSummary =
        error instanceof Error ? error.message : "Unable to start crawl job";
      crawlFailed(errorSummary);
      showToast(errorSummary);
    }
  };

  const isScraping = scrapeStage.tag === "loading";
  const isCrawling = crawlStage.tag === "loading";

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
    <div>
      <button
        style={{
          ...styles.disclosure,
          ...(optionsOpen ? styles.disclosureActive : {}),
        }}
        onClick={() => {
          toggleOptions();
        }}
        type="button"
      >
        <span>Options</span>
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
      <div style={styles.sectionDivider} />
    </div>
  );

  const renderResultCard = () => {
    if (!lastScrape) {
      return null;
    }

    const totalLength = lastScrape.primary.length;
    const hasOverflow = totalLength > 400;
    const preview = previewSnippet(lastScrape.primary, previewExpanded);

    return (
      <div>
        <div style={styles.previewContainer}>
          <pre style={styles.preview}>{preview}</pre>
          {hasOverflow ? (
            <button
              style={styles.linkButton}
              onClick={() => {
                togglePreview();
              }}
              type="button"
            >
              {previewExpanded ? "Show less" : "Show more"}
            </button>
          ) : null}
        </div>
        <div style={styles.resultActions}>
          <button
            style={styles.tertiaryButton}
            onClick={() => {
              void handleCopy();
            }}
            type="button"
          >
            Copy
          </button>
          <button
            style={styles.tertiaryButton}
            onClick={() => {
              void handleDownload();
            }}
            type="button"
          >
            Download
          </button>
        </div>
      </div>
    );
  };

  const renderScrapeView = () => (
    <>
      <div>
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
        <p style={styles.microcopy}>1 credit</p>
        {scrapeStage.tag === "error" ? (
          <p style={styles.error}>{scrapeStage.message}</p>
        ) : null}
      </div>
      <div style={styles.sectionDivider} />
      {renderScrapeOptions()}
      {renderResultCard()}
    </>
  );

  const renderCrawlView = () => (
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
          <span>Prompt</span>
          <textarea
            rows={2}
            style={styles.textarea}
            placeholder={DEFAULT_CRAWL_FORM.prompt}
            value={crawlForm.prompt}
            onChange={(event) => {
              updateCrawlForm("prompt", event.target.value);
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
              placeholder={DEFAULT_CRAWL_FORM.limit}
              value={crawlForm.limit}
              onChange={(event) => {
                updateCrawlForm("limit", event.target.value);
              }}
            />
          </label>
          <label style={styles.fieldLabel}>
            <span>Max depth</span>
            <input
              style={styles.input}
              type="number"
              min={0}
              placeholder={DEFAULT_CRAWL_FORM.maxDiscoveryDepth}
              value={crawlForm.maxDiscoveryDepth}
              onChange={(event) => {
                updateCrawlForm("maxDiscoveryDepth", event.target.value);
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
                updateCrawlForm("sitemap", event.target.value as SitemapMode);
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
              placeholder={DEFAULT_CRAWL_FORM.delay}
              value={crawlForm.delay}
              onChange={(event) => {
                updateCrawlForm("delay", event.target.value);
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
              placeholder={DEFAULT_CRAWL_FORM.maxConcurrency}
              value={crawlForm.maxConcurrency}
              onChange={(event) => {
                updateCrawlForm("maxConcurrency", event.target.value);
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
                updateCrawlForm("ignoreQueryParameters", event.target.checked);
              }}
            />
            <span>Ignore query parameters</span>
          </label>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={crawlForm.crawlEntireDomain}
              onChange={(event) => {
                updateCrawlForm("crawlEntireDomain", event.target.checked);
              }}
            />
            <span>Crawl entire domain</span>
          </label>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={crawlForm.allowSubdomains}
              onChange={(event) => {
                updateCrawlForm("allowSubdomains", event.target.checked);
              }}
            />
            <span>Allow subdomains</span>
          </label>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={crawlForm.allowExternalLinks}
              onChange={(event) => {
                updateCrawlForm("allowExternalLinks", event.target.checked);
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
              placeholder={DEFAULT_CRAWL_FORM.includePaths}
              value={crawlForm.includePaths}
              onChange={(event) => {
                updateCrawlForm("includePaths", event.target.value);
              }}
            />
          </label>
          <label style={styles.fieldLabel}>
            <span>Exclude paths (one per line)</span>
            <textarea
              rows={2}
              style={styles.textarea}
              placeholder={DEFAULT_CRAWL_FORM.excludePaths}
              value={crawlForm.excludePaths}
              onChange={(event) => {
                updateCrawlForm("excludePaths", event.target.value);
              }}
            />
          </label>
        </div>
      </div>
      {crawlStage.tag === "error" ? (
        <p style={styles.error}>{crawlStage.message}</p>
      ) : null}
      {crawlStatusSummary && crawlJobId ? (
        <div style={styles.crawlStatusRow}>
          <span
            style={getStatusDotStyle(
              crawlStatus?.ok ? crawlStatus.status : undefined,
            )}
          />
          <p style={styles.crawlText}>{crawlStatusSummary}</p>
          {isPolling && (
            <span style={styles.pollingIndicator}>(auto-refresh)</span>
          )}
        </div>
      ) : null}
    </div>
  );

  return (
    <main style={styles.container}>
      <header style={styles.compactHeader}>
        <div style={styles.apiDomainRow}>
          <span style={styles.domain}>
            {extractDomain(tabUrl) || "Detecting..."}
          </span>
          {credits !== undefined && (
            <span style={styles.credits}>
              {credits.toLocaleString()} credits
            </span>
          )}
          {!apiEditorVisible && isApiConfigured && (
            <button
              style={styles.editKeyButton}
              onClick={() => setApiEditorVisible(true)}
              type="button"
            >
              🔑 Edit key
            </button>
          )}
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
                    clearNotice();
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
                    clearNotice();
                  }}
                  type="button"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>

      <nav style={styles.viewToggle}>
        <button
          style={{
            ...styles.viewButton,
            ...(currentView === "scrape" ? styles.viewButtonActive : {}),
          }}
          onClick={() => {
            setView("scrape");
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
            setView("crawl");
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
    color: colors.backgroundLighter,
    fontSize: font.size.md,
    fontWeight: font.weight.medium,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(250, 93, 25, 0.2)",
  },
  primaryButtonSmall: {
    padding: `${space.xs}px ${space.md}px`,
    borderRadius: radii.sm,
    border: "none",
    backgroundColor: colors.heat100,
    color: colors.backgroundLighter,
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    cursor: "pointer",
    boxShadow: "0 5px 16px rgba(250, 93, 25, 0.2)",
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
  compactHeader: {
    marginBottom: space.md,
  },
  apiDomainRow: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    fontSize: font.size.xs,
    color: colors.blackAlpha56,
  },
  keyIcon: {
    fontSize: font.size.sm,
  },
  domain: {
    flex: 1,
    fontWeight: font.weight.medium,
    color: colors.blackAlpha72,
  },
  editKeyButton: {
    padding: 0,
    border: "none",
    background: "none",
    color: colors.heat100,
    cursor: "pointer",
    fontSize: font.size.xs,
    fontWeight: font.weight.medium,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.borderFaint,
    margin: `${space.md}px 0`,
  },
  tertiaryButton: {
    padding: `${space.xs}px ${space.sm}px`,
    border: "none",
    background: "none",
    color: colors.blackAlpha72,
    fontSize: font.size.xs,
    cursor: "pointer",
    textDecoration: "underline",
    fontWeight: font.weight.medium,
  },
  crawlStatusRow: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    marginTop: space.sm,
  },
  pollingIndicator: {
    fontSize: font.size.xs,
    color: colors.blackAlpha56,
    fontStyle: "italic",
  },
  credits: {
    fontSize: font.size.xs,
    color: colors.blackAlpha56,
    fontWeight: font.weight.medium,
  },
};

const PopupWithQueryClient = () => (
  <QueryClientProvider client={queryClient}>
    <Popup />
  </QueryClientProvider>
);

export default PopupWithQueryClient;
