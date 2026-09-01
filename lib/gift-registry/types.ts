export type GiftStatus = 'available' | 'partially_claimed' | 'fully_claimed' | 'received';
export type GiftClaimStatus = 'intended' | 'purchased' | 'delivered' | 'cancelled';
export type CashGiftStatus = 'pending' | 'configured' | 'received';

export interface GiftItem {
  id: string;
  invitationId: string;
  name: string;
  description?: string;
  quantity: number;
  claimedCount: number;
  status: GiftStatus;
  imageUrl?: string;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GiftClaim {
  id: string;
  giftId: string;
  invitationId: string;
  guestName: string;
  guestPhone: string;
  quantity: number;
  status: GiftClaimStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CashGiftConfig {
  enabled: boolean;
  method: 'bank_transfer' | 'paystack' | 'manual';
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  paystackLink?: string;
  instructions?: string;
}

export interface GiftRegistry {
  id: string;
  invitationId: string;
  deliveryAddress?: string;
  deliveryInstructions?: string;
  cashGifts: CashGiftConfig;
  gifts: GiftItem[];
  createdAt: string;
  updatedAt: string;
}

export interface GiftRegistryStats {
  totalGifts: number;
  totalItems: number;
  claimedItems: number;
  receivedItems: number;
  cashGiftsReceived: number;
}

export interface GiftRegistryFilters {
  status?: GiftStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GiftRegistryResponse {
  gifts: GiftItem[];
  stats: GiftRegistryStats;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
