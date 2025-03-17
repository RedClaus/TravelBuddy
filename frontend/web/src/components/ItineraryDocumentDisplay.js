import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Paper, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Edit, Delete, FileCopy, SwapVert } from '@mui/icons-material';
import { DragDropContext } from 'react-beautiful-dnd';

// Import sub-components
import TripOverview from './itinerary/TripOverview';
import ChronologicalListing from './itinerary/ChronologicalListing';
import SelectedItemDetails from './itinerary/SelectedItemDetails';
import MapView from './itinerary/MapView';

// Import mock data (in a real app, this would come from props or API)
import { mockItinerary } from './itinerary/mockData';

/**
 * ItineraryDocumentDisplay component
 * 
 * A component that displays itinerary information in various formats
 * including overview, chronological listing, and map view.
 */
const ItineraryDocumentDisplay = ({ itinerary = {} }) => {
  // State for UI controls
  const [expanded, setExpanded] = useState(true);
  const [viewMode, setViewMode] = useState('detailed');
  const [selectedItem, setSelectedItem] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [mapMarkers, setMapMarkers] = useState([]);
  
  // Use mock data if no itinerary is provided
  const tripData = itinerary && Object.keys(itinerary).length > 0 ? itinerary : mockItinerary;
  
  // Handle drag and drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    // In a real app, you would update the activity order here
    console.log('Moved item from index', result.source.index, 'to index', result.destination.index);
  };
  
  // Handle item selection
  const handleItemSelect = (item) => {
    setSelectedItem(selectedItem?.id === item.id ? null : item);
  };
  
  // Handle long press / context menu
  const handleContextMenu = (event, item) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      item: item,
    });
  };
  
  // Handle context menu close
  const handleContextMenuClose = () => {
    setContextMenu(null);
  };
  
  // Handle edit action
  const handleEdit = (item) => {
    console.log('Edit item:', item);
    handleContextMenuClose();
    // In a real app, you would open an edit dialog here
  };
  
  // Handle delete action
  const handleDelete = (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      console.log('Delete item:', item);
      // In a real app, you would remove the item from the data
    }
    handleContextMenuClose();
  };
  
  // Handle duplicate action
  const handleDuplicate = (item) => {
    console.log('Duplicate item:', item);
    handleContextMenuClose();
    // In a real app, you would duplicate the item
  };
  
  // Handle move action
  const handleMove = (item) => {
    console.log('Move item:', item);
    handleContextMenuClose();
    // In a real app, you would show a dialog to select where to move the item
  };
  
  // Handle mark as complete action
  const handleMarkComplete = (item) => {
    console.log('Mark as complete:', item);
    // In a real app, you would update the item's completed status
  };
  
  // Update map markers when activities change
  useEffect(() => {
    const markers = tripData.activities.map(activity => ({
      lat: activity.location.coordinates.lat,
      lng: activity.location.coordinates.lng,
      title: activity.title,
    }));
    setMapMarkers(markers);
  }, [tripData.activities]);
  
  // Render view mode tabs
  const renderViewModeTabs = () => (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
      <Tabs
        value={viewMode}
        onChange={(e, newValue) => setViewMode(newValue)}
        aria-label="view mode tabs"
      >
        <Tab label="Compact" value="compact" />
        <Tab label="Detailed" value="detailed" />
        <Tab label="Map" value="map" />
      </Tabs>
    </Box>
  );
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Trip Overview Section */}
      <TripOverview 
        tripData={tripData} 
        expanded={expanded} 
        setExpanded={setExpanded} 
      />
      
      {/* View Mode Tabs */}
      {renderViewModeTabs()}
      
      {/* Selected Item Details */}
      {selectedItem && (
        <SelectedItemDetails 
          selectedItem={selectedItem} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMarkComplete={handleMarkComplete}
        />
      )}
      
      {/* Map View */}
      {viewMode === 'map' && <MapView markers={mapMarkers} />}
      
      {/* Chronological Listing */}
      {(viewMode === 'compact' || viewMode === 'detailed') && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <ChronologicalListing 
            activities={tripData.activities}
            viewMode={viewMode}
            selectedItem={selectedItem}
            onItemSelect={handleItemSelect}
            onContextMenu={handleContextMenu}
            isDetailed={viewMode === 'detailed'}
          />
        </DragDropContext>
      )}
      
      {/* Context Menu for Actions */}
      <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => handleEdit(contextMenu?.item)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDelete(contextMenu?.item)}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDuplicate(contextMenu?.item)}>
          <ListItemIcon>
            <FileCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMove(contextMenu?.item)}>
          <ListItemIcon>
            <SwapVert fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ItineraryDocumentDisplay;
