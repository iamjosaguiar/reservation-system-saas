'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReservationStatus } from '@prisma/client';

interface ReservationActionsProps {
  reservationId: string;
  status: ReservationStatus;
}

export default function ReservationActions({ reservationId, status }: ReservationActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function updateStatus(newStatus: ReservationStatus) {
    if (!confirm(`Are you sure you want to mark this reservation as ${newStatus.toLowerCase()}?`)) {
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update reservation');
      }

      router.refresh();
    } catch (error) {
      alert('Failed to update reservation. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this reservation? This action cannot be undone.')) {
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete reservation');
      }

      router.refresh();
    } catch (error) {
      alert('Failed to delete reservation. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="flex gap-2 justify-end">
      {status === 'PENDING' && (
        <button
          onClick={() => updateStatus('CONFIRMED')}
          disabled={isUpdating}
          className="text-green-600 hover:text-green-900 disabled:opacity-50"
        >
          Confirm
        </button>
      )}
      {status === 'CONFIRMED' && (
        <button
          onClick={() => updateStatus('SEATED')}
          disabled={isUpdating}
          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
        >
          Seat
        </button>
      )}
      {status === 'SEATED' && (
        <button
          onClick={() => updateStatus('COMPLETED')}
          disabled={isUpdating}
          className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
        >
          Complete
        </button>
      )}
      {(status === 'PENDING' || status === 'CONFIRMED') && (
        <button
          onClick={() => updateStatus('CANCELLED')}
          disabled={isUpdating}
          className="text-red-600 hover:text-red-900 disabled:opacity-50"
        >
          Cancel
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={isUpdating}
        className="text-red-600 hover:text-red-900 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
