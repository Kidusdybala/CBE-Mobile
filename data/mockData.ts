
import { User, Transaction } from '@/types';

// Mock user data - In production, this would come from secure storage/backend
export const mockUser: User = {
  id: '1',
  name: 'Abebe Kebede',
  accountNumber: '1000123456789',
  phoneNumber: '+251911234567',
  balance: 12345.00,
  pin: '1234', // In production, this should be hashed and stored securely
};

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'receive',
    amount: 5000.00,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    recipientName: 'Salary Payment',
    status: 'success',
    description: 'Monthly Salary',
  },
  {
    id: '2',
    type: 'send',
    amount: 1500.00,
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    recipientAccount: '1000987654321',
    recipientName: 'Tigist Alemu',
    status: 'success',
    description: 'Rent Payment',
  },
  {
    id: '3',
    type: 'airtime',
    amount: 100.00,
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    phoneNumber: '+251911234567',
    provider: 'Ethio Telecom',
    status: 'success',
    description: 'Airtime Recharge',
  },
  {
    id: '4',
    type: 'bill',
    amount: 850.00,
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    status: 'success',
    description: 'Electricity Bill',
  },
  {
    id: '5',
    type: 'send',
    amount: 2000.00,
    date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    recipientAccount: '1000555666777',
    recipientName: 'Dawit Tesfaye',
    status: 'success',
    description: 'Business Payment',
  },
];
