const translate = require("@vitalets/google-translate-api");

const translateText = async (text, targetLang) => {
  try {
    if (!text || text.trim() === "") return "";

    const result = await translate(text, {
      to: targetLang,
    });

    console.log("Translated:", result.text);

    return result.text || text;
  } catch (error) {
    console.error(
      "Translation utility error:",
      error.message
    );

    return text;
  }
};

module.exports = {
  translateText,
};