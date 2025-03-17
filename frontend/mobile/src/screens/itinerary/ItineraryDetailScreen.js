import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  List,
  Avatar,
  IconButton,
  Menu,
  Dialog,
  Portal,
  ActivityIndicator,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import theme
import theme from '../../theme/theme';

// Import actions
import {
  fetchItineraryById,
  deleteItinerary,
} from '../../redux/slices/itinerarySlice';

const ItineraryDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);
  const [itinerary, setItinerary] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  
  // Mock data for demo
  const mockItinerary = {
    id: '1',
    title: 'Paris Vacation',
    destination: 'Paris, France',
    startDate: new Date(2025, 3, 20),
    endDate: new Date(2025, 3, 27),
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    description: 'A week-long trip to explore the beautiful city of Paris, visit iconic landmarks, and enjoy French cuisine.',
    activities: [
      {
        id: '1',
        title: 'Flight to Paris',
        type: 'flight',
        icon: 'flight',
        time: new Date(2025, 3, 20, 8, 30),
        location: 'JFK Airport',
        confirmationCode: 'ABC123',
        details: 'Air France AF123, Terminal 4, Gate B12',
      },
      {
        id: '2',
        title: 'Hotel Check-in',
        type: 'hotel',
        icon: 'hotel',
        time: new Date(2025, 3, 20, 15, 0),
        location: 'Grand Hotel Paris',
        confirmationCode: 'HT456',
        details: 'Deluxe Room, 2 nights, Breakfast included',
      },
      {
        id: '3',
        title: 'Eiffel Tower Visit',
        type: 'attraction',
        icon: 'photo-camera',
        time: new Date(2025, 3, 21, 10, 0),
        location: 'Eiffel Tower',
        details: 'Skip-the-line tickets, 2nd floor access',
      },
      {
        id: '4',
        title: 'Dinner at Le Bistro',
        type: 'restaurant',
        icon: 'restaurant',
        time: new Date(2025, 3, 21, 19, 0),
        location: 'Le Bistro',
        confirmationCode: 'RES789',
        details: 'Reservation for 2 people',
      },
      {
        id: '5',
        title: 'Louvre Museum',
        type: 'attraction',
        icon: 'museum',
        time: new Date(2025, 3, 22, 13, 0),
        location: 'Louvre Museum',
        details: 'Guided tour, 2 hours',
      },
      {
        id: '6',
        title: 'Return Flight',
        type: 'flight',
        icon: 'flight',
        time: new Date(2025, 3, 27, 16, 45),
        location: 'Charles de Gaulle Airport',
        confirmationCode: 'DEF456',
        details: 'Air France AF456, Terminal 2E, Gate 25',
      },
    ],
  };

  useEffect(() => {
    loadItinerary();
  }, [id]);

  const loadItinerary = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from the API
      // await dispatch(fetchItineraryById(id)).unwrap();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock data
      setItinerary(mockItinerary);
      setLoading(false);
    } catch (error) {
      console.error('Error loading itinerary:', error);
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my trip to ${itinerary.destination} from ${formatDate(itinerary.startDate)} to ${formatDate(itinerary.endDate)}!`,
        title: itinerary.title,
      });
    } catch (error) {
      console.error('Error sharing itinerary:', error);
    }
  };

  const handleEdit = () => {
    navigation.navigate('ItineraryCreate', { id: itinerary.id });
  };

  const handleDelete = async () => {
    try {
      setDeleteDialogVisible(false);
      setLoading(true);
      
      // In a real app, this would call the API
      // await dispatch(deleteItinerary(id)).unwrap();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
      case 'attraction':
        return 'photo-camera';
      default:
        return 'event';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!itinerary) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Itinerary not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>{itinerary.title}</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="more-vert"
              size={24}
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              handleEdit();
            }}
            title="Edit"
            leadingIcon="edit"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              handleShare();
            }}
            title="Share"
            leadingIcon="share"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              setDeleteDialogVisible(true);
            }}
            title="Delete"
            leadingIcon="delete"
          />
        </Menu>
      </View>

      <ScrollView>
        {/* Cover Image */}
        <Image source={{ uri: itinerary.image }} style={styles.coverImage} />

        {/* Destination and Dates */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.destinationContainer}>
              <Icon name="place" size={20} color={theme.colors.primary} />
              <Text style={styles.destination}>{itinerary.destination}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Icon name="date-range" size={20} color={theme.colors.primary} />
              <Text style={styles.dates}>
                {formatDateRange(itinerary.startDate, itinerary.endDate)}
              </Text>
            </View>
            {itinerary.description && (
              <Text style={styles.description}>{itinerary.description}</Text>
            )}
          </Card.Content>
        </Card>

        {/* Activities */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Itinerary</Text>
        </View>

        <Card style={styles.activitiesCard}>
          {itinerary.activities.map((activity, index) => (
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
                onPress={() => {}}
                right={() => (
                  activity.confirmationCode ? (
                    <View style={styles.confirmationCode}>
                      <Text style={styles.confirmationText}>
                        {activity.confirmationCode}
                      </Text>
                    </View>
                  ) : null
                )}
              />
              {activity.details && (
                <Text style={styles.activityDetails}>{activity.details}</Text>
              )}
              {index < itinerary.activities.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            icon="edit"
            onPress={handleEdit}
            style={styles.actionButton}
          >
            Edit Trip
          </Button>
          <Button
            mode="outlined"
            icon="share"
            onPress={handleShare}
            style={styles.actionButton}
          >
            Share
          </Button>
        </View>
      </ScrollView>

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Trip</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this trip? This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDelete} textColor={theme.colors.error}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.error,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center',
  },
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  infoCard: {
    margin: 15,
    elevation: 2,
  },
  destinationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  destination: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dates: {
    fontSize: 16,
    marginLeft: 10,
  },
  description: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 10,
  },
  sectionHeader: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  activitiesCard: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  activityDetails: {
    paddingHorizontal: 72,
    paddingBottom: 15,
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.7,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default ItineraryDetailScreen;
