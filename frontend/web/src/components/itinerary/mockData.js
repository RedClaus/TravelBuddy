/**
 * Mock data for the ItineraryDocumentDisplay component
 */
export const mockItinerary = {
  tripDates: {
    start: '2025-04-15',
    end: '2025-04-22',
  },
  destinations: ['Tokyo, Japan', 'Kyoto, Japan'],
  keyDetails: 'Spring trip to see cherry blossoms',
  activities: [
    {
      id: '1',
      title: 'Flight to Tokyo',
      dateTime: '2025-04-15T08:30:00',
      location: {
        name: 'Narita International Airport',
        coordinates: { lat: 35.7720, lng: 140.3929 },
      },
      type: 'transportation',
      details: 'Flight JL123, Terminal 2',
      completed: false,
    },
    {
      id: '2',
      title: 'Hotel Check-in',
      dateTime: '2025-04-15T14:00:00',
      location: {
        name: 'Park Hyatt Tokyo',
        coordinates: { lat: 35.6866, lng: 139.6909 },
      },
      type: 'accommodation',
      details: 'Reservation #12345',
      completed: false,
    },
    {
      id: '3',
      title: 'Visit Shinjuku Gyoen',
      dateTime: '2025-04-16T10:00:00',
      location: {
        name: 'Shinjuku Gyoen National Garden',
        coordinates: { lat: 35.6852, lng: 139.7100 },
      },
      type: 'activity',
      details: 'Cherry blossom viewing',
      completed: false,
    },
    {
      id: '4',
      title: 'Dinner at Ichiran',
      dateTime: '2025-04-16T19:00:00',
      location: {
        name: 'Ichiran Shibuya',
        coordinates: { lat: 35.6597, lng: 139.7019 },
      },
      type: 'dining',
      details: 'Famous ramen restaurant',
      completed: false,
    },
    {
      id: '5',
      title: 'Train to Kyoto',
      dateTime: '2025-04-18T09:00:00',
      location: {
        name: 'Tokyo Station',
        coordinates: { lat: 35.6812, lng: 139.7671 },
      },
      type: 'transportation',
      details: 'Shinkansen Nozomi, Car 5, Seats 3A-3B',
      completed: false,
    },
  ],
};

/**
 * Helper functions for date and time formatting
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Helper function to group activities by day
 */
export const groupActivitiesByDay = (activities) => {
  const grouped = {};
  
  activities.forEach(activity => {
    const date = new Date(activity.dateTime).toLocaleDateString();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(activity);
  });
  
  // Sort activities within each day
  Object.keys(grouped).forEach(date => {
    grouped[date].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  });
  
  return grouped;
};

/**
 * Helper function to determine if an activity is past, current, or upcoming
 */
export const getActivityStatus = (dateTime) => {
  const now = new Date();
  const activityDate = new Date(dateTime);
  
  if (activityDate < now) {
    return 'past';
  } else if (
    activityDate.getDate() === now.getDate() &&
    activityDate.getMonth() === now.getMonth() &&
    activityDate.getFullYear() === now.getFullYear()
  ) {
    return 'current';
  } else {
    return 'upcoming';
  }
};
