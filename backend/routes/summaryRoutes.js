import { emailSummary } from "../controllers/emailController.js";
// Email sending route
import express from "express";
import { getSummary } from "../controllers/summaryController.js";
import upload from "../services/uploadService.js";
import { extractTextFromFile } from "../controllers/extractController.js";

const router = express.Router();

// Example route for summarization
router.post("/summarize", getSummary);

// Test email route
router.get("/test-email", async (req, res) => {
	const to = req.body.to;
	const subject = req.body.subject;
	const text = req.body.text;
	const { sendSummaryEmail } = await import("../services/emailService.js");
	const result = await sendSummaryEmail({ to, subject, text });
	if (result.success) {
		res.json({ message: "Test email sent successfully!", info: result.info });
	} else {
		res.status(500).json({ error: result.error });
	}
});

router.post("/send-email", emailSummary);

// File upload route

router.post("/upload", upload.single("file"), async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: "No file uploaded." });
	}
	try {
		const extractedText = await extractTextFromFile(req.file);
		// Get prompt from frontend, fallback to default
		const { generateSummary } = await import("../services/aiService.js");
		const prompt = req.body.prompt || "Summarize the following document:";
		const summary = await generateSummary(extractedText, prompt);
		res.json({ filename: req.file.filename, summary });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
