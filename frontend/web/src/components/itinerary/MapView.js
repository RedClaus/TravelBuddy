import React from 'react';
import { Box } from '@mui/material';
import MapComponent from '../MapComponent';

/**
 * MapView component
 * 
 * Displays a map with markers for all activities in the itinerary.
 */
const MapView = ({ markers }) => {
  // Default center if no markers are provided
  const defaultCenter = { lat: 35.6762, lng: 139.6503 }; // Tokyo
  
  return (
    <Box sx={{ height: 500, width: '100%', mb: 2 }}>
      <MapComponent
        center={markers.length > 0 ? markers[0] : defaultCenter}
        zoom={10}
        markers={markers}
      />
    </Box>
  );
};

export default MapView;
