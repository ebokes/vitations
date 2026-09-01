import { z } from 'zod';

export const customInvitationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
});

export type CustomInvitationFormData = z.infer<typeof customInvitationSchema>;
