/**
 * Type definitions for pdf-parse
 * Since pdf-parse doesn't ship with TypeScript types, we create our own minimal type declarations
 */

declare module 'pdf-parse' {
  interface PDFOptions {
    // Page number to start parsing from
    pagerender?: (pageData: any) => string;
    // Maximum number of pages to parse
    max?: number;
    // Parser version
    version?: string;
  }

  interface PDFData {
    // Number of pages
    numpages: number;
    // Number of rendered pages 
    numrender: number;
    // PDF info
    info: any;
    // PDF metadata
    metadata: any;
    // PDF text content
    text: string;
    // PDF version
    version: string;
  }

  // Default export is a function that takes a buffer and options
  function PDFParse(dataBuffer: Buffer | ArrayBuffer, options?: PDFOptions): Promise<PDFData>;
  export default PDFParse;
}