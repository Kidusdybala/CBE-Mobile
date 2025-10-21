
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
import { useAuth } from '@/contexts/AuthContext';
import { colors, buttonStyles, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Transaction } from '@/types';

const TELECOM_PROVIDERS = [
  { id: 'ethio', name: 'Ethio Telecom', color: colors.success },
  { id: 'safaricom', name: 'Safaricom Ethiopia', color: colors.error },
];

const QUICK_AMOUNTS = [50, 100, 200, 500];

export default function AirtimeScreen() {
  const [selectedProvider, setSelectedProvider] = useState(TELECOM_PROVIDERS[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ phoneNumber: '', amount: '' });

  const { user, updateBalance, addTransaction } = useAuth();
  const router = useRouter();

  const validateInputs = () => {
    let valid = true;
    const newErrors = { phoneNumber: '', amount: '' };

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      valid = false;
    } else if (phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Invalid phone number';
      valid = false;
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
      valid = false;
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
      valid = false;
    } else if (user && parseFloat(amount) > user.balance) {
      newErrors.amount = 'Insufficient balance';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handlePurchase = async () => {
    if (!validateInputs() || !user) {
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const purchaseAmount = parseFloat(amount);
      const newBalance = user.balance - purchaseAmount;

      // Create transaction
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'airtime',
        amount: purchaseAmount,
        date: new Date().toISOString(),
        phoneNumber,
        provider: selectedProvider.name,
        status: 'success',
        description: `${selectedProvider.name} Airtime`,
      };

      // Update balance and add transaction
      updateBalance(newBalance);
      addTransaction(transaction);

      Alert.alert(
        'Purchase Successful',
        `You have successfully purchased ${purchaseAmount.toFixed(2)} ETB airtime for ${phoneNumber}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setPhoneNumber('');
              setAmount('');
              router.back();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Airtime purchase error:', error);
      Alert.alert('Purchase Failed', 'An error occurred. Please try again.');
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
        <Text style={styles.headerTitle}>Airtime Recharge</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Provider Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Provider</Text>
          <View style={styles.providersContainer}>
            {TELECOM_PROVIDERS.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerButton,
                  selectedProvider.id === provider.id && styles.providerButtonActive,
                  { borderColor: provider.color },
                ]}
                onPress={() => setSelectedProvider(provider)}
              >
                <View
                  style={[
                    styles.providerIcon,
                    { backgroundColor: provider.color + '20' },
                  ]}
                >
                  <IconSymbol name="phone.fill" size={24} color={provider.color} />
                </View>
                <Text style={styles.providerName}>{provider.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form */}
        <View style={styles.section}>
          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <Text style={commonStyles.inputLabel}>Phone Number</Text>
            <TextInput
              style={[commonStyles.input, errors.phoneNumber && styles.inputError]}
              placeholder="+251 9XX XXX XXX"
              placeholderTextColor={colors.inactive}
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                setErrors({ ...errors, phoneNumber: '' });
              }}
              keyboardType="phone-pad"
              editable={!loading}
            />
            {errors.phoneNumber ? (
              <Text style={commonStyles.errorText}>{errors.phoneNumber}</Text>
            ) : null}
          </View>

          {/* Quick Amount Selection */}
          <View style={styles.inputContainer}>
            <Text style={commonStyles.inputLabel}>Quick Amount (ETB)</Text>
            <View style={styles.quickAmountsContainer}>
              {QUICK_AMOUNTS.map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  style={[
                    styles.quickAmountButton,
                    amount === quickAmount.toString() && styles.quickAmountButtonActive,
                  ]}
                  onPress={() => setAmount(quickAmount.toString())}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.quickAmountText,
                      amount === quickAmount.toString() && styles.quickAmountTextActive,
                    ]}
                  >
                    {quickAmount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Custom Amount */}
          <View style={styles.inputContainer}>
            <Text style={commonStyles.inputLabel}>Or Enter Custom Amount (ETB)</Text>
            <TextInput
              style={[commonStyles.input, errors.amount && styles.inputError]}
              placeholder="0.00"
              placeholderTextColor={colors.inactive}
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                setErrors({ ...errors, amount: '' });
              }}
              keyboardType="decimal-pad"
              editable={!loading}
            />
            {errors.amount ? (
              <Text style={commonStyles.errorText}>{errors.amount}</Text>
            ) : null}
            {user && (
              <Text style={styles.balanceText}>
                Available Balance: {user.balance.toFixed(2)} ETB
              </Text>
            )}
          </View>

          {/* Purchase Button */}
          <TouchableOpacity
            style={[buttonStyles.primaryButton, loading && buttonStyles.disabledButton]}
            onPress={handlePurchase}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={buttonStyles.primaryButtonText}>Purchase Airtime</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  providersContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  providerButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  providerButtonActive: {
    borderWidth: 2,
  },
  providerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickAmountButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  quickAmountTextActive: {
    color: colors.white,
  },
  balanceText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
});
