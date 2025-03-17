/**
 * Itinerary Reset Controller
 * 
 * This controller handles API endpoints related to resetting itinerary data.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const perplexityController = require('./perplexity-controller');

// Promisify fs functions
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

// Store reset history
const resetHistory = [];

/**
 * Reset itinerary data
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.resetItinerary = async (req, res) => {
  try {
    const { resetType, preserveDocuments, partialResetOptions } = req.body;
    
    // Create a backup of the current itinerary data
    const currentItinerary = perplexityController.latestItineraryData;
    const backupData = {
      timestamp: new Date().toISOString(),
      itineraryData: currentItinerary,
      resetType,
      partialResetOptions
    };
    
    // Add to reset history
    resetHistory.push(backupData);
    
    // Limit history to last 10 resets
    if (resetHistory.length > 10) {
      resetHistory.shift();
    }
    
    // Handle different reset types
    if (resetType === 'complete') {
      // Complete reset - clear all itinerary data
      perplexityController.latestItineraryData = null;
      
      // Clean up uploaded files if not preserving documents
      if (!preserveDocuments) {
        await cleanUploadedFiles();
      }
      
      return res.status(200).json({
        success: true,
        message: 'Itinerary completely reset successfully',
        data: null
      });
    } else if (resetType === 'partial' && partialResetOptions) {
      // Partial reset - reset specific portions
      if (!currentItinerary) {
        return res.status(400).json({
          success: false,
          message: 'No itinerary data to reset'
        });
      }
      
      // Create a copy of the current itinerary
      const updatedItinerary = JSON.parse(JSON.stringify(currentItinerary));
      
      // Filter activities based on activity types
      if (partialResetOptions.activityTypes && partialResetOptions.activityTypes.length > 0) {
        updatedItinerary.activities = updatedItinerary.activities.filter(
          activity => !partialResetOptions.activityTypes.includes(activity.type)
        );
      }
      
      // Filter activities based on date range
      if (partialResetOptions.dateRange && partialResetOptions.dateRange.start && partialResetOptions.dateRange.end) {
        const startDate = new Date(partialResetOptions.dateRange.start);
        const endDate = new Date(partialResetOptions.dateRange.end);
        
        updatedItinerary.activities = updatedItinerary.activities.filter(activity => {
          const activityDate = new Date(activity.dateTime);
          return activityDate < startDate || activityDate > endDate;
        });
      }
      
      // Update the itinerary data
      perplexityController.latestItineraryData = updatedItinerary;
      
      return res.status(200).json({
        success: true,
        message: 'Itinerary partially reset successfully',
        data: updatedItinerary
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset options'
      });
    }
  } catch (error) {
    console.error('Error in resetItinerary controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to reset itinerary'
    });
  }
};

/**
 * Get reset history
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.getResetHistory = async (req, res) => {
  try {
    // Return only metadata, not the full itinerary data
    const historyMetadata = resetHistory.map(item => ({
      timestamp: item.timestamp,
      resetType: item.resetType,
      partialResetOptions: item.partialResetOptions
    }));
    
    return res.status(200).json({
      success: true,
      data: historyMetadata
    });
  } catch (error) {
    console.error('Error in getResetHistory controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get reset history'
    });
  }
};

/**
 * Restore itinerary from history
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.restoreFromHistory = async (req, res) => {
  try {
    const { timestamp } = req.body;
    
    // Find the backup with the specified timestamp
    const backup = resetHistory.find(item => item.timestamp === timestamp);
    
    if (!backup) {
      return res.status(404).json({
        success: false,
        message: 'Backup not found'
      });
    }
    
    // Restore the itinerary data
    perplexityController.latestItineraryData = backup.itineraryData;
    
    return res.status(200).json({
      success: true,
      message: 'Itinerary restored successfully',
      data: backup.itineraryData
    });
  } catch (error) {
    console.error('Error in restoreFromHistory controller:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to restore itinerary'
    });
  }
};

/**
 * Clean up uploaded files
 * 
 * @returns {Promise<void>}
 */
async function cleanUploadedFiles() {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    
    // Check if uploads directory exists
    try {
      await stat(uploadsDir);
    } catch (err) {
      // Directory doesn't exist, nothing to clean up
      return;
    }
    
    // Get all files in the uploads directory
    const files = await readdir(uploadsDir);
    
    // Delete each file
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const fileStat = await stat(filePath);
      
      if (fileStat.isFile()) {
        await unlink(filePath);
      }
    }
  } catch (error) {
    console.error('Error cleaning up uploaded files:', error);
    throw error;
  }
}
