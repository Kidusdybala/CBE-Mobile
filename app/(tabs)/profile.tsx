
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  const profileOptions = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: 'person.circle.fill',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon'),
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: 'lock.fill',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'bell.fill',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'questionmark.circle.fill',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon'),
    },
    {
      id: 'about',
      title: 'About',
      icon: 'info.circle.fill',
      onPress: () => Alert.alert('CBE Mobile Banking', 'Version 1.0.0\n\nCommercial Bank of Ethiopia\nMobile Banking MVP'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.fill" size={48} color={colors.white} />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userPhone}>{user.phoneNumber}</Text>
          <View style={styles.accountInfoContainer}>
            <View style={styles.accountInfoItem}>
              <Text style={styles.accountInfoLabel}>Account Number</Text>
              <Text style={styles.accountInfoValue}>{user.accountNumber}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.changePasswordButton}
            onPress={handleChangePassword}
          >
            <IconSymbol name="key.fill" size={20} color={colors.primary} />
            <Text style={styles.changePasswordText}>Change Password</Text>
            <IconSymbol name="chevron.right" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Options */}
        <View style={styles.section}>
          {profileOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIcon}>
                  <IconSymbol
                    name={option.icon as any}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.optionTitle}>{option.title}</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <IconSymbol name="arrow.right.square.fill" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  scrollContentWithTabBar: {
    paddingBottom: 140,
  },
  profileCard: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 20,
  },
  accountInfoContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  accountInfoItem: {
    alignItems: 'center',
  },
  accountInfoLabel: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  accountInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
  },
  changePasswordText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error + '10',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 12,
  },
  versionText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 24,
  },
});
