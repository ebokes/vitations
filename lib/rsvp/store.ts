import {
  RSVPRecord,
  RSVPSubmission,
  RSVPStats,
  RSVPListFilters,
  RSVPListResponse,
} from './types';

// In-memory store for demo purposes
// In production, this would be Supabase
const rsvpStore: Map<string, RSVPRecord[]> = new Map();

// Counter for IDs
let idCounter = 1;

/**
 * Generate unique RSVP ID
 */
function generateId(): string {
  return `rsvp-${Date.now()}-${idCounter++}`;
}

/**
 * Validate RSVP submission
 */
export function validateRSVPSubmission(submission: RSVPSubmission): {
  valid: boolean;
  error?: string;
} {
  if (!submission.invitationId) {
    return { valid: false, error: 'Invitation ID is required' };
  }

  if (!submission.guestName || submission.guestName.length < 2) {
    return { valid: false, error: 'Guest name must be at least 2 characters' };
  }

  if (!submission.guestPhone || submission.guestPhone.length < 10) {
    return { valid: false, error: 'Please enter a valid phone number' };
  }

  if (!['attending', 'not_attending', 'maybe'].includes(submission.status)) {
    return { valid: false, error: 'Invalid RSVP status' };
  }

  if (submission.attendeeCount !== undefined) {
    if (submission.attendeeCount < 1 || submission.attendeeCount > 20) {
      return { valid: false, error: 'Attendee count must be between 1 and 20' };
    }
  }

  return { valid: true };
}

/**
 * Submit or update RSVP
 */
export function submitRSVP(submission: RSVPSubmission): {
  success: boolean;
  rsvp?: RSVPRecord;
  error?: string;
  updated?: boolean;
} {
  const validation = validateRSVPSubmission(submission);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const existingRsvps = rsvpStore.get(submission.invitationId) || [];

  // Check for duplicate by phone number
  const existingIndex = existingRsvps.findIndex(
    (r) => r.guestPhone === submission.guestPhone
  );

  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    // Update existing RSVP
    const updated: RSVPRecord = {
      ...existingRsvps[existingIndex],
      ...submission,
      updatedAt: now,
    };
    existingRsvps[existingIndex] = updated;
    rsvpStore.set(submission.invitationId, existingRsvps);
    return { success: true, rsvp: updated, updated: true };
  }

  // Create new RSVP
  const newRsvp: RSVPRecord = {
    ...submission,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };

  existingRsvps.push(newRsvp);
  rsvpStore.set(submission.invitationId, existingRsvps);

  return { success: true, rsvp: newRsvp };
}

/**
 * Get RSVP by ID
 */
export function getRSVPById(invitationId: string, rsvpId: string): RSVPRecord | null {
  const rsvps = rsvpStore.get(invitationId) || [];
  return rsvps.find((r) => r.id === rsvpId) || null;
}

/**
 * Get RSVP by guest phone
 */
export function getRSVPByPhone(
  invitationId: string,
  guestPhone: string
): RSVPRecord | null {
  const rsvps = rsvpStore.get(invitationId) || [];
  return rsvps.find((r) => r.guestPhone === guestPhone) || null;
}

/**
 * Get all RSVPs for an invitation
 */
export function getRSVPsForInvitation(
  invitationId: string,
  filters?: RSVPListFilters
): RSVPListResponse {
  let rsvps = rsvpStore.get(invitationId) || [];

  // Apply status filter
  if (filters?.status) {
    rsvps = rsvps.filter((r) => r.status === filters.status);
  }

  // Apply search filter
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    rsvps = rsvps.filter(
      (r) =>
        r.guestName.toLowerCase().includes(search) ||
        r.guestPhone.includes(search)
    );
  }

  // Calculate stats (before pagination)
  const allRsvps = rsvpStore.get(invitationId) || [];
  const stats = calculateStats(allRsvps);

  // Apply pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const total = rsvps.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedRsvps = rsvps.slice(start, start + limit);

  return {
    rsvps: paginatedRsvps,
    stats,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Calculate RSVP statistics
 */
export function calculateStats(rsvps: RSVPRecord[]): RSVPStats {
  const stats: RSVPStats = {
    total: rsvps.length,
    attending: 0,
    notAttending: 0,
    maybe: 0,
    totalAttendees: 0,
  };

  for (const rsvp of rsvps) {
    switch (rsvp.status) {
      case 'attending':
        stats.attending++;
        stats.totalAttendees += rsvp.attendeeCount || 1;
        break;
      case 'not_attending':
        stats.notAttending++;
        break;
      case 'maybe':
        stats.maybe++;
        break;
    }
  }

  return stats;
}

/**
 * Delete RSVP (for admin/guest cancellation)
 */
export function deleteRSVP(
  invitationId: string,
  rsvpId: string
): { success: boolean; error?: string } {
  const rsvps = rsvpStore.get(invitationId) || [];
  const index = rsvps.findIndex((r) => r.id === rsvpId);

  if (index === -1) {
    return { success: false, error: 'RSVP not found' };
  }

  rsvps.splice(index, 1);
  rsvpStore.set(invitationId, rsvps);

  return { success: true };
}

/**
 * Seed demo RSVPs for testing
 */
export function seedDemoRSVPs(invitationId: string): void {
  const demoRsvps: RSVPSubmission[] = [
    {
      invitationId,
      guestName: 'Chidi Okonkwo',
      guestPhone: '08012345678',
      status: 'attending',
      attendeeCount: 3,
      message: 'Looking forward to the celebration!',
    },
    {
      invitationId,
      guestName: 'Nneka Eze',
      guestPhone: '08098765432',
      status: 'attending',
      attendeeCount: 2,
    },
    {
      invitationId,
      guestName: 'Tunde Bakare',
      guestPhone: '08055555555',
      status: 'maybe',
      message: 'Will try to make it!',
    },
    {
      invitationId,
      guestName: 'Amina Mohammed',
      guestPhone: '08011111111',
      status: 'not_attending',
      message: 'Sorry, I will be traveling.',
    },
    {
      invitationId,
      guestName: 'Emeka Nwosu',
      guestPhone: '08022222222',
      status: 'attending',
      attendeeCount: 1,
    },
  ];

  for (const rsvp of demoRsvps) {
    submitRSVP(rsvp);
  }
}
