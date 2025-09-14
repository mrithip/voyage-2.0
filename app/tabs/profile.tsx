import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

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

  const showTermsAndConditions = () => {
    Alert.alert(
      'Terms and Conditions',
      'Welcome to Voyage! By using our app, you agree to the following terms:\n\n' +
      '1. Acceptance of Terms: By downloading or using Voyage, you agree to these terms.\n\n' +
      '2. Use License: We grant you a limited, non-transferable license to use Voyage.\n\n' +
      '3. Content: You are responsible for content you upload. We do not claim ownership.\n\n' +
      '4. Privacy: Your privacy is protected under our Privacy Policy.\n\n' +
      '5. Prohibited Uses: Do not use the app for illegal activities.\n\n' +
      '6. Termination: We may terminate your account for breach of terms.\n\n' +
      '7. Limitation of Liability: The app is provided "as is".\n\n' +
      '8. Changes to Terms: We may update these terms at any time.\n\n' +
      'Contact us at support@voyageapp.com for questions.',
      [{ text: 'OK' }]
    );
  };

  const showPrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Voyage values your privacy. Our Privacy Policy explains how we collect, use, and protect your information:\n\n' +
      '1. Information We Collect:\n' +
      '   - Personal information you provide (name, email)\n' +
      '   - Memories and content you upload\n' +
      '   - Usage data and device information\n\n' +
      '2. How We Use Information:\n' +
      '   - Provide and improve our services\n' +
      '   - Personalize your experience\n' +
      '   - Communicate with you\n\n' +
      '3. Information Sharing:\n' +
      '   - We do not sell your personal information\n' +
      '   - May share anonymized data for analytics\n\n' +
      '4. Data Security:\n' +
      '   - We implement security measures to protect your data\n' +
      '   - You can request data deletion\n\n' +
      '5. Cookies and Tracking: Limited use for app functionality\n\n' +
      '6. Children\'s Privacy: App is for users 13+\n\n' +
      '7. Changes to Policy: We may update this policy\n\n' +
      'Contact support@voyageapp.com for privacy concerns.',
      [{ text: 'OK' }]
    );
  };

  const profileItems = [
    {
      icon: 'person-outline',
      title: 'Name',
      value: user?.name,
    },
    {
      icon: 'mail-outline',
      title: 'Email',
      value: user?.email,
    },
    {
      icon: 'calendar-outline',
      title: 'Member Since',
      value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
    },
  ];

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
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {/* Profile Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Profile Details */}
        <View style={styles.profileDetails}>
          {profileItems.map((item, index) => (
            <View key={index} style={styles.profileItem}>
              <Ionicons name={item.icon as any} size={24} color="#64748b" />
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <View style={styles.logoutContent}>
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>
            Voyage v1.0.0{'\n'}
            Made with ❤️ by Your App
          </Text>

          <View style={styles.appLinks}>
            <TouchableOpacity onPress={showTermsAndConditions}>
              <Text style={styles.appLink}>Terms and Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={showPrivacyPolicy}>
              <Text style={styles.appLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 32,
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 96,
    height: 96,
    backgroundColor: '#0ea5e9',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  userEmail: {
    color: '#4b5563',
  },
  profileDetails: {
    marginBottom: 32,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    marginLeft: 16,
    flex: 1,
  },
  itemTitle: {
    color: '#6b7280',
    fontSize: 14,
  },
  itemValue: {
    color: '#111827',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    marginLeft: 8,
  },
  appInfo: {
    marginTop: 48,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  appInfoText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 16,
  },
  appLinks: {
    alignItems: 'center',
  },
  appLink: {
    color: '#0ea5e9',
    fontSize: 14,
    marginVertical: 4,
    textDecorationLine: 'underline',
  },
});
