
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Transaction } from '@/types';
import { mockUser, mockTransactions } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  transactions: Transaction[];
  isAuthenticated: boolean;
  login: (accountNumber: string, pin: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  addTransaction: (transaction: Transaction) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (accountNumber: string, pin: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple validation against mock data
    if (accountNumber === mockUser.accountNumber && pin === mockUser.pin) {
      setUser(mockUser);
      setIsAuthenticated(true);
      console.log('Login successful');
      return true;
    }

    console.log('Login failed');
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    console.log('User logged out');
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      setUser({ ...user, balance: newBalance });
      console.log('Balance updated:', newBalance);
    }
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    console.log('Transaction added:', transaction);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        transactions,
        isAuthenticated,
        login,
        logout,
        updateBalance,
        addTransaction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
