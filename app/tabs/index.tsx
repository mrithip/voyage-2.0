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
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, Memory, GroupedMemories, ApiMemoriesResponse } from '../../utils/api';

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
      Alert.alert('Error', 'Failed to load memories');
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

  const renderMemoryCard = (memory: Memory) => (
    <TouchableOpacity
      key={memory._id}
      style={styles.memoryCard}
      onPress={() => {/* Navigate to memory details later */}}
    >
      <View style={styles.memoryCardContent}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${memory.photo}` }}
          style={styles.memoryImage}
          resizeMode="cover"
        />
        <View style={styles.memoryDetails}>
          <Text style={styles.memoryTitle}>{memory.title}</Text>
          <Text style={styles.memoryPlace}>{memory.placeName}</Text>
          <Text style={styles.memoryDate}>{memory.dateRange}</Text>
          {memory.description && (
            <Text style={styles.memoryDescription} numberOfLines={2}>
              {memory.description}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Loading memories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with user info and logout */}
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
            <Ionicons name="log-out-outline" size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchBar}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search" size={18} color="#64748b" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search memories..."
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
                <Ionicons name="close" size={18} color="#374151" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Memories List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.memoriesListContainer}>
          {Object.keys(groupedMemories).length === 0 ? (
            <View style={styles.noMemoriesContainer}>
              <Ionicons name="images-outline" size={48} color="#cbd5e1" />
              <Text style={styles.noMemoriesText}>
                No memories found
              </Text>
              <Text style={styles.noMemoriesSubText}>
                {searchQuery || selectedYear ? 'Try adjusting your search or filters' : 'Start by adding your first memory!'}
              </Text>
              {!searchQuery && !selectedYear && (
                <Link href="/tabs/add" asChild>
                  <TouchableOpacity style={styles.addMemoryButton}>
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
                  >
                    <View style={styles.yearTitleContainer}>
                      <Ionicons
                        name={expandedYears.has(year) ? "folder-open" : "folder"}
                        size={24}
                        color="#0ea5e9"
                      />
                      <Text style={styles.yearTitle}>
                        {year}
                      </Text>
                    </View>
                    <View style={styles.yearCountContainer}>
                      <Text style={styles.yearCountText}>
                        {Object.values(groupedMemories[year]).reduce(
                          (sum, month) => sum + month.memories.length,
                          0
                        )} memories
                      </Text>
                      <Ionicons
                        name={expandedYears.has(year) ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#64748b"
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
                                name="calendar-outline"
                                size={18}
                                color="#64748b"
                              />
                              <Text style={styles.monthTitle}>
                                {monthData.monthName} ({monthData.memories.length})
                              </Text>
                            </View>
                            {monthData.memories.map(renderMemoryCard)}
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
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    color: '#475569',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  welcomeText: {
    color: '#475569',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchFilterContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 8,
    color: '#111827',
  },
  clearFilterButton: {
    backgroundColor: '#d1d5db',
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  memoriesListContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  noMemoriesContainer: {
    textAlign: 'center',
    paddingVertical: 48,
    alignItems: 'center',
  },
  noMemoriesText: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 18,
  },
  noMemoriesSubText: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
  addMemoryButton: {
    backgroundColor: '#0ea5e9',
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addMemoryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  yearGroup: {
    marginBottom: 24,
  },
  yearHeader: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yearTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yearTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 12,
  },
  yearCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yearCountText: {
    color: '#6b7280',
    marginRight: 8,
  },
  monthList: {
    marginLeft: 24,
  },
  monthGroup: {
    marginBottom: 16,
  },
  monthHeader: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthTitle: {
    color: '#374151',
    fontWeight: '500',
    marginLeft: 8,
  },
  memoryCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  memoryCardContent: {
    flexDirection: 'row',
  },
  memoryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  memoryDetails: {
    flex: 1,
  },
  memoryTitle: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  memoryPlace: {
    color: '#475569',
    fontSize: 14,
    marginBottom: 8,
  },
  memoryDate: {
    color: '#6b7280',
    fontSize: 12,
  },
  memoryDescription: {
    color: '#475569',
    fontSize: 14,
    marginTop: 4,
  },
});
