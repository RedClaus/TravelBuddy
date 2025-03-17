import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { 
  SwapVert, 
  LocationOn, 
  Event, 
  AccessTime, 
  MoreVert,
  Explore
} from '@mui/icons-material';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { formatDate, formatTime, groupActivitiesByDay, getActivityStatus } from './mockData';

/**
 * ChronologicalListing component
 * 
 * Displays activities grouped by day in chronological order.
 * Supports drag and drop reordering.
 */
const ChronologicalListing = ({ 
  activities, 
  viewMode, 
  selectedItem, 
  onItemSelect, 
  onContextMenu,
  isDetailed
}) => {
  // State for options dialog
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
  const [selectedItemForOptions, setSelectedItemForOptions] = useState(null);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionsData, setOptionsData] = useState(null);
  const [optionsError, setOptionsError] = useState(null);
  
  // Handle opening the options dialog
  const handleOpenOptionsDialog = (activity, event) => {
    event.stopPropagation();
    setSelectedItemForOptions(activity);
    setOptionsDialogOpen(true);
    setOptionsLoading(true);
    setOptionsData(null);
    setOptionsError(null);
    
    // Call the API to get options for this activity
    fetch('http://localhost:5002/api/perplexity/item-options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: activity }),
    })
      .then(response => response.json())
      .then(data => {
        setOptionsLoading(false);
        if (data.success) {
          setOptionsData(data.data);
        } else {
          setOptionsError(data.message || 'Failed to get options');
        }
      })
      .catch(error => {
        setOptionsLoading(false);
        setOptionsError(error.message || 'An error occurred');
      });
  };
  
  // Handle closing the options dialog
  const handleCloseOptionsDialog = () => {
    setOptionsDialogOpen(false);
  };
  // Group activities by day
  const groupedActivities = groupActivitiesByDay(activities);
  
  // Render activity item with appropriate styling based on status
  const renderActivityItem = (activity, index) => {
    const status = getActivityStatus(activity.dateTime);
    
    return (
      <Draggable key={activity.id} draggableId={activity.id} index={index}>
        {(provided) => (
          <ListItem
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            button
            selected={selectedItem?.id === activity.id}
            onClick={() => onItemSelect(activity)}
            onContextMenu={(e) => onContextMenu(e, activity)}
            sx={{
              opacity: status === 'past' ? 0.6 : 1,
              backgroundColor: status === 'current' ? 'rgba(144, 202, 249, 0.2)' : 'inherit',
              borderLeft: status === 'current' ? '4px solid #1976d2' : 'none',
              pl: status === 'current' ? 1 : 2,
              mb: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemIcon>
              {activity.type === 'transportation' && <SwapVert />}
              {activity.type === 'accommodation' && <LocationOn />}
              {activity.type === 'activity' && <Event />}
              {activity.type === 'dining' && <AccessTime />}
            </ListItemIcon>
            <ListItemText
              primary={activity.title}
              secondary={
                isDetailed ? (
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {formatTime(activity.dateTime)}
                    </Typography>
                    {' — '}
                    {activity.location.name}
                  </>
                ) : (
                  formatTime(activity.dateTime)
                )
              }
            />
            <Box sx={{ display: 'flex' }}>
              <IconButton 
                edge="end" 
                aria-label="options" 
                onClick={(e) => handleOpenOptionsDialog(activity, e)}
                sx={{ mr: 1 }}
                color="primary"
              >
                <Explore />
              </IconButton>
              <IconButton 
                edge="end" 
                aria-label="more" 
                onClick={(e) => {
                  e.stopPropagation();
                  onContextMenu(e, activity);
                }}
              >
                <MoreVert />
              </IconButton>
            </Box>
          </ListItem>
        )}
      </Draggable>
    );
  };
  
  return (
    <>
      {Object.keys(groupedActivities).map((date, dayIndex) => (
        <Box key={date} sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {formatDate(date)}
          </Typography>
          <Droppable droppableId={`day-${dayIndex}`}>
            {(provided) => (
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                {groupedActivities[date].map((activity, index) => (
                  renderActivityItem(activity, index)
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </Box>
      ))}
      
      {/* Options Dialog */}
      <Dialog
        open={optionsDialogOpen}
        onClose={handleCloseOptionsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedItemForOptions ? `Options around ${selectedItemForOptions.title}` : 'Options'}
        </DialogTitle>
        <DialogContent>
          {optionsLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {optionsError && (
            <Typography color="error" sx={{ my: 2 }}>
              Error: {optionsError}
            </Typography>
          )}
          
          {optionsData && !optionsLoading && !optionsError && (
            <Typography sx={{ whiteSpace: 'pre-line' }}>
              {optionsData.choices[0].message.content}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOptionsDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChronologicalListing;
