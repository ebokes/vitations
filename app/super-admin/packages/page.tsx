'use client';

import { useState } from 'react';
import { useSuperAdminPackages, useUpdatePackage, useAddPackageFeature, useRemovePackageFeature } from '@/lib/super-admin/hooks';
import { LoadingSpinner } from '@/components/ui/loading';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Plus, Trash2 } from 'lucide-react';

function PackageEditModal({
  pkg,
  onClose,
}: {
  pkg: { id: string; name: string; description: string | null; priceNgn: number; isActive: boolean };
  onClose: () => void;
}) {
  const [name, setName] = useState(pkg.name);
  const [description, setDescription] = useState(pkg.description || '');
  const [price, setPrice] = useState(pkg.priceNgn.toString());
  const [isActive, setIsActive] = useState(pkg.isActive);
  const updateMutation = useUpdatePackage();

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      packageId: pkg.id,
      updates: {
        name,
        description,
        priceNgn: parseInt(price, 10),
        isActive,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Edit Package</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Price (NGN)</label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300"
            />
            <label className="text-sm text-neutral-700">Active</label>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={updateMutation.isPending} className="flex-1">
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddFeatureModal({
  packageId,
  onClose,
}: {
  packageId: string;
  onClose: () => void;
}) {
  const [featureKey, setFeatureKey] = useState('');
  const [featureName, setFeatureName] = useState('');
  const [featureDescription, setFeatureDescription] = useState('');
  const addMutation = useAddPackageFeature();

  const handleAdd = async () => {
    if (!featureKey.trim() || !featureName.trim()) return;
    await addMutation.mutateAsync({
      packageId,
      featureKey,
      featureName,
      featureDescription: featureDescription || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Add Feature</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Feature Key</label>
            <Input value={featureKey} onChange={(e) => setFeatureKey(e.target.value)} placeholder="e.g. video_rsvp" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Feature Name</label>
            <Input value={featureName} onChange={(e) => setFeatureName(e.target.value)} placeholder="e.g. Video RSVP" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <Textarea value={featureDescription} onChange={(e) => setFeatureDescription(e.target.value)} rows={2} />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={!featureKey.trim() || !featureName.trim() || addMutation.isPending} className="flex-1">
              {addMutation.isPending ? 'Adding...' : 'Add Feature'}
            </Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminPackagesPage() {
  const { data: packages, isLoading } = useSuperAdminPackages();
  const removeFeatureMutation = useRemovePackageFeature();
  const [editingPkg, setEditingPkg] = useState<string | null>(null);
  const [addingFeature, setAddingFeature] = useState<string | null>(null);

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>;
  }

  const pkgList = packages || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Package Management</h1>
        <p className="text-neutral-500">Configure packages, pricing, and features</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {pkgList.map((pkg) => (
          <Card key={pkg.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{pkg.name}</h3>
                  <p className="text-sm text-neutral-500 capitalize">{pkg.tier}</p>
                </div>
                <Badge variant={pkg.isActive ? 'success' : 'secondary'}>
                  {pkg.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <p className="text-3xl font-bold text-neutral-900 mb-2">
                ₦{pkg.priceNgn.toLocaleString()}
              </p>

              {pkg.description && (
                <p className="text-sm text-neutral-500 mb-4">{pkg.description}</p>
              )}

              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium text-neutral-700">Features:</p>
                {pkg.features.map((feature) => (
                  <div key={feature.id} className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">{feature.featureName}</span>
                    <button
                      onClick={() => removeFeatureMutation.mutateAsync({ featureId: feature.id, packageId: pkg.id })}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {pkg.features.length === 0 && (
                  <p className="text-sm text-neutral-400">No features configured</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditingPkg(pkg.id)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setAddingFeature(pkg.id)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Feature
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {pkgList.length === 0 && (
          <div className="col-span-full text-center py-12 text-neutral-500">
            No packages found
          </div>
        )}
      </div>

      {editingPkg && (
        <PackageEditModal
          pkg={pkgList.find((p) => p.id === editingPkg)!}
          onClose={() => setEditingPkg(null)}
        />
      )}

      {addingFeature && (
        <AddFeatureModal
          packageId={addingFeature}
          onClose={() => setAddingFeature(null)}
        />
      )}
    </div>
  );
}
