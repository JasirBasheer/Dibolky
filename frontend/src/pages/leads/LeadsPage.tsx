"use client";

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { Search, MoreHorizontal, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";
import type { RootState } from "@/types/common";
import { PlatformFilter } from "@/components/common/platfrom-filter";
import { fetchConnections, getAdSetsApi, getCampaignsApi } from "@/services";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDate, formatTimestamp } from "@/utils/utils";
import { Adsets } from "./components/adsets";
import DetailModal from "@/components/modals/details-modal";

const LeadsPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const [selectedTab, setSelectedTab] = useState("all");

  const [selectedAdAccounts, setSelectedAdAccounts] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isCampaignsLoading, setIsCampaignsLoading] = useState<boolean>(false);
  const [isSelectedContentLoading, setSelectedContentLoading] =
    useState<boolean>(false);
  const [selectedCampaignAdsets, setSelectedCampaignAdsets] =
    useState<any>(null);
  const [selectedCampaignDetails, setSelectedCampaignDetails] =
    useState<any>(null);
  const [filteredCampaigns, setFilteredCampaigns] = useState<any[]>([]);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (!selectedCampaignDetails) return;
      async function getMedias() {
        try {
          setSelectedContentLoading(true);
          const response = await getAdSetsApi(
            user.role,
            user.user_id,
            selectedCampaignDetails
          );
          setSelectedCampaignAdsets(response.data.adsets || null);
        } catch (error) {
          console.log(error);
        } finally {
          setSelectedContentLoading(false);
        }
      }

      getMedias();
    }, 900);
    return () => clearTimeout(debounceTimer);
  }, [selectedCampaignDetails]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setIsCampaignsLoading(true);
      setSelectedCampaignAdsets(null);
      async function getMedias() {
        const response = await getCampaignsApi(
          user.role,
          user.user_id,
          selectedPlatforms,
          selectedAdAccounts
        );
        console.log(response.data.campaigns);
        setCampaigns(response.data.campaigns || []);
        if (response) {
          setIsCampaignsLoading(false);
        }
      }

      getMedias();
    }, 900);
    return () => clearTimeout(debounceTimer);
  }, [selectedPlatforms, selectedAdAccounts]);

  const { data: connections, isLoading: isConnectionsLoading } = useQuery({
    queryKey: ["get-leads-connection-status", user.role, user.user_id],
    queryFn: () => {
      return fetchConnections(user.role, user.user_id, `?includes=ads`);
    },
    select: (data) => data?.data,
    enabled: !!user.user_id,
    staleTime: 1000 * 60 * 60,
  });

  const handleFilterChange = (connections: string[], platforms: string[]) => {
    setSelectedAdAccounts(connections);
    setSelectedPlatforms(platforms);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setIsCampaignsLoading(true);
      let filteredContent = campaigns;

      if (selectedTab !== "all") {
        filteredContent = filteredContent.filter(
          (item) => item.effective_status === selectedTab.toUpperCase()
        );
      }

      if (searchQuery) {
        filteredContent = filteredContent.filter((item) =>
          item.caption.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredCampaigns(filteredContent);
      setIsCampaignsLoading(false);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [
    selectedPlatforms,
    selectedAdAccounts,
    selectedTab,
    searchQuery,
    campaigns,
  ]);

  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          [
            "Communications",
            `/${user.role == "agency" ? "agency" : "client"}/leads`,
          ],
          ["Leads Management", ""],
        ]}
      />
      <div className="md:flex h-screen w-full mx-auto border-l-gray-300 bg-white">
        <div className="md:w-[34em] overflow-hidden overflow-y-auto p-5 w-full h-full border-r border-l-gray-300">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Leads Manager</h1>
            <PlatformFilter
              filter2="Ad Accounts"
              connections={connections}
              onFilterChange={handleFilterChange}
              selectedConnections={selectedAdAccounts}
              selectedPlatforms={selectedPlatforms}
              isLoading={isConnectionsLoading}
            />
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search leads..."
              className="pl-10 bg-slate-50 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <Tabs defaultValue="all" className="flex-1">
              <div className="overflow-x-auto no-scrollbar">
                <TabsList className="flex w-max whitespace-nowrap bg-slate-100 scroll-smooth px-2 py-1 rounded-md">
                  <TabsTrigger
                    value="all"
                    onClick={() => setSelectedTab("all")}
                    className="flex gap-2 items-center text-xs"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="traffic"
                    onClick={() => setSelectedTab("active")}
                    className="flex gap-2 items-center text-xs"
                  >
                    Active
                  </TabsTrigger>
                  <TabsTrigger
                    value="lead"
                    onClick={() => setSelectedTab("paused")}
                    className="flex gap-2 items-center text-xs"
                  >
                    Paused
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
            
            <Button
              size="sm"
              className=" bg-black text-white"
              onClick={() => setIsCreateCampaignOpen(true)}
            >
              <Plus className="h-4 w-4 " />
            </Button>
            
          </div>

          <div className="flex-1 ">
            {isCampaignsLoading ? (
              [1, 2, 3, 4].map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-3 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="space-y-3 ">
                {filteredCampaigns.length === 0 && !isCampaignsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-xs">
                      Make sure you have selected pages and platforms.
                    </p>
                    <p className="text-gray-500 text-sm">
                      No content matches your current filters.
                    </p>
                  </div>
                ) : (
                  filteredCampaigns.map((item) => {
                    return (
                      <Card
                        key={item.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedCampaignAdsets?.id === item.id
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedCampaignDetails({
                            id: item.id,
                            platform: item.platform,
                            name: item.name,
                          })
                        }
                      >
                        <CardContent className="p-4 relative">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-sm text-gray-900 truncate">
                                  Name: {item.name}
                                </h3>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 flex-shrink-0"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">
                                        More options
                                      </span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-32 "
                                  >
                                    <DropdownMenuItem
                                      className="text-xs cursor-pointer"
                                      onClick={() =>
                                        console.log("Pause clicked")
                                      }
                                    >
                                      {item.effective_status == "ACTIVE"
                                        ? "Pause Campaign"
                                        : "Restart Campaign"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-xs cursor-pointer text-destructive"
                                      onClick={() =>
                                        console.log("Delete clicked")
                                      }
                                    >
                                      Delete Campaign
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                Objective: {item.objective}
                              </p>
                              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                Status: {item.effective_status}
                              </p>
                              <p className="text-xs text-gray-600 line-clamp-2 mb-0">
                                Platform:{" "}
                                {item.platform
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                              </p>
                              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                Started: {formatTimestamp(item.start_time)}
                              </p>
                              {item?.stop_time && (
                                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                  Stoped: {formatDate(item?.stop_time)}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-full h-screen transition-all duration-500 ease-in-out">
          <Adsets
            adSets={selectedCampaignAdsets}
            isLoading={isSelectedContentLoading}
          />
        </div>
      </div>
      <DetailModal
        title="Create Campaign"
        open={isCreateCampaignOpen}
        onOpenChange={setIsCreateCampaignOpen}
      >
        <form className="space-y-4">
          <div>
            <label
              htmlFor="campaignName"
              className="block text-sm font-medium text-gray-700"
            >
              Campaign Name
            </label>
            <input
              id="campaignName"
              name="campaignName"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="objective"
              className="block text-sm font-medium text-gray-700"
            >
              Objective
            </label>
            <select
              id="objective"
              name="objective"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="">Select objective</option>
              <option value="LINK_CLICKS">Link Clicks</option>
              <option value="CONVERSIONS">Conversions</option>
              <option value="BRAND_AWARENESS">Brand Awareness</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="objective"
              className="block text-sm font-medium text-gray-700"
            >
              Meta Ad Account
            </label>
            <select
              id="objective"
              name="objective"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="">Select Ad Account</option>
              {connections?.adAccounts.flat().map((acc: { account_id: string , name: string  }) => (
              <option key={acc.account_id} value={acc.account_id}>{acc.name}</option>
              ))}
  
            </select>
          </div>
        </form>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setIsCreateCampaignOpen(false)}
          >
            Close
          </Button>
          <Button
            variant="default"
            onClick={() => setIsCreateCampaignOpen(false)}
          >
            Create
          </Button>
        </div>
      </DetailModal>
    </>
  );
};

export default LeadsPage;
