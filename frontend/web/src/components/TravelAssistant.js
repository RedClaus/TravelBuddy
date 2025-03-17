import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Grid,
  Container,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Send as SendIcon, 
  LocationOn, 
  Flight, 
  Hotel, 
  Restaurant, 
  Attractions,
  CalendarMonth
} from '@mui/icons-material';
import MapComponent from './MapComponent';

const API_URL = 'http://localhost:5002/api';

/**
 * TravelAssistant component
 * 
 * This component provides an interface for users to ask travel-related questions
 * and get responses using the Perplexity API, along with a map visualization.
 */
const TravelAssistant = () => {
  const [query, setQuery] = useState('');
  const [context, setContext] = useState({
    location: '',
    travelDates: {
      start: '',
      end: '',
    },
    preferences: {},
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 40.12150192260742, lng: -100.45039367675781 });
  const [mapZoom, setMapZoom] = useState(4);
  const [mapMarkers, setMapMarkers] = useState([]);

  // Sample suggested questions
  const suggestedQuestions = [
    'What are the top attractions in Paris?',
    'Best time to visit Tokyo?',
    'How to prepare for a trip to Iceland?',
    'Budget travel tips for Southeast Asia',
    'Family-friendly activities in New York City',
  ];

  // Sample destinations with coordinates
  const destinations = {
    'Paris': { lat: 48.8566, lng: 2.3522 },
    'Tokyo': { lat: 35.6762, lng: 139.6503 },
    'New York': { lat: 40.7128, lng: -74.0060 },
    'London': { lat: 51.5074, lng: -0.1278 },
    'Rome': { lat: 41.9028, lng: 12.4964 },
    'Sydney': { lat: -33.8688, lng: 151.2093 },
    'Cairo': { lat: 30.0444, lng: 31.2357 },
    'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
    'Bangkok': { lat: 13.7563, lng: 100.5018 },
    'Cape Town': { lat: -33.9249, lng: 18.4241 },
  };

  /**
   * Extract location mentions from text
   */
  const extractLocations = (text) => {
    const foundLocations = [];
    
    // Check for mentions of known destinations
    Object.keys(destinations).forEach(destination => {
      if (text.toLowerCase().includes(destination.toLowerCase())) {
        foundLocations.push({
          name: destination,
          ...destinations[destination],
        });
      }
    });
    
    return foundLocations;
  };

  /**
   * Update map based on locations mentioned in the conversation
   */
  const updateMapFromText = (text) => {
    const locations = extractLocations(text);
    
    if (locations.length > 0) {
      // Center map on the first location
      setMapCenter({ lat: locations[0].lat, lng: locations[0].lng });
      setMapZoom(10); // Zoom in to city level
      
      // Add markers for all found locations
      setMapMarkers(locations.map(location => ({
        lat: location.lat,
        lng: location.lng,
        title: location.name,
      })));
    }
  };

  /**
   * Handle query submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Add user query to chat history
      const newMessage = {
        type: 'user',
        content: query,
        timestamp: new Date(),
      };
      
      setChatHistory((prev) => [...prev, newMessage]);
      
      // Check if query mentions any known locations
      updateMapFromText(query);
      
      // Call the API
      const response = await axios.post(`${API_URL}/perplexity/travel-info`, {
        query,
        context,
      });
      
      // Extract the response text
      const responseData = response.data.data;
      const assistantResponse = responseData.choices[0].message.content;
      
      // Add assistant response to chat history
      setChatHistory((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: assistantResponse,
          timestamp: new Date(),
        },
      ]);
      
      // Check if response mentions any known locations
      updateMapFromText(assistantResponse);
      
      setResponse(responseData);
      setQuery('');
    } catch (err) {
      console.error('Error fetching travel information:', err);
      setError(
        err.response?.data?.message ||
          'Failed to get travel information. Please try again.'
      );
      
      // Add error message to chat history
      setChatHistory((prev) => [
        ...prev,
        {
          type: 'error',
          content: 'Sorry, I encountered an error while processing your request. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle clicking a suggested question
   */
  const handleSuggestedQuestion = (question) => {
    setQuery(question);
    // Auto-submit after a short delay
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 100);
  };

  /**
   * Format the timestamp
   */
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 2 }}>
        <div>
          <Typography variant="h4" gutterBottom>
            Travel Assistant
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ask me anything about travel destinations, tips, or recommendations.
          </Typography>
        </div>
        <Button
          component={Link}
          to="/itinerary"
          variant="outlined"
          color="primary"
          startIcon={<CalendarMonth />}
        >
          View Itinerary
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Chat and Input Section */}
        <Grid item xs={12} md={7}>
          {/* Chat History */}
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 3,
              height: 400,
              overflowY: 'auto',
              bgcolor: '#f5f5f5',
            }}
          >
            {chatHistory.length === 0 ? (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'text.secondary',
                }}
              >
                <Typography variant="body1" gutterBottom>
                  No messages yet. Ask me about your travel plans!
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2, justifyContent: 'center' }}>
                  {suggestedQuestions.map((question, index) => (
                    <Chip
                      key={index}
                      label={question}
                      onClick={() => handleSuggestedQuestion(question)}
                      sx={{ my: 0.5 }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              chatHistory.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.type === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Card
                    sx={{
                      maxWidth: '80%',
                      bgcolor:
                        message.type === 'user'
                          ? 'primary.main'
                          : message.type === 'error'
                          ? 'error.light'
                          : 'white',
                      color:
                        message.type === 'user'
                          ? 'white'
                          : message.type === 'error'
                          ? 'error.contrastText'
                          : 'text.primary',
                    }}
                  >
                    <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                      <Typography variant="body1">{message.content}</Typography>
                    </CardContent>
                  </Card>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {message.type === 'user' ? 'You' : 'Assistant'} • {formatTime(message.timestamp)}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>

          {/* Query Input */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask about travel destinations, tips, or recommendations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {loading && <CircularProgress size={24} />}
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !query.trim()}
                sx={{ height: 56, minWidth: 56, width: 56, p: 0 }}
              >
                <SendIcon />
              </Button>
            </Box>
          </form>

          {/* Context Settings */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Context Settings (Optional)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <TextField
                label="Current Location"
                variant="outlined"
                size="small"
                value={context.location}
                onChange={(e) =>
                  setContext({ ...context, location: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ flexGrow: 1, minWidth: '200px' }}
              />
              <TextField
                label="Travel Start Date"
                variant="outlined"
                size="small"
                type="date"
                value={context.travelDates.start}
                onChange={(e) =>
                  setContext({
                    ...context,
                    travelDates: { ...context.travelDates, start: e.target.value },
                  })
                }
                InputLabelProps={{ shrink: true }}
                sx={{ flexGrow: 1, minWidth: '200px' }}
              />
              <TextField
                label="Travel End Date"
                variant="outlined"
                size="small"
                type="date"
                value={context.travelDates.end}
                onChange={(e) =>
                  setContext({
                    ...context,
                    travelDates: { ...context.travelDates, end: e.target.value },
                  })
                }
                InputLabelProps={{ shrink: true }}
                sx={{ flexGrow: 1, minWidth: '200px' }}
              />
            </Box>
          </Box>

          {/* Error Message */}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Grid>

        {/* Map Section */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ height: '100%', minHeight: 500 }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
              <Typography variant="h6">Destination Map</Typography>
              <Typography variant="body2" color="text.secondary">
                Locations mentioned in your conversation will appear on the map
              </Typography>
            </Box>
            <Box sx={{ height: 'calc(100% - 70px)' }}>
              <MapComponent 
                center={mapCenter}
                zoom={mapZoom}
                markers={mapMarkers}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TravelAssistant;
