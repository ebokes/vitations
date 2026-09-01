'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from './hooks';
import { getNotificationTemplate } from './types';
import type { NotificationType } from './types';
import { CheckCircle, XCircle, Send, Sparkles, Unlock, Edit, Users, Gift, Package, Image, Video, FileText, Bell } from 'lucide-react';

function getNotificationIcon(type: NotificationType) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    CheckCircle,
    XCircle,
    Send,
    Sparkles,
    Unlock,
    Edit,
    Users,
    Gift,
    Package,
    Image,
    Video,
    FileText,
    Bell,
  };

  const template = getNotificationTemplate(type);
  const Icon = icons[template.icon] || Bell;
  return Icon;
}

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
  const { data } = useNotifications({ unreadOnly: true, limit: 100 });
  const unreadCount = data?.unreadCount || 0;
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <NotificationDropdown onClose={() => setOpen(false)} />
        </>
      )}
    </div>
  );
}

interface NotificationDropdownProps {
  onClose: () => void;
}

function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { data, isLoading } = useNotifications({ limit: 10 });
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notifications = data?.data || [];

  return (
    <div className="absolute right-0 top-full mt-2 z-50 w-80 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
        <h3 className="font-semibold text-neutral-900">Notifications</h3>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={() => markAllReadMutation.mutate()}
            className="text-xs text-primary-600 hover:text-primary-700"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-neutral-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-8 w-8 mx-auto text-neutral-300 mb-2" />
            <p className="text-sm text-neutral-500">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const template = getNotificationTemplate(notification.type);
            return (
              <button
                key={notification.id}
                onClick={() => {
                  if (!notification.isRead) {
                    markReadMutation.mutate(notification.id);
                  }
                }}
                className={cn(
                  'w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0',
                  !notification.isRead && 'bg-primary-50'
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', template.color)} />
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-medium', notification.isRead ? 'text-neutral-700' : 'text-neutral-900')}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">{notification.message}</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <span className="h-2 w-2 rounded-full bg-primary-500 flex-shrink-0 mt-2" />
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
