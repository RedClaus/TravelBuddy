/**
 * Perplexity API Routes
 * 
 * This file defines the routes for the Perplexity API endpoints.
 */

const express = require('express');
const router = express.Router();
const perplexityController = require('../controllers/perplexity-controller');

/**
 * @route   POST /api/perplexity/travel-info
 * @desc    Get travel information based on a query
 * @access  Private
 */
router.post('/travel-info', perplexityController.getTravelInfo);

/**
 * @route   POST /api/perplexity/local-recommendations
 * @desc    Get local recommendations based on location and preferences
 * @access  Private
 */
router.post('/local-recommendations', perplexityController.getLocalRecommendations);

/**
 * @route   POST /api/perplexity/destination-info
 * @desc    Get information about a specific destination
 * @access  Private
 */
router.post('/destination-info', perplexityController.getDestinationInfo);

/**
 * @route   GET /api/perplexity/latest-itinerary
 * @desc    Get the latest itinerary data processed by the Perplexity API
 * @access  Public
 */
router.get('/latest-itinerary', perplexityController.getLatestItinerary);

/**
 * @route   POST /api/perplexity/item-options
 * @desc    Get options and things to do around an itinerary item
 * @access  Public
 */
router.post('/item-options', perplexityController.getItemOptions);

module.exports = router;
