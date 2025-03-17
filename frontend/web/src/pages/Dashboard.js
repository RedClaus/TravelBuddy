import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import {
  Flight,
  Hotel,
  Restaurant,
  Explore,
  Today,
  TrendingUp,
  Notifications
} from '@mui/icons-material';

import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        
        // Fetch upcoming trips
        const tripsRes = await axios.get('/api/itineraries/upcoming');
        setUpcomingTrips(tripsRes.data);
        
        // Fetch upcoming activities
        const activitiesRes = await axios.get('/api/activities/upcoming');
        setUpcomingActivities(activitiesRes.data);
        
        // Fetch recent notifications
        const notificationsRes = await axios.get('/api/notifications/recent');
        setRecentNotifications(notificationsRes.data);
        
        // Fetch weather data for current location or next trip destination
        if (tripsRes.data.length > 0) {
          const nextTrip = tripsRes.data[0];
          const weatherRes = await axios.get(`/api/weather?location=${nextTrip.destination.name}`);
          setWeatherData(weatherRes.data);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // For demo purposes, set some mock data
    setUpcomingTrips([
      {
        id: '1',
        title: 'Paris Vacation',
        destination: { name: 'Paris, France' },
        startDate: new Date(2025, 3, 20),
        endDate: new Date(2025, 3, 27),
        activities: [
          { title: 'Eiffel Tower Visit', startDateTime: new Date(2025, 3, 21, 10, 0) },
          { title: 'Louvre Museum', startDateTime: new Date(2025, 3, 22, 13, 0) }
        ]
      },
      {
        id: '2',
        title: 'Tokyo Business Trip',
        destination: { name: 'Tokyo, Japan' },
        startDate: new Date(2025, 4, 15),
        endDate: new Date(2025, 4, 20),
        activities: [
          { title: 'Client Meeting', startDateTime: new Date(2025, 4, 16, 9, 0) },
          { title: 'Team Dinner', startDateTime: new Date(2025, 4, 17, 19, 0) }
        ]
      }
    ]);
    
    setUpcomingActivities([
      {
        id: '1',
        title: 'Flight to Paris',
        category: 'flight',
        startDateTime: new Date(2025, 3, 20, 8, 30),
        location: { name: 'JFK Airport' },
        confirmationNumber: 'ABC123'
      },
      {
        id: '2',
        title: 'Hotel Check-in',
        category: 'hotel',
        startDateTime: new Date(2025, 3, 20, 15, 0),
        location: { name: 'Grand Hotel Paris' },
        confirmationNumber: 'HT456'
      },
      {
        id: '3',
        title: 'Dinner Reservation',
        category: 'restaurant',
        startDateTime: new Date(2025, 3, 20, 19, 0),
        location: { name: 'Le Bistro' }
      }
    ]);
    
    setRecentNotifications([
      {
        id: '1',
        title: 'Check-in Available',
        message: 'Online check-in for your flight to Paris is now available',
        createdAt: new Date(2025, 3, 19, 8, 0),
        read: false
      },
      {
        id: '2',
        title: 'Weather Alert',
        message: 'Light rain expected in Paris during your stay',
        createdAt: new Date(2025, 3, 18, 14, 30),
        read: true
      }
    ]);
    
    setWeatherData({
      location: 'Paris, France',
      temperature: 18,
      condition: 'Partly Cloudy',
      forecast: [
        { day: 'Mon', temp: 18, condition: 'Partly Cloudy' },
        { day: 'Tue', temp: 20, condition: 'Sunny' },
        { day: 'Wed', temp: 17, condition: 'Light Rain' },
        { day: 'Thu', temp: 19, condition: 'Sunny' }
      ]
    });
    
    setLoading(false);
  }, [isAuthenticated, navigate]);

  if (authLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const getActivityIcon = (category) => {
    switch (category) {
      case 'flight':
        return <Flight />;
      case 'hotel':
        return <Hotel />;
      case 'restaurant':
        return <Restaurant />;
      default:
        return <Explore />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.firstName || 'Traveler'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your upcoming travel plans and activities.
        </Typography>
      </Box>

      {/* Weather Widget */}
      {weatherData && (
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                Weather in {weatherData.location}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h3" component="span">
                  {weatherData.temperature}°C
                </Typography>
                <Typography variant="body1" sx={{ ml: 2 }}>
                  {weatherData.condition}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {weatherData.forecast.map((day, index) => (
                  <Box key={index} sx={{ textAlign: 'center', mx: 1 }}>
                    <Typography variant="body2">{day.day}</Typography>
                    <Typography variant="h6">{day.temp}°</Typography>
                    <Typography variant="caption">{day.condition}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Grid container spacing={4}>
        {/* Upcoming Trips */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Today sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Upcoming Trips
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {upcomingTrips.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                  No upcoming trips. Start planning your next adventure!
                </Typography>
              ) : (
                upcomingTrips.map((trip) => (
                  <Box key={trip.id} sx={{ mb: 2 }}>
                    <Typography variant="h6">{trip.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {trip.destination.name}
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </Typography>
                    <Button 
                      size="small" 
                      sx={{ mt: 1 }}
                      onClick={() => navigate(`/itineraries/${trip.id}`)}
                    >
                      View Details
                    </Button>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))
              )}
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                color="primary"
                onClick={() => navigate('/itineraries/create')}
              >
                Plan New Trip
              </Button>
              <Button 
                size="small"
                onClick={() => navigate('/itineraries')}
              >
                View All Trips
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Upcoming Activities */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Upcoming Activities
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {upcomingActivities.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                  No upcoming activities scheduled.
                </Typography>
              ) : (
                upcomingActivities.map((activity) => (
                  <Box key={activity.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getActivityIcon(activity.category)}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {activity.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {formatDate(activity.startDateTime)} at {formatTime(activity.startDateTime)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.location?.name}
                    </Typography>
                    {activity.confirmationNumber && (
                      <Typography variant="caption" display="block">
                        Confirmation: {activity.confirmationNumber}
                      </Typography>
                    )}
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notifications sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Recent Notifications
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {recentNotifications.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                  No new notifications.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {recentNotifications.map((notification) => (
                    <Grid item xs={12} sm={6} md={4} key={notification.id}>
                      <Card variant="outlined" sx={{ 
                        bgcolor: notification.read ? 'background.default' : 'action.hover'
                      }}>
                        <CardContent>
                          <Typography variant="subtitle1" component="div">
                            {notification.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            {new Date(notification.createdAt).toLocaleString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                View All Notifications
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
