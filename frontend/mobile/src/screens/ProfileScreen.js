import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Divider,
  List,
  Switch,
  TextInput,
  Title,
  Paragraph,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';

// Import context
import AuthContext from '../context/AuthContext';

// Import theme
import theme from '../theme/theme';

// Import actions
import {
  updateUserProfile,
  updateUserPreferences,
} from '../redux/slices/userSlice';

const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const dispatch = useDispatch();
  
  // Mock user data for demo
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    profilePicture: null,
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      currency: 'USD',
      language: 'English',
      travelPreferences: {
        preferredAirlines: ['Delta', 'United'],
        preferredHotels: ['Marriott', 'Hilton'],
        seatPreference: 'Window',
        dietaryRestrictions: ['Vegetarian'],
      },
    },
  });

  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({ ...userData });

  const handleEdit = () => {
    setEditMode(true);
    setEditedData({ ...userData });
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      // In a real app, this would call the API
      // await dispatch(updateUserProfile(editedData)).unwrap();
      
      // Update local state for demo
      setUserData(editedData);
      setEditMode(false);
      
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => logout(),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleToggleNotification = (type) => {
    const updatedPreferences = {
      ...editedData.preferences,
      notifications: {
        ...editedData.preferences.notifications,
        [type]: !editedData.preferences.notifications[type],
      },
    };
    
    setEditedData({
      ...editedData,
      preferences: updatedPreferences,
    });
    
    if (!editMode) {
      // In a real app, this would call the API
      // dispatch(updateUserPreferences(updatedPreferences));
      
      // Update local state for demo
      setUserData({
        ...userData,
        preferences: updatedPreferences,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          {!editMode ? (
            <Button mode="text" onPress={handleEdit}>
              Edit
            </Button>
          ) : (
            <View style={styles.editButtons}>
              <Button mode="text" onPress={handleCancel} style={styles.cancelButton}>
                Cancel
              </Button>
              <Button mode="contained" onPress={handleSave}>
                Save
              </Button>
            </View>
          )}
        </View>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar.Image
              size={80}
              source={require('../assets/avatar.png')}
            />
            <View style={styles.profileInfo}>
              {editMode ? (
                <View style={styles.nameInputs}>
                  <TextInput
                    label="First Name"
                    value={editedData.firstName}
                    onChangeText={(text) =>
                      setEditedData({ ...editedData, firstName: text })
                    }
                    style={styles.nameInput}
                    mode="outlined"
                    dense
                  />
                  <TextInput
                    label="Last Name"
                    value={editedData.lastName}
                    onChangeText={(text) =>
                      setEditedData({ ...editedData, lastName: text })
                    }
                    style={styles.nameInput}
                    mode="outlined"
                    dense
                  />
                </View>
              ) : (
                <Text style={styles.name}>
                  {userData.firstName} {userData.lastName}
                </Text>
              )}
              <Text style={styles.email}>{userData.email}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            {editMode ? (
              <View>
                <TextInput
                  label="Email"
                  value={editedData.email}
                  onChangeText={(text) =>
                    setEditedData({ ...editedData, email: text })
                  }
                  style={styles.input}
                  mode="outlined"
                  keyboardType="email-address"
                  disabled
                />
                <TextInput
                  label="Phone"
                  value={editedData.phone}
                  onChangeText={(text) =>
                    setEditedData({ ...editedData, phone: text })
                  }
                  style={styles.input}
                  mode="outlined"
                  keyboardType="phone-pad"
                />
              </View>
            ) : (
              <View>
                <View style={styles.infoRow}>
                  <Icon name="email" size={20} color={theme.colors.primary} />
                  <Text style={styles.infoText}>{userData.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Icon name="phone" size={20} color={theme.colors.primary} />
                  <Text style={styles.infoText}>{userData.phone}</Text>
                </View>
              </View>
            )}
          </View>

          <Divider style={styles.divider} />

          {/* Notification Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Preferences</Text>
            <List.Item
              title="Email Notifications"
              right={() => (
                <Switch
                  value={
                    editMode
                      ? editedData.preferences.notifications.email
                      : userData.preferences.notifications.email
                  }
                  onValueChange={() => handleToggleNotification('email')}
                  color={theme.colors.primary}
                />
              )}
            />
            <List.Item
              title="Push Notifications"
              right={() => (
                <Switch
                  value={
                    editMode
                      ? editedData.preferences.notifications.push
                      : userData.preferences.notifications.push
                  }
                  onValueChange={() => handleToggleNotification('push')}
                  color={theme.colors.primary}
                />
              )}
            />
            <List.Item
              title="SMS Notifications"
              right={() => (
                <Switch
                  value={
                    editMode
                      ? editedData.preferences.notifications.sms
                      : userData.preferences.notifications.sms
                  }
                  onValueChange={() => handleToggleNotification('sms')}
                  color={theme.colors.primary}
                />
              )}
            />
          </View>

          <Divider style={styles.divider} />

          {/* Travel Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Travel Preferences</Text>
            <List.Item
              title="Preferred Airlines"
              description={userData.preferences.travelPreferences.preferredAirlines.join(', ')}
            />
            <List.Item
              title="Preferred Hotels"
              description={userData.preferences.travelPreferences.preferredHotels.join(', ')}
            />
            <List.Item
              title="Seat Preference"
              description={userData.preferences.travelPreferences.seatPreference}
            />
            <List.Item
              title="Dietary Restrictions"
              description={userData.preferences.travelPreferences.dietaryRestrictions.join(', ')}
            />
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          color={theme.colors.error}
        >
          Logout
        </Button>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  editButtons: {
    flexDirection: 'row',
  },
  cancelButton: {
    marginRight: 10,
  },
  profileCard: {
    margin: 20,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  email: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.7,
  },
  nameInputs: {
    flexDirection: 'column',
  },
  nameInput: {
    marginBottom: 10,
  },
  divider: {
    marginHorizontal: 20,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.text,
  },
  input: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: theme.colors.text,
  },
  logoutButton: {
    margin: 20,
    borderColor: theme.colors.error,
  },
});

export default ProfileScreen;
