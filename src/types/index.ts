export type ListingType = 'RENT' | 'SELL';
export type TransactionType = 'RENT' | 'BUY';
export type ItemCondition = 'Like New' | 'Good' | 'Fair';
export type ItemCategory = 'Appliances' | 'Furniture' | 'Books' | 'Electronics' | 'Others';
export type TransactionStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type UserRole = 'Student' | 'Alum/Senior' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  phone?: string | null;
  role: string;
  avatarUrl?: string | null;
  verifiedStudent: boolean;
  dormLocation?: string | null;
  bio?: string | null;
  createdAt: string | Date;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  listingType: ListingType;
  price?: number | null;
  rentalRate?: number | null;
  rentalPeriod: string; // 'daily' | 'monthly'
  securityDeposit: number;
  condition: ItemCondition;
  images: string[] | string;
  sellerId: string;
  isAvailable: boolean;
  location?: string | null;
  viewsCount?: number;
  createdAt: string | Date;
  updatedAt?: string | Date;
  seller?: User;
}

export interface RentalTransaction {
  id: string;
  itemId: string;
  buyerId: string;
  sellerId: string;
  type: TransactionType;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  totalAmount: number;
  depositAmount: number;
  status: TransactionStatus;
  paymentStatus: string;
  pickupLocation?: string | null;
  notes?: string | null;
  createdAt: string | Date;
  item?: Item;
  buyer?: User;
  seller?: User;
}

export interface Inquiry {
  id: string;
  itemId: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string | Date;
  sender?: User;
  receiver?: User;
  item?: Item;
}
