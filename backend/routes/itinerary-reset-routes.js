/**
 * Itinerary Reset Routes
 * 
 * This file defines the routes for the itinerary reset API endpoints.
 */

const express = require('express');
const router = express.Router();
const itineraryResetController = require('../controllers/itinerary-reset-controller');

/**
 * @route   POST /api/itinerary/reset
 * @desc    Reset itinerary data
 * @access  Public
 */
router.post('/reset', itineraryResetController.resetItinerary);

/**
 * @route   GET /api/itinerary/reset-history
 * @desc    Get reset history
 * @access  Public
 */
router.get('/reset-history', itineraryResetController.getResetHistory);

/**
 * @route   POST /api/itinerary/restore
 * @desc    Restore itinerary from history
 * @access  Public
 */
router.post('/restore', itineraryResetController.restoreFromHistory);

module.exports = router;
