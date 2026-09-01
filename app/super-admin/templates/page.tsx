'use client';

import { useState } from 'react';
import { useSuperAdminTemplates, useUpdateTemplateStatus, useTemplateVersions, useSetTemplateVersionCurrent } from '@/lib/super-admin/hooks';
import { formatDesignType, formatTemplateStatus } from '@/lib/super-admin/types';
import { LoadingSpinner } from '@/components/ui/loading';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Eye, CheckCircle } from 'lucide-react';

function TemplateDetailModal({
  templateId,
  templateName,
  onClose,
}: {
  templateId: string;
  templateName: string;
  onClose: () => void;
}) {
  const { data: versions, isLoading } = useTemplateVersions(templateId);
  const setStatusMutation = useUpdateTemplateStatus();
  const setVersionCurrentMutation = useSetTemplateVersionCurrent();
  const [reason, setReason] = useState('');

  if (isLoading) return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">{templateName}</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-neutral-900 mb-3">Versions</h3>
            <div className="space-y-2">
              {(versions || []).map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-900">Version {v.versionNumber}</p>
                    <p className="text-xs text-neutral-500">{new Date(v.createdAt).toLocaleDateString()}</p>
                  </div>
                  {v.isCurrent ? (
                    <Badge variant="success">Current</Badge>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setVersionCurrentMutation.mutateAsync({ templateId, versionId: v.id })}
                      disabled={setVersionCurrentMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Set Current
                    </Button>
                  )}
                </div>
              ))}
              {(!versions || versions.length === 0) && (
                <p className="text-sm text-neutral-500">No versions found</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 mb-3">Status Actions</h3>
            <div className="space-y-3">
              <Textarea
                placeholder="Reason for status change (optional)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setStatusMutation.mutateAsync({ templateId, status: 'active', reason })}
                  disabled={setStatusMutation.isPending}
                >
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setStatusMutation.mutateAsync({ templateId, status: 'draft', reason })}
                  disabled={setStatusMutation.isPending}
                >
                  Set Draft
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setStatusMutation.mutateAsync({ templateId, status: 'retired', reason })}
                  disabled={setStatusMutation.isPending}
                >
                  Retire
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminTemplatesPage() {
  const { data: templates, isLoading } = useSuperAdminTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<{ id: string; name: string } | null>(null);

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>;
  }

  const templateList = templates || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Template Management</h1>
        <p className="text-neutral-500">Manage templates, versions, and publishing</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templateList.map((template) => {
          const statusInfo = formatTemplateStatus(template.status);
          return (
            <Card key={template.id}>
              <CardContent className="p-4">
                <div className="aspect-video bg-neutral-100 rounded-lg flex items-center justify-center mb-3">
                  {template.thumbnailUrl ? (
                    <img src={template.thumbnailUrl} alt={template.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-neutral-400 text-sm">No Preview</span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-neutral-900">{template.name}</h3>
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                  </div>

                  <div className="text-sm text-neutral-500 space-y-1">
                    <p>{formatDesignType(template.designType)}</p>
                    <p>Min: <span className="capitalize">{template.minimumPackage}</span></p>
                    {template.currentVersion && (
                      <p>Version: {template.currentVersion}</p>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedTemplate({ id: template.id, name: template.name })}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {templateList.length === 0 && (
          <div className="col-span-full text-center py-12 text-neutral-500">
            No templates found
          </div>
        )}
      </div>

      {selectedTemplate && (
        <TemplateDetailModal
          templateId={selectedTemplate.id}
          templateName={selectedTemplate.name}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  );
}
