'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Gift, Loader2, CheckCircle, CreditCard, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { GiftItem, GiftRegistry } from './types';
import { claimGift, getGiftRegistry } from './store';

const claimFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .max(15, 'Phone number is too long'),
  quantity: z.number().min(1).max(10),
  message: z.string().optional(),
});

type ClaimFormData = z.infer<typeof claimFormSchema>;

interface GiftClaimFormProps {
  invitationId: string;
  gift: GiftItem;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  onSuccess?: () => void;
}

export function GiftClaimForm({
  invitationId,
  gift,
  primaryColor = '#b88360',
  secondaryColor = '#f5f0ea',
  accentColor = '#a96a44',
  onSuccess,
}: GiftClaimFormProps) {
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimFormData>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const onSubmit = async (data: ClaimFormData) => {
    setError(null);
    const result = claimGift(invitationId, gift.id, {
      guestName: data.name,
      guestPhone: data.phone,
      quantity: data.quantity,
      message: data.message,
    });

    if (result.success) {
      setSubmitted(true);
      onSuccess?.();
    } else {
      setError(result.error || 'Failed to claim gift');
    }
  };

  if (submitted) {
    return (
      <div
        className="rounded-xl p-4 text-center"
        style={{ backgroundColor: secondaryColor }}
      >
        <CheckCircle className="mx-auto h-8 w-8" style={{ color: primaryColor }} />
        <p
          className="mt-2 text-sm font-medium"
          style={{ color: primaryColor }}
        >
          Thank you for claiming this gift!
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: secondaryColor }}
    >
      <h4
        className="font-medium"
        style={{ color: primaryColor }}
      >
        Claim: {gift.name}
      </h4>

      {error && (
        <div className="mt-2 rounded-lg bg-red-50 p-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={`claim-name-${gift.id}`}
              className="block text-xs font-medium"
              style={{ color: primaryColor }}
            >
              Your Name
            </label>
            <Input
              id={`claim-name-${gift.id}`}
              placeholder="Name"
              className="mt-1 text-sm"
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor={`claim-phone-${gift.id}`}
              className="block text-xs font-medium"
              style={{ color: primaryColor }}
            >
              Phone
            </label>
            <Input
              id={`claim-phone-${gift.id}`}
              type="tel"
              placeholder="08012345678"
              className="mt-1 text-sm"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor={`claim-qty-${gift.id}`}
            className="block text-xs font-medium"
            style={{ color: primaryColor }}
          >
            Quantity
          </label>
          <Input
            id={`claim-qty-${gift.id}`}
            type="number"
            min={1}
            max={gift.quantity - gift.claimedCount}
            className="mt-1 w-20 text-sm"
            {...register('quantity', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label
            htmlFor={`claim-msg-${gift.id}`}
            className="block text-xs font-medium"
            style={{ color: primaryColor }}
          >
            Message (Optional)
          </label>
          <Textarea
            id={`claim-msg-${gift.id}`}
            placeholder="Add a message..."
            rows={2}
            className="mt-1 text-sm"
            {...register('message')}
          />
        </div>

        <Button
          type="submit"
          size="sm"
          className="w-full"
          disabled={isSubmitting}
          style={{ backgroundColor: primaryColor }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Claiming...
            </>
          ) : (
            'Claim Gift'
          )}
        </Button>
      </form>
    </div>
  );
}

interface GiftRegistryGuestViewProps {
  invitationId: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function GiftRegistryGuestView({
  invitationId,
  primaryColor = '#b88360',
  secondaryColor = '#f5f0ea',
  accentColor = '#a96a44',
}: GiftRegistryGuestViewProps) {
  const [registry, setRegistry] = React.useState<GiftRegistry | null>(null);
  const [expandedGift, setExpandedGift] = React.useState<string | null>(null);

  React.useEffect(() => {
    const reg = getGiftRegistry(invitationId);
    setRegistry(reg);
  }, [invitationId]);

  if (!registry) return null;

  return (
    <div
      className="rounded-xl p-6"
      style={{ backgroundColor: 'white' }}
    >
      <div className="flex items-center gap-2">
        <Gift className="h-5 w-5" style={{ color: primaryColor }} />
        <h3
          className="text-lg font-bold"
          style={{ color: primaryColor }}
        >
          Gift Registry
        </h3>
      </div>

      {/* Delivery Address */}
      {registry.deliveryAddress && (
        <div
          className="mt-4 rounded-lg p-3"
          style={{ backgroundColor: secondaryColor }}
        >
          <p
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            Delivery Address
          </p>
          <p
            className="mt-1 text-sm"
            style={{ color: primaryColor }}
          >
            {registry.deliveryAddress}
          </p>
          {registry.deliveryInstructions && (
            <p
              className="mt-1 text-xs"
              style={{ color: accentColor }}
            >
              {registry.deliveryInstructions}
            </p>
          )}
        </div>
      )}

      {/* Gift Items */}
      {registry.gifts.length > 0 && (
        <div className="mt-4 space-y-3">
          <p
            className="text-sm font-medium"
            style={{ color: primaryColor }}
          >
            Gift Items
          </p>
          {registry.gifts.map((gift) => {
            const available = gift.quantity - gift.claimedCount;
            const isExpanded = expandedGift === gift.id;

            return (
              <div
                key={gift.id}
                className="rounded-lg border p-3"
                style={{ borderColor: secondaryColor }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: primaryColor }}
                    >
                      {gift.name}
                    </p>
                    {gift.description && (
                      <p
                        className="text-xs"
                        style={{ color: accentColor }}
                      >
                        {gift.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={gift.status === 'available' ? 'success' : 'warning'}
                      className="text-xs"
                    >
                      {available} of {gift.quantity} left
                    </Badge>
                  </div>
                </div>

                {available > 0 && (
                  <div className="mt-3">
                    {isExpanded ? (
                      <GiftClaimForm
                        invitationId={invitationId}
                        gift={gift}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        accentColor={accentColor}
                        onSuccess={() => setExpandedGift(null)}
                      />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedGift(gift.id)}
                        className="w-full"
                        style={{ borderColor: primaryColor, color: primaryColor }}
                      >
                        Claim This Gift
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cash Gift Option */}
      {registry.cashGifts.enabled && (
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" style={{ color: primaryColor }} />
            <p
              className="text-sm font-medium"
              style={{ color: primaryColor }}
            >
              Cash Gift
            </p>
          </div>

          <div
            className="mt-3 rounded-lg p-3"
            style={{ backgroundColor: secondaryColor }}
          >
            {registry.cashGifts.method === 'bank_transfer' && (
              <>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" style={{ color: accentColor }} />
                  <p
                    className="text-xs font-medium"
                    style={{ color: accentColor }}
                  >
                    Bank Transfer
                  </p>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm" style={{ color: primaryColor }}>
                    <span className="font-medium">Bank:</span> {registry.cashGifts.bankName}
                  </p>
                  <p className="text-sm" style={{ color: primaryColor }}>
                    <span className="font-medium">Account Name:</span> {registry.cashGifts.accountName}
                  </p>
                  <p className="text-sm" style={{ color: primaryColor }}>
                    <span className="font-medium">Account Number:</span> {registry.cashGifts.accountNumber}
                  </p>
                </div>
                {registry.cashGifts.instructions && (
                  <p
                    className="mt-2 text-xs italic"
                    style={{ color: accentColor }}
                  >
                    {registry.cashGifts.instructions}
                  </p>
                )}
              </>
            )}

            {registry.cashGifts.method === 'paystack' && (
              <a
                href={registry.cashGifts.paystackLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  size="sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  Send Cash Gift
                </Button>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
