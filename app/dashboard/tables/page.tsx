import { requireTenant } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteTableButton from '@/components/tables/DeleteTableButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table as TableUI, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Table as TableIcon, Edit } from 'lucide-react';

export default async function TablesPage() {
  const user = await requireTenant();

  const tables = await prisma.table.findMany({
    where: { tenantId: user.tenantId! },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tables</h1>
          <p className="text-muted-foreground mt-2">Manage your venue's tables and seating</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tables/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Table
          </Link>
        </Button>
      </div>

      {tables.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="py-12 text-center">
              <TableIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No tables yet</h3>
              <p className="mt-2 text-muted-foreground">Get started by adding your first table.</p>
              <Button asChild className="mt-6">
                <Link href="/dashboard/tables/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Table
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Tables</CardTitle>
            <CardDescription>A list of all tables in your venue</CardDescription>
          </CardHeader>
          <CardContent>
            <TableUI>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((table) => (
                  <TableRow key={table.id}>
                    <TableCell className="font-medium">{table.name}</TableCell>
                    <TableCell>{table.capacity} seats</TableCell>
                    <TableCell className="text-muted-foreground">{table.location || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={table.isActive ? 'default' : 'secondary'}>
                        {table.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/tables/${table.id}/edit`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <DeleteTableButton tableId={table.id} tableName={table.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableUI>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
