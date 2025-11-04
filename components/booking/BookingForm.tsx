'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Loader2 } from 'lucide-react';

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
  const [partySize, setPartySize] = useState<string>('');

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
      partySize: parseInt(partySize),
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
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Reservation Submitted!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for your reservation. We'll send you a confirmation email shortly.
            </p>
            <Button
              onClick={() => router.push(`/${tenant.slug}`)}
              style={{ backgroundColor: tenant.primaryColor }}
            >
              Back to {tenant.name}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Make a Reservation</CardTitle>
        <CardDescription>
          Fill out the form below to book your table at {tenant.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                min={minDate.toISOString().split('T')[0]}
                max={maxDate.toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                name="time"
                type="time"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="partySize">Party Size *</Label>
            <Select value={partySize} onValueChange={setPartySize} required>
              <SelectTrigger>
                <SelectValue placeholder="Select number of guests" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>

            <div className="space-y-2">
              <Label htmlFor="guestName">Full Name *</Label>
              <Input
                id="guestName"
                name="guestName"
                type="text"
                required
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestEmail">Email *</Label>
              <Input
                id="guestEmail"
                name="guestEmail"
                type="email"
                required
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestPhone">Phone Number *</Label>
              <Input
                id="guestPhone"
                name="guestPhone"
                type="tel"
                required
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
              <Input
                id="specialRequests"
                name="specialRequests"
                placeholder="e.g., Window seat, high chair needed, celebrating birthday..."
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            style={{ backgroundColor: tenant.primaryColor }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Complete Reservation'
            )}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            By making a reservation, you agree to our terms and conditions.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
