"use client";

import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "@/styles/magazines.css";

import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  RefreshCw,
  Download,
  Sparkles,
} from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const FlipBook = HTMLFlipBook as any;

interface Props {
  pdfUrl: string;
  title?: string;
}

export default function FlipBookViewer({ pdfUrl }: Props) {
  const flipBookRef = useRef<any>(null);

  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [summary, setSummary] = useState("");
  const [bookWidth, setBookWidth] = useState(320);
  const [bookHeight, setBookHeight] = useState(480);
  const [autoFlip, setAutoFlip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
  const updateSize = () => {
    const mobile = window.innerWidth < 768;

    setIsMobile(mobile);

    if (mobile) {
      setBookWidth(180);
      setBookHeight(260);
    } else {
      setBookWidth(320);
      setBookHeight(470);
    }
  };

  updateSize();

  window.addEventListener("resize", updateSize);

  return () =>
    window.removeEventListener("resize", updateSize);
}, []);


  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoFlip) {
      interval = setInterval(() => {
        flipBookRef.current?.pageFlip()?.flipNext();
      }, 2500);
    }

    return () => clearInterval(interval);
  }, [autoFlip]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onFlip = (e: any) => {
  setCurrentPage(e.data + 1);

  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
  });
};
  const prevPage = () => flipBookRef.current?.pageFlip()?.flipPrev();
  const nextPage = () => flipBookRef.current?.pageFlip()?.flipNext();

  const zoomIn = () => setZoom((p) => Math.min(p + 0.2, 2));
  const zoomOut = () => setZoom((p) => Math.max(p - 0.2, 0.8));

  const handleFullscreen = () => {
    const el = document.getElementById("magazine-reader");
    el?.requestFullscreen();
  };

  const generateSummary = async () => {
    setSummary("Generating summary...");
  };

  /* ICON BUTTON THEME */
  const iconBtn = {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#1a1a1a",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.25s ease",
  };

  const iconHover = (e: any, enter: boolean) => {
    if (enter) {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.border = "1px solid #ff4d6d";
      e.currentTarget.style.boxShadow =
        "0 8px 20px rgba(255,77,109,0.15)";
    } else {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
      e.currentTarget.style.boxShadow = "none";
    }
  };

  const bottomBtn = {
    padding: "12px 18px",
    borderRadius: "14px",
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    color: "#1a1a1a",
    fontWeight: 600,
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    transition: "all 0.25s ease",
  };
  const isCoverPage = currentPage === 1;

const viewerWidth = isCoverPage
  ? bookWidth
  : bookWidth * 2;

  return (
    <div className="reader-page">
      <div
        id="magazine-reader"
        style={{
          background:
            "linear-gradient(to right, #4a4a4a, #3b3b3b, #4a4a4a)",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        {/* TOP TOOLBAR */}
        <div
          style={{
            height: "70px",
            background: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 25px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            position: "sticky",
            top: 0,
            zIndex: 999,
            color: "#fff",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            {[prevPage, nextPage, zoomOut, zoomIn].map((fn, i) => {
              const icons = [
                <ChevronLeft size={18} />,
                <ChevronRight size={18} />,
                <ZoomOut size={18} />,
                <ZoomIn size={18} />,
              ];

              return (
                <button
                  key={i}
                  style={iconBtn}
                  onClick={fn}
                  onMouseEnter={(e) => iconHover(e, true)}
                  onMouseLeave={(e) => iconHover(e, false)}
                >
                  {icons[i]}
                </button>
              );
            })}
          </div>

          <div
            style={{
              padding: "8px 14px",
              borderRadius: "999px",
              background: "#000",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {currentPage} / {numPages}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={iconBtn}
              onClick={handleFullscreen}
              onMouseEnter={(e) => iconHover(e, true)}
              onMouseLeave={(e) => iconHover(e, false)}
            >
              <Maximize size={18} />
            </button>

            <button
              style={iconBtn}
              onClick={() => setAutoFlip(!autoFlip)}
              onMouseEnter={(e) => iconHover(e, true)}
              onMouseLeave={(e) => iconHover(e, false)}
            >
              <RefreshCw size={18} />
            </button>

            <a href={pdfUrl} target="_blank" style={iconBtn}>
              <Download size={18} />
            </a>
          </div>
        </div>

        {/* VIEWER */}
        <div
          style={{
            minHeight: "700px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* SIDE ARROWS */}
          <button
            onClick={prevPage}
            style={{
              position: "absolute",
              left: "30px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "58px",
              height: "120px",
              borderRadius: "14px",
              border: "none",
              background: "rgba(0,0,0,0.35)",
              color: "#fff",
              fontSize: "34px",
              cursor: "pointer",
              zIndex: 50,
            }}
          >
            ❮
          </button>

          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <div
  style={{
    transform: `scale(${zoom})`,
    transition: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    perspective: "2500px",
  }}
>
  
  
  <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    margin: "0 auto",

    transform:
      currentPage === 1
        ? `translateX(-${bookWidth / 2}px) scale(${zoom})`
        : `translateX(0px) scale(${zoom})`,

    transition: "none",
  }}
>
              <FlipBook
  ref={flipBookRef}
  width={bookWidth}
  height={bookHeight}
  size="fixed"
autoSize={false}
  minWidth={bookWidth}
  maxWidth={bookWidth}
  minHeight={bookHeight}
  maxHeight={bookHeight}
  showCover={true}
  usePortrait={false}
  startPage={0}
  drawShadow={true}
  flippingTime={800}
  maxShadowOpacity={0.6}
  mobileScrollSupport={true}
  showPageCorners={true}
  disableFlipByClick={false}
  onFlip={onFlip}
>
                {Array.from({ length: numPages }, (_, i) => (
                  <div
                    key={i}
                    className="page"
                    style={{
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Page pageNumber={i + 1} width={bookWidth} />
                  </div>
                ))}
              </FlipBook>
              </div>
              
            </div>
          </Document>

          <button
            onClick={nextPage}
            style={{
              position: "absolute",
              right: "30px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "58px",
              height: "120px",
              borderRadius: "14px",
              border: "none",
              background: "rgba(0,0,0,0.35)",
              color: "#fff",
              fontSize: "34px",
              cursor: "pointer",
              zIndex: 50,
            }}
          >
            ❯
          </button>
        </div>
      </div>

      {/* BOTTOM */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          padding: "30px",
        }}
      >
        <button style={bottomBtn} onClick={generateSummary}>
          <Sparkles size={16} /> Generate Summary
        </button>

        <a
          href={pdfUrl}
          target="_blank"
          style={{ ...bottomBtn, textDecoration: "none" }}
        >
          <Download size={16} /> Download PDF
        </a>
      </div>

      {summary && (
        <div style={{ padding: 20, background: "#fff" }}>
          <h3>Summary</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}