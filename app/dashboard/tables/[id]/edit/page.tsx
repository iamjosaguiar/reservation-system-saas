import { requireTenant } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import TableForm from '@/components/tables/TableForm';

export default async function EditTablePage({ params }: { params: { id: string } }) {
  const user = await requireTenant();

  const table = await prisma.table.findFirst({
    where: {
      id: params.id,
      tenantId: user.tenantId!,
    },
  });

  if (!table) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Table</h1>
        <p className="text-gray-600 mt-2">Update table information</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <TableForm table={table} isEdit />
      </div>
    </div>
  );
}
