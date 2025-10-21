
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, buttonStyles, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const router = useRouter();

  const validateInputs = () => {
    let valid = true;
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
      valid = false;
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
      valid = false;
    } else if (newPassword.length < 4) {
      newErrors.newPassword = 'Password must be at least 4 characters';
      valid = false;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChangePassword = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // In production, this would call an API to change the password
      Alert.alert(
        'Success',
        'Your password has been changed successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Change password error:', error);
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.infoBox}>
            <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Choose a strong password that you don&apos;t use for other accounts
            </Text>
          </View>

          {/* Current Password */}
          <View style={styles.inputContainer}>
            <Text style={commonStyles.inputLabel}>Current Password</Text>
            <TextInput
              style={[
                commonStyles.input,
                errors.currentPassword && styles.inputError,
              ]}
              placeholder="Enter current password"
              placeholderTextColor={colors.inactive}
              value={currentPassword}
              onChangeText={(text) => {
                setCurrentPassword(text);
                setErrors({ ...errors, currentPassword: '' });
              }}
              secureTextEntry
              editable={!loading}
            />
            {errors.currentPassword ? (
              <Text style={commonStyles.errorText}>{errors.currentPassword}</Text>
            ) : null}
          </View>

          {/* New Password */}
          <View style={styles.inputContainer}>
            <Text style={commonStyles.inputLabel}>New Password</Text>
            <TextInput
              style={[commonStyles.input, errors.newPassword && styles.inputError]}
              placeholder="Enter new password"
              placeholderTextColor={colors.inactive}
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                setErrors({ ...errors, newPassword: '' });
              }}
              secureTextEntry
              editable={!loading}
            />
            {errors.newPassword ? (
              <Text style={commonStyles.errorText}>{errors.newPassword}</Text>
            ) : null}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={commonStyles.inputLabel}>Confirm New Password</Text>
            <TextInput
              style={[
                commonStyles.input,
                errors.confirmPassword && styles.inputError,
              ]}
              placeholder="Confirm new password"
              placeholderTextColor={colors.inactive}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrors({ ...errors, confirmPassword: '' });
              }}
              secureTextEntry
              editable={!loading}
            />
            {errors.confirmPassword ? (
              <Text style={commonStyles.errorText}>{errors.confirmPassword}</Text>
            ) : null}
          </View>

          {/* Change Password Button */}
          <TouchableOpacity
            style={[buttonStyles.primaryButton, loading && buttonStyles.disabledButton]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={buttonStyles.primaryButtonText}>Change Password</Text>
            )}
          </TouchableOpacity>
        </View>
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
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
});
