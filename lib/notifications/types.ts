// Notification types for the platform
export type NotificationType =
  | 'payment_successful'
  | 'payment_failed'
  | 'invitation_submitted'
  | 'invitation_approved'
  | 'invitation_ready'
  | 'admin_unlock'
  | 'admin_update'
  | 'guest_rsvp'
  | 'gift_claimed'
  | 'gift_received'
  | 'media_approved'
  | 'media_rejected'
  | 'livestream_activation'
  | 'custom_request_new'
  | 'custom_request_update';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

// Notification template definitions
export interface NotificationTemplate {
  type: NotificationType;
  title: string;
  message: string;
  icon: string;
  color: string;
}

export const NOTIFICATION_TEMPLATES: Record<NotificationType, NotificationTemplate> = {
  payment_successful: {
    type: 'payment_successful',
    title: 'Payment Successful',
    message: 'Your payment has been processed successfully.',
    icon: 'CheckCircle',
    color: 'text-green-600',
  },
  payment_failed: {
    type: 'payment_failed',
    title: 'Payment Failed',
    message: 'Your payment could not be processed. Please try again.',
    icon: 'XCircle',
    color: 'text-red-600',
  },
  invitation_submitted: {
    type: 'invitation_submitted',
    title: 'Invitation Submitted',
    message: 'Your invitation has been submitted for review.',
    icon: 'Send',
    color: 'text-blue-600',
  },
  invitation_approved: {
    type: 'invitation_approved',
    title: 'Invitation Approved',
    message: 'Your invitation has been approved and is ready to share.',
    icon: 'CheckCircle',
    color: 'text-green-600',
  },
  invitation_ready: {
    type: 'invitation_ready',
    title: 'Invitation Ready',
    message: 'Your invitation is now live and ready to share with guests.',
    icon: 'Sparkles',
    color: 'text-primary-600',
  },
  admin_unlock: {
    type: 'admin_unlock',
    title: 'Invitation Unlocked',
    message: 'An admin has unlocked your invitation for editing.',
    icon: 'Unlock',
    color: 'text-amber-600',
  },
  admin_update: {
    type: 'admin_update',
    title: 'Invitation Updated',
    message: 'An admin has made changes to your invitation.',
    icon: 'Edit',
    color: 'text-amber-600',
  },
  guest_rsvp: {
    type: 'guest_rsvp',
    title: 'New RSVP',
    message: 'A guest has responded to your invitation.',
    icon: 'Users',
    color: 'text-purple-600',
  },
  gift_claimed: {
    type: 'gift_claimed',
    title: 'Gift Claimed',
    message: 'A guest has claimed a gift from your registry.',
    icon: 'Gift',
    color: 'text-pink-600',
  },
  gift_received: {
    type: 'gift_received',
    title: 'Gift Received',
    message: 'A guest has marked a gift as delivered.',
    icon: 'Package',
    color: 'text-green-600',
  },
  media_approved: {
    type: 'media_approved',
    title: 'Media Approved',
    message: 'Your uploaded media has been approved.',
    icon: 'Image',
    color: 'text-green-600',
  },
  media_rejected: {
    type: 'media_rejected',
    title: 'Media Rejected',
    message: 'Your uploaded media was not approved.',
    icon: 'XCircle',
    color: 'text-red-600',
  },
  livestream_activation: {
    type: 'livestream_activation',
    title: 'Livestream Active',
    message: 'Your event livestream is now active.',
    icon: 'Video',
    color: 'text-red-600',
  },
  custom_request_new: {
    type: 'custom_request_new',
    title: 'New Custom Request',
    message: 'A new custom invitation request has been submitted.',
    icon: 'FileText',
    color: 'text-blue-600',
  },
  custom_request_update: {
    type: 'custom_request_update',
    title: 'Custom Request Updated',
    message: 'A custom invitation request has been updated.',
    icon: 'FileText',
    color: 'text-blue-600',
  },
};

// Get notification template with defaults
export function getNotificationTemplate(type: NotificationType): NotificationTemplate {
  return NOTIFICATION_TEMPLATES[type] || {
    type,
    title: 'Notification',
    message: 'You have a new notification.',
    icon: 'Bell',
    color: 'text-neutral-600',
  };
}
