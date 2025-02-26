import React, { useState } from 'react';
import { Search, Briefcase, User, Tag, Calendar, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllProjects } from "@/services/common/get.services";
import { getStatusColor } from '@/utils/utils';
import { Card, CardContent } from '@/components/ui/card';


interface IAgencyProjects {
  _id: string;
  service_name: string;
  category: string;
  client: { client_name: string,client_id:string };
  status: string;
  dead_line: string | number | Date;
  service_details: Record<string, string>;
}

interface IProject extends Omit<IAgencyProjects, '_id' | 'serviceName' | 'deadLine'> {
  id: string;
  name: string;
  deadline: string;
}

export default function AgencyProject() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const statusOptions = ['Not Started', 'In Progress', 'On Hold', 'Completed'];

  const { data: projectsData, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["agency-projects", page],
    queryFn: () => getAllProjects(page, 10),
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
      totalPages: Math.ceil(data?.data?.total / 10)
    }),
  });



  const categories = ["All", "VIDEO", "SM", "CRM"];

  const filteredProjects = projectsData?.projects?.filter((project: IProject) =>
    (selectedCategory === "All" || project.category === selectedCategory) &&
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) || project.client.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isProjectsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6  mx-auto bg-gray-50 min-h-screen pb-28">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
      </div>

      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
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
            className="pl-10 pr-4 py-2 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Category", "Client", "Status", "Deadline"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProjects.map((project: IProject) => (
              <tr
                key={project.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedProject(project);
                  setIsDialogOpen(true);
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{project.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {project.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.client.client_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.deadline}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.min(projectsData?.totalPages || 1, p + 1))}
          disabled={page === projectsData?.totalPages}
        >
          Next
        </Button>
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
                  
                  {/* <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Status:</span>
                    <Select 
                      value={selectedProject?.status}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(status => (
                          <SelectItem key={status} value={status}>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(status)}>{status}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div> */}
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Deadline:</span>
                    <span>{selectedProject?.deadline}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Details Card */}
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
  );
}