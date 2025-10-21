
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, buttonStyles, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function LoginScreen() {
  const [accountNumber, setAccountNumber] = useState('');
  const [pin, setPin] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ accountNumber: '', pin: '' });

  const { login } = useAuth();
  const router = useRouter();

  const validateInputs = () => {
    let valid = true;
    const newErrors = { accountNumber: '', pin: '' };

    if (!accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
      valid = false;
    } else if (accountNumber.length < 10) {
      newErrors.accountNumber = 'Account number must be at least 10 digits';
      valid = false;
    }

    if (!pin.trim()) {
      newErrors.pin = 'PIN is required';
      valid = false;
    } else if (pin.length < 4) {
      newErrors.pin = 'PIN must be at least 4 digits';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const success = await login(accountNumber, pin);
      
      if (success) {
        console.log('Login successful, navigating to home');
        router.replace('/(tabs)/(home)');
      } else {
        Alert.alert(
          'Login Failed',
          'Invalid account number or PIN. Please try again.\n\nDemo credentials:\nAccount: 1000123456789\nPIN: 1234'
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('../assets/images/cbe-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.title}>Commercial Bank of Ethiopia</Text>
            <Text style={styles.subtitle}>Mobile Banking</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.instructionText}>Sign in to continue</Text>

            {/* Account Number Input */}
            <View style={styles.inputContainer}>
              <Text style={commonStyles.inputLabel}>Account Number</Text>
              <TextInput
                style={[commonStyles.input, errors.accountNumber && styles.inputError]}
                placeholder="Enter your account number"
                placeholderTextColor={colors.inactive}
                value={accountNumber}
                onChangeText={(text) => {
                  setAccountNumber(text);
                  setErrors({ ...errors, accountNumber: '' });
                }}
                keyboardType="numeric"
                autoCapitalize="none"
                editable={!loading}
              />
              {errors.accountNumber ? (
                <Text style={commonStyles.errorText}>{errors.accountNumber}</Text>
              ) : null}
            </View>

            {/* PIN Input */}
            <View style={styles.inputContainer}>
              <Text style={commonStyles.inputLabel}>PIN</Text>
              <TextInput
                style={[commonStyles.input, errors.pin && styles.inputError]}
                placeholder="Enter your PIN"
                placeholderTextColor={colors.inactive}
                value={pin}
                onChangeText={(text) => {
                  setPin(text);
                  setErrors({ ...errors, pin: '' });
                }}
                secureTextEntry
                keyboardType="numeric"
                maxLength={6}
                editable={!loading}
              />
              {errors.pin ? (
                <Text style={commonStyles.errorText}>{errors.pin}</Text>
              ) : null}
            </View>

            {/* Remember Me */}
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
              disabled={loading}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && (
                  <IconSymbol name="checkmark" size={16} color={colors.white} />
                )}
              </View>
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[buttonStyles.primaryButton, loading && buttonStyles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={buttonStyles.primaryButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Demo Info */}
            <View style={styles.demoInfo}>
              <Text style={styles.demoInfoText}>Demo Credentials:</Text>
              <Text style={styles.demoInfoText}>Account: 1000123456789</Text>
              <Text style={styles.demoInfoText}>PIN: 1234</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    marginTop: -10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 8,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rememberMeText: {
    fontSize: 14,
    color: colors.text,
  },
  demoInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    alignItems: 'center',
  },
  demoInfoText: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },
});
