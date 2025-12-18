import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

export const extractTextFromPDF = async (filepath) => {
    try {
        const dateBuffer = await fs.readFile(filepath);
        // pdf-parse expects a Unit8Array, not Buffer
        const parser = new PDFParse(new Uint8Array(dateBuffer));
        const data = await parser.getText();

        return {
            text: data.text,
            numPages: data.numPages,
            info: data.info,
        }
    } catch (error) {
        console.error("PDF parsing error:", error);
        throw new Error("Failed to extract text from PDF");
    }
}