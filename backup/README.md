# PDF Text Extraction Implementation Backup

This directory contains backup files for the PDF text extraction implementation added to the TravelBuddy application.

## Files

1. `file-upload-controller.js.bak` - Contains the implementation of PDF text extraction using the pdf-parse library.
2. `package.json.bak` - Contains the dependency on pdf-parse.

## Changes Made

1. Added the pdf-parse library to extract text from PDF files:
   ```bash
   npm install pdf-parse
   ```

2. Updated the file-upload-controller.js file to:
   - Import the pdf-parse library
   - Implement actual PDF text extraction using pdf-parse
   - Extract text from uploaded PDF files
   - Send the extracted text to the Perplexity API for processing

## How to Restore

If you need to restore these files, you can use the following commands:

```bash
# Restore file-upload-controller.js
cp backup/file-upload-controller.js.bak backend/controllers/file-upload-controller.js

# Restore package.json (if needed)
cp backup/package.json.bak backend/package.json

# Reinstall dependencies (if needed)
cd backend && npm install
```

## Implementation Details

The PDF text extraction implementation uses the pdf-parse library to extract text from PDF files. The extracted text is then sent to the Perplexity API, which processes it and returns a structured itinerary in JSON format.

The implementation handles multiple PDF files and combines their text before sending it to the API. The API response is parsed and displayed in the web interface.

## Future Improvements

1. Implement extraction for DOC/DOCX files using a library like mammoth.js
2. Fix the Google Maps API key issue to properly display locations on the map
3. Enhance the detailed view to show all activities
