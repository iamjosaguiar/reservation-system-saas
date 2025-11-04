import SignupForm from '@/components/auth/SignupForm';
import Link from 'next/link';
import { Calendar, Check } from 'lucide-react';

export default function SignupPage() {
  const benefits = [
    'Unlimited reservations',
    'Easy table management',
    'Email notifications',
    'Mobile-friendly design',
    'Free forever plan',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden gradient-animated">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-center p-12 text-white">
          <div className="max-w-lg space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl">
              <Calendar className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-5xl font-bold leading-tight">
              Start Managing Reservations Today
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Everything you need to run a professional reservation system for your venue.
            </p>
            <div className="space-y-3 pt-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">ReserveNow</span>
          </Link>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              Create Your Account
            </h1>
            <p className="text-lg text-muted-foreground">
              Start managing reservations for your business
            </p>
          </div>

          {/* Form */}
          <SignupForm />

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
