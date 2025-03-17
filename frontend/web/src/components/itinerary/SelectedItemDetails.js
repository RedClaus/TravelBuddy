import React from 'react';
import { 
  Paper, 
  Typography, 
  Divider, 
  Grid, 
  Box, 
  Button 
} from '@mui/material';
import { Edit, Delete, Check } from '@mui/icons-material';
import { formatDate, formatTime } from './mockData';

/**
 * SelectedItemDetails component
 * 
 * Displays detailed information about a selected itinerary item.
 * Includes edit, delete, and mark complete actions.
 */
const SelectedItemDetails = ({ 
  selectedItem, 
  onEdit, 
  onDelete, 
  onMarkComplete 
}) => {
  if (!selectedItem) return null;
  
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">{selectedItem.title}</Typography>
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Date & Time
          </Typography>
          <Typography variant="body1">
            {formatDate(selectedItem.dateTime)} at {formatTime(selectedItem.dateTime)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Location
          </Typography>
          <Typography variant="body1">
            {selectedItem.location.name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Details
          </Typography>
          <Typography variant="body1">
            {selectedItem.details}
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button
          startIcon={<Edit />}
          variant="outlined"
          size="small"
          onClick={() => onEdit(selectedItem)}
        >
          Edit
        </Button>
        <Button
          startIcon={<Delete />}
          variant="outlined"
          size="small"
          color="error"
          onClick={() => onDelete(selectedItem)}
        >
          Delete
        </Button>
        <Button
          startIcon={<Check />}
          variant="outlined"
          size="small"
          color="success"
          onClick={() => onMarkComplete(selectedItem)}
        >
          Mark Complete
        </Button>
      </Box>
    </Paper>
  );
};

export default SelectedItemDetails;
