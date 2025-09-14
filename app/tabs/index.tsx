import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, Memory, GroupedMemories, ApiMemoriesResponse } from '../../utils/api';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [groupedMemories, setGroupedMemories] = useState<GroupedMemories>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [localSearchText, setLocalSearchText] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>();
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const fetchMemories = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      const response: ApiMemoriesResponse = await apiService.getMemories(
        searchQuery || undefined,
        selectedYear,
        selectedMonth
      );

      setMemories(response.memories);
      setGroupedMemories(response.groupedMemories);
    } catch (error) {
      console.error('Error fetching memories:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load memories',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, selectedYear, selectedMonth]);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setSearchQuery(localSearchText);
    }, 500);
  }, [localSearchText]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMemories(false);
  }, [fetchMemories]);

  const toggleYear = (year: string) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: async () => {
            await logout();
            router.replace({ pathname: "/auth/login" });
          }},
      ]
    );
  };

  const clearFilters = () => {
    setLocalSearchText('');
    setSearchQuery('');
    setSelectedYear(undefined);
    setSelectedMonth(undefined);
  };

  const handleDeleteMemory = async (memory: Memory) => {
    Alert.alert(
      'Delete Memory',
      'Are you sure you want to delete this memory? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              await apiService.deleteMemory(memory._id);
              // Remove from local state or refetch
              await fetchMemories(true);
              Toast.show({
                type: 'success',
                text1: 'Memory deleted',
                text2: 'The memory has been removed successfully.',
              });
            } catch (error) {
              console.error('Error deleting memory:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete memory. Please try again.',
              });
            }
          }},
      ]
    );
  };

  const renderMemoryCard = (memory: Memory) => (
    <View key={memory._id} style={styles.memoryCard}>
      <TouchableOpacity
        style={styles.memoryCardTouchable}
        onPress={() => router.push(`/memory/${memory._id}`)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: `data:image/jpeg;base64,${memory.photo}` }}
          style={styles.memoryImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.memoryGradient}
        />
        <View style={styles.memoryDetails}>
          <Text style={styles.memoryTitle} numberOfLines={1}>{memory.title}</Text>
          <View style={styles.memoryMeta}>
            <View style={styles.memoryMetaItem}>
              <Ionicons name="location-outline" size={12} color="#e5e7eb" />
              <Text style={styles.memoryPlace} numberOfLines={1}>{memory.placeName}</Text>
            </View>
            <View style={styles.memoryMetaItem}>
              <Ionicons name="calendar-outline" size={12} color="#e5e7eb" />
              <Text style={styles.memoryDate}>{memory.dateRange}</Text>
            </View>
          </View>
          {memory.description && (
            <Text style={styles.memoryDescription} numberOfLines={2}>
              {memory.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteMemory(memory)}
        activeOpacity={0.8}
      >
        <Ionicons name="trash-outline" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Loading your memories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with user info and logout */}
      <LinearGradient
        colors={['#7c3aed', '#8b5cf6']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greetingText}>Hello, {user?.name}!</Text>
              <Text style={styles.welcomeText}>Welcome back to your journey</Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Search and Filter */}
          <View style={styles.searchFilterContainer}>
            <View style={styles.searchBar}>
              <View style={styles.searchInputWrapper}>
                <Ionicons name="search" size={20} color="#7c3aed" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search memories..."
                  placeholderTextColor="#a78bfa"
                  value={localSearchText}
                  onChangeText={setLocalSearchText}
                  autoCapitalize="none"
                />
              </View>
              {(searchQuery || selectedYear || selectedMonth) && (
                <TouchableOpacity
                  onPress={clearFilters}
                  style={styles.clearFilterButton}
                >
                  <Ionicons name="close-circle" size={20} color="#7c3aed" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Memories List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#7c3aed']}
            tintColor="#7c3aed"
          />
        }
      >
        <View style={styles.memoriesListContainer}>
          {Object.keys(groupedMemories).length === 0 ? (
            <View style={styles.noMemoriesContainer}>
              <View style={styles.noMemoriesIcon}>
                <Ionicons name="images-outline" size={64} color="#cbd5e1" />
              </View>
              <Text style={styles.noMemoriesText}>
                No memories found
              </Text>
              <Text style={styles.noMemoriesSubText}>
                {searchQuery || selectedYear ? 'Try adjusting your search or filters' : 'Start by adding your first memory!'}
              </Text>
              {!searchQuery && !selectedYear && (
                <Link href="/tabs/add" asChild>
                  <TouchableOpacity style={styles.addMemoryButton}>
                    <Ionicons name="add" size={20} color="white" />
                    <Text style={styles.addMemoryButtonText}>Add Memory</Text>
                  </TouchableOpacity>
                </Link>
              )}
            </View>
          ) : (
            Object.keys(groupedMemories)
              .sort((a, b) => parseInt(b) - parseInt(a)) // Latest years first
              .map((year) => (
                <View key={year} style={styles.yearGroup}>
                  <TouchableOpacity
                    onPress={() => toggleYear(year)}
                    style={styles.yearHeader}
                    activeOpacity={0.7}
                  >
                    <View style={styles.yearTitleContainer}>
                      <Ionicons
                        name={expandedYears.has(year) ? "folder-open" : "folder"}
                        size={24}
                        color="#7c3aed"
                      />
                      <Text style={styles.yearTitle}>
                        {year}
                      </Text>
                    </View>
                    <View style={styles.yearCountContainer}>
                      <View style={styles.yearCountBadge}>
                        <Text style={styles.yearCountText}>
                          {Object.values(groupedMemories[year]).reduce(
                            (sum, month) => sum + month.memories.length,
                            0
                          )}
                        </Text>
                      </View>
                      <Ionicons
                        name={expandedYears.has(year) ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#7c3aed"
                      />
                    </View>
                  </TouchableOpacity>

                  {expandedYears.has(year) && (
                    <View style={styles.monthList}>
                      {Object.values(groupedMemories[year])
                        .sort((a, b) => b.month - a.month) // Latest months first
                        .map((monthData) => (
                          <View key={monthData.monthName} style={styles.monthGroup}>
                            <View style={styles.monthHeader}>
                              <Ionicons
                                name="calendar"
                                size={18}
                                color="#7c3aed"
                              />
                              <Text style={styles.monthTitle}>
                                {monthData.monthName} 
                              </Text>
                              <View style={styles.monthCountBadge}>
                                <Text style={styles.monthCountText}>
                                  {monthData.memories.length}
                                </Text>
                              </View>
                            </View>
                            <ScrollView 
                              horizontal 
                              showsHorizontalScrollIndicator={false}
                              style={styles.memoriesScroll}
                              contentContainerStyle={styles.memoriesScrollContent}
                            >
                              {monthData.memories.map(renderMemoryCard)}
                            </ScrollView>
                          </View>
                        ))}
                    </View>
                  )}
                </View>
              ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf5ff',
  },
  loadingText: {
    marginTop: 16,
    color: '#7c3aed',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  container: {
    flex: 1,
    backgroundColor: '#faf5ff',
    marginBottom: 70,
  },
  headerGradient: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    backgroundColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Inter-Bold',
  },
  welcomeText: {
    color: '#ddd6fe',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchFilterContainer: {
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 6,
    color: '#4c1d95',
    fontFamily: 'Inter-Regular',
  },
  clearFilterButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  memoriesListContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  noMemoriesContainer: {
    textAlign: 'center',
    paddingVertical: 60,
    alignItems: 'center',
  },
  noMemoriesIcon: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 50,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  noMemoriesText: {
    color: '#4c1d95',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  noMemoriesSubText: {
    color: '#8b5cf6',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  addMemoryButton: {
    backgroundColor: '#7c3aed',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addMemoryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  yearGroup: {
    marginBottom: 24,
  },
  yearHeader: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yearTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yearTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4c1d95',
    marginLeft: 12,
    fontFamily: 'Inter-Bold',
  },
  yearCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yearCountBadge: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  yearCountText: {
    color: '#7c3aed',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  monthList: {
    marginLeft: 10,
  },
  monthGroup: {
    marginBottom: 24,
  },
  monthHeader: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  monthTitle: {
    color: '#4c1d95',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  monthCountBadge: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  monthCountText: {
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  memoriesScroll: {
    marginHorizontal: -20,
  },
  memoriesScrollContent: {
    paddingHorizontal: 20,
    paddingRight: 10,
  },
  memoryCard: {
    width: width * 0.7,
    height: 200,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  memoryCardTouchable: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  memoryImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  memoryGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  memoryDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  memoryTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  memoryMeta: {
    marginBottom: 8,
  },
  memoryMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memoryPlace: {
    color: '#e5e7eb',
    fontSize: 12,
    marginLeft: 6,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  memoryDate: {
    color: '#e5e7eb',
    fontSize: 12,
    marginLeft: 6,
    fontFamily: 'Inter-Regular',
  },
  memoryDescription: {
    color: '#e5e7eb',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    padding: 8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
