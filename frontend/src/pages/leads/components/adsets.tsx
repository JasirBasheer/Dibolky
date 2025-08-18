import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { formatTimestamp } from "@/utils/utils";
import { fetchAdsApi } from "@/services";
import { useSelector } from "react-redux";
import { RootState } from "@/types";
import AdsListWithInsights from "./adlists";
import { Button } from "@/components/ui/button";
import DetailModal from "@/components/modals/details-modal";

const cityIdToName: { [key: string]: string } = {
  "95": "Abu Dhabi",
  "368": "Dubai",
  "641": "Al Ain",
};

export const Adsets = ({
  adSets,
  isLoading,
}: {
  adSets: any[] | null;
  isLoading: boolean;
}) => {
  const user = useSelector((state: RootState) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAdSets, setFilteredAdSets] = useState(adSets || []);
  const [selectedAdSet, setSelectedAdSet] = useState<{
    adSetId: string;
    platform: string | null;
  } | null>(null);
  const [isCreateAdSetModalOpen, setIsCreateAdSetModalOpen] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (!adSets || !Array.isArray(adSets)) {
        setFilteredAdSets([]);
        return;
      }
      const filtered = adSets.filter((adSet) =>
        adSet.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAdSets(filtered);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, adSets]);

  const { data: ads, isLoading: isAdsLoading } = useQuery({
    queryKey: ["ads", selectedAdSet?.adSetId, selectedAdSet?.platform],
    queryFn: () =>
      fetchAdsApi(
        user.role,
        user.user_id,
        selectedAdSet?.platform || "",
        selectedAdSet?.adSetId
      ),
    enabled: !!selectedAdSet?.adSetId && !!selectedAdSet?.platform,
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.data.ads,
  });

  const formatLocations = (geoLocations: any) => {
    if (!geoLocations?.custom_locations) return "N/A";
    const cities = geoLocations.custom_locations
      .map(
        (loc: any) =>
          cityIdToName[loc.primary_city_id] ||
          `Lat: ${loc.latitude}, Lon: ${loc.longitude}`
      )
      .filter(
        (city: string, index: number, self: string[]) =>
          self.indexOf(city) === index
      );
    return cities.join(", ") || "N/A";
  };

  return (
    <>
      <DetailModal
        title="Create Campaign"
        open={isCreateAdSetModalOpen}
        onOpenChange={setIsCreateAdSetModalOpen}
      >
        <form className="space-y-6">
          <div>

            <label
              htmlFor="adSetName"
              className="block text-sm font-medium text-gray-700"
            >
              Ad Set Name
            </label>
            <input
              id="adSetName"
              name="adSetName"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="My Ad Set"
            />

            <label
              htmlFor="campaignId"
              className="block text-sm font-medium text-gray-700 mt-4"
            >
              Campaign ID
            </label>
            <input
              id="campaignId"
              name="campaignId"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="1234567890"
            />

            <label
              htmlFor="dailyBudget"
              className="block text-sm font-medium text-gray-700 mt-4"
            >
              Daily Budget (in cents)
            </label>
            <input
              id="dailyBudget"
              name="dailyBudget"
              type="number"
              min="1"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="1000"
            />

            <label
              htmlFor="optimizationGoal"
              className="block text-sm font-medium text-gray-700 mt-4"
            >
              Optimization Goal
            </label>
            <select
              id="optimizationGoal"
              name="optimizationGoal"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="">Select goal</option>
              <option value="LINK_CLICKS">Link Clicks</option>
              <option value="CONVERSIONS">Conversions</option>
              <option value="REACH">Reach</option>
            </select>
          </div>

          {/* Ad Section */}
          <div>
            <h3 className="font-medium mb-2">Ad Details</h3>

            <label
              htmlFor="adName"
              className="block text-sm font-medium text-gray-700"
            >
              Ad Name
            </label>
            <input
              id="adName"
              name="adName"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="My Ad"
            />

            <label
              htmlFor="adCreativeId"
              className="block text-sm font-medium text-gray-700 mt-4"
            >
              Ad Creative ID
            </label>
            <input
              id="adCreativeId"
              name="adCreativeId"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="1234567890"
            />

            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mt-4"
            >
              Ad Status
            </label>
            <select
              id="status"
              name="status"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="PAUSED">Paused</option>
              <option value="ACTIVE">Active</option>
            </select>
          </div>

        </form>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setIsCreateAdSetModalOpen(false)}
          >
            Close
          </Button>
          <Button
            variant="default"
            onClick={() => setIsCreateAdSetModalOpen(false)}
          >
            Create
          </Button>
        </div>
      </DetailModal>

      <div className="w-full h-full transition-all duration-500 ease-in-out">
        {isLoading ? (
          <>
            <div className="w-full md:h-[73px] h-[79px] bg-gray-100 flex items-center justify-between px-4 shadow-sm">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="w-full md:h-[calc(100vh-73px)] h-[calc(100vh-79px)] bg-gray-50 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-6 w-32" />
                      </div>
                      <Skeleton className="w-full h-32 rounded-md" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : !adSets || adSets.length === 0 ? (
          <div className="flex justify-center w-full h-full items-center">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold mt-2">Leads Manager</h2>
              <p className="text-slate-500 text-xs">
                Select an ad set to view details.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full md:h-[73px] h-[79px] bg-gray-100 flex items-center justify-between px-4 shadow-sm">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search ad sets..."
                  className="pl-10 bg-white border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                size="sm"
                className=" bg-black text-white"
                onClick={() => setIsCreateAdSetModalOpen(true)}
              >
                <Plus className="h-4 w-4 " />
              </Button>
            </div>
            <div className="w-full md:h-[calc(100vh-73px)] h-[calc(100vh-79px)] bg-gray-50 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Leads Manager</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredAdSets.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          No ads match your search.
                        </p>
                      ) : (
                        filteredAdSets.map((adSet) => (
                          <Dialog key={adSet.id}>
                            <DialogTrigger asChild>
                              <div
                                className="border-b pb-4 last:border-b-0 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                                onClick={() =>
                                  setSelectedAdSet({
                                    adSetId: adSet.id,
                                    platform: adSet.platform,
                                  })
                                }
                              >
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {adSet.name}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  ID: {adSet.id}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Status: {adSet.status}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Daily Budget: $
                                  {(parseInt(adSet.daily_budget) / 100).toFixed(
                                    2
                                  )}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Targeting: Ages {adSet?.targeting?.age_min}-
                                  {adSet?.targeting?.age_max},{" "}
                                  {formatLocations(
                                    adSet?.targeting?.geo_locations
                                  )}
                                </p>
                                {adSet.targeting.flexible_spec && (
                                  <p className="text-xs text-gray-600">
                                    Audience:{" "}
                                    {adSet?.targeting?.flexible_spec[0]?.behaviors
                                      ?.map((b: { name: string }) => b.name)
                                      .join(", ") || "N/A"}
                                    {adSet?.targeting?.flexible_spec[0]
                                      ?.work_positions
                                      ? ", " +
                                        adSet?.targeting?.flexible_spec[0]?.work_positions
                                          .slice(0, 3)
                                          .map((p: { name: string }) => p.name)
                                          .join(", ") +
                                        (adSet?.targeting?.flexible_spec[0]
                                          ?.work_positions?.length > 3
                                          ? "..."
                                          : "")
                                      : ""}
                                  </p>
                                )}
                                <p className="text-xs text-gray-600">
                                  Platforms:{" "}
                                  {adSet?.targeting?.publisher_platforms?.join(
                                    ", "
                                  )}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Started: {formatTimestamp(adSet?.start_time)}
                                </p>
                                {adSet.end_time && (
                                  <p className="text-xs text-gray-600">
                                    Ends: {formatTimestamp(adSet?.end_time)}
                                  </p>
                                )}
                                <p className="text-xs text-gray-600">
                                  Optimization Goal: {adSet?.optimization_goal}
                                </p>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>
                                  {adSet?.name} - Details
                                </DialogTitle>
                              </DialogHeader>
                              <AdsListWithInsights
                                ads={ads}
                                isAdsLoading={isAdsLoading}
                              />
                            </DialogContent>
                          </Dialog>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
