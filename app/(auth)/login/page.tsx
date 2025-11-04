import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
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
              Welcome Back
            </h1>
            <p className="text-lg text-muted-foreground">
              Log in to manage your reservations
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden gradient-animated">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-center p-12 text-white">
          <div className="max-w-lg space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl">
              <Calendar className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-5xl font-bold leading-tight">
              Streamline Your Restaurant Reservations
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join thousands of venues using ReserveNow to manage their bookings efficiently and professionally.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-xl border-2 border-white"></div>
                ))}
              </div>
              <div className="text-sm">
                <div className="font-semibold">500+ Happy Customers</div>
                <div className="text-white/80">And counting...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
