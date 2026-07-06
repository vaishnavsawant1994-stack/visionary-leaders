const express = require("express");
const router = express.Router();

const { generateSummary } = require("../utils/aiSummary");

/* ================= FIXED IMPORT ================= */
/* MUST match: module.exports = function */
const extractPdfText = require("../utils/pdfExtractor");

/* ================= SUMMARY ROUTE ================= */
router.post("/summarize", async (req, res) => {
  try {
    const { content = "", pdfUrl = "" } = req.body;

    let textToSummarize = "";

    console.log("🧠 Summary request:", {
      hasPdf: !!pdfUrl,
      contentLength: content?.length || 0,
    });

    /* ================= PDF FLOW ================= */
    if (pdfUrl && pdfUrl.trim() !== "") {
      console.log("📄 Extracting PDF...");

      try {
        const extractedText = await extractPdfText(pdfUrl);

        if (!extractedText || extractedText.trim().length < 10) {
          return res.status(400).json({
            success: false,
            message: "PDF contains no readable text",
          });
        }

        textToSummarize = extractedText;

        console.log(
          "📊 PDF Extracted Length:",
          textToSummarize.length
        );
      } catch (pdfError) {
        console.error("❌ PDF extraction failed:", pdfError.message);

        return res.status(500).json({
          success: false,
          message: "PDF extraction failed",
        });
      }
    }

    /* ================= NORMAL CONTENT ================= */
    else if (content && content.trim() !== "") {
      textToSummarize = content;
    }

    /* ================= EMPTY CHECK ================= */
    else {
      return res.status(400).json({
        success: false,
        message: "No content or PDF provided",
      });
    }

    /* ================= FINAL SAFETY CHECK ================= */
    const cleanText = textToSummarize
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText || cleanText.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Not enough text to summarize",
      });
    }

    /* ================= GENERATE SUMMARY ================= */
    const summary = await generateSummary(cleanText);

    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("❌ AI Summary Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to generate summary",
    });
  }
});

module.exports = router;