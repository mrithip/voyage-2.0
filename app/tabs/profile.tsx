import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Profile Avatar */}
          <View style={styles.avatarSection}>
            <LinearGradient
              colors={['#7c3aed', '#8b5cf6']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </Text>
            </LinearGradient>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>

          {/* Profile Details */}
          <View style={styles.profileDetails}>
            {profileItems.map((item, index) => (
              <View key={index} style={styles.profileItem}>
                <View style={styles.itemIconContainer}>
                  <Ionicons name={item.icon as any} size={20} color="#7c3aed" />
                </View>
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
            activeOpacity={0.8}
          >
            <View style={styles.logoutContent}>
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>

          {/* App Info */}
          <View style={styles.appInfo}>
            <View style={styles.appInfoHeader}>
              <Ionicons name="information-circle" size={24} color="#7c3aed" />
              <Text style={styles.appInfoTitle}>App Information</Text>
            </View>
            
            <Text style={styles.appInfoText}>
              Voyage v1.0.0{'\n'}
            </Text>

            <View style={styles.appLinks}>
              <TouchableOpacity 
                onPress={showTermsAndConditions}
                style={styles.appLinkButton}
                activeOpacity={0.7}
              >
                <Ionicons name="document-text-outline" size={18} color="#7c3aed" />
                <Text style={styles.appLinkText}>Terms and Conditions</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={showPrivacyPolicy}
                style={styles.appLinkButton}
                activeOpacity={0.7}
              >
                <Ionicons name="shield-checkmark-outline" size={18} color="#7c3aed" />
                <Text style={styles.appLinkText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
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
    marginBottom: 70,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Inter-Bold',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4c1d95',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#8b5cf6',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  profileDetails: {
    marginBottom: 32,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    color: '#6b7280',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  itemValue: {
    color: '#4c1d95',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 32,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  appInfo: {
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4c1d95',
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  appInfoText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 20,
    lineHeight: 20,
  },
  appLinks: {
    alignItems: 'stretch',
  },
  appLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#faf5ff',
    borderRadius: 12,
    marginBottom: 12,
  },
  appLinkText: {
    color: '#7c3aed',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 12,
  },
});