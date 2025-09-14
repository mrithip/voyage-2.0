import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { apiService, Memory } from '../../utils/api';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Memory not found',
          });
          router.back();
        }
      } catch (error) {
        console.error('Error fetching memory:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load memory',
        });
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
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Unable to open link',
        });
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Loading your memory...</Text>
      </View>
    );
  }

  if (!memory) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Gradient */}
      <LinearGradient
        colors={['#7c3aed', '#8b5cf6']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Memory Details</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${memory.photo}` }}
            style={styles.photo}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(124, 58, 237, 0.1)']}
            style={styles.photoGradient}
          />
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailSection}>
            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="text" size={20} color="#7c3aed" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Title</Text>
                <Text style={styles.detailValue}>{memory.title}</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="location" size={20} color="#7c3aed" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Place</Text>
                <Text style={styles.detailValue}>{memory.placeName}</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.detailRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar" size={20} color="#7c3aed" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{memory.dateRange}</Text>
              </View>
            </View>

            {memory.description && (
              <>
                <View style={styles.separator} />
                <View style={styles.detailRow}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="document-text" size={20} color="#7c3aed" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={styles.detailDescription}>{memory.description}</Text>
                  </View>
                </View>
              </>
            )}

            {memory.locationLink && (
              <>
                <View style={styles.separator} />
                <View style={styles.detailRow}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="map" size={20} color="#7c3aed" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Location</Text>
                    <TouchableOpacity onPress={openLocation} style={styles.linkButton}>
                      <Text style={styles.linkText}>Open in maps</Text>
                      <Ionicons name="open-outline" size={16} color="#7c3aed" />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Memory Footer */}
        <View style={styles.footer}>
          <Ionicons name="time-outline" size={16} color="#a78bfa" />
          <Text style={styles.footerText}>
            Created on {new Date(memory.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#faf5ff',
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Inter-Bold',
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 20,
  },
  photoContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  photoGradient: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 0,
    height: 60,
    borderRadius: 20,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 24,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailSection: {
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    color: '#6b7280',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  detailValue: {
    color: '#4c1d95',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  detailDescription: {
    color: '#4c1d95',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  separator: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 8,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#faf5ff',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  linkText: {
    color: '#7c3aed',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginRight: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    padding: 16,
  },
  footerText: {
    color: '#a78bfa',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
  },
});