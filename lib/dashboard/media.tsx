'use client';

import * as React from 'react';
import { useMediaStats } from './hooks';
import { useCustomerInvitation } from './hooks';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Image,
  Video,
  CheckCircle,
  Clock,
  Plus,
  Upload,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  AlertCircle,
  GalleryThumbnails,
  ImageIcon,
} from 'lucide-react';

interface MediaItem {
  id: string;
  fileName: string;
  type: 'image' | 'video';
  source: 'customer' | 'guest';
  status: 'pending' | 'approved' | 'rejected';
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  fileSize: number;
  uploadedBy?: string;
  createdAt: string;
}

function StatCard({ title, value, icon, color }: { 
  title: string; 
  value: number; 
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">{title}</p>
            <p className="mt-1 text-3xl font-bold text-neutral-900">{value}</p>
          </div>
          <div className={cn('p-3 rounded-xl', color)}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardMedia() {
  const { data: invitation } = useCustomerInvitation();
  const { data: stats, isLoading } = useMediaStats(invitation?.id || null);

  // Hooks must be called unconditionally
  const [activeTab, setActiveTab] = React.useState<'all' | 'customer' | 'guest' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  if (!invitation) {
    return (
      <div className="text-center py-16">
        <Image className="mx-auto h-16 w-16 text-neutral-300" />
        <h2 className="mt-4 text-2xl font-bold text-neutral-900">No Invitation</h2>
        <p className="mt-2 text-neutral-500">Create an invitation to upload media.</p>
      </div>
    );
  }

  if (invitation.packageTier === 'essential') {
    return (
      <div className="text-center py-16">
        <Image className="mx-auto h-16 w-16 text-neutral-300" />
        <h2 className="mt-4 text-2xl font-bold text-neutral-900">Media Gallery Requires Premium</h2>
        <p className="mt-2 text-neutral-500 max-w-md mx-auto">
          Upgrade to Premium (₦150,000) or Ultimate (₦350,000) to enable photo & video gallery.
        </p>
        <Button asChild className="mt-6" size="lg">
          <a href="/packages">View Packages</a>
        </Button>
      </div>
    );
  }

  // Mock media data
  const mockMedia: MediaItem[] = [
    { id: '1', fileName: 'couple-portrait.jpg', type: 'image', source: 'customer', status: 'approved', url: 'https://picsum.photos/800/600', thumbnailUrl: 'https://picsum.photos/200/150', caption: 'Our engagement photos', fileSize: 2400000, uploadedBy: 'Bride', createdAt: '2024-01-15T10:00:00Z' },
    { id: '2', fileName: 'venue-walkthrough.mp4', type: 'video', source: 'customer', status: 'approved', url: 'https://example.com/video.mp4', thumbnailUrl: 'https://picsum.photos/200/150', caption: 'Venue tour', fileSize: 15000000, uploadedBy: 'Groom', createdAt: '2024-01-16T10:00:00Z' },
    { id: '3', fileName: 'guest-photo-1.jpg', type: 'image', source: 'guest', status: 'pending', url: 'https://picsum.photos/800/600', thumbnailUrl: 'https://picsum.photos/200/150', caption: 'From Auntie Grace', fileSize: 3200000, uploadedBy: 'Grace O.', createdAt: '2024-01-17T14:30:00Z' },
    { id: '4', fileName: 'pre-wedding-shoot.jpg', type: 'image', source: 'customer', status: 'approved', url: 'https://picsum.photos/800/600', thumbnailUrl: 'https://picsum.photos/200/150', caption: 'Pre-wedding session', fileSize: 4100000, uploadedBy: 'Bride', createdAt: '2024-01-18T09:00:00Z' },
    { id: '5', fileName: 'guest-video-1.mp4', type: 'video', source: 'guest', status: 'rejected', url: 'https://example.com/video2.mp4', thumbnailUrl: 'https://picsum.photos/200/150', caption: 'Too long', fileSize: 25000000, uploadedBy: 'Friend', createdAt: '2024-01-19T16:00:00Z' },
    { id: '6', fileName: 'guest-photo-2.jpg', type: 'image', source: 'guest', status: 'pending', url: 'https://picsum.photos/800/600', thumbnailUrl: 'https://picsum.photos/200/150', caption: 'From work colleagues', fileSize: 1800000, uploadedBy: 'Team', createdAt: '2024-01-20T11:00:00Z' },
  ];

  const filteredMedia = mockMedia.filter(m => {
    if (activeTab === 'customer' && m.source !== 'customer') return false;
    if (activeTab === 'guest' && m.source !== 'guest') return false;
    if (activeTab === 'pending' && m.status !== 'pending') return false;
    if (searchQuery && !m.fileName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !m.caption?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Photos & Videos</h1>
          <p className="text-neutral-500">Manage your event media gallery</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Media
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Media" value={mockMedia.length} icon={<GalleryThumbnails className="h-6 w-6" />} color="bg-blue-100 text-blue-600" />
        <StatCard title="Your Uploads" value={mockMedia.filter(m => m.source === 'customer').length} icon={<Upload className="h-6 w-6" />} color="bg-purple-100 text-purple-600" />
        <StatCard title="Guest Uploads" value={mockMedia.filter(m => m.source === 'guest').length} icon={<Image className="h-6 w-6" />} color="bg-green-100 text-green-600" />
        <StatCard title="Pending Review" value={mockMedia.filter(m => m.status === 'pending').length} icon={<Clock className="h-6 w-6" />} color="bg-amber-100 text-amber-600" />
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({mockMedia.length})</TabsTrigger>
              <TabsTrigger value="customer">Your Uploads ({mockMedia.filter(m => m.source === 'customer').length})</TabsTrigger>
              <TabsTrigger value="guest">Guest Uploads ({mockMedia.filter(m => m.source === 'guest').length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({mockMedia.filter(m => m.status === 'pending').length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input placeholder="Search by filename or caption..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="p-12 text-center">
              <Image className="mx-auto h-12 w-12 text-neutral-300" />
              <h3 className="mt-4 text-lg font-medium text-neutral-900">No media found</h3>
              <p className="mt-1 text-neutral-500">Upload photos and videos to build your gallery.</p>
              <Button className="mt-4"><Upload className="mr-2 h-4 w-4" /> Upload Media</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-4">
              {filteredMedia.map((media) => (
                <div key={media.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100">
                    {media.type === 'image' ? (
                      <img 
                        src={media.thumbnailUrl || media.url} 
                        alt={media.caption || media.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black">
                        <Video className="h-12 w-12 text-white" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <div className="bg-white/90 p-2 rounded-full">
                            <Video className="h-5 w-5 text-neutral-900" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/90 text-red-600"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge variant={
                        media.status === 'approved' ? 'success' :
                        media.status === 'pending' ? 'secondary' : 'danger'
                      } className="text-xs">
                        {media.status.charAt(0).toUpperCase() + media.status.slice(1)}
                      </Badge>
                    </div>
                    
                    {/* Source Badge */}
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 gap-1">
                        {media.source === 'guest' ? <Image className="h-2.5 w-2.5" /> : <Upload className="h-2.5 w-2.5" />}
                        {media.source === 'guest' ? 'Guest' : 'You'}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-2 px-1">
                    <p className="text-xs font-medium text-neutral-900 truncate">{media.fileName}</p>
                    <p className="text-[10px] text-neutral-500">{formatFileSize(media.fileSize)} • {new Date(media.createdAt).toLocaleDateString()}</p>
                    {media.caption && <p className="text-[10px] text-neutral-500 italic truncate">{media.caption}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Approval Notice */}
      {mockMedia.filter(m => m.status === 'pending').length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800">{mockMedia.filter(m => m.status === 'pending').length} guest uploads pending review</p>
              <p className="text-sm text-amber-700">Switch to the &ldquo;Pending&rdquo; tab to approve or reject guest media.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}