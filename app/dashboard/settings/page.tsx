import { requireTenant } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import SettingsForm from '@/components/settings/SettingsForm';
import EmbedCodeGenerator from '@/components/widget/EmbedCodeGenerator';

export default async function SettingsPage() {
  const user = await requireTenant();

  const tenant = await prisma.tenant.findUnique({
    where: { id: user.tenantId! },
    include: {
      settings: true,
    },
  });

  if (!tenant) {
    return <div>Tenant not found</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your venue settings and preferences</p>
      </div>

      {/* Subscription Info */}
      <div className="card-elevated p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Subscription</h2>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Current Plan</div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-xl">
                {tenant.subscriptionTier}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Status: <span className="font-semibold text-foreground">{tenant.subscriptionStatus}</span>
            </div>
          </div>
          {tenant.subscriptionTier === 'FREE' && (
            <div className="text-center md:text-right">
              <button className="btn-glow inline-flex items-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl mb-2">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                Upgrade Plan
              </button>
              <p className="text-xs text-muted-foreground">
                Remove branding, enable SMS, and more
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Embed Widget */}
      <div className="card-elevated p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
            <svg className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Embeddable Widget</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          Add the booking widget to your own website. Copy the code below and paste it into your website's HTML.
        </p>
        <EmbedCodeGenerator slug={tenant.slug} />
      </div>

      {/* Booking Links */}
      <div className="card-elevated p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Booking Links</h2>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Public Booking Page
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/${tenant.slug}`}
                className="flex-1 px-4 py-3 border border-border rounded-xl bg-muted text-foreground font-mono text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/${tenant.slug}`);
                  alert('Copied to clipboard!');
                }}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Direct Booking Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/${tenant.slug}/book`}
                className="flex-1 px-4 py-3 border border-border rounded-xl bg-muted text-foreground font-mono text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/${tenant.slug}/book`);
                  alert('Copied to clipboard!');
                }}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Venue Settings */}
      <div className="card-elevated p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Venue Settings</h2>
        </div>
        <SettingsForm tenant={tenant} />
      </div>
    </div>
  );
}
