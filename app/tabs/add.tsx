import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../utils/api';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AddMemoryScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [locationLink, setLocationLink] = useState('');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [photo, setPhoto] = useState<string | null>(null); // Base64 string

  // Date picker state
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Title is required',
      });
      return;
    }
    if (!placeName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Place name is required',
      });
      return;
    }
    if (!photo) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select a photo',
      });
      return;
    }
    if (fromDate > toDate) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'From date cannot be after to date',
      });
      return;
    }

    try {
      setLoading(true);

      await apiService.createMemory({
        title: title.trim(),
        description: description.trim(),
        placeName: placeName.trim(),
        locationLink: locationLink.trim() || undefined,
        fromDate: apiService.formatDate(fromDate),
        toDate: apiService.formatDate(toDate),
        photo,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPlaceName('');
      setLocationLink('');
      setFromDate(new Date());
      setToDate(new Date());
      setPhoto(null);

      Alert.alert('Success', 'Memory created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error creating memory:', error);
      Alert.alert('Error', 'Failed to create memory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setPlaceName('');
    setLocationLink('');
    setFromDate(new Date());
    setToDate(new Date());
    setPhoto(null);
    setShowFromDatePicker(false);
    setShowToDatePicker(false);
  };

  const selectPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0].base64 || null);
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.headerTitle}>Add New Memory</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Photo Selection */}
          <View style={styles.photoSection}>
            <Text style={styles.labelRequired}>Photo *</Text>
            <TouchableOpacity
              onPress={selectPhoto}
              style={styles.photoPicker}
              activeOpacity={0.7}
            >
            {photo ? (
              <View style={styles.photoContainer}>
                <Image
                  source={{ uri: `data:image/jpeg;base64,${photo}` }}
                  style={styles.photoImage}
                  resizeMode="cover"
                />
                <View style={styles.photoOverlay}>
                  <Ionicons name="camera" size={32} color="white" />
                  <Text style={styles.photoOverlayText}>Change Photo</Text>
                </View>
              </View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera" size={48} color="#7c3aed" />
                <Text style={styles.photoText}>Tap to select a photo</Text>
                <Text style={styles.photoSubText}>Recommended: 4:3 ratio</Text>
              </View>
            )}
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.labelRequired}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter memory title"
                placeholderTextColor="#a78bfa"
                value={title}
                onChangeText={setTitle}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.labelRequired}>Place Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Where was this memory made?"
                placeholderTextColor="#a78bfa"
                value={placeName}
                onChangeText={setPlaceName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us about this memory..."
                placeholderTextColor="#a78bfa"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location Link</Text>
              <TextInput
                style={styles.input}
                placeholder="Google Maps link (optional)"
                placeholderTextColor="#a78bfa"
                value={locationLink}
                onChangeText={setLocationLink}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>

            {/* Dates */}
            <View style={styles.dateRow}>
              <View style={styles.dateGroup}>
                <Text style={styles.labelRequired}>From Date *</Text>
                <TouchableOpacity
                  onPress={() => setShowFromDatePicker(true)}
                  style={styles.dateButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="calendar" size={20} color="#7c3aed" style={styles.dateIcon} />
                  <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dateGroup}>
                <Text style={styles.labelRequired}>To Date *</Text>
                <TouchableOpacity
                  onPress={() => setShowToDatePicker(true)}
                  style={styles.dateButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="calendar" size={20} color="#7c3aed" style={styles.dateIcon} />
                  <Text style={styles.dateText}>{formatDate(toDate)}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Date Pickers */}
            {showFromDatePicker && (
              <DateTimePicker
                value={fromDate}
                mode="date"
                display="spinner"
                themeVariant="light"
                onChange={(event, selectedDate) => {
                  setShowFromDatePicker(false);
                  if (selectedDate) {
                    setFromDate(selectedDate);
                  }
                }}
              />
            )}

            {showToDatePicker && (
              <DateTimePicker
                value={toDate}
                mode="date"
                display="spinner"
                themeVariant="light"
                onChange={(event, selectedDate) => {
                  setShowToDatePicker(false);
                  if (selectedDate) {
                    setToDate(selectedDate);
                  }
                }}
              />
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearForm}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color="#7c3aed" />
              <Text style={styles.clearButtonText}>
                Clear Form
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="white" />
                  <Text style={styles.saveButtonText}>
                    Save Memory
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf5ff',
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 30,
  },
  photoSection: {
    marginBottom: 24,
  },
  labelRequired: {
    color: '#4c1d95',
    marginBottom: 8,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  label: {
    color: '#4c1d95',
    marginBottom: 8,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  photoPicker: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#7c3aed',
    height: 200,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  photoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(124, 58, 237, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoOverlayText: {
    color: 'white',
    marginTop: 8,
    fontFamily: 'Inter-Medium',
  },
  photoPlaceholder: {
    alignItems: 'center',
    padding: 20,
  },
  photoText: {
    color: '#7c3aed',
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  photoSubText: {
    color: '#a78bfa',
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  form: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd6fe',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#4c1d95',
    backgroundColor: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd6fe',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dateIcon: {
    marginRight: 8,
  },
  dateText: {
    color: '#4c1d95',
    fontFamily: 'Inter-Regular',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  clearButton: {
    backgroundColor: '#ede9fe',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clearButtonText: {
    color: '#7c3aed',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
});