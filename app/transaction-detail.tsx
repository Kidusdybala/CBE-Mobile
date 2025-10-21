
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { transactions } = useAuth();

  const transaction = transactions.find((t) => t.id === id);

  if (!transaction) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.container}>
          <Text style={styles.errorText}>Transaction not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ETB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'receive':
        return 'arrow.down.circle.fill';
      case 'send':
        return 'arrow.up.circle.fill';
      case 'airtime':
        return 'phone.fill';
      case 'bill':
        return 'doc.text.fill';
      default:
        return 'circle.fill';
    }
  };

  const getTransactionColor = () => {
    switch (transaction.type) {
      case 'receive':
        return colors.success;
      case 'send':
        return colors.primary;
      case 'airtime':
        return colors.accent;
      case 'bill':
        return colors.textLight;
      default:
        return colors.text;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Transaction Icon and Amount */}
        <View style={styles.amountSection}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: getTransactionColor() + '20' },
            ]}
          >
            <IconSymbol
              name={getTransactionIcon() as any}
              size={48}
              color={getTransactionColor()}
            />
          </View>
          <Text
            style={[
              styles.amount,
              {
                color:
                  transaction.type === 'receive' ? colors.success : colors.text,
              },
            ]}
          >
            {transaction.type === 'receive' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  transaction.status === 'success'
                    ? colors.success + '20'
                    : transaction.status === 'failed'
                    ? colors.error + '20'
                    : colors.accent + '20',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    transaction.status === 'success'
                      ? colors.success
                      : transaction.status === 'failed'
                      ? colors.error
                      : colors.accent,
                },
              ]}
            >
              {transaction.status}
            </Text>
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{transaction.description}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <Text style={styles.detailValue}>{transaction.id}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formatDate(transaction.date)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{formatTime(transaction.date)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={[styles.detailValue, styles.capitalize]}>
              {transaction.type}
            </Text>
          </View>

          {transaction.recipientAccount && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Recipient Account</Text>
              <Text style={styles.detailValue}>{transaction.recipientAccount}</Text>
            </View>
          )}

          {transaction.recipientName && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Recipient Name</Text>
              <Text style={styles.detailValue}>{transaction.recipientName}</Text>
            </View>
          )}

          {transaction.phoneNumber && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone Number</Text>
              <Text style={styles.detailValue}>{transaction.phoneNumber}</Text>
            </View>
          )}

          {transaction.provider && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Provider</Text>
              <Text style={styles.detailValue}>{transaction.provider}</Text>
            </View>
          )}
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
  amountSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  detailsSection: {
    backgroundColor: colors.secondary,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textLight,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 40,
  },
});
