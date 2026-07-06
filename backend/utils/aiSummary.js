const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ================= CLEAN TEXT ================= */
const cleanText = (text) => {
  if (!text) return "";

  return text
    .replace(/\s+/g, " ")
    .replace(/\n/g, " ")
    .trim();
};

/* ================= RETRY HELPER ================= */
const delay = (ms) =>
  new Promise((res) => setTimeout(res, ms));

/* ================= MAIN SUMMARY FUNCTION ================= */
async function generateSummary(content) {
  const safeContent = cleanText(content);

  if (!safeContent || safeContent.length < 10) {
    return "Not enough content to summarize.";
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are an expert content summarizer.

Rules:
- Summarize the content into exactly 5 to 6 short bullet points only.
- Each point must be one line only.
- Keep it concise, meaningful, and easy to read.
- Do NOT exceed 6 lines.
- Do NOT repeat information.
- Focus only on the most important points.

Content:
${safeContent}
`;

    let result;

    try {
      result = await model.generateContent(prompt);
    } catch (apiError) {
      console.error(
        "⚠️ Gemini API Error:",
        apiError.message
      );

      /* Retry once after delay */
      await delay(2000);

      result = await model.generateContent(prompt);
    }

    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      throw new Error("Empty AI response");
    }

    return text;
  } catch (error) {
    console.error(
      "❌ AI Utility Error:",
      error.message
    );

    /* ================= SMART FALLBACK ================= */
    const words = safeContent.split(" ");

    const chunks = [];
    for (let i = 0; i < words.length; i += 15) {
      chunks.push(
        words.slice(i, i + 15).join(" ")
      );
    }

    /* Only return first 5 lines */
    return chunks
      .slice(0, 5)
      .map((c) => "• " + c)
      .join("\n");
  }
}

module.exports = { generateSummary };