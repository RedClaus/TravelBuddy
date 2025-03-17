import React from 'react';
import { 
  Box, 
  Typography, 
  Collapse, 
  Card, 
  CardContent, 
  Grid, 
  Chip 
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { formatDate } from './mockData';

/**
 * TripOverview component
 * 
 * Displays an overview of the trip including dates, destinations, and key details.
 * Can be expanded or collapsed.
 */
const TripOverview = ({ tripData, expanded, setExpanded }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography variant="h6">Trip Overview</Typography>
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </Box>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Card variant="outlined" sx={{ mt: 1 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Dates
                </Typography>
                <Typography variant="body1">
                  {formatDate(tripData.tripDates.start)} - {formatDate(tripData.tripDates.end)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Destinations
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {tripData.destinations.map((destination, index) => (
                    <Chip key={index} label={destination} size="small" />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Key Details
                </Typography>
                <Typography variant="body1">
                  {tripData.keyDetails}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Collapse>
    </Box>
  );
};

export default TripOverview;
