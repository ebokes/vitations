import { InvitationData } from '@/lib/invitation-renderer/types';

// Mock invitation store for demo purposes
// In production, this would be fetched from Supabase
const mockInvitations: Map<string, InvitationData> = new Map([
  [
    'demo-wedding-001',
    {
      id: 'demo-wedding-001',
      templateId: 'tpl-elegant-001',
      templateVersion: 1,
      packageTier: 'ultimate',
      celebrant: {
        name: 'Adaeze Okonkwo',
        coCelebrantName: 'Emeka Nwosu',
        eventTitle: "Adaeze & Emeka's Wedding Celebration",
      },
      eventTypes: ['traditional_wedding', 'white_wedding', 'reception'],
      events: [
        {
          type: 'traditional_wedding',
          date: '2024-12-25',
          time: '10:00 AM',
          venue: 'Eko Hotels & Suites',
          address: '14 Adetokunbo Ademola St, Victoria Island, Lagos',
          description: 'Join us for a beautiful traditional Nigerian wedding ceremony.',
        },
        {
          type: 'reception',
          date: '2024-12-25',
          time: '4:00 PM',
          venue: 'Eko Hotels & Suites',
          address: '14 Adetokunbo Ademola St, Victoria Island, Lagos',
          description: 'Celebration continues with dinner, music, and dancing.',
        },
      ],
      features: {
        songLink: 'https://open.spotify.com/track/example',
        giftRegistryEnabled: true,
        cashGiftEnabled: true,
        gallery: ['/photos/1.jpg', '/photos/2.jpg', '/photos/3.jpg'],
        stories: [
          "We met at a mutual friend's party in 2019.",
          'Our first date was at a small café in Victoria Island.',
          'After 3 years of love and laughter, Emeka proposed!',
        ],
        livestreamUrl: 'https://youtube.com/live/example',
        livestreamPlatform: 'youtube',
        guestUploadsEnabled: true,
        dressCode: 'Traditional attire encouraged',
        specialInstructions: 'Please arrive 30 minutes before the ceremony.',
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      status: 'submitted',
    },
  ],
  [
    'demo-birthday-001',
    {
      id: 'demo-birthday-001',
      templateId: 'tpl-modern-003',
      templateVersion: 1,
      packageTier: 'essential',
      celebrant: {
        name: 'Tunde Bakare',
        eventTitle: "Tunde's 30th Birthday Celebration",
      },
      eventTypes: ['birthday'],
      events: [
        {
          type: 'birthday',
          date: '2024-12-31',
          time: '7:00 PM',
          venue: 'The Destination, Lekki',
          address: '15 Admiralty Way, Lekki Phase 1, Lagos',
        },
      ],
      features: {
        songLink: 'https://open.spotify.com/track/example',
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      status: 'submitted',
    },
  ],
]);

// Guest RSVP responses
export interface GuestRSVP {
  invitationId: string;
  guestName: string;
  guestPhone: string;
  attending: 'yes' | 'no' | null;
  submittedAt: string;
}

const guestRSVPs: Map<string, GuestRSVP[]> = new Map();

/**
 * Get invitation by ID (public access)
 */
export function getPublicInvitation(id: string): InvitationData | null {
  return mockInvitations.get(id) || null;
}

/**
 * Check if invitation is valid and accessible
 */
export function isInvitationAccessible(invitation: InvitationData): boolean {
  return invitation.status === 'submitted' || invitation.status === 'locked';
}

/**
 * Submit guest RSVP
 */
export function submitGuestRSVP(
  invitationId: string,
  guestName: string,
  guestPhone: string,
  attending: 'yes' | 'no'
): GuestRSVP {
  const rsvp: GuestRSVP = {
    invitationId,
    guestName,
    guestPhone,
    attending,
    submittedAt: new Date().toISOString(),
  };

  const existing = guestRSVPs.get(invitationId) || [];
  const existingIndex = existing.findIndex(
    (r) => r.guestPhone === guestPhone
  );

  if (existingIndex >= 0) {
    existing[existingIndex] = rsvp;
  } else {
    existing.push(rsvp);
  }

  guestRSVPs.set(invitationId, existing);
  return rsvp;
}

/**
 * Get guest RSVP by phone
 */
export function getGuestRSVP(
  invitationId: string,
  guestPhone: string
): GuestRSVP | null {
  const rsvps = guestRSVPs.get(invitationId) || [];
  return rsvps.find((r) => r.guestPhone === guestPhone) || null;
}

/**
 * Get all RSVPs for an invitation
 */
export function getInvitationRSVPs(invitationId: string): GuestRSVP[] {
  return guestRSVPs.get(invitationId) || [];
}
