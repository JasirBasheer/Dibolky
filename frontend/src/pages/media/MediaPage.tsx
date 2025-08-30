"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ImageIcon,
  Video,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";
import type { RootState } from "@/types/common";
import { PlatformFilter } from "@/components/common/platfrom-filter";
import { fetchConnections, getMediaApi, getMediaDetailsApi } from "@/services";
import MediaContentDetails from "./components/contentDetails";

type InstagramMedia = {
  id: string;
  caption: string;
  media_type: string;
  thumbnail_url: string;
  media_url: string;
  permalink: string;
  timestamp: string;
  platform: string;
  profileName: string;
  profilePicture: string;
  pageId: string;
};

const Media = () => {
  const user = useSelector((state: RootState) => state.user);
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [contents, setContents] = useState<InstagramMedia[]>([]);
  const [isContentLoading, setContentLoading] = useState<boolean>(false);
  const [isSelectedContentLoading, setSelectedContentLoading] =
    useState<boolean>(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedContentMedia, setSelectedContentMedia] = useState<{
    platform: string;
    id: string;
    type: string;
    pageId: string;
  } | null>(null);
  const [filteredContents, setFilteredContents] = useState<InstagramMedia[]>(
    []
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (!selectedContentMedia) return;
      async function getMedias() {
        try {
          setSelectedContentLoading(true);
          const response = await getMediaDetailsApi(
            user.role,
            user.user_id,
            selectedContentMedia
          );
          console.log(response.data.content, "cnotent");
          setSelectedContent(response.data.content || null);
        } catch (error) {
          console.log(error);
        } finally {
          setSelectedContentLoading(false);
        }
      }

      getMedias();
    }, 900);
    return () => clearTimeout(debounceTimer);
  }, [selectedContentMedia]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setContentLoading(true);
      setSelectedContent(null);
      async function getMedias() {
        const response = await getMediaApi(
          user.role,
          user.user_id,
          selectedPlatforms,
          selectedConnections
        );
        console.log(response.data.contents,);
        setContents(response.data.contents || []);
        if (response) {
          setContentLoading(false);
        }
      }

      getMedias();
    }, 900);
    return () => clearTimeout(debounceTimer);
  }, [selectedPlatforms, selectedConnections]);

  const { data: connections, isLoading: isConnectionsLoading } = useQuery({
    queryKey: ["get-connections-status",user.role, user.user_id],
    queryFn: () => {
      return fetchConnections(user.role, user.user_id,`?includes=pages`);
    },
    select: (data) => data?.data,
    enabled: !!user.user_id,
    staleTime: 1000 * 60 * 60,
  });

  const handleFilterChange = (connections: string[], platforms: string[]) => {
    setSelectedConnections(connections);
    setSelectedPlatforms(platforms);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setContentLoading(true);
      let filteredContent = contents;

      if (selectedTab !== "all") {
        filteredContent = filteredContent.filter(
          (item) => item.media_type === selectedTab
        );
      }

      if (searchQuery) {
        filteredContent = filteredContent.filter((item) =>
          item.caption.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredContents(filteredContent);
      setContentLoading(false);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [
    selectedPlatforms,
    selectedConnections,
    selectedTab,
    searchQuery,
    contents,
  ]);

  const getContentIcon = (type: string) => {
    switch (type) {
      case "REEL":
      case "VIDEO":
        return <Video className="h-4 w-4" />;
      case "STORY":
        return <ImageIcon className="h-4 w-4" />;
      case "CAROUSEL":
        return <ImageIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };



  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Content", "/agency/content"],
          ["Content Manager", ""],
        ]}
      />
      <div className="md:flex h-screen w-full mx-auto border-l-gray-300 bg-white">
        <div className="md:w-[34em] overflow-hidden overflow-y-auto p-5 w-full h-full border-r border-l-gray-300">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">
              Content Manager
            </h1>
            <PlatformFilter
              connections={connections}
              onFilterChange={handleFilterChange}
              selectedConnections={selectedConnections}
              selectedPlatforms={selectedPlatforms}
              isLoading={isConnectionsLoading}
            />
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search content..."
              className="pl-10 bg-slate-50 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid grid-cols-4 bg-slate-100">
              <TabsTrigger
                value="all"
                onClick={() => setSelectedTab("all")}
                className="flex gap-2 items-center text-xs"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="thoughts"
                onClick={() => setSelectedTab("thoughts")}
                className="flex gap-2 items-center text-xs"
              >
                Thoughts
              </TabsTrigger>
              <TabsTrigger
                value="posts"
                onClick={() => setSelectedTab("IMAGE")}
                className="flex gap-2 items-center text-xs"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="reels"
                onClick={() => setSelectedTab("VIDEO")}
                className="flex gap-2 items-center text-xs"
              >
                Reels
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex-1 ">
            {isContentLoading ? (
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
                {filteredContents.length === 0 && !isContentLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-xs">
                      Make sure you have selected pages and platforms.
                    </p>
                    <p className="text-gray-500 text-sm">
                      No content matches your current filters.
                    </p>
                  </div>
                ) : (
                  filteredContents.map((item) => {
                    return (
                      <Card
                        key={item.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedContent?.id === item.id
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedContentMedia({
                            platform: item.platform,
                            id: item.id,
                            type: item.media_type,
                            pageId: item.pageId,
                          })
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <div className="relative">
                              <img
                                src={item.thumbnail_url || item.media_url}
                                alt={item.media_url}
                                className="h-16 w-16 rounded-md object-cover"
                              />
                              <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                                {getContentIcon(item.media_type)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-sm text-gray-900 truncate">
                                  {item.caption}
                                </h3>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                {item.caption}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-5 w-5">
                                    <AvatarImage
                                      src={
                                        item.profilePicture ||
                                        "/placeholder.svg"
                                      }
                                      alt={item.profileName}
                                    />
                                    <AvatarFallback className="text-xs">
                                      {item.profileName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-gray-500">
                                    {item.profileName}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="text-xs capitalize"
                                  >
                                    {item.platform}
                                  </Badge>
                                </div>
                              </div>
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
          <MediaContentDetails content={selectedContent} isLoading={isSelectedContentLoading}  />
        </div>
      </div>
    </>
  );
};

export default Media;
