import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image, // Add Image import
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../utils/api';

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
    return date.toLocaleDateString();
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
        quality: 0.5,
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
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#0c4a6e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Memory</Text>
        </View>

        {/* Photo Selection */}
        <View style={styles.photoSection}>
          <Text style={styles.labelRequired}>Photo *</Text>
          <TouchableOpacity
            onPress={selectPhoto}
            style={styles.photoPicker}
            activeOpacity={0.7}
          >
          {photo ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${photo}` }}
              style={styles.photoImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={48} color="#cbd5e1" />
              <Text style={styles.photoText}>Tap to select photo</Text>
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
              value={placeName}
              onChangeText={setPlaceName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Tell us about this memory..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location Link</Text>
            <TextInput
              style={styles.input}
              placeholder="Google Maps link (optional)"
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
              >
                <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateGroup}>
              <Text style={styles.labelRequired}>To Date *</Text>
              <TouchableOpacity
                onPress={() => setShowToDatePicker(true)}
                style={styles.dateButton}
              >
                <Text style={styles.dateText}>{formatDate(toDate)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date Pickers */}
          {showFromDatePicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display="default"
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
              display="default"
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
          >
            <Text style={styles.clearButtonText}>
              Clear Form
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveButtonText}>
                Save Memory
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  photoSection: {
    marginBottom: 24,
  },
  labelRequired: {
    color: '#374151',
    marginBottom: 12,
    fontWeight: '500',
  },
  label: {
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  photoPicker: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    height: 160,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  photoPlaceholder: {
    alignItems: 'center',
  },
  photoText: {
    color: '#6b7280',
    marginTop: 8,
  },
  form: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#111827',
    backgroundColor: 'white',
  },
  dateRow: {
    flexDirection: 'row',
  },
  dateGroup: {
    flex: 1,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  dateText: {
    color: '#111827',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  clearButton: {
    backgroundColor: '#6b7280',
    borderRadius: 8,
    paddingVertical: 16,
    flex: 1,
    marginRight: 8,
  },
  clearButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    paddingVertical: 16,
    flex: 1,
    marginLeft: 8,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
});
