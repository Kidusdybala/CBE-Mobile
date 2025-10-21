
export interface User {
  id: string;
  name: string;
  accountNumber: string;
  phoneNumber: string;
  balance: number;
  pin: string;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'airtime' | 'bill';
  amount: number;
  date: string;
  recipientAccount?: string;
  recipientName?: string;
  phoneNumber?: string;
  provider?: string;
  status: 'success' | 'failed' | 'pending';
  description: string;
}

export interface TransferData {
  recipientAccount: string;
  amount: number;
  description?: string;
}

export interface AirtimeData {
  provider: string;
  phoneNumber: string;
  amount: number;
}
