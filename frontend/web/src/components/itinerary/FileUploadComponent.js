import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import { 
  CloudUpload, 
  InsertDriveFile, 
  PictureAsPdf, 
  Description,
  Delete
} from '@mui/icons-material';

/**
 * FileUploadComponent
 * 
 * A component that allows users to upload itinerary documents in various formats.
 */
const FileUploadComponent = ({ onFileProcessed }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles([...files, ...selectedFiles]);
    event.target.value = null; // Reset input
  };

  // Remove a file from the list
  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  // Get icon based on file type
  const getFileIcon = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(extension)) {
      return <PictureAsPdf color="error" />;
    } else if (['doc', 'docx'].includes(extension)) {
      return <Description color="primary" />;
    } else {
      return <InsertDriveFile />;
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Create a FormData object to send files to the server
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Send files to the backend API
      const response = await fetch('http://localhost:5002/api/upload/itinerary', {
        method: 'POST',
        body: formData,
      });
      
      // Parse the response
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload files');
      }
      
      // Process the itinerary data from the response
      if (result.data && onFileProcessed) {
        onFileProcessed(result.data);
      }
      
      setSuccess(result.message || `Successfully processed ${files.length} file(s)`);
      setFiles([]);
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upload Itinerary Documents
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Upload your travel itineraries, booking confirmations, or any other travel documents.
        Supported formats: PDF, DOC, DOCX, TXT.
      </Typography>
      
      {/* File Input */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUpload />}
          disabled={uploading}
        >
          Select Files
          <input
            type="file"
            hidden
            multiple
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
          />
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          disabled={files.length === 0 || uploading}
          onClick={handleUpload}
        >
          {uploading ? <CircularProgress size={24} /> : 'Upload & Process'}
        </Button>
      </Box>
      
      {/* File List */}
      {files.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Files:
          </Typography>
          <List dense>
            {files.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => handleRemoveFile(index)}
                    disabled={uploading}
                  >
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  {getFileIcon(file)}
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / 1024).toFixed(2)} KB`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      
      {/* Status Messages */}
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
    </Paper>
  );
};

export default FileUploadComponent;
