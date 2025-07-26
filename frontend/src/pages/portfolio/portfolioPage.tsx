import { Calendar, Play, FileText, SquarePen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/types";
import { AddPortfolio } from "./components/addPortfolio";
import { useState, useEffect } from "react";
import DetailModal from "@/components/modals/details-modal";
import { getAllPortfoliosApi, getSignedUrlApi } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface Media {
  type: "image" | "video" | "text";
  url?: string;
  key?: string;
}

interface PortfolioItem {
  _id: string;
  title: string;
  description?: string;
  type?: string;
  media: Media[];
  createdAt?: string;
}

function MediaItem({
  media,
  isPreview = false,
}: {
  media: { type: "image" | "video" | "text"; url?: string };
  isPreview?: boolean;
}) {
  if (media.type === "image" && media.url) {
    return (
      <img
        src={media.url}
        alt="Case study media"
        width={600}
        height={400}
        className="w-full h-48 object-cover "
      />
    );
  }

  if (media.type === "video" && media.url) {
    if (isPreview) {
      return (
        <div className="relative w-full h-48 bg-muted  overflow-hidden">
          <video
            src={media.url}
            className="w-full h-full object-cover"
            muted
            preload="metadata"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 rounded-full p-3">
              <Play className="w-6 h-6 text-gray-800" fill="currentColor" />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <video
          src={media.url}
          controls
          className="w-full h-64 object-contain rounded-lg bg-black"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      );
    }
  }

  return (
    <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
      <FileText className="w-12 h-12 text-muted-foreground" />
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function PortfolioPage() {
  const user = useSelector((state: RootState) => state.user);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [modals, setModals] = useState({
    isAddPortfolioOpen: false,
    isDetialsModalOpen: false,
  });
  const [mediaUrls, setMediaUrls] = useState<{ [key: string]: string }>({});
  const [selectedMediaUrls, setSelectedMediaUrls] = useState<{ [key: string]: string }>({});

  const { data: portfolioItems, refetch } = useQuery({
    queryKey: ["get-portfolioItems"],
    queryFn: () => {
      return getAllPortfoliosApi('?type=portfolio')
    },
    select: (data) => data?.data.portfolios,
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (portfolioItems?.length) {
      const fetchAllUrls = async () => {
        const urls: { [key: string]: string } = {};
        
        for (const item of portfolioItems) {
          if (item.media?.length > 0) {
            const firstMedia = item.media[0];
            if (firstMedia.key && firstMedia.type !== "text") {
              try {
                const signedUrl = await getSignedUrlApi(firstMedia.key);
                urls[firstMedia.key] = signedUrl.data.signedUrl;
              } catch (error) {
                console.error(`Failed to fetch signed URL for ${firstMedia.key}:`, error);
                urls[firstMedia.key] = "";
              }
            }
          }
        }
        setMediaUrls(urls);
      };
      fetchAllUrls();
    }
  }, [portfolioItems]);

  useEffect(() => {
    if (selectedPortfolio?.media) {
      const fetchSelectedUrls = async () => {
        const urls: { [key: string]: string } = {};
        
        for (const media of selectedPortfolio.media) {
          if (media.key && media.type !== "text") {
            try {
              const signedUrl = await getSignedUrlApi(media.key);
              urls[media.key] = signedUrl.data.signedUrl;
            } catch (error) {
              console.error(`Failed to fetch signed URL for ${media.key}:`, error);
              urls[media.key] = "/placeholder.svg";
            }
          }
        }
        setSelectedMediaUrls(urls);
      };
      fetchSelectedUrls();
    }
  }, [selectedPortfolio]);

  return (
    <div className="relative min-h-screen bg-background">
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Our Works", `/${user.role == "agency" ? "agency" : "client"}`],
          ["Portfolio", ""],
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {portfolioItems?.map((item: PortfolioItem) => (
            <Card
              key={item._id}
                 onClick={() => {
                    setSelectedPortfolio(item);
                    setModals((prev) => ({
                      ...prev,
                      isDetialsModalOpen: true,
                    }));
                  }}
              className="overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <CardHeader className="p-0">
                <div className="relative">
                  {item.media.length > 0 && (
                    <div className="transform group-hover:scale-105 transition-transform duration-300">
                      <MediaItem
                        media={{
                          type: item.media[0]?.type || "text",
                          url: mediaUrls[item.media[0]?.key || ""] || "/placeholder.svg",
                        }}
                        isPreview={true}
                      />
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">
      
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {item.description}
                  </p>
                )}
              </CardContent>

              <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 mr-1" />
                  {item.createdAt && formatDate(new Date(item.createdAt))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {portfolioItems?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No portfolio items found.</p>
          </div>
        )}

        {user.role == "agency" && (
          <Button
            className="fixed bottom-5 right-5 shadow-lg"
            variant="outline"
            onClick={() =>
              setModals((prev) => ({
                ...prev,
                isAddPortfolioOpen: true,
              }))
            }
          >
            <SquarePen className="w-4 h-4 mr-2" />
            Create Portfolio
          </Button>
        )}
      </div>

      <AddPortfolio
        open={modals.isAddPortfolioOpen}
        onOpenChange={() =>
          setModals((prev) => ({
            ...prev,
            isAddPortfolioOpen: false,
          }))
        }
        refetch={refetch}
      />

      <DetailModal
        title="Portfolio Details"
        open={modals.isDetialsModalOpen}
        onOpenChange={() =>
          setModals((prev) => ({
            ...prev,
            isDetialsModalOpen: false,
          }))
        }
      >
        {selectedPortfolio && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">{selectedPortfolio.title}</h3>
              {selectedPortfolio.type && (
                <Badge variant="outline" className="mb-4">{selectedPortfolio.type}</Badge>
              )}
            </div>

            {selectedPortfolio.media?.length > 0 && (
              <div className="w-full">
                <Carousel className="w-full">
                  <CarouselContent>
                    {selectedPortfolio.media.map((media, index) => (
                      <CarouselItem key={index} className="pl-4">
                        <div className="flex justify-center">
                          {media.type === "image" && media.key && selectedMediaUrls[media.key] && (
                            <img
                              src={selectedMediaUrls[media.key]}
                              alt={`Media ${index + 1}`}
                              className="w-full max-w-2xl h-64 object-contain rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder.svg";
                              }}
                            />
                          )}
                          {media.type === "video" && media.key && selectedMediaUrls[media.key] && (
                            <MediaItem
                              media={{
                                type: "video",
                                url: selectedMediaUrls[media.key],
                              }}
                              isPreview={false}
                            />
                          )}
                          {media.type === "text" && (
                            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-10 h-10 text-gray-500" />
                              <span className="ml-2 text-gray-600">Text Document</span>
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            )}

            {selectedPortfolio.description && (
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground leading-relaxed max-h-[20rem] overflow-y-auto overflow-hidden">
                  {selectedPortfolio.description}
                </p>
              </div>
            )}

            {selectedPortfolio.createdAt && (
              <p className="text-sm text-muted-foreground">
                Created: {formatDate(new Date(selectedPortfolio.createdAt))}
              </p>
            )}
          </div>
        )}
      </DetailModal>
    </div>
  );
}