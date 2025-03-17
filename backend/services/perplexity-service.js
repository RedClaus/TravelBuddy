/**
 * Perplexity API Service
 * 
 * This service provides methods to interact with the Perplexity API
 * for context-aware information retrieval.
 */

const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

// List of models to try in order of preference
// Based on Perplexity API documentation (updated March 2025)
// Note: Model names may change over time, check the latest documentation
const MODELS = [
  'sonar',
  'sonar-pro',
  'sonar-reasoning',
  'sonar-reasoning-pro',
  'sonar-deep-research',
  'r1-1776'
];

/**
 * Try to call the Perplexity API with different models until one works
 * 
 * @param {string} systemPrompt - The system prompt
 * @param {string} userPrompt - The user prompt
 * @returns {Promise<object>} - The API response
 */
async function callPerplexityAPI(systemPrompt, userPrompt) {
  if (!PERPLEXITY_API_KEY) {
    throw new Error('PERPLEXITY_API_KEY environment variable is not set');
  }

  // Verify API key format - Perplexity API keys typically start with 'pplx-'
  if (!PERPLEXITY_API_KEY.startsWith('pplx-')) {
    console.warn('Warning: API key does not start with "pplx-". This may cause authentication issues.');
    // Continue anyway as the key format might have changed
  }

  let lastError = null;

  // Try each model in sequence
  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      
      // Construct the request payload
      const requestPayload = {
        model: model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      };
      
      // Log the request (without API key)
      console.log('Request payload:', JSON.stringify(requestPayload, null, 2));
      
      // Make the API call
      const response = await axios.post(PERPLEXITY_API_URL, requestPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
        }
      });
      
      console.log(`Successfully used model: ${model}`);
      console.log('Response status:', response.status);
      
      return response.data;
    } catch (error) {
      lastError = error;
      console.error(`Error with model ${model}:`, error.message);
      
      // Log detailed error information
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
        console.error('Error response headers:', JSON.stringify(error.response.headers, null, 2));
      } else if (error.request) {
        console.error('No response received. Request details:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      
      // Continue to the next model
    }
  }
  
  // If we get here, all models failed
  throw lastError || new Error('All models failed');
}

