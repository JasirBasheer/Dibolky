import { message } from "antd";
import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import AdminClientDetails from "./ClientsDetails";
import { IAdminClientData } from "@/types/admin.types";
import { DataTable } from "@/components/ui/data-table";
import PaginationControls from "@/components/ui/PaginationControls";
import {
  Search,
  ArrowUpDown,
  User,
  CalendarDays,
  Eye,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalClients: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ClientListItem {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  industry?: string;
  status?: string;
}

const AdminClients = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClientDetailsLoading, setIsClientDetailsLoading] =
    useState<boolean>(false);
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [client, setClient] = useState<IAdminClientData>();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalClients: 0,
    hasNext: false,
    hasPrev: false,
  });

  const [filter, setFilter] = useState({
    query: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
    limit: 10,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filter.sortBy, filter.sortOrder]);

  useEffect(() => {
    fetchClients();
  }, [currentPage, debouncedSearchTerm, filter.sortBy, filter.sortOrder]);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: filter.limit.toString(),
        sortBy: filter.sortBy,
        sortOrder: filter.sortOrder,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
      });

      const response = await axios.get(`/api/admin/clients?${params}`);

      if (response && response.status === 200) {
        setClients(response.data.clients || []);
        setPagination({
          currentPage: response.data.pagination?.currentPage || 1,
          totalPages: response.data.pagination?.totalPages || 1,
          totalClients: response.data.pagination?.total || 0,
          hasNext: response.data.pagination?.hasNext || false,
          hasPrev: response.data.pagination?.hasPrev || false,
        });
      }
    } catch (error: unknown) {
      try {
        const fallbackResponse = await axios.get("/api/admin/clients");
        if (fallbackResponse && fallbackResponse.status === 200) {
          setClients(fallbackResponse.data.clients || []);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalClients: fallbackResponse.data.clients?.length || 0,
            hasNext: false,
            hasPrev: false,
          });
        }
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const errResponse = error as {
            response: { data?: { error?: string } };
          };
          message.error(
            errResponse.response.data?.error || "Failed to fetch clients"
          );
        } else {
          message.error("An unknown error occurred");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const viewClient = async (clientItem: ClientListItem) => {
    try {
      setIsClicked(true);
      setIsClientDetailsLoading(true);
      const response = await axios.get(
        `api/admin/client/${clientItem._id}`
      );
      if (response) {
        setClient(response.data.details);
      }
    } catch (error: unknown) {
      message.error(
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed to fetch client details"
      );
      setIsClicked(false);
    } finally {
      setIsClientDetailsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSortToggle = () => {
    setFilter((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="relative w-full p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          All Clients
        </h1>
        <p className="text-gray-600">Manage and view all registered clients</p>
      </div>

      {/* Filters and Search Card */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by client name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              <select
                value={filter.sortBy}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, sortBy: e.target.value }))
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="createdAt">Join Date</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSortToggle}
                title={`Sort ${
                  filter.sortOrder === "asc" ? "Descending" : "Ascending"
                }`}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Clients</span>
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
            <DataTable
              data={clients}
              columns={[
                {
                  header: "Client",
                  render: (client) => (
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {client.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ID: {client._id.slice(-8)}
                        </p>
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Email",
                  render: (client) => (
                    <span className="text-gray-900">{client.email}</span>
                  ),
                },
                {
                  header: "Join Date",
                  render: (client) => (
                    <div className="flex items-center gap-1 text-gray-600">
                      <CalendarDays className="h-4 w-4" />
                      <span className="text-sm">
                        {formatDate(client.createdAt)}
                      </span>
                    </div>
                  ),
                },
                {
                  header: "Industry",
                  render: (client) => (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {client.industry || "N/A"}
                    </Badge>
                  ),
                },
              ]}
              onRowClick={viewClient}
              emptyMessage="No clients found. Try adjusting your search criteria."
            />
        </CardContent>
      </Card>

      {!isLoading && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>

          <PaginationControls
            page={pagination.currentPage}
            totalPages={pagination.totalPages}
            onNext={handleNextPage}
            onPrev={handlePrevPage}
          />
        </div>
      )}

      {isClicked && ( <AdminClientDetails client={client} setIsClicked={setIsClicked} />)}
    </div>
  );
};

export default AdminClients;
