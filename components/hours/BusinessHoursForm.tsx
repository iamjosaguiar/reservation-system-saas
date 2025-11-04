'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BusinessHour {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

interface BusinessHoursFormProps {
  businessHours: BusinessHour[];
  tenantId: string;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function BusinessHoursForm({ businessHours, tenantId }: BusinessHoursFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hours, setHours] = useState<BusinessHour[]>(businessHours);

  const updateDay = (dayOfWeek: number, field: keyof BusinessHour, value: any) => {
    setHours((prevHours) =>
      prevHours.map((h) =>
        h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h
      )
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/business-hours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update hours');
      }

      router.refresh();
      alert('Business hours updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {hours.map((hour) => (
          <div key={hour.dayOfWeek} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="w-32">
                <span className="font-medium text-gray-900">
                  {dayNames[hour.dayOfWeek]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!hour.isClosed}
                  onChange={(e) => updateDay(hour.dayOfWeek, 'isClosed', !e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">Open</label>
              </div>

              {!hour.isClosed && (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">From:</label>
                    <input
                      type="time"
                      value={hour.openTime}
                      onChange={(e) => updateDay(hour.dayOfWeek, 'openTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">To:</label>
                    <input
                      type="time"
                      value={hour.closeTime}
                      onChange={(e) => updateDay(hour.dayOfWeek, 'closeTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {hour.isClosed && (
                <span className="text-red-600 text-sm">Closed</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Business Hours'}
        </button>
      </div>
    </form>
  );
}
