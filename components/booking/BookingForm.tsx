'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BookingFormProps {
  tenant: {
    id: string;
    name: string;
    slug: string;
    primaryColor: string;
    businessHours: Array<{
      dayOfWeek: number;
      openTime: string;
      closeTime: string;
      isClosed: boolean;
    }>;
    tables: Array<{
      id: string;
      name: string;
      capacity: number;
    }>;
    settings: {
      maxAdvanceBookingDays: number;
      minAdvanceBookingHours: number;
    } | null;
  };
}

export default function BookingForm({ tenant }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const dateTime = new Date(`${date}T${time}`);

    const data = {
      tenantId: tenant.id,
      date: dateTime.toISOString(),
      time: dateTime.toISOString(),
      partySize: parseInt(formData.get('partySize') as string),
      guestName: formData.get('guestName'),
      guestEmail: formData.get('guestEmail'),
      guestPhone: formData.get('guestPhone'),
      specialRequests: formData.get('specialRequests'),
    };

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Booking failed');
      }

      setSuccess(true);
      // Optionally redirect to confirmation page
      setTimeout(() => {
        router.push(`/${tenant.slug}?booking=success`);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  // Calculate min and max dates
  const today = new Date();
  const minDate = new Date(today.getTime() + (tenant.settings?.minAdvanceBookingHours || 2) * 60 * 60 * 1000);
  const maxDate = new Date(today.getTime() + (tenant.settings?.maxAdvanceBookingDays || 30) * 24 * 60 * 60 * 1000);

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Reservation Submitted!</h3>
        <p className="text-gray-600 mb-4">
          Thank you for your reservation. We'll send you a confirmation email shortly.
        </p>
        <a
          href={`/${tenant.slug}`}
          className="inline-block px-6 py-3 text-white rounded-lg"
          style={{ backgroundColor: tenant.primaryColor }}
        >
          Back to {tenant.name}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            min={minDate.toISOString().split('T')[0]}
            max={maxDate.toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
            Time *
          </label>
          <input
            id="time"
            name="time"
            type="time"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="partySize" className="block text-sm font-medium text-gray-700 mb-1">
          Party Size *
        </label>
        <select
          id="partySize"
          name="partySize"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Select number of guests</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'Guest' : 'Guests'}
            </option>
          ))}
        </select>
      </div>

      <hr className="my-6" />

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              id="guestName"
              name="guestName"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              id="guestEmail"
              name="guestEmail"
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              id="guestPhone"
              name="guestPhone"
              type="tel"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
              Special Requests (Optional)
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., Window seat, high chair needed, celebrating birthday..."
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: tenant.primaryColor }}
      >
        {loading ? 'Submitting...' : 'Complete Reservation'}
      </button>

      <p className="text-sm text-gray-500 text-center">
        By making a reservation, you agree to our terms and conditions.
      </p>
    </form>
  );
}
