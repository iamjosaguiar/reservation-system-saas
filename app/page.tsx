import Link from 'next/link';
import { Calendar, Users, Clock, Smartphone, BarChart3, Shield, Zap, Globe } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Calendar,
      title: 'Smart Reservations',
      description: 'Intuitive booking system that makes it easy for customers to reserve tables online.',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Users,
      title: 'Table Management',
      description: 'Efficiently manage your venue\'s seating with our intelligent table allocation system.',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Instant notifications and updates keep you and your customers always in sync.',
      gradient: 'from-teal-500 to-cyan-600',
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Beautiful, responsive design that works perfectly on any device, anywhere.',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Gain insights into your business with comprehensive analytics and reporting.',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security ensures your data and your customers are always protected.',
      gradient: 'from-indigo-500 to-blue-600',
    },
  ];

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Unlimited reservations',
        'Basic table management',
        'Email notifications',
        'Mobile responsive',
        'Community support',
      ],
      cta: 'Get Started Free',
      highlighted: false,
    },
    {
      name: 'Premium',
      price: '$29',
      period: 'per month',
      description: 'For growing businesses',
      features: [
        'Everything in Free',
        'Remove branding',
        'SMS notifications',
        'Advanced analytics',
        'Priority support',
        'Custom domain',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-border/50 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">ReserveNow</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="btn-glow inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/20 text-primary font-medium text-sm shadow-sm">
              <Zap className="h-4 w-4" />
              <span>Transform Your Restaurant Reservations</span>
            </div>

            {/* Hero Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-gradient">Modern Reservation</span>
              <br />
              <span className="text-foreground">System for Your Venue</span>
            </h1>

            {/* Hero Description */}
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Streamline your restaurant, bar, or cafe with our powerful multi-tenant reservation platform.
              Beautiful, easy to use, and built for growth.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/signup"
                className="btn-glow group inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-2xl hover:shadow-primary/50 hover:-translate-y-1"
              >
                Start Free Today
                <Zap className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white border-2 border-border text-foreground font-bold text-lg hover:border-primary/50 hover:shadow-xl transition-all"
              >
                View Demo
                <Globe className="ml-2 h-5 w-5" />
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-white"></div>
                  ))}
                </div>
                <span className="font-medium">500+ venues trust us</span>
              </div>
              <div className="hidden md:block h-4 w-px bg-border"></div>
              <div className="hidden md:flex items-center gap-2">
                <div className="flex text-yellow-500">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="font-medium">5.0 rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed to help you manage reservations effortlessly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card-interactive group p-8"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free and upgrade when you're ready. No hidden fees, ever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-2xl scale-105'
                    : 'bg-white border-2 border-border shadow-lg'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-sm font-bold rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${plan.highlighted ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg ${plan.highlighted ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.highlighted ? 'bg-white/20' : 'bg-success-light'
                      }`}>
                        <svg className={`w-3 h-3 ${plan.highlighted ? 'text-white' : 'text-success'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className={plan.highlighted ? 'text-white' : 'text-foreground'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`btn-glow block w-full text-center px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl ${
                    plan.highlighted
                      ? 'bg-white text-primary hover:bg-gray-50'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl gradient-animated p-12 md:p-20 text-center shadow-2xl">
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Transform Your Reservations?
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Join hundreds of venues already using ReserveNow to streamline their booking process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/signup"
                  className="btn-glow inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary font-bold text-lg hover:bg-gray-50 transition-all shadow-2xl"
                >
                  Start Free Trial
                  <Zap className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white font-bold text-lg hover:bg-white/20 transition-all"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-gradient">ReserveNow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2025 ReserveNow. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
