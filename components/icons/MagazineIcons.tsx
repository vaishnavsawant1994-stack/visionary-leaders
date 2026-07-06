import {
  Sun,
  Moon,
  Palette,

  ChevronLeft,
  ChevronRight,

  ZoomIn,
  ZoomOut,

  Maximize,
  Minimize,

  RefreshCw,
  Download,

  Sparkles,
  Languages,
  FileDown,
} from "lucide-react";

export const MagazineIcons = {
  // 🌗 Theme icons
  lightTheme: Sun,
  darkTheme: Moon,
  corporateTheme: Palette,

  // 📖 Reader navigation
  prev: ChevronLeft,
  next: ChevronRight,

  // 🔍 Zoom controls
  zoomIn: ZoomIn,
  zoomOut: ZoomOut,

  // 🖥️ Screen controls
  fullscreen: Maximize,
  exitFullscreen: Minimize,

  // 🔄 Auto flip
  autoFlip: RefreshCw,

  // ⬇️ Download
  download: Download,

  // 🧠 AI tools
  summary: Sparkles,
  translate: Languages,
  pdfDownload: FileDown,
};