import { requireTenant } from '@/lib/auth-utils';
import TableForm from '@/components/tables/TableForm';

export default async function NewTablePage() {
  await requireTenant();

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Table</h1>
        <p className="text-gray-600 mt-2">Create a new table for your venue</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <TableForm />
      </div>
    </div>
  );
}
