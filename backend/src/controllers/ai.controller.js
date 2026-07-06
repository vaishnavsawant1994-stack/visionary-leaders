import { generateAISummary } from "../utils/aiSummary.js";

export const createSummary = async (req, res) => {
  try {
    const { content, type } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const summary = await generateAISummary(
      content,
      type
    );

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error(
      "Create Summary Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate summary",
    });
  }
};