export async function translateContent(
  text: string,
  targetLang: string
): Promise<string> {
  // If no text or English, return as-is
  if (!text || targetLang === "en") return text;

  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang,
        format: "text",
      }),
    });

    const data = await response.json();

    // safety fallback
    return data?.translatedText || text;
  } catch (error) {
    console.error("Translation failed:", error);

    // fallback: show original text
    return text;
  }
}