// Create a service that uses the real Perplexity API
const perplexityService = {
  /**
   * Get travel information based on a query
   * 
   * @param {string} query - The user's travel-related query
   * @param {object} context - Additional context (location, preferences, etc.)
   * @returns {Promise<object>} - The response from Perplexity API
   */
  getTravelInfo: async (query, context = {}) => {
    try {
      // Enhance the query with context
      const enhancedQuery = _enhanceQueryWithContext(query, context);
      
      // System prompt for travel information
      const systemPrompt = "You are a helpful travel assistant providing accurate and relevant information about destinations, travel tips, and recommendations.";
      
      // Call the API
      return await callPerplexityAPI(systemPrompt, enhancedQuery);
    } catch (error) {
      console.error('Error in getTravelInfo:', error.message);
      
      // Check if the error is related to invalid models
      const isInvalidModelError = error.response?.data?.error?.type === 'invalid_model';
      
      // Return a formatted error response
      return {
        id: "error-response",
        model: "error-model",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: isInvalidModelError 
                ? `I apologize, but I'm currently unable to retrieve travel information due to API configuration issues. The Perplexity API models need to be updated in the server configuration. Please contact the administrator to update the model names in the perplexity-service.js file.`
                : `I apologize, but I'm currently unable to retrieve travel information. The service is experiencing technical difficulties. Please try again later or contact support if the issue persists. Error details: ${error.message}`
            },
            finish_reason: "stop"
          }
        ],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };
    }
  },

  /**
   * Get local recommendations based on user's location and preferences
   * 
   * @param {object} location - User's current location (lat, lng)
   * @param {object} preferences - User's preferences
   * @returns {Promise<object>} - The response from Perplexity API
   */
  getLocalRecommendations: async (location, preferences = {}) => {
    try {
      const query = `I'm currently at latitude ${location.lat}, longitude ${location.lng}.
                    Based on my preferences (${_formatPreferences(preferences)}),
                    what are some recommended places to visit, eat, or activities to do nearby?`;
      
      // System prompt for local recommendations
      const systemPrompt = "You are a helpful travel assistant providing local recommendations based on the user's location and preferences.";
      
      // Call the API
      return await callPerplexityAPI(systemPrompt, query);
    } catch (error) {
      console.error('Error in getLocalRecommendations:', error.message);
      
      // Check if the error is related to invalid models
      const isInvalidModelError = error.response?.data?.error?.type === 'invalid_model';
      
      // Return a formatted error response
      return {
        id: "error-response",
        model: "error-model",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: isInvalidModelError 
                ? `I apologize, but I'm currently unable to retrieve local recommendations due to API configuration issues. The Perplexity API models need to be updated in the server configuration. Please contact the administrator to update the model names in the perplexity-service.js file.`
                : `I apologize, but I'm currently unable to retrieve local recommendations. The service is experiencing technical difficulties. Please try again later or contact support if the issue persists. Error details: ${error.message}`
            },
            finish_reason: "stop"
          }
        ],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };
    }
  },

  /**
   * Get information about a specific destination
   * 
   * @param {string} destination - The destination name
   * @param {array} aspects - Aspects to focus on (e.g., ['weather', 'attractions', 'safety'])
   * @returns {Promise<object>} - The response from Perplexity API
   */
  getDestinationInfo: async (destination, aspects = []) => {
    try {
      let query = `Tell me about ${destination}`;
      if (aspects.length > 0) {
        query += ` focusing on the following aspects: ${aspects.join(', ')}`;
      }
      
      // System prompt for destination information
      const systemPrompt = "You are a helpful travel assistant providing detailed information about destinations.";
      
      // Call the API
      return await callPerplexityAPI(systemPrompt, query);
    } catch (error) {
      console.error('Error in getDestinationInfo:', error.message);
      
      // Check if the error is related to invalid models
      const isInvalidModelError = error.response?.data?.error?.type === 'invalid_model';
      
      // Return a formatted error response
      return {
        id: "error-response",
        model: "error-model",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: isInvalidModelError 
                ? `I apologize, but I'm currently unable to retrieve information about ${destination} due to API configuration issues. The Perplexity API models need to be updated in the server configuration. Please contact the administrator to update the model names in the perplexity-service.js file.`
                : `I apologize, but I'm currently unable to retrieve information about ${destination}. The service is experiencing technical difficulties. Please try again later or contact support if the issue persists. Error details: ${error.message}`
            },
            finish_reason: "stop"
          }
        ],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };
    }
  },

  /**
   * Get options and things to do around an itinerary item
   * 
   * @param {object} item - The itinerary item
   * @returns {Promise<object>} - The response from Perplexity API
   */
  getItemOptions: async (item) => {
    try {
      // Create a query based on the item type and location
      let query = `I'm going to be at ${item.location.name} on ${new Date(item.dateTime).toLocaleDateString()} at ${new Date(item.dateTime).toLocaleTimeString()}.`;
      
      // Add more context based on the item type
      if (item.type === 'accommodation') {
        query += ` I'll be staying at this accommodation. What are some interesting things to do, places to eat, or attractions to visit nearby? Please provide specific options and choices.`;
      } else if (item.type === 'transportation') {
        query += ` I'll be ${item.title.toLowerCase().includes('to') ? 'arriving at' : 'departing from'} this location. What are some convenient options for food, entertainment, or services nearby? Please provide specific options and choices.`;
      } else if (item.type === 'activity') {
        query += ` I'll be doing this activity. What are some complementary activities, dining options, or other experiences I could add to enhance my visit? Please provide specific options and choices.`;
      } else if (item.type === 'dining') {
        query += ` I'll be dining at this location. What are some interesting things to do before or after my meal, or other dining alternatives in the area? Please provide specific options and choices.`;
      } else {
        query += ` What are some interesting things to do, places to eat, or attractions to visit in this area? Please provide specific options and choices.`;
      }
      
      // Add item details for more context
      if (item.details) {
        query += ` Additional context about my plans: ${item.details}`;
      }
      
      // System prompt for item options
      const systemPrompt = "You are a helpful travel assistant providing specific options and recommendations for travelers. Focus on providing practical, actionable suggestions with specific names of places, activities, and experiences. Organize your response in clear categories.";
      
      // Call the API
      return await callPerplexityAPI(systemPrompt, query);
    } catch (error) {
      console.error('Error in getItemOptions:', error.message);
      
      // Check if the error is related to invalid models
      const isInvalidModelError = error.response?.data?.error?.type === 'invalid_model';
      
      // Return a formatted error response
      return {
        id: "error-response",
        model: "error-model",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: isInvalidModelError 
                ? `I apologize, but I'm currently unable to retrieve options for this itinerary item due to API configuration issues. The Perplexity API models need to be updated in the server configuration. Please contact the administrator to update the model names in the perplexity-service.js file.`
                : `I apologize, but I'm currently unable to retrieve options for this itinerary item. The service is experiencing technical difficulties. Please try again later or contact support if the issue persists. Error details: ${error.message}`
            },
            finish_reason: "stop"
          }
        ],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };
    }
  }
};

/**
 * Enhance a query with contextual information
 * 
 * @param {string} query - The original query
 * @param {object} context - Contextual information
 * @returns {string} - Enhanced query
 * @private
 */
function _enhanceQueryWithContext(query, context) {
  let enhancedQuery = query;

  if (context.location) {
    enhancedQuery += ` (I'm currently in ${context.location})`;
  }

  if (context.travelDates) {
    enhancedQuery += ` (I'll be traveling from ${context.travelDates.start} to ${context.travelDates.end})`;
  }

  if (context.preferences) {
    enhancedQuery += ` (My preferences: ${_formatPreferences(context.preferences)})`;
  }

  return enhancedQuery;
}

/**
 * Format user preferences into a readable string
 * 
 * @param {object} preferences - User preferences
 * @returns {string} - Formatted preferences
 * @private
 */
function _formatPreferences(preferences) {
  return Object.entries(preferences)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
}

module.exports = perplexityService;
