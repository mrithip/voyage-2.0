import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { apiService, Memory } from '../../utils/api';

export default function MemoryDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [memory, setMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        // Since we don't have getMemory by id, we'll get all and find it
        // In a real app, you'd implement getMemory(id)
        const response = await apiService.getMemories();
        const foundMemory = response.memories.find((m: Memory) => m._id === id);
        if (foundMemory) {
          setMemory(foundMemory);
        } else {
          Alert.alert('Error', 'Memory not found');
          router.back();
        }
      } catch (error) {
        console.error('Error fetching memory:', error);
        Alert.alert('Error', 'Failed to load memory');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMemory();
    }
  }, [id]);

  const openLocation = () => {
    if (memory?.locationLink) {
      Linking.openURL(memory.locationLink).catch(() => {
        Alert.alert('Error', 'Unable to open link');
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Loading memory...</Text>
      </View>
    );
  }

  if (!memory) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#0c4a6e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Memory Details</Text>
        </View>

        {/* Photo */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${memory.photo}` }}
            style={styles.photo}
            resizeMode="cover"
          />
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="text" size={24} color="#64748b" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Title</Text>
              <Text style={styles.detailValue}>{memory.title}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location" size={24} color="#64748b" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Place</Text>
              <Text style={styles.detailValue}>{memory.placeName}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={24} color="#64748b" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{memory.dateRange}</Text>
            </View>
          </View>

          {memory.description && (
            <View style={styles.detailRow}>
              <Ionicons name="document-text" size={24} color="#64748b" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>{memory.description}</Text>
              </View>
            </View>
          )}

          {memory.locationLink && (
            <View style={styles.detailRow}>
              <Ionicons name="map" size={24} color="#64748b" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Location Link</Text>
                <TouchableOpacity onPress={openLocation}>
                  <Text style={styles.linkText}>Open in maps</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
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
  content: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 50,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  photoContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  photo: {
    width: '100%',
    height: 240,
    borderRadius: 12,
  },
  detailsContainer: {
    paddingHorizontal: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  detailContent: {
    marginLeft: 16,
    flex: 1,
  },
  detailLabel: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '500',
  },
  linkText: {
    color: '#0ea5e9',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
