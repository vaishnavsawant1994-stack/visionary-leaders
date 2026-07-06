const axios = require("axios");
const pdfParse = require("pdf-parse");

/* ================= PDF TEXT EXTRACTOR ================= */
const extractPdfText = async (pdfUrl) => {
  try {
    if (!pdfUrl) return "";

    console.log("📄 Fetching PDF:", pdfUrl);

    const response = await axios.get(pdfUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
    });

    const buffer = Buffer.from(response.data);

    const data = await pdfParse(buffer);

    let text = data?.text || "";

    if (!text || text.trim().length === 0) {
      console.log("⚠️ PDF contains no readable text");
      return "";
    }

    // ================= CLEANING (IMPORTANT FIX) =================
    text = text
      .replace(/-\n/g, "")        // fix broken words (VERY IMPORTANT)
      .replace(/\n/g, " ")        // remove line breaks
      .replace(/\s+/g, " ")       // normalize spaces
      .replace(/[^a-zA-Z0-9.,!?'"()-\s]/g, "") // remove junk characters
      .trim();

    console.log("📊 PDF extracted length:", text.length);

    return text;
  } catch (error) {
    console.error("❌ PDF Extract Error:", error.message);

    // NEVER BREAK FLOW
    return "";
  }
};

module.exports = extractPdfText;