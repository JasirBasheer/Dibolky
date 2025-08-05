import React, { useEffect, useState } from "react";
import {
  Search,
  Briefcase,
  User,
  Tag,
  Calendar,
  CheckCircle2,
  ArrowUpDown,
  DollarSign,
  CalendarDays,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllProjects } from "@/services/common/get.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RootState } from "@/types/common";
import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";
import { useSelector } from "react-redux";
import { useFilter, usePagination } from "@/hooks";
import SelectInput from "@/components/ui/selectInput";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import PaginationControls from "@/components/ui/PaginationControls";
import Skeleton from "react-loading-skeleton";

export default function Projects() {
  const user = useSelector((state: RootState) => state.user);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState({
    query: "",
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
    type: "",
  });
  const { page, limit, nextPage, prevPage, reset } = usePagination(1, 10);
  const debouncedFilter = useFilter(filter, 900);

  const onProjectSelect = (project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const { data, isLoading: isProjectsLoading } = useQuery({
    queryKey: [
      "get-projects",
      page,
      limit,
      debouncedFilter,
      user.user_id
    ],
    queryFn: () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        query: debouncedFilter.query,
        status: debouncedFilter.status,
        sortBy: debouncedFilter.sortBy,
        sortOrder: debouncedFilter.sortOrder,
        type: debouncedFilter.type,
      }).toString();
      return getAllProjects(
        user.role == "agency" ? "agency" : "client",
        user.user_id,
        `?${searchParams}`
      );
    },
    placeholderData: keepPreviousData,
    select: (data) => data.data,
  });


  useEffect(() => {
    reset();
  }, [debouncedFilter.query,user.user_id, debouncedFilter.status, debouncedFilter.sortBy, debouncedFilter.sortOrder, debouncedFilter.type]);

  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Content & Projects", "/agency/projects"],
          ["All Projects", ""],
        ]}
      />

      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by client name, invoice number, or service..."
                    value={filter.query}
                    onChange={(e) =>
                      setFilter((prev) => ({ ...prev, query: e.target.value }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <SelectInput
                placeholder="Filter by status"
                value={filter.status}
                options={[
                  { label: "All Status", value: "all" },
                  { label: "Pending", value: "Pending" },
                  { label: "Completed", value: "Completed" },
                ]}
                onChange={(value) =>
                  setFilter((prev) => ({ ...prev, status: value }))
                }
              />
              <SelectInput
                placeholder="Category"
                value={filter.type}
                options={[
                  { label: "DM", value: "DM" },
                  { label: "CRM", value: "CRM" },
                  { label: "CC", value: "CC" },
                ]}
                onChange={(value) =>
                  setFilter((prev) => ({ ...prev, type: value }))
                }
              />

              <SelectInput
                placeholder="Sort by"
                value={filter.sortBy}
                options={[
                  { label: "Date Created", value: "createdAt" },
                  { label: "Due Date", value: "dead_line" },
                  { label: "Name", value: "client.client_name" },
                  { label: "Amount", value: "service_details.budget" },
                ]}
                onChange={(value) =>
                  setFilter((prev) => ({ ...prev, sortBy: value }))
                }
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
                  }))
                }
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {!isProjectsLoading ? (
              <DataTable
                data={data.projects}
                onRowClick={onProjectSelect}
                columns={[
                  {
                    header: "Project Name",
                    render: (project) => project.name,
                  },
                  {
                    header: "Client",
                    render: (project) => (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">
                            {project.client.client_name}
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    header: "Category",
                    render: (project) => (
                      <div className="flex items-center gap-1">
                        <Badge variant="outline">{project.category}</Badge>
                      </div>
                    ),
                  },
                  {
                    header: "Status",
                    render: (project) => (
                      <div className="flex items-center gap-1">
                        <Badge variant="outline">{project.status}</Badge>
                      </div>
                    ),
                  },
                  {
                    header: "Amount",
                    render: (project) => (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {project.serviceDetails.budget}
                        </span>
                      </div>
                    ),
                  },
                  {
                    header: "Due Date",
                    render: (project) => (
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-gray-400" />
                        <span>
                          {format(new Date(project.deadline), "MMM dd, yyyy")}
                        </span>
                      </div>
                    ),
                  },
                ]}
              />
            ) : (
              <Skeleton count={3} height={48} />
            )}
          </CardContent>
        </Card>
        <PaginationControls
          page={page}
          totalPages={data?.totalPages || 1}
          onNext={nextPage}
          onPrev={prevPage}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Briefcase className="w-6 h-6" />
                {selectedProject?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Project Info
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Client:</span>
                      <span>{selectedProject?.client.client_name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Category:</span>
                      <span>{selectedProject?.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Deadline:</span>
                      <span>{selectedProject?.deadline}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Service Details
                  </h3>
                  <div className="space-y-3">
                    {selectedProject?.serviceDetails &&
                      Object.entries(selectedProject.serviceDetails).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="font-medium capitalize">
                              {key}:
                            </span>
                            <span className="text-gray-600">
                              {value.toString()}
                            </span>
                          </div>
                        )
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>


               {user.role != "client" && 
                         <Button
                variant="default"
                className="bg-black"
                disabled={selectedProject?.status === "Completed"}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as Done
              </Button>
             }
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
