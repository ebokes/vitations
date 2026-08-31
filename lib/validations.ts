import { z } from 'zod';

export const eventFormSchema = z.object({
  celebrantName: z
    .string()
    .min(2, 'Celebrant name must be at least 2 characters')
    .max(100, 'Celebrant name must be at most 100 characters'),
  eventTitle: z
    .string()
    .min(2, 'Event title must be at least 2 characters')
    .max(100, 'Event title must be at most 100 characters'),
  eventDate: z.string().min(1, 'Event date is required'),
  eventTime: z.string().optional(),
  eventVenue: z.string().optional(),
  eventDescription: z.string().optional(),
});

export type EventFormData = z.infer<typeof eventFormSchema>;

export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
