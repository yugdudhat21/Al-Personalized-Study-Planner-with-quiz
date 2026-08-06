import { NextResponse } from 'next/server';
import path from 'path';
import { pathToFileURL } from 'url';

// Provide polyfill for DOMMatrix requirement in Node environment for PDF.js
if (typeof globalThis.DOMMatrix === 'undefined') {
  class DOMMatrixMock {
    constructor() {
      this.a = 1;
      this.b = 0;
      this.c = 0;
      this.d = 1;
      this.e = 0;
      this.f = 0;
    }
  }
  globalThis.DOMMatrix = DOMMatrixMock;
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No PDF file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let extractedText = '';
    let numPages = 1;

    try {
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

      // Point workerSrc to local worker file via file:// URL to prevent worker resolution failure
      const workerPath = path.join(
        process.cwd(),
        'node_modules',
        'pdfjs-dist',
        'legacy',
        'build',
        'pdf.worker.mjs'
      );
      pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;

      const uint8Array = new Uint8Array(buffer);
      const loadingTask = pdfjs.getDocument({
        data: uint8Array,
        useSystemFonts: true,
        disableFontFace: true,
        isEvalSupported: false,
        ignoreErrors: true,
      });

      const pdfDoc = await loadingTask.promise;
      numPages = pdfDoc.numPages || 1;

      let pageTexts = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();

        let lastY = null;
        let pageText = '';

        for (const item of textContent.items) {
          if (!item.str) continue;

          const currentY = item.transform ? item.transform[5] : null;

          // Detect line break when Y-coordinate changes by more than 3 units
          if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 3) {
            pageText += '\n';
          } else if (
            pageText.length > 0 &&
            !pageText.endsWith(' ') &&
            !pageText.endsWith('\n') &&
            !item.str.startsWith(' ')
          ) {
            pageText += ' ';
          }

          pageText += item.str;

          if (item.hasEOL) {
            pageText += '\n';
          }

          lastY = currentY;
        }

        if (pageText.trim()) {
          pageTexts.push(pageText.trim());
        }
      }

      extractedText = pageTexts.join('\n\n');
    } catch (pdfErr) {
      console.error('PDF Parsing Error:', pdfErr);
      return NextResponse.json(
        { error: `PDF text extraction error: ${pdfErr.message || 'Failed to read PDF'}` },
        { status: 500 }
      );
    }

    // Clean up non-printable control characters, but PRESERVE line breaks (\n)
    const cleanedText = extractedText
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!cleanedText) {
      return NextResponse.json(
        { error: 'Could not extract readable text from PDF. The PDF may be a scanned image or empty.' },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      text: cleanedText,
      pages: numPages,
    });
  } catch (error) {
    console.error('PDF Parse Route Exception:', error);
    return NextResponse.json({ error: error.message || 'Failed to process PDF' }, { status: 500 });
  }
}
