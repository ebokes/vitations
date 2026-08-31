export type RSVPStatus = 'attending' | 'not_attending' | 'maybe';

export interface RSVPSubmission {
  invitationId: string;
  guestName: string;
  guestPhone: string;
  status: RSVPStatus;
  attendeeCount?: number;
  message?: string;
}

export interface RSVPRecord extends RSVPSubmission {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface RSVPStats {
  total: number;
  attending: number;
  notAttending: number;
  maybe: number;
  totalAttendees: number;
}

export interface RSVPListFilters {
  status?: RSVPStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface RSVPListResponse {
  rsvps: RSVPRecord[];
  stats: RSVPStats;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
