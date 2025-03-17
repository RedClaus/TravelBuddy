import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TextInput,
  Button,
  Card,
  Divider,
  List,
  Avatar,
  IconButton,
  ActivityIndicator,
  Dialog,
  Portal,
  Chip,
  HelperText,
  FAB,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import theme
import theme from '../../theme/theme';

// Import actions
import {
  createItinerary,
  updateItinerary,
  fetchItineraryById,
} from '../../redux/slices/itinerarySlice';

const ItineraryCreateScreen = ({ route, navigation }) => {
  const { id } = route.params || {};
  const isEditing = !!id;
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [itinerary, setItinerary] = useState({
    title: '',
    destination: '',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    description: '',
    activities: [],
  });
  
  const [errors, setErrors] = useState({});
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [activityDialogVisible, setActivityDialogVisible] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [showActivityTimePicker, setShowActivityTimePicker] = useState(false);
  
  // Mock data for editing
  const mockItinerary = {
    id: '1',
    title: 'Paris Vacation',
    destination: 'Paris, France',
    startDate: new Date(2025, 3, 20),
    endDate: new Date(2025, 3, 27),
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
    ],
  };

  useEffect(() => {
    if (isEditing) {
      loadItinerary();
    }
  }, [id]);

  const loadItinerary = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from the API
      // const data = await dispatch(fetchItineraryById(id)).unwrap();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock data
      setItinerary(mockItinerary);
      setLoading(false);
    } catch (error) {
      console.error('Error loading itinerary:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to load itinerary details');
      navigation.goBack();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!itinerary.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!itinerary.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    
    if (itinerary.endDate < itinerary.startDate) {
      newErrors.dates = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      // In a real app, this would call the API
      if (isEditing) {
        // await dispatch(updateItinerary({ id, itineraryData: itinerary })).unwrap();
      } else {
        // await dispatch(createItinerary(itinerary)).unwrap();
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaving(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving itinerary:', error);
      setSaving(false);
      Alert.alert('Error', 'Failed to save itinerary');
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setItinerary({ ...itinerary, startDate: selectedDate });
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setItinerary({ ...itinerary, endDate: selectedDate });
    }
  };

  const handleAddActivity = () => {
    setCurrentActivity({
      id: Date.now().toString(),
      title: '',
      type: 'event',
      icon: 'event',
      time: new Date(),
      location: '',
      confirmationCode: '',
      details: '',
    });
    setActivityDialogVisible(true);
  };

  const handleEditActivity = (activity) => {
    setCurrentActivity({ ...activity });
    setActivityDialogVisible(true);
  };

  const handleDeleteActivity = (activityId) => {
    const updatedActivities = itinerary.activities.filter(
      activity => activity.id !== activityId
    );
    setItinerary({ ...itinerary, activities: updatedActivities });
  };

  const handleActivityTimeChange = (event, selectedTime) => {
    setShowActivityTimePicker(false);
    if (selectedTime) {
      setCurrentActivity({ ...currentActivity, time: selectedTime });
    }
  };

  const handleActivityTypeChange = (type) => {
    let icon = 'event';
    switch (type) {
      case 'flight':
        icon = 'flight';
        break;
      case 'hotel':
        icon = 'hotel';
        break;
      case 'restaurant':
        icon = 'restaurant';
        break;
      case 'attraction':
        icon = 'photo-camera';
        break;
    }
    
    setCurrentActivity({ ...currentActivity, type, icon });
  };

  const saveActivity = () => {
    if (!currentActivity.title.trim() || !currentActivity.location.trim()) {
      Alert.alert('Error', 'Activity title and location are required');
      return;
    }
    
    const updatedActivities = [...itinerary.activities];
    const existingIndex = updatedActivities.findIndex(
      activity => activity.id === currentActivity.id
    );
    
    if (existingIndex !== -1) {
      updatedActivities[existingIndex] = currentActivity;
    } else {
      updatedActivities.push(currentActivity);
    }
    
    setItinerary({ ...itinerary, activities: updatedActivities });
    setActivityDialogVisible(false);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
        <Text style={styles.title}>
          {isEditing ? 'Edit Trip' : 'Create New Trip'}
        </Text>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
        >
          Save
        </Button>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Trip Title"
              value={itinerary.title}
              onChangeText={(text) => setItinerary({ ...itinerary, title: text })}
              style={styles.input}
              mode="outlined"
              error={!!errors.title}
            />
            {errors.title && (
              <HelperText type="error" visible={!!errors.title}>
                {errors.title}
              </HelperText>
            )}

            <TextInput
              label="Destination"
              value={itinerary.destination}
              onChangeText={(text) => setItinerary({ ...itinerary, destination: text })}
              style={styles.input}
              mode="outlined"
              error={!!errors.destination}
            />
            {errors.destination && (
              <HelperText type="error" visible={!!errors.destination}>
                {errors.destination}
              </HelperText>
            )}

            <View style={styles.dateContainer}>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateLabel}>Start Date</Text>
                <Text style={styles.dateValue}>{formatDate(itinerary.startDate)}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateLabel}>End Date</Text>
                <Text style={styles.dateValue}>{formatDate(itinerary.endDate)}</Text>
              </TouchableOpacity>
            </View>
            {errors.dates && (
              <HelperText type="error" visible={!!errors.dates}>
                {errors.dates}
              </HelperText>
            )}

            <TextInput
              label="Description (Optional)"
              value={itinerary.description}
              onChangeText={(text) => setItinerary({ ...itinerary, description: text })}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
          </Card.Content>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activities</Text>
        </View>

        <Card style={styles.card}>
          {itinerary.activities.length === 0 ? (
            <Card.Content>
              <Text style={styles.emptyText}>No activities added yet</Text>
              <Button
                mode="contained"
                onPress={handleAddActivity}
                style={styles.addButton}
              >
                Add Activity
              </Button>
            </Card.Content>
          ) : (
            <Card.Content>
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
                    right={() => (
                      <View style={styles.activityActions}>
                        <IconButton
                          icon="edit"
                          size={20}
                          onPress={() => handleEditActivity(activity)}
                        />
                        <IconButton
                          icon="delete"
                          size={20}
                          onPress={() => handleDeleteActivity(activity.id)}
                        />
                      </View>
                    )}
                  />
                  {index < itinerary.activities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Card.Content>
          )}
        </Card>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddActivity}
      />

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={itinerary.startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={itinerary.endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

      {/* Activity Dialog */}
      <Portal>
        <Dialog
          visible={activityDialogVisible}
          onDismiss={() => setActivityDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>
            {currentActivity?.id ? 'Edit Activity' : 'Add Activity'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Activity Title"
              value={currentActivity?.title || ''}
              onChangeText={(text) =>
                setCurrentActivity({ ...currentActivity, title: text })
              }
              style={styles.dialogInput}
              mode="outlined"
            />

            <View style={styles.activityTypeContainer}>
              <Text style={styles.activityTypeLabel}>Activity Type:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Chip
                  selected={currentActivity?.type === 'flight'}
                  onPress={() => handleActivityTypeChange('flight')}
                  style={styles.typeChip}
                  icon="flight"
                >
                  Flight
                </Chip>
                <Chip
                  selected={currentActivity?.type === 'hotel'}
                  onPress={() => handleActivityTypeChange('hotel')}
                  style={styles.typeChip}
                  icon="hotel"
                >
                  Hotel
                </Chip>
                <Chip
                  selected={currentActivity?.type === 'restaurant'}
                  onPress={() => handleActivityTypeChange('restaurant')}
                  style={styles.typeChip}
                  icon="restaurant"
                >
                  Restaurant
                </Chip>
                <Chip
                  selected={currentActivity?.type === 'attraction'}
                  onPress={() => handleActivityTypeChange('attraction')}
                  style={styles.typeChip}
                  icon="photo-camera"
                >
                  Attraction
                </Chip>
                <Chip
                  selected={currentActivity?.type === 'event'}
                  onPress={() => handleActivityTypeChange('event')}
                  style={styles.typeChip}
                  icon="event"
                >
                  Other
                </Chip>
              </ScrollView>
            </View>

            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => setShowActivityTimePicker(true)}
            >
              <Text style={styles.timeLabel}>Time:</Text>
              <Text style={styles.timeValue}>
                {formatTime(currentActivity?.time || new Date())}
              </Text>
            </TouchableOpacity>

            <TextInput
              label="Location"
              value={currentActivity?.location || ''}
              onChangeText={(text) =>
                setCurrentActivity({ ...currentActivity, location: text })
              }
              style={styles.dialogInput}
              mode="outlined"
            />

            <TextInput
              label="Confirmation Code (Optional)"
              value={currentActivity?.confirmationCode || ''}
              onChangeText={(text) =>
                setCurrentActivity({ ...currentActivity, confirmationCode: text })
              }
              style={styles.dialogInput}
              mode="outlined"
            />

            <TextInput
              label="Details (Optional)"
              value={currentActivity?.details || ''}
              onChangeText={(text) =>
                setCurrentActivity({ ...currentActivity, details: text })
              }
              style={styles.dialogInput}
              mode="outlined"
              multiline
              numberOfLines={2}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setActivityDialogVisible(false)}>Cancel</Button>
            <Button onPress={saveActivity}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Activity Time Picker */}
      {showActivityTimePicker && (
        <DateTimePicker
          value={currentActivity?.time || new Date()}
          mode="time"
          display="default"
          onChange={handleActivityTimeChange}
        />
      )}
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
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateInput: {
    width: '48%',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 4,
    padding: 10,
  },
  dateLabel: {
    fontSize: 12,
    color: theme.colors.primary,
  },
  dateValue: {
    fontSize: 16,
    marginTop: 5,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    color: theme.colors.text,
    opacity: 0.7,
  },
  addButton: {
    marginTop: 10,
  },
  activityActions: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  dialog: {
    maxHeight: '80%',
  },
  dialogInput: {
    marginBottom: 10,
  },
  activityTypeContainer: {
    marginBottom: 15,
  },
  activityTypeLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: theme.colors.text,
  },
  typeChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  timeLabel: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  timeValue: {
    fontSize: 16,
  },
});

export default ItineraryCreateScreen;
