'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInvitationForm } from '@/components/invitation-form-provider';
import { packageFeaturesSchema, PackageFeaturesData, LIVESTREAM_PLATFORM_LABELS } from '@/lib/validations/invitation';

export function PackageFeaturesStep() {
  const { formData, updateFormData, nextStep } = useInvitationForm();
  const tier = formData.packageTier;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PackageFeaturesData>({
    resolver: zodResolver(packageFeaturesSchema),
    defaultValues: {
      songLink: formData.features?.songLink || '',
      giftRegistryEnabled: formData.features?.giftRegistryEnabled || false,
      cashGiftEnabled: formData.features?.cashGiftEnabled || false,
      cashGiftDetails: formData.features?.cashGiftDetails || '',
      videoMessagesEnabled: formData.features?.videoMessagesEnabled || false,
      guestUploadsEnabled: formData.features?.guestUploadsEnabled || false,
      livestreamUrl: formData.features?.livestreamUrl || '',
      livestreamPlatform: formData.features?.livestreamPlatform || undefined,
      privatePageEnabled: formData.features?.privatePageEnabled || false,
    },
  });

  const showPremium = tier === 'premium' || tier === 'ultimate';
  const showUltimate = tier === 'ultimate';

  const onSubmit = (data: PackageFeaturesData) => {
    updateFormData({ features: data });
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Package Features</h2>
        <p className="mt-1 text-neutral-600">
          Configure the features included in your <span className="font-semibold capitalize">{tier}</span> package.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Essential: Song Link */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-neutral-900">Song Link</h3>
            <p className="text-sm text-neutral-600">Add a link to your favorite song.</p>
            <Input
              placeholder="https://open.spotify.com/..."
              className="mt-3"
              {...register('songLink')}
            />
          </CardContent>
        </Card>

        {/* Premium: Gift Registry */}
        {showPremium && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-neutral-900">Gift Registry</h3>
                <p className="text-sm text-neutral-600">Enable gift tracking for your guests.</p>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="giftRegistry" {...register('giftRegistryEnabled')} />
                <label htmlFor="giftRegistry" className="text-sm text-neutral-700">
                  Enable gift registry
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="cashGift" {...register('cashGiftEnabled')} />
                <label htmlFor="cashGift" className="text-sm text-neutral-700">
                  Enable cash gift option
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ultimate: Advanced Features */}
        {showUltimate && (
          <>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-neutral-900">Guest Uploads</h3>
                  <p className="text-sm text-neutral-600">Allow guests to upload photos (5MB max per file).</p>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="guestUploads" {...register('guestUploadsEnabled')} />
                  <label htmlFor="guestUploads" className="text-sm text-neutral-700">
                    Enable guest photo uploads
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-neutral-900">Livestream</h3>
                  <p className="text-sm text-neutral-600">Add a livestream link for remote guests.</p>
                </div>
                <Input
                  placeholder="https://youtube.com/live/..."
                  {...register('livestreamUrl')}
                />
                <div className="flex flex-wrap gap-3">
                  {Object.entries(LIVESTREAM_PLATFORM_LABELS).map(([value, label]) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={value}
                        className="h-4 w-4 text-primary-600"
                        {...register('livestreamPlatform')}
                      />
                      <span className="text-sm text-neutral-700">{label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Checkbox id="privatePage" {...register('privatePageEnabled')} />
                  <div>
                    <label htmlFor="privatePage" className="font-semibold text-neutral-900">
                      Private Page
                    </label>
                    <p className="text-sm text-neutral-600">Create a private page with restricted access.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!showPremium && (
          <div className="rounded-lg bg-neutral-50 p-4">
            <p className="text-sm text-neutral-600">
              <Badge variant="secondary" className="mr-2">Premium</Badge>
              Upgrade to Premium to unlock gift registry, gallery, and more features.
            </p>
          </div>
        )}

        {!showUltimate && showPremium && (
          <div className="rounded-lg bg-neutral-50 p-4">
            <p className="text-sm text-neutral-600">
              <Badge variant="secondary" className="mr-2">Ultimate</Badge>
              Upgrade to Ultimate to unlock guest uploads, livestream, and private pages.
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </div>
  );
}
