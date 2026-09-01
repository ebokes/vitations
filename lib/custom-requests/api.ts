'use server';

import { createClient } from '@/lib/supabase/server';

export interface SubmitCustomRequestInput {
  name: string;
  phone: string;
  email: string;
}

export interface SubmitCustomRequestResult {
  success: boolean;
  error?: string;
  requestId?: string;
}

// Submit a custom invitation request (public, no auth required)
export async function submitCustomRequest(
  input: SubmitCustomRequestInput
): Promise<SubmitCustomRequestResult> {
  const supabase = await createClient();

  // Validate required fields
  if (!input.name || input.name.trim().length < 2) {
    return { success: false, error: 'Name must be at least 2 characters' };
  }

  if (!input.phone || input.phone.trim().length < 10) {
    return { success: false, error: 'Please enter a valid phone number' };
  }

  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { success: false, error: 'Please enter a valid email address' };
  }

  // Check for duplicate request (same email within last 24 hours)
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const { data: existing } = await supabase
    .from('custom_invitation_requests')
    .select('id')
    .eq('email', input.email.trim().toLowerCase())
    .gte('created_at', oneDayAgo.toISOString())
    .limit(1);

  if (existing && existing.length > 0) {
    return {
      success: false,
      error: 'You have already submitted a request recently. Our team will contact you soon.',
    };
  }

  // Insert the request
  const { data, error } = await supabase
    .from('custom_invitation_requests')
    .insert({
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email.trim().toLowerCase(),
      status: 'new',
    })
    .select('id')
    .single();

  if (error) {
    return { success: false, error: 'Failed to submit request. Please try again.' };
  }

  return { success: true, requestId: data.id };
}
