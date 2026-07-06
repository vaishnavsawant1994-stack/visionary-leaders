const express = require("express");

/* PDF Extractor */
const extractPdfText = require("../utils/pdfExtractor");

/* Centralized Translator */
const {
  translateText,
} = require("../utils/translateText");

const router = express.Router();

/* ================= SPLIT LARGE CONTENT ================= */
const splitIntoChunks = (
  text,
  size = 1000
) => {
  if (!text) return [];

  const chunks = [];

  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }

  return chunks;
};

/* ================= MAIN TRANSLATE ROUTE ================= */
router.post("/", async (req, res) => {
  try {
    const {
      title = "",
      description = "",
      content = "",
      pdfUrl = "",
      targetLang,
    } = req.body;

    /* ================= VALIDATION ================= */
    if (!targetLang) {
      return res.status(400).json({
        success: false,
        message:
          "Target language is required",
      });
    }

    console.log(
      "🌐 Translate request received:",
      {
        targetLang,
        hasPdf: !!pdfUrl,
        contentLength:
          content?.length || 0,
      }
    );

    let finalContent = content;

    /* ================= PDF EXTRACTION ================= */
    if (pdfUrl) {
      console.log(
        "📄 Extracting PDF:",
        pdfUrl
      );

      try {
        finalContent =
          await extractPdfText(pdfUrl);

        if (
          !finalContent ||
          finalContent.trim().length < 10
        ) {
          return res.status(500).json({
            success: false,
            message:
              "PDF extraction returned empty text",
          });
        }

        console.log(
          "📊 PDF extracted length:",
          finalContent.length
        );
      } catch (err) {
        console.error(
          "❌ PDF Extract Error:",
          err.message
        );

        return res.status(500).json({
          success: false,
          message:
            "PDF extraction failed",
        });
      }
    }

    /* ================= TRANSLATE META ================= */
    const translatedTitle =
      await translateText(
        title,
        targetLang
      );

    const translatedDescription =
      await translateText(
        description,
        targetLang
      );

    /* ================= TRANSLATE LARGE CONTENT ================= */
    let translatedContent = "";

    if (finalContent) {
      const chunks =
        splitIntoChunks(finalContent);

      for (const chunk of chunks) {
        const translatedChunk =
          await translateText(
            chunk,
            targetLang
          );

        translatedContent +=
          translatedChunk + " ";
      }
    }

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      success: true,
      translated: {
        title: translatedTitle,
        description:
          translatedDescription,
        content:
          translatedContent.trim(),
      },
    });
  } catch (error) {
    console.error(
      "Translation Route Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Translation failed",
    });
  }
});

module.exports = router;