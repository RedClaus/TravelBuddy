import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, List, Divider, Avatar, Badge, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

// Import theme
import theme from '../theme/theme';

// Import actions
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '../redux/slices/notificationSlice';

const NotificationsScreen = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  
  // Mock data for demo
  const [notifications, setNotifications] = useState([
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
    {
      id: '3',
      title: 'Itinerary Update',
      message: 'Your hotel reservation has been confirmed',
      time: new Date(2025, 3, 17, 10, 15),
      read: true,
    },
    {
      id: '4',
      title: 'Flight Status',
      message: 'Your flight AF1234 is on time',
      time: new Date(2025, 3, 16, 18, 45),
      read: true,
    },
  ]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setRefreshing(true);
      // In a real app, this would fetch from the API
      // await dispatch(fetchNotifications()).unwrap();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setRefreshing(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      // In a real app, this would call the API
      // await dispatch(markNotificationAsRead(id)).unwrap();
      
      // Update local state for demo
      setNotifications(
        notifications.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // In a real app, this would call the API
      // await dispatch(markAllNotificationsAsRead()).unwrap();
      
      // Update local state for demo
      setNotifications(
        notifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    
    // If it's today
    if (
      notificationDate.getDate() === now.getDate() &&
      notificationDate.getMonth() === now.getMonth() &&
      notificationDate.getFullYear() === now.getFullYear()
    ) {
      return `Today, ${formatTime(date)}`;
    }
    
    // If it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (
      notificationDate.getDate() === yesterday.getDate() &&
      notificationDate.getMonth() === yesterday.getMonth() &&
      notificationDate.getFullYear() === yesterday.getFullYear()
    ) {
      return `Yesterday, ${formatTime(date)}`;
    }
    
    // Otherwise, show the full date
    return notificationDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderNotification = ({ item }) => (
    <List.Item
      title={item.title}
      description={item.message}
      left={() => (
        <View style={styles.notificationIconContainer}>
          <Avatar.Icon
            size={40}
            icon="notifications"
            style={{
              backgroundColor: item.read
                ? theme.colors.background
                : theme.colors.primary,
            }}
          />
          {!item.read && <Badge style={styles.unreadBadge} />}
        </View>
      )}
      right={() => (
        <Text style={styles.notificationTime}>{formatDate(item.time)}</Text>
      )}
      style={
        item.read ? styles.readNotification : styles.unreadNotification
      }
      onPress={() => handleMarkAsRead(item.id)}
    />
  );

  const renderSeparator = () => <Divider />;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <Button mode="text" onPress={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={renderSeparator}
          refreshing={refreshing}
          onRefresh={loadNotifications}
          contentContainerStyle={styles.listContent}
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
  listContent: {
    flexGrow: 1,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text,
    opacity: 0.7,
  },
});

export default NotificationsScreen;
