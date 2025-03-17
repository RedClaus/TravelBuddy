const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { promisify } = require('util');
const pdfParse = require('pdf-parse');
const perplexityService = require('../services/perplexity-service');
const perplexityController = require('./perplexity-controller');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// File filter to only allow certain file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Promisify readFile
const readFileAsync = promisify(fs.readFile);

/**
 * Extract text from uploaded files
 * Using pdf-parse for PDFs and direct reading for text files.
 * For DOC/DOCX files, we still use a placeholder as we would need additional libraries.
 */
const extractTextFromFile = async (filePath) => {
  try {
    const fileExtension = path.extname(filePath).toLowerCase();
    
    if (fileExtension === '.txt') {
      // For text files, read directly
      const data = await readFileAsync(filePath, 'utf8');
      return data;
    } else if (fileExtension === '.pdf') {
      // For PDF files, use pdf-parse library
      const dataBuffer = await readFileAsync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      console.log(`Successfully extracted ${pdfData.text.length} characters from PDF: ${path.basename(filePath)}`);
      return pdfData.text;
    } else if (fileExtension === '.doc' || fileExtension === '.docx') {
      // For DOC/DOCX files, we would need additional libraries like mammoth
      // This is still a placeholder
      return `Extracted text from ${path.basename(filePath)}. For DOC/DOCX files, you would need to implement mammoth.js or similar library.`;
    } else {
      return '';
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    return `Error extracting text from ${path.basename(filePath)}: ${error.message}`;
  }
};

/**
 * Process uploaded files using Perplexity API
 */
const processFiles = async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Extract text from all files
    const fileTexts = [];
    for (const file of req.files) {
      const text = await extractTextFromFile(file.path);
      fileTexts.push({
        filename: file.originalname,
        text: text
      });
    }

    // Combine all text into a single document
    const combinedText = fileTexts.map(file => `File: ${file.filename}\n\n${file.text}`).join('\n\n---\n\n');

    // Use Perplexity API to process the text and generate a structured itinerary
    const prompt = `
      I have uploaded travel documents containing itinerary information. 
      Please analyze the following text and extract a structured itinerary with:
      1. Trip dates (start and end)
      2. Destinations
      3. Key details about the trip
      4. A chronological list of activities with dates, times, locations, and details
      
      Format the response as a JSON object with the following structure:
      {
        "tripDates": {
          "start": "YYYY-MM-DD",
          "end": "YYYY-MM-DD"
        },
        "destinations": ["City, Country", "City, Country"],
        "keyDetails": "Brief description of the trip",
        "activities": [
          {
            "id": "unique-id",
            "title": "Activity name",
            "dateTime": "YYYY-MM-DDThh:mm:ss",
            "location": {
              "name": "Location name",
              "coordinates": { "lat": 0.0, "lng": 0.0 }
            },
            "type": "transportation/accommodation/activity/dining",
            "details": "Additional details",
            "completed": false
          }
        ]
      }
      
      Here's the text to analyze:
      ${combinedText}
    `;

    // Call Perplexity API to process the text
    const perplexityResponse = await perplexityService.getTravelInfo(prompt);
    
    // Extract the itinerary data from the response
    const assistantMessage = perplexityResponse.choices[0].message.content;
    console.log('Perplexity API Response:', assistantMessage);
    
    // Try to parse the JSON response
    let itineraryData;
    try {
      // Find JSON in the response (it might be wrapped in markdown code blocks)
      const jsonMatch = assistantMessage.match(/```json\n([\s\S]*?)\n```/) || 
                        assistantMessage.match(/```\n([\s\S]*?)\n```/) ||
                        [null, assistantMessage];
      
      const jsonString = jsonMatch[1];
      console.log('Extracted JSON string:', jsonString);
      itineraryData = JSON.parse(jsonString);
      console.log('Parsed itinerary data:', itineraryData);
    } catch (error) {
      console.error('Error parsing JSON from Perplexity response:', error);
      
      // Fallback to a simplified structure if parsing fails
      itineraryData = {
        tripDates: {
          start: '2025-05-01',
          end: '2025-05-10',
        },
        destinations: ['Unknown Location'],
        keyDetails: 'Trip details extracted from uploaded documents',
        activities: [],
      };
    }
    
    // Clean up uploaded files
    for (const file of req.files) {
      fs.unlinkSync(file.path);
    }
    
    // Store the latest itinerary data for the refresh button
    perplexityController.latestItineraryData = itineraryData;
    
    // Return the processed itinerary data
    return res.status(200).json({
      success: true,
      message: `Successfully processed ${req.files.length} file(s)`,
      data: itineraryData
    });
  } catch (error) {
    console.error('Error processing files:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing files',
      error: error.message
    });
  }
};

module.exports = {
  upload: upload.array('files', 10), // Allow up to 10 files
  processFiles
};
