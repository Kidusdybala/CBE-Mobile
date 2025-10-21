
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Transaction } from '@/types';

type FilterType = 'all' | 'send' | 'receive' | 'airtime' | 'bill';

export default function TransactionsScreen() {
  const [filter, setFilter] = useState<FilterType>('all');
  const { transactions } = useAuth();
  const router = useRouter();

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'send', label: 'Sent' },
    { id: 'receive', label: 'Received' },
    { id: 'airtime', label: 'Airtime' },
    { id: 'bill', label: 'Bills' },
  ];

  const filteredTransactions =
    filter === 'all'
      ? transactions
      : transactions.filter((t) => t.type === filter);

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ETB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
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

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
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
        <Text style={styles.headerTitle}>Transaction History</Text>
      </View>

      <View style={styles.container}>
        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {filters.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[
                styles.filterButton,
                filter === f.id && styles.filterButtonActive,
              ]}
              onPress={() => setFilter(f.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f.id && styles.filterTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Transactions List */}
        <ScrollView
          style={styles.transactionsList}
          contentContainerStyle={[
            styles.transactionsContent,
            Platform.OS !== 'ios' && styles.transactionsContentWithTabBar,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionItem}
                onPress={() =>
                  router.push(`/transaction-detail?id=${transaction.id}`)
                }
              >
                <View
                  style={[
                    styles.transactionIcon,
                    {
                      backgroundColor: getTransactionColor(transaction.type) + '20',
                    },
                  ]}
                >
                  <IconSymbol
                    name={getTransactionIcon(transaction.type) as any}
                    size={24}
                    color={getTransactionColor(transaction.type)}
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>
                    {transaction.description}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {formatDate(transaction.date)} • {formatTime(transaction.date)}
                  </Text>
                  {transaction.recipientName && (
                    <Text style={styles.transactionRecipient}>
                      {transaction.recipientName}
                    </Text>
                  )}
                </View>
                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color:
                          transaction.type === 'receive'
                            ? colors.success
                            : colors.text,
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
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol
                name="tray.fill"
                size={64}
                color={colors.inactive}
              />
              <Text style={styles.emptyStateText}>No transactions found</Text>
              <Text style={styles.emptyStateSubtext}>
                Your {filter !== 'all' ? filter : ''} transactions will appear here
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
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
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterTextActive: {
    color: colors.white,
  },
  transactionsList: {
    flex: 1,
  },
  transactionsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  transactionsContentWithTabBar: {
    paddingBottom: 140,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  transactionRecipient: {
    fontSize: 12,
    color: colors.textLight,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
});
