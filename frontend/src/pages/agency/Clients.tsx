import { Table, Column } from '@/components/shared/Table';
import { Button } from '@/components/ui/button';
import CustomBreadCrumbs from '@/components/ui/custom-breadcrumbs';
import { fetchAllClientsApi } from '@/services/agency/get.services';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useCallback, useMemo } from 'react';

interface Client {
  _id: string;
  name: string;
  email: string;
  industry: string;
  profile?: string;
  bio?: string;
  orgId?: string;
  isPaymentInitialized?: boolean;
  isSocialMediaInitialized?: boolean;
  createdAt?: string;
  updatedAt?: string;
  projects?: any[];
}

const columns: Column<Client>[] = [
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { 
    header: "Industry", 
    accessor: "industry",
    render: (value) => (
      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
        {value || 'Not specified'}
      </span>
    )
  },
];

const Clients = () => {
  const [page, setPage] = useState(1);
  const [globalSelectedRows, setGlobalSelectedRows] = useState<Set<string>>(new Set());
  const [globalSelectedClients, setGlobalSelectedClients] = useState<Map<string, Client>>(new Map());
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["list-clients", page],
    queryFn: () => fetchAllClientsApi(`?include=details&page=${page}&limit=${limit}`),
    select: (data) => ({
      clients: data?.data.result.clients || [],
      totalPages: data?.data.result.totalPages || 1,
    }),
    staleTime: 1000 * 60 * 5, 
  });

  const clientData = data?.clients || [];
  const totalPages = data?.totalPages || 1;

   const currentPageSelectedRows = useMemo(() => {
    const currentPageIds = new Set(clientData.map(client => client._id));
    return new Set(Array.from(globalSelectedRows).filter(id => currentPageIds.has(id)));
  }, [globalSelectedRows, clientData]);
 
  const handleSelectionChange = useCallback((selectedIds: string[], selectedItems: Client[]) => {
     setGlobalSelectedRows(prev => {
      const newGlobalSelection = new Set(prev);
      const currentPageIds = clientData.map(client => client._id);
      
       currentPageIds.forEach(id => newGlobalSelection.delete(id));
      
       selectedIds.forEach(id => newGlobalSelection.add(id));
      
      return newGlobalSelection;
    });

     setGlobalSelectedClients(prev => {
      const newGlobalClients = new Map(prev);
      const currentPageIds = clientData.map(client => client._id);
      currentPageIds.forEach(id => newGlobalClients.delete(id));
      
      selectedItems.forEach(client => newGlobalClients.set(client._id, client));
      
      return newGlobalClients;
    });
  }, [clientData]);

  const handleMailClients = useCallback(() => {
    const emails = Array.from(globalSelectedClients.values())
      .map(client => client.email)
      .filter(Boolean);
    console.log("Mailing clients:", emails);
    console.log("Selected clients:", Array.from(globalSelectedClients.values()));
  }, [globalSelectedClients]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, [])

  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Client Management", "/clients"],
          ["All Clients", ""],
        ]}
      />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-1">
              Manage your client database
            </p>
          </div>
          
          {globalSelectedClients.size > 0 && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {globalSelectedClients.size} selected across all pages
              </span>
              <Button 
                onClick={handleMailClients}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Mail Selected ({globalSelectedClients.size})
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setGlobalSelectedRows(new Set());
                  setGlobalSelectedClients(new Map());
                }}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        <Table
          columns={columns}
          data={clientData}
          selectable={true}
          selectedRows={currentPageSelectedRows}
          onSelectionChange={handleSelectionChange}
          loading={isLoading}
          emptyMessage={error ? `Error: ${(error as Error).message}` : "No clients found"}
          className="mb-6"
        />

         {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(Math.max(page - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
             
              </div>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Clients;