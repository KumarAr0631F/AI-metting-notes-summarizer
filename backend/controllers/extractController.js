import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import fs from "fs";
import path from "path";

export async function extractTextFromFile(file) {
    if (!file || !file.path) {
        throw new Error("No file uploaded or file path missing.");
    }
    const filePath = file.path;
    const ext = path.extname(filePath).toLowerCase();
    let extractedText = "";

    // Check if file exists before reading
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    if (ext === ".pdf") {
        let dataBuffer;
        try {
            dataBuffer = fs.readFileSync(filePath);
        } catch (readErr) {
            throw new Error("PDF file cannot be read: " + readErr.message);
        }
        try {
            const data = await pdfParse(dataBuffer);
            extractedText = data.text;
        } catch (parseErr) {
            throw new Error("Failed to parse PDF: " + parseErr.message);
        }
    } else if (ext === ".docx") {
        try {
            const data = await mammoth.extractRawText({ path: filePath });
            extractedText = data.value;
        } catch (docxErr) {
            throw new Error("Failed to extract DOCX text: " + docxErr.message);
        }
    } else if (ext === ".txt") {
        try {
            extractedText = fs.readFileSync(filePath, "utf8");
        } catch (txtErr) {
            throw new Error("Failed to read TXT file: " + txtErr.message);
        }
    } else {
        throw new Error("Unsupported file type.");
    }

    return extractedText;
}
