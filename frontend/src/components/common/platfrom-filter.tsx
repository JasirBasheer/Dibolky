"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Skeleton from "react-loading-skeleton";

interface Connection {
  platform: string;
  is_valid: boolean;
  createdAt: string;
}

interface ConnectedPage {
  name: string;
  id: string;
}

interface AdAccount {
  id: string;
  account_id: string;
  name: string;
}

interface PlatformFilterProps {
  connections?: {
    connections: Connection[];
    connectedPages: ConnectedPage[];
    adAccounts?: AdAccount[][];
  };
  onFilterChange: (connections: string[], platforms: string[]) => void;
  selectedConnections: string[];
  selectedPlatforms: string[];
  isLoading: boolean;
  filter1?: string;
  filter2?: string;
}

export function PlatformFilter({
  connections,
  onFilterChange,
  selectedConnections,
  selectedPlatforms,
  isLoading,
  filter1 = "Platforms",
  filter2 = "Connections",
}: PlatformFilterProps) {
  const [selectedTab, setSelectedTab] = useState("platforms");
  const [isOpen, setIsOpen] = useState(false);

  const availablePlatforms =
    connections?.connections
      ?.filter((conn) => conn.is_valid)
      ?.map((conn) => conn.platform) || [];

  const connectedPages = connections?.connectedPages || [];
  const adAccounts = connections?.adAccounts?.flat() || [];

  const handleConnectionToggle = (connectionId: string) => {
    const newSelectedConnections = selectedConnections.includes(connectionId)
      ? selectedConnections.filter((id) => id !== connectionId)
      : [...selectedConnections, connectionId];

    onFilterChange(newSelectedConnections, selectedPlatforms);
  };

  const handlePlatformToggle = (platformId: string) => {
    const newSelectedPlatforms = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter((id) => id !== platformId)
      : [...selectedPlatforms, platformId];

    onFilterChange(selectedConnections, newSelectedPlatforms);
  };

  function getSocialMediaIcon(platform: string) {
    const platformLower: string = platform.toLowerCase();

    const icons: Record<string, string> = {
      facebook:
        "M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.04 20.44 19.7 18.73C21.35 17.03 22.34 14.82 22.34 12.56C22.34 9.8 21.23 7.16 19.26 5.19C17.29 3.23 14.65 2.11 11.9 2.11L12 2.04Z",
      instagram:
        "M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.509-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.67.01 2.986.058 4.04.044.976.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.976-.044 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.054.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.04-.044-.976-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 8.468a3.333 3.333 0 100-6.666 3.333 3.333 0 000 6.666zm6.538-8.469a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z",
      x: "M18.901 2.289h-3.346L8.978 9.743 3.099 2.289H0l7.071 10.286L0 21.711h3.346l7.071-8.457 5.879 8.457h3.099l-7.071-10.286 7.071-8.457z",
      linkedin:
        "M22 3.47C22 2.65 21.35 2 20.53 2H3.47C2.65 2 2 2.65 2 3.47v17.06C2 21.35 2.65 22 3.47 22h17.06c.82 0 1.47-.65 1.47-1.47V3.47zM6.67 18H4V8.67h2.67V18zm-1.33-10.67c-.86 0-1.56-.7-1.56-1.56s.7-1.56 1.56-1.56 1.56.7 1.56 1.56-.7 1.56-1.56 1.56zm14.66 10.67h-2.67v-5.33c0-1.27-.45-2.13-1.58-2.13-.86 0-1.37.58-1.6 1.14-.08.2-.1.48-.1.76v5.56H11.33V8.67h2.56v1.14c.38-.58 1.06-1.4 2.58-1.4 1.9 0 3.33 1.24 3.33 3.9v5.69z",
      meta_ads:
        "M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.04 20.44 19.7 18.73C21.35 17.03 22.34 14.82 22.34 12.56C22.34 9.8 21.23 7.16 19.26 5.19C17.29 3.23 14.65 2.11 11.9 2.11L12 2.04Z",
    };
    if (!icons[platformLower])
      return `M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.04 20.44 19.7 18.73C21.35 17.03 22.34 14.82 22.34 12.56C22.34 9.8 21.23 7.16 19.26 5.19C17.29 3.23 14.65 2.11 11.9 2.11L12 2.04Z`;
    return icons[platformLower];
  }

  const uniquePlatforms = [...new Set(availablePlatforms)];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-transparent"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.5 3C4.67157 3 4 3.67157 4 4.5C4 5.32843 4.67157 6 5.5 6C6.32843 6 7 5.32843 7 4.5C7 3.67157 6.32843 3 5.5 3ZM3 4.5C3 3.11929 4.11929 2 5.5 2C6.88071 2 8 3.11929 8 4.5C8 5.88071 6.88071 7 5.5 7C4.11929 7 3 5.88071 3 4.5ZM9.5 9C8.67157 9 8 9.67157 8 10.5C8 11.3284 8.67157 12 9.5 12C10.3284 12 11 11.3284 11 10.5C11 9.67157 10.3284 9 9.5 9ZM7 10.5C7 9.11929 8.11929 8 9.5 8C10.8807 8 12 9.11929 12 10.5C12 11.8807 10.8807 13 9.5 13C8.11929 13 7 11.8807 7 10.5ZM1.5 4C1.22386 4 1 4.22386 1 4.5C1 4.77614 1.22386 5 1.5 5H2.5C2.77614 5 3 4.77614 3 4.5C3 4.22386 2.77614 4 2.5 4H1.5ZM8 4.5C8 4.22386 8.22386 4 8.5 4H13.5C13.7761 4 14 4.22386 14 4.5C14 4.77614 13.7761 5 13.5 5H8.5C8.22386 5 8 4.77614 8 4.5ZM1.5 10C1.22386 10 1 10.2239 1 10.5C1 10.7761 1.22386 11 1.5 11H6.5C6.77614 11 7 10.7761 7 10.5C7 10.2239 6.77614 10 6.5 10H1.5ZM12 10.5C12 10.2239 12.2239 10 12.5 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H12.5C12.2239 11 12 10.7761 12 10.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
          <span>Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-96 p-0">
        <div className="flex flex-col">
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-32 border-r bg-muted/20">
              <div className="p-2 space-y-1">
                <Button
                  variant={selectedTab === "platforms" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => setSelectedTab("platforms")}
                >
                  {filter1}
                </Button>
                <Button
                  variant={selectedTab === "connections" ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => setSelectedTab("connections")}
                >
                  {filter2}
                </Button>
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              {isLoading ? (
                <div className="p-2 space-y-2">
                  <Skeleton count={4} height={32} />
                </div>
              ) : (
                <>
                  {selectedTab === "connections" && (
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-2 space-y-2">
                        {availablePlatforms.includes("meta_ads") ? (
                          adAccounts.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                              No ad accounts available
                            </div>
                          ) : (
                            adAccounts.map((account) => (
                              <div
                                key={account.id}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                                onClick={() => handleConnectionToggle(account.id)}
                              >
                                <Checkbox
                                  checked={selectedConnections.includes(
                                    account.id
                                  )}
                                  onCheckedChange={() =>
                                    handleConnectionToggle(account.id)
                                  }
                                />
                                <span className="flex items-center justify-center bg-blue-100 text-blue-600 rounded-full w-6 h-6">
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                  >
                                    <path d={getSocialMediaIcon("meta_ads")} />
                                  </svg>
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm max-w-[163px] truncate">
                                    {account.name}
                                  </div>
                                </div>
                              </div>
                            ))
                          )
                        ) : connectedPages.length === 0 ? (
                          <div className="text-center py-4 text-gray-500">
                            No connected pages available
                          </div>
                        ) : (
                          connectedPages.map((page) => (
                            <div
                              key={page.id}
                              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                              onClick={() => handleConnectionToggle(page.id)}
                            >
                              <Checkbox
                                checked={selectedConnections.includes(page.id)}
                                onCheckedChange={() =>
                                  handleConnectionToggle(page.id)
                                }
                              />
                              <span className="flex items-center justify-center bg-blue-100 text-blue-600 rounded-full w-6 h-6">
                                <svg
                                  viewBox="0 0 24 24"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                >
                                  <path d={getSocialMediaIcon("facebook")} />
                                </svg>
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm max-w-[163px] truncate">
                                  {page.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Connected Page
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {selectedTab === "platforms" && (
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-2 space-y-2">
                        {uniquePlatforms.length === 0 ? (
                          <div className="text-center py-4 text-gray-500">
                            No platforms available
                          </div>
                        ) : (
                          uniquePlatforms.map((platform) => (
                            <div
                              key={platform}
                              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                              onClick={() => handlePlatformToggle(platform)}
                            >
                              <Checkbox
                                checked={selectedPlatforms.includes(platform)}
                                onCheckedChange={() =>
                                  handlePlatformToggle(platform)
                                }
                              />
                              <span className="flex items-center justify-center bg-blue-100 text-blue-600 rounded-full w-6 h-6">
                                <svg
                                  viewBox="0 0 24 24"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                >
                                  <path d={getSocialMediaIcon(platform)} />
                                </svg>
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {platform
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}