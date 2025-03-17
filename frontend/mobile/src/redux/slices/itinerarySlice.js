import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchItineraries = createAsyncThunk(
  'itineraries/fetchItineraries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/itineraries');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchItineraryById = createAsyncThunk(
  'itineraries/fetchItineraryById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/itineraries/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createItinerary = createAsyncThunk(
  'itineraries/createItinerary',
  async (itineraryData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/itineraries', itineraryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateItinerary = createAsyncThunk(
  'itineraries/updateItinerary',
  async ({ id, itineraryData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/itineraries/${id}`, itineraryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteItinerary = createAsyncThunk(
  'itineraries/deleteItinerary',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/itineraries/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  itineraries: [],
  currentItinerary: null,
  loading: false,
  error: null,
};

// Slice
const itinerarySlice = createSlice({
  name: 'itineraries',
  initialState,
  reducers: {
    clearCurrentItinerary: (state) => {
      state.currentItinerary = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all itineraries
      .addCase(fetchItineraries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItineraries.fulfilled, (state, action) => {
        state.loading = false;
        state.itineraries = action.payload;
      })
      .addCase(fetchItineraries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch itineraries';
      })
      
      // Fetch itinerary by ID
      .addCase(fetchItineraryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItineraryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItinerary = action.payload;
      })
      .addCase(fetchItineraryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch itinerary';
      })
      
      // Create itinerary
      .addCase(createItinerary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItinerary.fulfilled, (state, action) => {
        state.loading = false;
        state.itineraries.push(action.payload);
        state.currentItinerary = action.payload;
      })
      .addCase(createItinerary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create itinerary';
      })
      
      // Update itinerary
      .addCase(updateItinerary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItinerary.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.itineraries.findIndex(
          (itinerary) => itinerary.id === action.payload.id
        );
        if (index !== -1) {
          state.itineraries[index] = action.payload;
        }
        state.currentItinerary = action.payload;
      })
      .addCase(updateItinerary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update itinerary';
      })
      
      // Delete itinerary
      .addCase(deleteItinerary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItinerary.fulfilled, (state, action) => {
        state.loading = false;
        state.itineraries = state.itineraries.filter(
          (itinerary) => itinerary.id !== action.payload
        );
        if (state.currentItinerary?.id === action.payload) {
          state.currentItinerary = null;
        }
      })
      .addCase(deleteItinerary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete itinerary';
      });
  },
});

export const { clearCurrentItinerary, clearError } = itinerarySlice.actions;

export default itinerarySlice.reducer;
