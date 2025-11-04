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
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your venue settings and preferences</p>
      </div>

      {/* Subscription Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Subscription</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Current Plan</div>
            <div className="text-2xl font-bold text-indigo-600">
              {tenant.subscriptionTier}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Status: {tenant.subscriptionStatus}
            </div>
          </div>
          {tenant.subscriptionTier === 'FREE' && (
            <div>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                Upgrade Plan
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Remove branding, enable SMS, and more
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Embed Widget */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Embeddable Widget</h2>
        <p className="text-gray-600 mb-4">
          Add the booking widget to your own website. Copy the code below and paste it into your website's HTML.
        </p>
        <EmbedCodeGenerator slug={tenant.slug} />
      </div>

      {/* Booking Links */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Links</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Public Booking Page
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/${tenant.slug}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/${tenant.slug}`);
                  alert('Copied to clipboard!');
                }}
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Direct Booking Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/${tenant.slug}/book`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || 'https://yourapp.com'}/${tenant.slug}/book`);
                  alert('Copied to clipboard!');
                }}
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Venue Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Venue Settings</h2>
        <SettingsForm tenant={tenant} />
      </div>
    </div>
  );
}
