import { ReservationStatus } from '@prisma/client';

interface ReservationStatusBadgeProps {
  status: ReservationStatus;
}

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-green-100 text-green-800' },
  SEATED: { label: 'Seated', color: 'bg-blue-100 text-blue-800' },
  COMPLETED: { label: 'Completed', color: 'bg-gray-100 text-gray-800' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  NO_SHOW: { label: 'No Show', color: 'bg-orange-100 text-orange-800' },
};

export default function ReservationStatusBadge({ status }: ReservationStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}
    >
      {config.label}
    </span>
  );
}
