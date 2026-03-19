"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Card } from "../ui/card";
import { useTranslations } from "../layout/locale-provider";

const LETTER_WIDTH_PX = 816;
const LETTER_HEIGHT_PX = 1056;

/**
 * True double-buffer: two iframes sit on top of each other.
 * Only ONE rule: we NEVER mutate the srcDoc of the currently visible iframe.
 *
 * Flow:
 *   1. active=0, iframe[0] visible (shows current html)
 *   2. html prop changes → load new html into iframe[1] (hidden behind iframe[0])
 *   3. iframe[1].onLoad fires → swap: active=1, iframe[1] comes to front
 *   4. Next change → load into iframe[0] (now hidden) → swap back → active=0
 *   ...repeat ping-pong
 *
 * Because the front iframe's srcDoc is never changed, it never reloads,
 * and the user sees zero blank frames.
 */
export function PDFPreview({ html }: { html: string }) {
  const t = useTranslations();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const iframeRefs = [
    useRef<HTMLIFrameElement | null>(null),
    useRef<HTMLIFrameElement | null>(null),
  ];

  const [availableWidth, setAvailableWidth] = useState(LETTER_WIDTH_PX);
  const [docHeight, setDocHeight] = useState(LETTER_HEIGHT_PX);

  // srcDoc for each slot
  const [slotHtml, setSlotHtml] = useState<[string, string]>([html, html]);
  // which slot index is currently shown on top
  const [active, setActive] = useState<0 | 1>(0);

  // Refs mirror state so onLoad callbacks never capture stale values
  const activeRef = useRef<0 | 1>(0);
  const slotHtmlRef = useRef<[string, string]>([html, html]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setAvailableWidth(el.clientWidth || LETTER_WIDTH_PX);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // When html changes, write it into the inactive slot (never the active one)
  useEffect(() => {
    const cur = activeRef.current;
    const inactive = cur === 0 ? 1 : 0;
    // Skip if back slot already has this html
    if (slotHtmlRef.current[inactive] === html) return;
    const next: [string, string] = [slotHtmlRef.current[0], slotHtmlRef.current[1]];
    next[inactive] = html;
    slotHtmlRef.current = next;
    setSlotHtml(next);
  }, [html]);

  const measure = (idx: 0 | 1) => {
    try {
      const h =
        iframeRefs[idx]!.current?.contentDocument?.documentElement?.scrollHeight ??
        LETTER_HEIGHT_PX;
      setDocHeight(Math.max(h, LETTER_HEIGHT_PX));
    } catch {
      // sandboxed / cross-origin — leave height unchanged
    }
  };

  // Called when slot `idx` finishes loading
  const makeOnLoad = (idx: 0 | 1) => () => {
    const cur = activeRef.current;
    if (idx === cur) {
      // Active slot (re)loaded (initial paint) — just measure
      measure(idx);
    } else {
      // Back slot finished loading new content — only promote if content changed
      if (slotHtmlRef.current[idx] !== slotHtmlRef.current[cur]) {
        measure(idx);
        activeRef.current = idx;
        setActive(idx);
      }
    }
  };

  const scale = useMemo(
    () => Math.min(availableWidth / LETTER_WIDTH_PX, 1),
    [availableWidth],
  );
  const scaledHeight = docHeight * scale;

  const baseStyle = {
    position: "absolute" as const,
    left: 0,
    top: 0,
    width: `${LETTER_WIDTH_PX}px`,
    height: `${docHeight}px`,
    transformOrigin: "top left",
    transform: `scale(${scale})`,
    border: "none" as const,
    background: "white",
  };

  return (
    <Card variant="glass" className="overflow-hidden">
      <div className="border-b border-[color:var(--field-border)] px-6 py-4">
        <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">
          {t("render.pdfPreview.title")}
        </h3>
        <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
          {t("render.pdfPreview.description")}
        </p>
      </div>
      <div className="bg-[linear-gradient(180deg,rgba(247,241,232,0.96),rgba(255,255,255,0.98))] p-5 dark:bg-[linear-gradient(180deg,rgba(23,27,31,0.92),rgba(17,20,23,0.96))]">
        <div
          ref={viewportRef}
          className="mx-auto w-full max-w-[816px] overflow-y-auto"
          style={{ maxHeight: "80vh" }}
        >
          <div
            className="relative mx-auto bg-white"
            style={{ height: `${scaledHeight}px` }}
          >
            {([0, 1] as const).map((idx) => {
              const isActive = idx === active;
              return (
                <iframe
                  key={idx}
                  ref={iframeRefs[idx]}
                  title={isActive ? t("render.pdfPreview.iframeTitle") : "preview-buffer"}
                  srcDoc={slotHtml[idx]}
                  sandbox="allow-same-origin"
                  scrolling="no"
                  onLoad={makeOnLoad(idx)}
                  aria-hidden={!isActive}
                  style={{
                    ...baseStyle,
                    zIndex: isActive ? 1 : 0,
                    // hidden keeps layout intact but stops browser from painting it
                    visibility: isActive ? "visible" : "hidden",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
