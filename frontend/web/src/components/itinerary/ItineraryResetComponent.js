import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Alert,
  CircularProgress,
  Divider,
  Paper
} from '@mui/material';
import { RestartAlt, Download, History, Warning } from '@mui/icons-material';

/**
 * ItineraryResetComponent
 * 
 * A component that provides functionality to reset the itinerary to start fresh.
 * Includes options for complete reset, partial reset, and saving states.
 */
const ItineraryResetComponent = ({ onReset, itineraryData }) => {
  // State for dialog and options
  const [open, setOpen] = useState(false);
  const [resetType, setResetType] = useState('complete');
  const [preserveDocuments, setPreserveDocuments] = useState(true);
  const [downloadBeforeReset, setDownloadBeforeReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // State for partial reset options
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [activityTypes, setActivityTypes] = useState({
    transportation: false,
    accommodation: false,
    activity: false,
    dining: false
  });
  
  // Open the reset dialog
  const handleOpenDialog = () => {
    setOpen(true);
    setError(null);
    setSuccess(null);
  };
  
  // Close the reset dialog
  const handleCloseDialog = () => {
    setOpen(false);
  };
  
  // Handle reset type change
  const handleResetTypeChange = (event) => {
    setResetType(event.target.value);
  };
  
  // Handle preserve documents change
  const handlePreserveDocumentsChange = (event) => {
    setPreserveDocuments(event.target.checked);
  };
  
  // Handle download before reset change
  const handleDownloadBeforeResetChange = (event) => {
    setDownloadBeforeReset(event.target.checked);
  };
  
  // Handle activity type change
  const handleActivityTypeChange = (event) => {
    setActivityTypes({
      ...activityTypes,
      [event.target.name]: event.target.checked
    });
  };
  
  // Download itinerary data as JSON
  const handleDownloadItinerary = () => {
    if (!itineraryData) return;
    
    const dataStr = JSON.stringify(itineraryData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `itinerary-backup-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Perform the reset operation
  const handleReset = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Download itinerary before reset if option is selected
      if (downloadBeforeReset && itineraryData) {
        handleDownloadItinerary();
      }
      
      // Prepare reset options
      const resetOptions = {
        resetType,
        preserveDocuments,
        partialResetOptions: resetType === 'partial' ? {
          dateRange: dateRange.start && dateRange.end ? dateRange : null,
          activityTypes: Object.entries(activityTypes)
            .filter(([_, selected]) => selected)
            .map(([type]) => type)
        } : null
      };
      
      console.log('Reset options:', resetOptions);
      
      // Call the reset API
      try {
        const response = await fetch('http://localhost:5002/api/itinerary/reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resetOptions),
        });
        
        console.log('Reset API response status:', response.status);
        
        // Log the raw response text for debugging
        const responseText = await response.text();
        console.log('Reset API response text:', responseText);
        
        // Parse the JSON response if possible
        let result;
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Error parsing JSON response:', parseError);
          throw new Error(`Invalid JSON response: ${responseText}`);
        }
        
        if (!response.ok) {
          throw new Error(result.message || `Failed to reset itinerary: ${response.status}`);
        }
        
        console.log('Reset API result:', result);
        
        setSuccess(result.message || 'Itinerary reset successfully');
        
        // Call the onReset callback to update the parent component
        if (onReset) {
          onReset(result.data);
        }
        
        // Close the dialog after a short delay
        setTimeout(() => {
          setOpen(false);
        }, 1500);
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        throw fetchError;
      }
    } catch (err) {
      console.error('Error resetting itinerary:', err);
      setError(err.message || 'Failed to reset itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Itinerary Management</Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<RestartAlt />}
          onClick={handleOpenDialog}
        >
          Reset Itinerary
        </Button>
      </Box>
      
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RestartAlt sx={{ mr: 1 }} />
            Reset Itinerary
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            This will reset your itinerary data. Please select the reset options below.
          </DialogContentText>
          
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <Warning fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Resetting your itinerary will remove the selected data. This action cannot be undone unless you download a backup.
            </Typography>
          </Alert>
          
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Reset Type</Typography>
            <RadioGroup
              value={resetType}
              onChange={handleResetTypeChange}
            >
              <FormControlLabel 
                value="complete" 
                control={<Radio />} 
                label="Complete Reset (Clear all itinerary data)" 
              />
              <FormControlLabel 
                value="partial" 
                control={<Radio />} 
                label="Partial Reset (Reset specific portions)" 
              />
            </RadioGroup>
          </FormControl>
          
          {resetType === 'partial' && (
            <Box sx={{ ml: 4, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Reset by Activity Type</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={activityTypes.transportation}
                    onChange={handleActivityTypeChange}
                    name="transportation"
                  />
                }
                label="Transportation"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={activityTypes.accommodation}
                    onChange={handleActivityTypeChange}
                    name="accommodation"
                  />
                }
                label="Accommodation"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={activityTypes.activity}
                    onChange={handleActivityTypeChange}
                    name="activity"
                  />
                }
                label="Activities"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={activityTypes.dining}
                    onChange={handleActivityTypeChange}
                    name="dining"
                  />
                }
                label="Dining"
              />
            </Box>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>Options</Typography>
          
          <FormControlLabel
            control={
              <Checkbox
                checked={preserveDocuments}
                onChange={handlePreserveDocumentsChange}
              />
            }
            label="Preserve uploaded documents"
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={downloadBeforeReset}
                onChange={handleDownloadBeforeResetChange}
              />
            }
            label="Download backup before reset"
          />
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDownloadItinerary}
            startIcon={<Download />}
            disabled={loading || !itineraryData}
            sx={{ mr: 1 }}
          >
            Download Backup
          </Button>
          <Button
            onClick={handleReset}
            variant="contained"
            color="error"
            disabled={loading || (resetType === 'partial' && !Object.values(activityTypes).some(v => v))}
            startIcon={loading ? <CircularProgress size={24} /> : <RestartAlt />}
          >
            {loading ? 'Resetting...' : 'Reset Itinerary'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ItineraryResetComponent;
