
import { sendSummaryEmail } from "../services/emailService.js";
import { createSummaryDocx } from "../services/docService.js";

export const emailSummary = async (req, res) => {
    const { to, subject, text, asDoc } = req.body;
    if (!to || !subject || !text) {
        return res.status(400).json({ error: "Missing required fields: to, subject, text" });
    }

    let attachmentPath = null;
    if (asDoc) {
        // Generate DOCX file from summary
        const filename = `summary_${Date.now()}.docx`;
        attachmentPath = await createSummaryDocx(text, filename);
    }

    // If asDoc is true, send only DOCX attachment, no text in body
    const emailText = asDoc ? 'Please find attached the summary document.' : text;
    const result = await sendSummaryEmail({ to, subject, text: emailText, attachmentPath });
    if (result.success) {
        res.json({ message: "Email sent successfully!", info: result.info });
    } else {
        res.status(500).json({ error: result.error });
    }
};
