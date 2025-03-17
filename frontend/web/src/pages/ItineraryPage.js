import React, { useState } from 'react';
import { Container, Typography, Box, Button, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { ArrowBack, Refresh } from '@mui/icons-material';
import ItineraryDocumentDisplay from '../components/ItineraryDocumentDisplay';
import FileUploadComponent from '../components/itinerary/FileUploadComponent';
import ItineraryResetComponent from '../components/itinerary/ItineraryResetComponent';

/**
 * ItineraryPage component
 * 
 * A page that displays the itinerary document with all its features.
 * Allows users to upload itinerary documents.
 */
const ItineraryPage = () => {
  const [itineraryData, setItineraryData] = useState(null);

  // Handle processed file data
  const handleFileProcessed = (data) => {
    setItineraryData(data);
  };
  
  // Handle itinerary reset
  const handleItineraryReset = (data) => {
    setItineraryData(data);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button 
            component={Link} 
            to="/" 
            startIcon={<ArrowBack />}
            sx={{ mr: 2 }}
          >
            Back to Travel Assistant
          </Button>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>Trip Itinerary</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Refresh />}
            onClick={() => {
              // Fetch the latest itinerary data from the backend
              fetch('http://localhost:5002/api/perplexity/latest-itinerary')
                .then(response => response.json())
                .then(data => {
                  if (data.success && data.data) {
                    setItineraryData(data.data);
                  }
                })
                .catch(error => {
                  console.error('Error fetching latest itinerary:', error);
                });
            }}
          >
            Refresh Itinerary
          </Button>
        </Box>
        
        {/* File Upload Component */}
        <FileUploadComponent onFileProcessed={handleFileProcessed} />
        
        {/* Itinerary Reset Component */}
        <ItineraryResetComponent onReset={handleItineraryReset} itineraryData={itineraryData} />
        
        <Divider sx={{ my: 3 }} />
        
        {/* Itinerary Display */}
        <ItineraryDocumentDisplay itinerary={itineraryData} />
      </Box>
    </Container>
  );
};

export default ItineraryPage;
