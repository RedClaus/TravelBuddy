import { configureStore } from '@reduxjs/toolkit';
import itineraryReducer from './slices/itinerarySlice';
import notificationReducer from './slices/notificationSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    itineraries: itineraryReducer,
    notifications: notificationReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
