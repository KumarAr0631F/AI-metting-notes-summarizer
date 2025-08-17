import path from "path";
import fs from "fs";   

import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
export async function createSummaryDocx(summaryText, filename = "summary.docx") {
    // Parse summary into subheadings and bullet points
    const lines = summaryText.split(/\r?\n|•|\d+\./).filter(line => line.trim() !== "");
    const children = [];
    let bullets = [];
    lines.forEach(line => {
        const trimmed = line.trim();
        if (/^\*\*.*\*\*$/.test(trimmed)) {
            // If there are pending bullets, add them as a bullet list before new heading
            if (bullets.length > 0) {
                children.push(
                    ...bullets.map(text => new Paragraph({
                        children: [new TextRun(text)],
                        bullet: { level: 0 },
                    }))
                );
                bullets = [];
            }
            // Add subheading as bold
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: trimmed.replace(/^\*\*/, '').replace(/\*\*$/, ''), bold: true })],
                    heading: HeadingLevel.HEADING_2,
                })
            );
        } else {
            // Remove leading asterisks from normal points
            const cleaned = trimmed.replace(/^\*+\s*/, '');
            bullets.push(cleaned);
        }
    });
    // Add any remaining bullets
    if (bullets.length > 0) {
        children.push(
            ...bullets.map(text => new Paragraph({
                children: [new TextRun(text)],
                bullet: { level: 0 },
            }))
        );
    }
    const doc = new Document({
        sections: [
            {
                properties: {},
                children,
            },
        ],
    });
    const buffer = await Packer.toBuffer(doc);
    const filePath = path.join("uploads", filename);
    fs.writeFileSync(filePath, buffer);
    return filePath;
}



