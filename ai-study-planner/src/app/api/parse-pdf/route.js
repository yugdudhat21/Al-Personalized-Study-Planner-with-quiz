import { NextResponse } from 'next/server';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No PDF file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Provide polyfill for PDF.js DOMMatrix requirement in Node environment
    if (typeof globalThis.DOMMatrix === 'undefined') {
      class DOMMatrixMock {
        constructor() {
          this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
        }
      }
      globalThis.DOMMatrix = DOMMatrixMock;
    }

    let extractedText = '';
    let numPages = 1;

    const pdfParseModule = require('pdf-parse');

    // Handle both pdf-parse v2 (PDFParse class) and v1 (function)
    if (pdfParseModule.PDFParse) {
      const parser = new pdfParseModule.PDFParse({ data: buffer });
      await parser.load();
      const result = await parser.getText();
      extractedText = result.text || '';
      numPages = parser.doc?.numPages || result.pages || 1;
    } else if (typeof pdfParseModule === 'function') {
      const pdfData = await pdfParseModule(buffer);
      extractedText = pdfData.text || '';
      numPages = pdfData.numpages || 1;
    } else if (pdfParseModule.default && typeof pdfParseModule.default === 'function') {
      const pdfData = await pdfParseModule.default(buffer);
      extractedText = pdfData.text || '';
      numPages = pdfData.numpages || 1;
    }

    // Clean up excessive whitespace and non-printable characters
    const cleanedText = extractedText
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    return NextResponse.json({
      success: true,
      text: cleanedText,
      pages: numPages,
    });
  } catch (error) {
    console.error('PDF Parse Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to extract text from PDF' }, { status: 500 });
  }
}
