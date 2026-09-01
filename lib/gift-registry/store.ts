import {
  GiftItem,
  GiftClaim,
  GiftRegistry,
  GiftRegistryStats,
  GiftRegistryFilters,
  GiftRegistryResponse,
  CashGiftConfig,
  GiftStatus,
} from './types';

// In-memory store for demo purposes
const giftRegistries: Map<string, GiftRegistry> = new Map();
const giftClaims: Map<string, GiftClaim[]> = new Map();

let idCounter = 1;

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${idCounter++}`;
}

/**
 * Create or update gift registry for an invitation
 */
export function upsertGiftRegistry(
  invitationId: string,
  data: {
    deliveryAddress?: string;
    deliveryInstructions?: string;
    cashGifts?: CashGiftConfig;
    gifts?: Omit<GiftItem, 'id' | 'invitationId' | 'claimedCount' | 'status' | 'createdAt' | 'updatedAt'>[];
  }
): GiftRegistry {
  const existing = giftRegistries.get(invitationId);
  const now = new Date().toISOString();

  if (existing) {
    // Update existing registry
    if (data.deliveryAddress !== undefined) existing.deliveryAddress = data.deliveryAddress;
    if (data.deliveryInstructions !== undefined) existing.deliveryInstructions = data.deliveryInstructions;
    if (data.cashGifts !== undefined) existing.cashGifts = data.cashGifts;
    existing.updatedAt = now;

    // Update gifts if provided
    if (data.gifts) {
      existing.gifts = data.gifts.map((g, i) => ({
        ...g,
        id: existing.gifts[i]?.id || generateId('gift'),
        invitationId,
        claimedCount: existing.gifts[i]?.claimedCount || 0,
        status: existing.gifts[i]?.status || 'available',
        createdAt: existing.gifts[i]?.createdAt || now,
        updatedAt: now,
      }));
    }

    giftRegistries.set(invitationId, existing);
    return existing;
  }

  // Create new registry
  const registry: GiftRegistry = {
    id: generateId('registry'),
    invitationId,
    deliveryAddress: data.deliveryAddress,
    deliveryInstructions: data.deliveryInstructions,
    cashGifts: data.cashGifts || { enabled: false, method: 'manual' },
    gifts: (data.gifts || []).map((g) => ({
      ...g,
      id: generateId('gift'),
      invitationId,
      claimedCount: 0,
      status: 'available' as GiftStatus,
      createdAt: now,
      updatedAt: now,
    })),
    createdAt: now,
    updatedAt: now,
  };

  giftRegistries.set(invitationId, registry);
  return registry;
}

/**
 * Get gift registry for an invitation
 */
export function getGiftRegistry(invitationId: string): GiftRegistry | null {
  return giftRegistries.get(invitationId) || null;
}

/**
 * Add a gift item to registry
 */
export function addGiftItem(
  invitationId: string,
  gift: Omit<GiftItem, 'id' | 'invitationId' | 'claimedCount' | 'status' | 'createdAt' | 'updatedAt'>
): GiftItem | null {
  const registry = giftRegistries.get(invitationId);
  if (!registry) return null;

  const now = new Date().toISOString();
  const newGift: GiftItem = {
    ...gift,
    id: generateId('gift'),
    invitationId,
    claimedCount: 0,
    status: 'available',
    createdAt: now,
    updatedAt: now,
  };

  registry.gifts.push(newGift);
  registry.updatedAt = now;
  giftRegistries.set(invitationId, registry);

  return newGift;
}

/**
 * Remove a gift item from registry
 */
export function removeGiftItem(
  invitationId: string,
  giftId: string
): boolean {
  const registry = giftRegistries.get(invitationId);
  if (!registry) return false;

  const index = registry.gifts.findIndex((g) => g.id === giftId);
  if (index === -1) return false;

  registry.gifts.splice(index, 1);
  registry.updatedAt = new Date().toISOString();
  giftRegistries.set(invitationId, registry);

  return true;
}

/**
 * Claim a gift item
 */
export function claimGift(
  invitationId: string,
  giftId: string,
  claim: {
    guestName: string;
    guestPhone: string;
    quantity: number;
    message?: string;
  }
): { success: boolean; giftClaim?: GiftClaim; error?: string } {
  const registry = giftRegistries.get(invitationId);
  if (!registry) {
    return { success: false, error: 'Gift registry not found' };
  }

  const gift = registry.gifts.find((g) => g.id === giftId);
  if (!gift) {
    return { success: false, error: 'Gift not found' };
  }

  // Check availability
  const availableQuantity = gift.quantity - gift.claimedCount;
  if (claim.quantity > availableQuantity) {
    return { success: false, error: `Only ${availableQuantity} items available` };
  }

  // Check for duplicate claim by same guest
  const existingClaims = giftClaims.get(invitationId) || [];
  const duplicateClaim = existingClaims.find(
    (c) => c.giftId === giftId && c.guestPhone === claim.guestPhone && c.status !== 'cancelled'
  );

  if (duplicateClaim) {
    return { success: false, error: 'You have already claimed this gift' };
  }

  const now = new Date().toISOString();
  const newClaim: GiftClaim = {
    id: generateId('claim'),
    giftId,
    invitationId,
    guestName: claim.guestName,
    guestPhone: claim.guestPhone,
    quantity: claim.quantity,
    status: 'intended',
    message: claim.message,
    createdAt: now,
    updatedAt: now,
  };

  // Update gift claimed count
  gift.claimedCount += claim.quantity;
  gift.status = gift.claimedCount >= gift.quantity ? 'fully_claimed' : 'partially_claimed';
  gift.updatedAt = now;

  // Update registry
  registry.updatedAt = now;
  giftRegistries.set(invitationId, registry);

  // Store claim
  existingClaims.push(newClaim);
  giftClaims.set(invitationId, existingClaims);

  return { success: true, giftClaim: newClaim };
}

/**
 * Update gift claim status
 */
export function updateGiftClaimStatus(
  invitationId: string,
  claimId: string,
  status: GiftClaim['status']
): { success: boolean; error?: string } {
  const claims = giftClaims.get(invitationId) || [];
  const claim = claims.find((c) => c.id === claimId);

  if (!claim) {
    return { success: false, error: 'Claim not found' };
  }

  claim.status = status;
  claim.updatedAt = new Date().toISOString();
  giftClaims.set(invitationId, claims);

  // If cancelled, reduce claimed count
  if (status === 'cancelled') {
    const registry = giftRegistries.get(invitationId);
    if (registry) {
      const gift = registry.gifts.find((g) => g.id === claim.giftId);
      if (gift) {
        gift.claimedCount = Math.max(0, gift.claimedCount - claim.quantity);
        gift.status = gift.claimedCount === 0 ? 'available' : 'partially_claimed';
        gift.updatedAt = new Date().toISOString();
        registry.updatedAt = new Date().toISOString();
        giftRegistries.set(invitationId, registry);
      }
    }
  }

  return { success: true };
}

/**
 * Get claims for a specific gift
 */
export function getGiftClaims(
  invitationId: string,
  giftId: string
): GiftClaim[] {
  const claims = giftClaims.get(invitationId) || [];
  return claims.filter((c) => c.giftId === giftId && c.status !== 'cancelled');
}

/**
 * Get all claims for an invitation
 */
export function getAllGiftClaims(invitationId: string): GiftClaim[] {
  return giftClaims.get(invitationId) || [];
}

/**
 * Get gift registry with stats
 */
export function getGiftRegistryWithStats(
  invitationId: string,
  filters?: GiftRegistryFilters
): GiftRegistryResponse | null {
  const registry = giftRegistries.get(invitationId);
  if (!registry) return null;

  let gifts = [...registry.gifts];

  // Apply status filter
  if (filters?.status) {
    gifts = gifts.filter((g) => g.status === filters.status);
  }

  // Apply search filter
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    gifts = gifts.filter(
      (g) =>
        g.name.toLowerCase().includes(search) ||
        g.description?.toLowerCase().includes(search)
    );
  }

  // Calculate stats
  const allGifts = registry.gifts;
  const stats: GiftRegistryStats = {
    totalGifts: allGifts.length,
    totalItems: allGifts.reduce((sum, g) => sum + g.quantity, 0),
    claimedItems: allGifts.reduce((sum, g) => sum + g.claimedCount, 0),
    receivedItems: allGifts.filter((g) => g.status === 'received').length,
    cashGiftsReceived: 0,
  };

  // Apply pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const total = gifts.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedGifts = gifts.slice(start, start + limit);

  return {
    gifts: paginatedGifts,
    stats,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Mark gift as received
 */
export function markGiftReceived(
  invitationId: string,
  giftId: string
): boolean {
  const registry = giftRegistries.get(invitationId);
  if (!registry) return false;

  const gift = registry.gifts.find((g) => g.id === giftId);
  if (!gift) return false;

  gift.status = 'received';
  gift.updatedAt = new Date().toISOString();
  registry.updatedAt = new Date().toISOString();
  giftRegistries.set(invitationId, registry);

  return true;
}

/**
 * Seed demo gift registry
 */
export function seedDemoGiftRegistry(invitationId: string): GiftRegistry {
  const registry = upsertGiftRegistry(invitationId, {
    deliveryAddress: '15 Admiralty Way, Lekki Phase 1, Lagos',
    deliveryInstructions: 'Please call before delivery',
    cashGifts: {
      enabled: true,
      method: 'bank_transfer',
      bankName: 'Guaranty Trust Bank',
      accountName: 'Adaeze Okonkwo',
      accountNumber: '0123456789',
      instructions: 'Please include your name as reference',
    },
    gifts: [
      {
        name: 'Dinner Set',
        description: '6-piece ceramic dinner set',
        quantity: 2,
        link: 'https://example.com/dinner-set',
      },
      {
        name: 'Blender',
        description: 'High-speed kitchen blender',
        quantity: 1,
      },
      {
        name: 'Toaster',
        description: '4-slice bread toaster',
        quantity: 1,
      },
      {
        name: 'Coffee Maker',
        description: 'Programmable coffee maker',
        quantity: 1,
      },
      {
        name: 'Air Fryer',
        description: 'Large capacity air fryer',
        quantity: 1,
      },
    ],
  });

  // Add some demo claims
  claimGift(invitationId, registry.gifts[0].id, {
    guestName: 'Chidi Okonkwo',
    guestPhone: '08012345678',
    quantity: 1,
    message: 'Congratulations!',
  });

  claimGift(invitationId, registry.gifts[1].id, {
    guestName: 'Nneka Eze',
    guestPhone: '08098765432',
    quantity: 1,
  });

  return registry;
}
