const express = require('express');
const router = express.Router();
const fileUploadController = require('../controllers/file-upload-controller');

/**
 * @route POST /api/upload/itinerary
 * @desc Upload and process itinerary files
 * @access Public
 */
router.post('/itinerary', fileUploadController.upload, fileUploadController.processFiles);

module.exports = router;
