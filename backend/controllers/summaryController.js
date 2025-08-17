
import { generateSummary } from "../services/aiService.js";

export const getSummary = async (req, res) => {
    try {
        const { text, prompt } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Text is required." });
        }
        const summary = await generateSummary(text, prompt);
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate summary." });
    }
};
