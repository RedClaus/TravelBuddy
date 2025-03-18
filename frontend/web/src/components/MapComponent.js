import React, { useEffect, useRef, useState } from 'react';

/**
 * MapComponent
 * 
 * A React component that wraps the Google Maps JavaScript API
 * using the new Maps JavaScript API v3 beta features.
 * Falls back to a placeholder when API key is not available.
 */
const MapComponent = ({ 
  center = { lat: 40.12150192260742, lng: -100.45039367675781 }, 
  zoom = 4,
  markers = [],
  mapId = "DEMO_MAP_ID",
  apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "Your_API_Key"
}) => {
  const mapRef = useRef(null);
  const scriptRef = useRef(null);
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log("Map API Key:", apiKey);
    
    // Only try to load Google Maps if we have an API key
    if (apiKey && apiKey !== "YOUR_API_KEY_HERE") {
      try {
        // Load the Google Maps script if it hasn't been loaded yet
        if (!window.google || !window.google.maps) {
          scriptRef.current = document.createElement('script');
          scriptRef.current.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=console.debug&libraries=maps,marker&v=beta`;
          scriptRef.current.async = true;
          scriptRef.current.onerror = (error) => {
            console.error('Failed to load Google Maps API:', error);
            setMapError(true);
            setIsLoading(false);
          };
          document.head.appendChild(scriptRef.current);
          
          // Wait for the script to load
          scriptRef.current.onload = () => {
            console.log("Google Maps script loaded successfully");
            setTimeout(() => {
              initializeMap();
              setIsLoading(false);
            }, 500); // Add a small delay to ensure the API is fully initialized
          };
        } else {
          // If the script is already loaded, initialize the map directly
          console.log("Google Maps already loaded, initializing map");
          initializeMap();
          setIsLoading(false);
        }
        
        return () => {
          // Clean up the script tag if component unmounts
          if (scriptRef.current && scriptRef.current.parentNode) {
            document.head.removeChild(scriptRef.current);
          }
        };
      } catch (error) {
        console.error("Error setting up Google Maps:", error);
        setMapError(true);
        setIsLoading(false);
      }
    } else {
      // No API key, show placeholder
      console.error("No Google Maps API key provided");
      setMapError(true);
      setIsLoading(false);
    }
  }, [apiKey]);
  
  // Update map when center or zoom changes
  useEffect(() => {
    if (!mapError && window.google && window.google.maps && mapRef.current) {
      updateMap();
    }
  }, [center, zoom, markers, mapError]);
  
  const initializeMap = () => {
    // Wait for the Google Maps API to be fully loaded
    if (!window.google || !window.google.maps) {
      setTimeout(initializeMap, 100);
      return;
    }
    
    try {
      // Create the map element
      const mapElement = document.createElement('gmp-map');
      mapElement.setAttribute('center', `${center.lat},${center.lng}`);
      mapElement.setAttribute('zoom', zoom.toString());
      mapElement.setAttribute('map-id', mapId);
      
      // Clear any existing content
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
        mapRef.current.appendChild(mapElement);
        
        // Add markers
        addMarkers(mapElement);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
    }
  };
  
  const updateMap = () => {
    if (!mapRef.current) return;
    
    try {
      const mapElement = mapRef.current.querySelector('gmp-map');
      if (mapElement) {
        mapElement.setAttribute('center', `${center.lat},${center.lng}`);
        mapElement.setAttribute('zoom', zoom.toString());
        
        // Clear existing markers
        const existingMarkers = mapElement.querySelectorAll('gmp-advanced-marker');
        existingMarkers.forEach(marker => marker.remove());
        
        // Add updated markers
        addMarkers(mapElement);
      }
    } catch (error) {
      console.error('Error updating map:', error);
      setMapError(true);
    }
  };
  
  const addMarkers = (mapElement) => {
    try {
      // Add the default marker if no markers are provided
      if (markers.length === 0) {
        const defaultMarker = document.createElement('gmp-advanced-marker');
        defaultMarker.setAttribute('position', `${center.lat},${center.lng}`);
        defaultMarker.setAttribute('title', 'My location');
        mapElement.appendChild(defaultMarker);
      } else {
        // Add all provided markers
        markers.forEach(marker => {
          const markerElement = document.createElement('gmp-advanced-marker');
          markerElement.setAttribute('position', `${marker.lat},${marker.lng}`);
          markerElement.setAttribute('title', marker.title || '');
          
          if (marker.content) {
            markerElement.innerHTML = marker.content;
          }
          
          mapElement.appendChild(markerElement);
        });
      }
    } catch (error) {
      console.error('Error adding markers:', error);
    }
  };
  
  // Render placeholder when there's an error or no API key
  if (mapError) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: '100%', 
          minHeight: '400px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8f8f8',
          padding: '20px',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Map Unavailable</div>
        <div style={{ color: '#666', fontSize: '14px' }}>
          There was an issue loading the Google Maps API.
          <br />
          API Key: {apiKey ? `${apiKey.substring(0, 6)}...` : 'Not provided'}
          <br />
          Locations will still be tracked in your itinerary.
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: '100%', 
          minHeight: '400px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#666'
        }}
      >
        Loading map...
      </div>
    );
  }
  
  // Normal map container
  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '400px',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}
    />
  );
};

export default MapComponent;
