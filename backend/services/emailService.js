import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendSummaryEmail({ to, subject, text, attachmentPath }) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        attachments: attachmentPath
            ? [{ filename: attachmentPath.split("/").pop(), path: attachmentPath }]
            : [],
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return { success: true, info };
    } catch (error) {
        console.error('Email send error:', error);
        if (attachmentPath) {
            console.error('Attachment path:', attachmentPath);
            try {
                const fs = await import('fs');
                const exists = fs.existsSync(attachmentPath);
                console.error('Attachment exists:', exists);
            } catch (fsErr) {
                console.error('FS error:', fsErr);
            }
        }
        return { success: false, error: error.message };
    }
}
