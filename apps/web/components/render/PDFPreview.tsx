"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Card } from "../ui/card";
import { useTranslations } from "../layout/locale-provider";

const LETTER_WIDTH_PX = 816;
const LETTER_HEIGHT_PX = 1056;

export function PDFPreview({ html }: { html: string }) {
  const t = useTranslations();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [availableWidth, setAvailableWidth] = useState(LETTER_WIDTH_PX);
  // docHeight tracks the real rendered height of the iframe content (may exceed one page)
  const [docHeight, setDocHeight] = useState(LETTER_HEIGHT_PX);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    const updateWidth = () => {
      setAvailableWidth(element.clientWidth || LETTER_WIDTH_PX);
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const readDocHeight = useCallback(() => {
    try {
      const innerHeight =
        iframeRef.current?.contentDocument?.documentElement?.scrollHeight ??
        LETTER_HEIGHT_PX;
      setDocHeight(Math.max(innerHeight, LETTER_HEIGHT_PX));
    } catch {
      setDocHeight(LETTER_HEIGHT_PX);
    }
  }, []);

  // Re-read height whenever html changes
  useEffect(() => {
    setDocHeight(LETTER_HEIGHT_PX);
  }, [html]);

  const scale = useMemo(() => Math.min(availableWidth / LETTER_WIDTH_PX, 1), [availableWidth]);
  // Total scaled pixel height of the iframe wrapper
  const scaledHeight = docHeight * scale;

  return (
    <Card variant="glass" className="overflow-hidden">
      <div className="border-b border-[color:var(--field-border)] px-6 py-4">
        <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{t("render.pdfPreview.title")}</h3>
        <p className="mt-1 text-sm text-[color:var(--text-secondary)]">{t("render.pdfPreview.description")}</p>
      </div>
      <div className="bg-[linear-gradient(180deg,rgba(247,241,232,0.96),rgba(255,255,255,0.98))] p-5 dark:bg-[linear-gradient(180deg,rgba(23,27,31,0.92),rgba(17,20,23,0.96))]">
        {/* Outer scroller: allows multi-page content to be scrolled, capped at 80vh */}
        <div
          ref={viewportRef}
          className="mx-auto w-full max-w-[816px] overflow-y-auto"
          style={{ maxHeight: "80vh" }}
        >
          {/* Shrink-wrap to the scaled content height so the scroller knows how tall to be */}
          <div
            className="relative mx-auto overflow-hidden bg-white"
            style={{ height: `${scaledHeight}px` }}
          >
            {/* iframe rendered at native resolution, then scaled down */}
            <div
              className="absolute left-0 top-0 origin-top-left"
              style={{
                width: `${LETTER_WIDTH_PX}px`,
                height: `${docHeight}px`,
                transform: `scale(${scale})`,
              }}
            >
              <iframe
                ref={iframeRef}
                title={t("render.pdfPreview.iframeTitle")}
                className="block w-full border-0 bg-white"
                style={{ height: `${docHeight}px` }}
                srcDoc={html}
                sandbox="allow-same-origin"
                scrolling="no"
                onLoad={readDocHeight}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
