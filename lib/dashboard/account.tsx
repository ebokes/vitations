'use client';

import * as React from 'react';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { PackageBadge } from './layout';
import {
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  LogOut,
  Settings,
  CreditCard,
  History,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: string;
  lastSignInAt?: string;
}

export function DashboardAccount() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    fullName: user?.user_metadata?.full_name || '',
    phone: user?.phone || '',
  });
  const [notifications, setNotifications] = React.useState({
    emailRsvp: true,
    emailGift: true,
    emailMedia: true,
    emailLivestream: true,
    marketing: false,
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSuccess('Profile updated successfully');
    setSaving(false);
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setSuccess('Notification preferences saved');
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/signin');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Account Settings</h1>
        <p className="text-neutral-500">Manage your profile, notifications, and security</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-7 w-7 text-primary-600" />
            </div>
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              {success}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+234 800 000 0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-neutral-50"
            />
            <p className="text-xs text-neutral-500">
              Email cannot be changed. Contact support if you need to update it.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {user?.email_confirmed_at ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-600" />
              )}
              <span className="text-sm">
                {user?.email_confirmed_at ? 'Email verified' : 'Email not verified'}
              </span>
            </div>
            {!user?.email_confirmed_at && (
              <Button variant="outline" size="sm">
                Resend Verification
              </Button>
            )}
          </div>

          <Separator className="my-4" />

          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what emails you receive</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotificationToggle
            label="RSVP Updates"
            description="Get notified when guests RSVP to your invitation"
            checked={notifications.emailRsvp}
            onChange={(checked) => setNotifications(prev => ({ ...prev, emailRsvp: checked }))}
          />
          <NotificationToggle
            label="Gift Registry"
            description="Get notified when guests claim or mark gifts as received"
            checked={notifications.emailGift}
            onChange={(checked) => setNotifications(prev => ({ ...prev, emailGift: checked }))}
          />
          <NotificationToggle
            label="Media Uploads"
            description="Get notified when guests upload photos or videos"
            checked={notifications.emailMedia}
            onChange={(checked) => setNotifications(prev => ({ ...prev, emailMedia: checked }))}
          />
          <NotificationToggle
            label="Livestream Alerts"
            description="Get notified when livestream starts or ends"
            checked={notifications.emailLivestream}
            onChange={(checked) => setNotifications(prev => ({ ...prev, emailLivestream: checked }))}
          />
          <Separator />
          <NotificationToggle
            label="Marketing Emails"
            description="Receive tips, updates, and promotional offers"
            checked={notifications.marketing}
            onChange={(checked) => setNotifications(prev => ({ ...prev, marketing: checked }))}
          />

          <Button onClick={handleSaveNotifications} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Preferences'}
          </Button>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-neutral-400" />
              <div>
                <p className="font-medium text-neutral-900">Change Password</p>
                <p className="text-sm text-neutral-500">Update your account password</p>
              </div>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-neutral-400" />
              <div>
                <p className="font-medium text-neutral-900">Two-Factor Authentication</p>
                <p className="text-sm text-neutral-500">Add an extra layer of security (coming soon)</p>
              </div>
            </div>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-neutral-400" />
              <div>
                <p className="font-medium text-neutral-900">Login History</p>
                <p className="text-sm text-neutral-500">View recent login activity (coming soon)</p>
              </div>
            </div>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Billing Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>Billing & Payments</CardTitle>
              <CardDescription>View your payment history and invoices</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-neutral-400" />
              <div>
                <p className="font-medium text-neutral-900">Payment History</p>
                <p className="text-sm text-neutral-500">View all your transactions and invoices</p>
              </div>
            </div>
            <Button variant="outline">View History</Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-50">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-neutral-400" />
              <div>
                <p className="font-medium text-neutral-900">Invoices</p>
                <p className="text-sm text-neutral-500">Download PDF invoices for your records</p>
              </div>
            </div>
            <Button variant="outline">Download</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-700">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-50">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Sign Out Everywhere</p>
                <p className="text-sm text-red-700">Sign out of all devices and sessions</p>
              </div>
            </div>
            <Button variant="danger" onClick={handleSignOut}>Sign Out</Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-red-50">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Delete Account</p>
                <p className="text-sm text-red-700">Permanently delete your account and all data</p>
              </div>
            </div>
            <Button variant="danger" onClick={() => alert('Account deletion requires contacting support')}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your active subscription</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <PackageBadge tier="ultimate" />
              <p className="mt-2 text-sm text-neutral-500">Ultimate Plan - ₦350,000</p>
              <p className="text-xs text-neutral-400">Includes all features: livestream, guest uploads, 3D templates</p>
            </div>
            <Button variant="outline" asChild>
              <a href="/packages">Manage Plan</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationToggle({ 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  label: string; 
  description: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="font-medium text-neutral-900">{label}</p>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
}