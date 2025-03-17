import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Searchbar,
  Chip,
  FAB,
  ActivityIndicator,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import theme
import theme from '../../theme/theme';

// Import actions
import { fetchItineraries } from '../../redux/slices/itinerarySlice';

const ItineraryListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Mock data for demo
  const [itineraries, setItineraries] = useState([
    {
      id: '1',
      title: 'Paris Vacation',
      destination: 'Paris, France',
      startDate: new Date(2025, 3, 20),
      endDate: new Date(2025, 3, 27),
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      status: 'upcoming',
    },
    {
      id: '2',
      title: 'Tokyo Business Trip',
      destination: 'Tokyo, Japan',
      startDate: new Date(2025, 4, 15),
      endDate: new Date(2025, 4, 20),
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
      status: 'upcoming',
    },
    {
      id: '3',
      title: 'New York Weekend',
      destination: 'New York, USA',
      startDate: new Date(2024, 11, 10),
      endDate: new Date(2024, 11, 12),
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
      status: 'past',
    },
    {
      id: '4',
      title: 'Barcelona Summer',
      destination: 'Barcelona, Spain',
      startDate: new Date(2024, 7, 5),
      endDate: new Date(2024, 7, 15),
      image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4',
      status: 'past',
    },
  ]);

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    try {
      setRefreshing(true);
      // In a real app, this would fetch from the API
      // await dispatch(fetchItineraries()).unwrap();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading itineraries:', error);
      setRefreshing(false);
    }
  };

  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };

  const formatDateRange = (startDate, endDate) => {
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getFilteredItineraries = () => {
    let filtered = itineraries;
    
    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(item => item.status === selectedFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          item.destination.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const renderItineraryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ItineraryDetail', { id: item.id })}
    >
      <Card style={styles.card}>
        <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
        <Card.Content>
          <Title style={styles.cardTitle}>{item.title}</Title>
          <Paragraph style={styles.cardDestination}>{item.destination}</Paragraph>
          <Paragraph style={styles.cardDates}>
            {formatDateRange(item.startDate, item.endDate)}
          </Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
      </View>

      <Searchbar
        placeholder="Search trips"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={selectedFilter === 'all'}
            onPress={() => setSelectedFilter('all')}
            style={styles.filterChip}
            selectedColor={theme.colors.primary}
          >
            All
          </Chip>
          <Chip
            selected={selectedFilter === 'upcoming'}
            onPress={() => setSelectedFilter('upcoming')}
            style={styles.filterChip}
            selectedColor={theme.colors.primary}
          >
            Upcoming
          </Chip>
          <Chip
            selected={selectedFilter === 'past'}
            onPress={() => setSelectedFilter('past')}
            style={styles.filterChip}
            selectedColor={theme.colors.primary}
          >
            Past
          </Chip>
        </ScrollView>
      </View>

      <FlatList
        data={getFilteredItineraries()}
        renderItem={renderItineraryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={loadItineraries}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No trips found</Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('ItineraryCreate')}
              style={styles.emptyButton}
            >
              Plan a Trip
            </Button>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('ItineraryCreate')}
      />
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
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterChip: {
    marginRight: 10,
  },
  listContent: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
    elevation: 2,
  },
  cardImage: {
    height: 150,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDestination: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.7,
  },
  cardDates: {
    fontSize: 12,
    color: theme.colors.text,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text,
    opacity: 0.7,
    marginBottom: 20,
  },
  emptyButton: {
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default ItineraryListScreen;
