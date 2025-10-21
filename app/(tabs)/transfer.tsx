
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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, buttonStyles, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Transaction } from '@/types';

const ethiopianBanks = [
  { id: 'cbe', name: 'Commercial Bank of Ethiopia', logo: '🏦' },
  { id: 'db', name: 'Dashen Bank', logo: '💰' },
  { id: 'awash', name: 'Awash International Bank', logo: '🌊' },
  { id: 'bunna', name: 'Bank of Abyssinia', logo: '🏛️' },
  { id: 'lion', name: 'Lion International Bank', logo: '🦁' },
  { id: 'zemen', name: 'Zemen Bank', logo: '⭐' },
  { id: 'nib', name: 'Nib International Bank', logo: '🌟' },
  { id: 'wegagen', name: 'Wegagen Bank', logo: '🌱' },
  { id: 'cooperative', name: 'Cooperative Bank', logo: '🤝' },
  { id: 'debub', name: 'Debub Global Bank', logo: '🌍' },
  { id: 'addis', name: 'Addis International Bank', logo: '🏙️' },
  { id: 'oromia', name: 'Oromia International Bank', logo: '🌾' },
];

export default function TransferScreen() {
  const [transferType, setTransferType] = useState<'cbe' | 'other'>('cbe');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ recipientAccount: '', amount: '' });

  const { user, updateBalance, addTransaction } = useAuth();
  const router = useRouter();

  const validateInputs = () => {
    let valid = true;
    const newErrors = { recipientAccount: '', amount: '' };

    if (!recipientAccount.trim()) {
      newErrors.recipientAccount = 'Recipient account is required';
      valid = false;
    } else if (recipientAccount.length < 10) {
      newErrors.recipientAccount = 'Invalid account number';
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

  const handleTransfer = async () => {
    if (!validateInputs() || !user) {
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const transferAmount = parseFloat(amount);
      const newBalance = user.balance - transferAmount;

      // Create transaction
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'send',
        amount: transferAmount,
        date: new Date().toISOString(),
        recipientAccount,
        recipientName: 'Recipient Name', // In production, fetch from API
        status: 'success',
        description: description || 'Money Transfer',
      };

      // Update balance and add transaction
      updateBalance(newBalance);
      addTransaction(transaction);

      Alert.alert(
        'Transfer Successful',
        `You have successfully transferred ${transferAmount.toFixed(2)} ETB to ${recipientAccount}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setRecipientAccount('');
              setAmount('');
              setDescription('');
              router.push('/(tabs)/(home)');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Transfer error:', error);
      Alert.alert('Transfer Failed', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Money</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Transfer Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transfer To</Text>
          <View style={styles.transferTypeContainer}>
            <TouchableOpacity
              style={[
                styles.transferTypeButton,
                transferType === 'cbe' && styles.transferTypeButtonActive,
              ]}
              onPress={() => setTransferType('cbe')}
            >
              <Text
                style={[
                  styles.transferTypeText,
                  transferType === 'cbe' && styles.transferTypeTextActive,
                ]}
              >
                CBE Account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.transferTypeButton,
                transferType === 'other' && styles.transferTypeButtonActive,
              ]}
              onPress={() => setTransferType('other')}
            >
              <Text
                style={[
                  styles.transferTypeText,
                  transferType === 'other' && styles.transferTypeTextActive,
                ]}
              >
                Other Bank
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {transferType === 'other' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Bank</Text>
            <View style={styles.banksGrid}>
              {ethiopianBanks.map((bank) => (
                <TouchableOpacity
                  key={bank.id}
                  style={styles.bankItem}
                  onPress={() => {
                    setSelectedBank(bank.id);
                    Alert.alert('Bank Selected', `You selected ${bank.name}`);
                  }}
                >
                  <View style={[styles.bankLogo, selectedBank === bank.id && styles.bankLogoSelected]}>
                    <Text style={[styles.bankLogoText, selectedBank === bank.id && styles.bankLogoTextSelected]}>{bank.logo}</Text>
                  </View>
                  <Text style={[styles.bankName, selectedBank === bank.id && styles.bankNameSelected]}>{bank.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Form */}
        <View style={styles.section}>
          {/* Recipient Account */}
          <View style={styles.inputContainer}>
            <Text style={commonStyles.inputLabel}>Recipient Account Number</Text>
            <TextInput
              style={[commonStyles.input, errors.recipientAccount && styles.inputError]}
              placeholder="Enter account number"
              placeholderTextColor={colors.inactive}
              value={recipientAccount}
              onChangeText={(text) => {
                setRecipientAccount(text);
                setErrors({ ...errors, recipientAccount: '' });
              }}
              keyboardType="numeric"
              editable={!loading && transferType === 'cbe' && selectedBank !== null}
            />
            {errors.recipientAccount ? (
              <Text style={commonStyles.errorText}>{errors.recipientAccount}</Text>
            ) : null}
          </View>

          {/* Amount */}
          <View style={styles.inputContainer}>
            <Text style={commonStyles.inputLabel}>Amount (ETB)</Text>
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
              editable={!loading && transferType === 'cbe' && selectedBank !== null}
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

          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={commonStyles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[commonStyles.input, styles.textArea]}
              placeholder="Enter description"
              placeholderTextColor={colors.inactive}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              editable={!loading && transferType === 'cbe' && selectedBank !== null}
            />
          </View>

          {/* Transfer Button */}
          <TouchableOpacity
            style={[
              buttonStyles.primaryButton,
              (loading || transferType === 'other') && buttonStyles.disabledButton,
            ]}
            onPress={handleTransfer}
            disabled={loading || transferType === 'other' || selectedBank === null}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={buttonStyles.primaryButtonText}>Transfer Money</Text>
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
    paddingBottom: 20,
  },
  scrollContentWithTabBar: {
    paddingBottom: 140,
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
  transferTypeContainer: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 4,
  },
  transferTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  transferTypeButtonActive: {
    backgroundColor: colors.primary,
  },
  transferTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  transferTypeTextActive: {
    color: colors.white,
  },
  comingSoonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent + '20',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  balanceText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  banksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginHorizontal: -8,
  },
  bankItem: {
    width: '25%',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  bankLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bankLogoSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  bankLogoText: {
    fontSize: 20,
    color: colors.text,
  },
  bankLogoTextSelected: {
    color: colors.white,
  },
  bankName: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  bankNameSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
