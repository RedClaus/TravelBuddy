import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
  Divider,
  List,
  Avatar,
  Badge,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import context
import AuthContext from '../context/AuthContext';

// Import theme
import theme from '../theme/theme';

// Import actions
import { fetchItineraries } from '../redux/slices/itinerarySlice';
import { fetchNotifications } from '../redux/slices/notificationSlice';

const DashboardScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  
  const [refreshing, setRefreshing] = useState(false);
  const [weatherData, setWeatherData] = useState({
    location: 'New York',
    temperature: 22,
    condition: 'Sunny',
    icon: 'wb-sunny',
  });

  // Mock data for demo
  const upcomingTrips = [
    {
      id: '1',
      title: 'Paris Vacation',
      destination: 'Paris, France',
      startDate: new Date(2025, 3, 20),
      endDate: new Date(2025, 3, 27),
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    },
    {
      id: '2',
      title: 'Tokyo Business Trip',
      destination: 'Tokyo, Japan',
      startDate: new Date(2025, 4, 15),
      endDate: new Date(2025, 4, 20),
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
    },
  ];

  const upcomingActivities = [
    {
      id: '1',
      title: 'Flight to Paris',
      type: 'flight',
      icon: 'flight',
      time: new Date(2025, 3, 20, 8, 30),
      location: 'JFK Airport',
      confirmationCode: 'ABC123',
    },
    {
      id: '2',
      title: 'Hotel Check-in',
      type: 'hotel',
      icon: 'hotel',
      time: new Date(2025, 3, 20, 15, 0),
      location: 'Grand Hotel Paris',
      confirmationCode: 'HT456',
    },
    {
      id: '3',
      title: 'Dinner Reservation',
      type: 'restaurant',
      icon: 'restaurant',
      time: new Date(2025, 3, 20, 19, 0),
      location: 'Le Bistro',
    },
  ];

  const notifications = [
    {
      id: '1',
      title: 'Check-in Available',
      message: 'Online check-in for your flight to Paris is now available',
      time: new Date(2025, 3, 19, 8, 0),
      read: false,
    },
    {
      id: '2',
      title: 'Weather Alert',
      message: 'Light rain expected in Paris during your stay',
      time: new Date(2025, 3, 18, 14, 30),
      read: true,
    },
  ];

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setRefreshing(true);
      // In a real app, these would fetch from the API
      // await dispatch(fetchItineraries()).unwrap();
      // await dispatch(fetchNotifications()).unwrap();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadData();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateRange = (startDate, endDate) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'flight':
        return 'flight';
      case 'hotel':
        return 'hotel';
      case 'restaurant':
        return 'restaurant';
      default:
        return 'event';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.firstName || 'Traveler'}!</Text>
            <Text style={styles.subGreeting}>Ready for your next adventure?</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar.Image
              size={50}
              source={require('../assets/avatar.png')}
            />
          </TouchableOpacity>
        </View>

        {/* Weather Card */}
        <Card style={styles.weatherCard}>
          <Card.Content style={styles.weatherContent}>
            <View>
              <Text style={styles.weatherLocation}>{weatherData.location}</Text>
              <Text style={styles.weatherTemp}>{weatherData.temperature}°C</Text>
              <Text style={styles.weatherCondition}>{weatherData.condition}</Text>
            </View>
            <Icon name={weatherData.icon} size={60} color={theme.colors.primary} />
          </Card.Content>
        </Card>

        {/* Upcoming Trips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Trips</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Itineraries')}
            >
              See All
            </Button>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {upcomingTrips.map((trip) => (
              <TouchableOpacity
                key={trip.id}
                onPress={() => navigation.navigate('ItineraryDetail', { id: trip.id })}
              >
                <Card style={styles.tripCard}>
                  <Card.Cover source={{ uri: trip.image }} style={styles.tripImage} />
                  <Card.Content>
                    <Title style={styles.tripTitle}>{trip.title}</Title>
                    <Paragraph style={styles.tripDestination}>{trip.destination}</Paragraph>
                    <Paragraph style={styles.tripDates}>
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </Paragraph>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => navigation.navigate('ItineraryCreate')}>
              <Card style={[styles.tripCard, styles.newTripCard]}>
                <View style={styles.newTripContent}>
                  <Icon name="add-circle" size={50} color={theme.colors.primary} />
                  <Text style={styles.newTripText}>Plan New Trip</Text>
                </View>
              </Card>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Upcoming Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Activities</Text>
          </View>

          <Card style={styles.activitiesCard}>
            {upcomingActivities.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <List.Item
                  title={activity.title}
                  description={`${formatTime(activity.time)} • ${activity.location}`}
                  left={() => (
                    <Avatar.Icon
                      size={40}
                      icon={activity.icon}
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                  )}
                  right={() => (
                    activity.confirmationCode ? (
                      <View style={styles.confirmationCode}>
                        <Text style={styles.confirmationText}>{activity.confirmationCode}</Text>
                      </View>
                    ) : null
                  )}
                />
                {index < upcomingActivities.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Notifications')}
            >
              See All
            </Button>
          </View>

          <Card style={styles.notificationsCard}>
            {notifications.length === 0 ? (
              <Card.Content>
                <Text style={styles.emptyText}>No new notifications</Text>
              </Card.Content>
            ) : (
              notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <List.Item
                    title={notification.title}
                    description={notification.message}
                    left={() => (
                      <View style={styles.notificationIconContainer}>
                        <Avatar.Icon
                          size={40}
                          icon="notifications"
                          style={{
                            backgroundColor: notification.read
                              ? theme.colors.background
                              : theme.colors.primary,
                          }}
                        />
                        {!notification.read && (
                          <Badge style={styles.unreadBadge} />
                        )}
                      </View>
                    )}
                    right={() => (
                      <Text style={styles.notificationTime}>
                        {formatTime(notification.time)}
                      </Text>
                    )}
                    style={
                      notification.read
                        ? styles.readNotification
                        : styles.unreadNotification
                    }
                  />
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subGreeting: {
    fontSize: 16,
    color: theme.colors.text,
    opacity: 0.7,
  },
  weatherCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLocation: {
    fontSize: 16,
    color: theme.colors.text,
    opacity: 0.7,
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  weatherCondition: {
    fontSize: 16,
    color: theme.colors.text,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  tripCard: {
    width: 250,
    marginLeft: 20,
    marginBottom: 10,
  },
  tripImage: {
    height: 120,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tripDestination: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.7,
  },
  tripDates: {
    fontSize: 12,
    color: theme.colors.text,
    opacity: 0.7,
  },
  newTripCard: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  newTripContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  newTripText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  activitiesCard: {
    marginHorizontal: 20,
  },
  confirmationCode: {
    backgroundColor: theme.colors.primary + '20',
    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
  },
  confirmationText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  notificationsCard: {
    marginHorizontal: 20,
  },
  notificationIconContainer: {
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.accent,
  },
  notificationTime: {
    fontSize: 12,
    color: theme.colors.text,
    opacity: 0.7,
  },
  readNotification: {
    backgroundColor: theme.colors.background,
  },
  unreadNotification: {
    backgroundColor: theme.colors.primary + '10',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: theme.colors.text,
    opacity: 0.7,
  },
});

export default DashboardScreen;
