'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ConfirmationDialogProps {
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function InvitationSubmissionConfirmation({
  onConfirm,
  onCancel,
  isLoading = false,
}: Omit<ConfirmationDialogProps, 'title' | 'message'>) {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
            <AlertCircle className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <CardTitle className="text-center text-2xl">
          Review Your Invitation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> Please take a moment to review your details carefully.
            Once your invitation is submitted, changes can only be made by our admin team.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-neutral-900">Before you submit:</h4>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
              <span>Double-check all names and spellings</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
              <span>Verify event dates, times, and locations</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
              <span>Review all uploaded images and media</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
              <span>Confirm your contact information is correct</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row-reverse">
          <Button
            variant="primary"
            size="lg"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            className="flex-1"
          >
            Submit Invitation
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Back to Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
