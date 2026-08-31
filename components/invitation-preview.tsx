import { cn } from '@/lib/utils';

export interface InvitationPreviewProps {
  celebrantName: string;
  celebrantImage?: string;
  eventTitle: string;
  eventDate?: string;
  eventTime?: string;
  eventVenue?: string;
  className?: string;
}

export function InvitationPreview({
  celebrantName,
  celebrantImage,
  eventTitle,
  eventDate,
  eventTime,
  eventVenue,
  className,
}: InvitationPreviewProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm',
        className
      )}
    >
      {/* Celebrant Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
        {celebrantImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={celebrantImage}
            alt={`${celebrantName}'s invitation`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-6xl font-bold text-primary-600/30">
              {celebrantName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Event identity overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="mb-2 text-2xl font-bold">{eventTitle}</h2>
          <div className="flex flex-col gap-1 text-sm text-white/90">
            {celebrantName && <p>{celebrantName}</p>}
            {eventDate && <p>{eventDate}</p>}
            {eventTime && <p>{eventTime}</p>}
            {eventVenue && <p>{eventVenue}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface InvitationPreviewCardProps {
  celebrantName: string;
  celebrantImage?: string;
  eventTitle: string;
  eventDate?: string;
  className?: string;
}

export function InvitationPreviewCard({
  celebrantName,
  celebrantImage,
  eventTitle,
  eventDate,
  className,
}: InvitationPreviewCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm',
        className
      )}
    >
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary-100 to-primary-200">
        {celebrantImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={celebrantImage}
            alt={celebrantName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-lg font-bold text-primary-600/30">
              {celebrantName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </span>
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-neutral-900">{eventTitle}</h3>
        <p className="text-sm text-neutral-600">{celebrantName}</p>
        {eventDate && (
          <p className="text-xs text-neutral-500">{eventDate}</p>
        )}
      </div>
    </div>
  );
}
