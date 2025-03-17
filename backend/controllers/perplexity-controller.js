/**
 * Perplexity Controller
 * 
 * This controller handles API endpoints related to the Perplexity API
 * for travel information and recommendations.
 */

const perplexityService = require('../services/perplexity-service');

// Store the latest itinerary data
exports.latestItineraryData = null;

/**
 * Get travel information from Perplexity API
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.getTravelInfo = async (req, res) => {
  try {
    const { query, context } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }
    
    const result = await perplexityService.getTravelInfo(query, context || {});
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in getTravelInfo controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get travel information'
    });
  }
};

/**
 * Get local recommendations based on location and preferences
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.getLocalRecommendations = async (req, res) => {
  try {
    const { location, preferences } = req.body;
    
    if (!location || !location.lat || !location.lng) {
      return res.status(400).json({
        success: false,
        message: 'Valid location with latitude and longitude is required'
      });
    }
    
    const result = await perplexityService.getLocalRecommendations(location, preferences || {});
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in getLocalRecommendations controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get local recommendations'
    });
  }
};

/**
 * Get information about a specific destination
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.getDestinationInfo = async (req, res) => {
  try {
    const { destination, aspects } = req.body;
    
    if (!destination) {
      return res.status(400).json({
        success: false,
        message: 'Destination is required'
      });
    }
    
    const result = await perplexityService.getDestinationInfo(destination, aspects || []);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in getDestinationInfo controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get destination information'
    });
  }
};

/**
 * Get the latest itinerary data processed by the Perplexity API
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.getLatestItinerary = async (req, res) => {
  try {
    // If we don't have any itinerary data yet, return an error
    if (!exports.latestItineraryData) {
      return res.status(404).json({
        success: false,
        message: 'No itinerary data available yet. Please upload and process an itinerary document first.'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Latest itinerary data retrieved successfully',
      data: exports.latestItineraryData
    });
  } catch (error) {
    console.error('Error in getLatestItinerary controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get latest itinerary data'
    });
  }
};

/**
 * Get options and things to do around an itinerary item
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.getItemOptions = async (req, res) => {
  try {
    const { item } = req.body;
    
    if (!item || !item.location || !item.dateTime) {
      return res.status(400).json({
        success: false,
        message: 'Valid itinerary item with location and dateTime is required'
      });
    }
    
    const result = await perplexityService.getItemOptions(item);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in getItemOptions controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get options for itinerary item'
    });
  }
};
