import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarDays,
  Search,
  ArrowUpDown,
  Bolt,
  Notebook,
  SquarePen,
  RouteOff,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { useFilter, usePagination } from "@/hooks";
import type { PaginatedResponse, Plan, RootState } from "@/types";
import PaginationControls from "@/components/ui/PaginationControls";
import DetailModal from "@/components/modals/details-modal";
import SelectInput from "@/components/ui/selectInput";
import { DataTable } from "@/components/ui/data-table";
import Skeleton from "react-loading-skeleton";
import { getAllPlans } from "@/services/admin/get.services";
import {
  changePlanStatusApi,
  createPlanApi,
} from "@/services/admin/post.services";
import { toast } from "sonner";
import EditPlan from "@/components/admin/EditPlan";
import AddPlan from "@/components/admin/AddPlan";
import { AxiosError } from "axios";

const Plans = () => {
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.user);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [editPlanId, setEditPlanId] = useState("");
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);

  const [filter, setFilter] = useState({
    query: "",
    sortBy: "createdAt",
    sortOrder: "asc",
    type: "all",
  });

  const { page, limit, nextPage, prevPage, reset } = usePagination(1, 10);
  const debouncedFilter = useFilter(filter, 900);

  const { data, isLoading, refetch } = useQuery<PaginatedResponse<Plan>>({
    queryKey: ["admin:get-plans", page, debouncedFilter],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        query: debouncedFilter.query,
        sortBy: debouncedFilter.sortBy,
        sortOrder: debouncedFilter.sortOrder,
        type: debouncedFilter.type,
      }).toString();

      const res = await getAllPlans(`?${searchParams}`);
      return res.data.result;
    },
    enabled: !!user.user_id,
  });

  useEffect(() => {
    reset();
  }, [debouncedFilter]);

  const openPlanDetails = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDetailModalOpen(true);
  };

  const handleBlock = async (plan_id: string) => {
    const res = await changePlanStatusApi(plan_id);

    if (res.status === 200) {
      toast.success("Plan status changed successfully");
      queryClient.setQueryData(
        ["admin:get-plans", page, debouncedFilter],
        (oldData: PaginatedResponse<Plan>) => {
          if (!oldData) return oldData;
          const updatedPlans = oldData.data.map((plan) =>
            plan.id === plan_id ? { ...plan, isActive: !plan.isActive } : plan
          );
          return { ...oldData, data: updatedPlans };
        }
      );
    }
  };

  const handleAddPlan = async (details: Partial<Plan>) => {
    try {
      const res = await createPlanApi(details);
      if (res.status == 200) {
        toast.success("Plan successfully created");
        setIsAddPlanModalOpen(false);
        queryClient.setQueryData(
          ["admin:get-plans", page, debouncedFilter],
          (oldData: PaginatedResponse<Plan>) => {
            if (!oldData) {
              return {
                data: [res.data.plan],
                page: 1,
                totalCount: 1,
                totalPages: 1,
              };
            }
            return {
              ...oldData,
              data: [...oldData.data, res.data.plan],
              totalCount: oldData.totalCount + 1,
            };
          }
        );
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.error || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Admin", `/admin`],
          ["All Plans", ""],
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
                    placeholder="Search by plan name, feature name, or price..."
                    value={filter.query}
                    onChange={(e) =>
                      setFilter((prev) => ({ ...prev, query: e.target.value }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>
              <SelectInput
                placeholder="All Plans"
                value={filter.type}
                options={[
                  { label: "All Plans", value: "all" },
                  { label: "Trail Plans", value: "trial" },
                  { label: "Paid Plans", value: "paid" },
                ]}
                onChange={(value) =>
                  setFilter((prev) => ({ ...prev, type: value }))
                }
              />

              <SelectInput
                placeholder="Joine dDate"
                value={filter.sortBy}
                options={[
                  { label: "Create At", value: "createdAt" },
                  { label: "Name", value: "name" },
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
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setIsAddPlanModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Plans</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isLoading ? (
              <DataTable
                data={data?.data || []}
                onRowClick={openPlanDetails}
                columns={[
                  {
                    header: "Name",
                    render: (plan) => (
                      <div className="flex items-center gap-2">
                        <Notebook className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{plan.name}</div>
                        </div>
                      </div>
                    ),
                  },

                  {
                    header: "features",
                    render: (plan) => (
                      <div className="flex items-center gap-1">
                        <Bolt className="h-4 w-4" />
                        <span className="">{plan?.features.length}</span>
                      </div>
                    ),
                  },

                  {
                    header: "Created Date",
                    render: (plan) => (
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        <span className="">
                          {format(new Date(plan.createdAt), "MMM dd, yyyy")}
                        </span>
                      </div>
                    ),
                  },

                  {
                    header: "Actions",
                    render: (plan) => (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditPlanId(plan.id);
                            setSelectedPlan(plan);
                          }}
                        >
                          <SquarePen className="h-7 w-7 rounded-md hover:shadow-md  cursor-pointer" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          className=""
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBlock(plan.id);
                          }}
                        >
                          <RouteOff className="h-7 w-7 rounded-md hover:shadow-md cursor-pointer" />
                          {plan.isActive ? "Block" : "UnBlock"}
                        </Button>
                      </div>
                    ),
                  },
                ]}
              />
            ) : (
              <Skeleton count={5} height={48} />
            )}
          </CardContent>
        </Card>

        <PaginationControls
          page={page}
          totalPages={data?.totalPages || 1}
          onNext={nextPage}
          onPrev={prevPage}
        />

        <DetailModal
          title="Plan Details"
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
        >
          {selectedPlan && (
            <>
              <div className="flex  justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold font-lazare">
                    {selectedPlan.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-lazare font-semibold">
                    created At:{" "}
                    {format(new Date(selectedPlan.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-lazare">
                    Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span className="font-lazare font-semibold">Name:</span>
                    <span className="font-lazare font-bold">
                      {selectedPlan.name}
                    </span>
                  </div>
                  <div className="flex justify-between font-lazare">
                    <span className="font-lazare font-semibold">
                      Description:
                    </span>
                    <span className="font-lazare font-bold">
                      {selectedPlan.description}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-lazare font-semibold">Price:</span>
                    <span className="font-lazare font-bold">
                      $ {selectedPlan.price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-lazare font-semibold">
                      Billing Cycle:
                    </span>
                    <span className="font-lazare font-bold">
                      {" "}
                      {selectedPlan.billingCycle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-lazare font-semibold">
                      Max Projects:
                    </span>
                    <span className="font-lazare font-bold">
                      {" "}
                      {selectedPlan.maxProjects}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-lazare font-semibold">
                      Max Clients:
                    </span>
                    <span className="font-lazare font-bold">
                      {" "}
                      {selectedPlan.maxClients}
                    </span>
                  </div>
                  <div>
                    <span className=" block mb-2 font-lazare font-semibold">
                      Features:
                    </span>
                    <ul className="list-disc list-inside space-y-1 pl-3 font-lazare font-semibold">
                      {selectedPlan.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DetailModal>
        {editPlanId && (
          <EditPlan
            onClose={() => {
              setEditPlanId("");
              refetch();
            }}
            plan={selectedPlan}
          />
        )}
        {isAddPlanModalOpen && (
          <AddPlan
            setIsAddPlan={setIsAddPlanModalOpen}
            onSubmit={handleAddPlan}
          />
        )}
      </div>
    </>
  );
};

export default Plans;
