import React, { useState } from 'react';
import { Search, Briefcase, User, Tag, Calendar, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllProjects } from "@/services/common/get.services";
import { Card, CardContent } from '@/components/ui/card';
import Table from '@/components/common.components/table.component';
import { getStatusColor } from '@/utils/utils';
import { IAgencyProjects, IColumn, IDataItem, IProject } from '@/types/common.types';
import CustomBreadCrumbs from '@/components/ui/custom-breadcrumbs';




export default function AgencyProject() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onProjectSelect = (project: IProject) => {
    setSelectedProject(project)
    setIsDialogOpen(true)
  }


  const { data: projectsData, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["agency-projects", page],
    queryFn: () => getAllProjects(page),
    placeholderData: keepPreviousData,
    select: (data) => ({
      projects: data?.data?.projects.map((project: IAgencyProjects) => ({
        id: project._id,
        name: project.service_name,
        category: project.category,
        client: project.client,
        status: project.status,
        deadline: new Date(project.dead_line).toLocaleDateString(),
        serviceDetails: project.service_details,
      })),
      totalPages: data?.data?.totalPages
    }),
  });



  const categories = ["All", "DM","SM", "CRM"]
  const columns: IColumn<IDataItem>[] = [
    { key: "name", label: "Name" },
    { key: "category", label: "Category", render: (p) => <span className="text-blue-800">{p.category}</span> },
    { key: "client", label: "Client", render: (p) => p.client.client_name },
    { key: "status", label: "Status", render: (p) => <span className={getStatusColor(p.status)}>{p.status}</span> },
    { key: "deadline", label: "Deadline" },
  ]


  const filteredProjects = projectsData?.projects?.filter((project: IProject) =>
    (selectedCategory === "All" || project.category === selectedCategory) &&
    (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];


  if (isProjectsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
         <CustomBreadCrumbs
            breadCrumbs={[
              ["Content & Projects", "/agency/projects"],
              ["All Projects", ""],
            ]}
          />
          
    <div className="p-6 mx-auto bg-gray-50 min-h-screen pb-28">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
      </div>

      <div className="flex justify-between items-center mb-6 gap-4 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search projects..."
            className="pl-10 pr-4 py-2 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table columns={columns} data={filteredProjects} onClick={onProjectSelect} />
      <div className="flex items-center justify-center space-x-2 py-4">
      <button
        onClick={() => setPage((currentPage) => currentPage - 1)}
        disabled={page === 1}
        className="px-3 py-1 border rounded bg-white disabled:bg-gray-100 disabled:text-gray-400"
      >
        Previous
      </button>
      
      <span className="px-3 py-1">
        Page {page} of {projectsData?.totalPages}
      </span>
      
      <button
     onClick={() => setPage((currentPage) => currentPage + 1)}
        disabled={page === projectsData?.totalPages}
        className="px-3 py-1 border rounded bg-white disabled:bg-gray-100 disabled:text-gray-400"
      >
        Next
      </button>
    </div>
            

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
                <h3 className="text-lg font-semibold mb-4">Service Details</h3>
                <div className="space-y-3">
                  {selectedProject?.serviceDetails &&
                    Object.entries(selectedProject.serviceDetails).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        <span className="font-medium capitalize">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="default"
              className="bg-black"
              disabled={selectedProject?.status === 'Completed'}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark as Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}