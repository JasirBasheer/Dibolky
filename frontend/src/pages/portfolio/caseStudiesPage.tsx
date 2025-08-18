import { Calendar, Play, FileText, ArrowRight, Clock, SquarePen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/types";
import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";
import { getAllPortfoliosApi, getSignedUrlApi } from "@/services";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AddPortfolio } from "./components/addPortfolio";
import DetailModal from "@/components/modals/details-modal";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Media {
  type: "image" | "video" | "text";
  url?: string;
  key?: string;
  _id?:string
}

interface PortfolioItem {
  _id: string;
  title: string;
  description?: string;
  type?: string;
  media: Media[];
  createdAt?: string;
  tags?: string[];
  updatedAt?:string;
}

function MediaItem({
  media,
}: {
  media: { type: "image" | "video" | "text"; url?: string };
}) {
  if (media.type === "image" && media.url) {
    return (
      <img
        src={media.url}
        alt="Case study media"
        width={600}
        height={400}
        className="w-full h-48 object-cover rounded-lg"
      />
    );
  }

  if (media.type === "video" && media.url) {
    return (
      <div className="relative w-full h-48 bg-muted rounded-lg flex items-center justify-center">
        <Play className="w-12 h-12 text-muted-foreground" />
        <video
          src={media.url}
          width={600}
          height={400}
          className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-50"
        />
      </div>
    );
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

function getReadingTime(description: string) {
  const wordsPerMinute = 200;
  const wordCount = description.split(" ").length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min read`;
}

export const CaseStudiesPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const [selectedCaseStudy, setSelectedCaseStudy] =
    useState<PortfolioItem | null>(null);
  const [mediaUrls, setMediaUrls] = useState<{ [key: string]: string }>({});
  const [modals, setModals] = useState({
    isAddPortfolioOpen: false,
    isDetialsModalOpen: false,
  });

  const {
    data: caseStudies,
    isLoading: isCaseStudiesLoading,
    refetch,
  } = useQuery({
    queryKey: ["get-caseStudies"],
    queryFn: () => getAllPortfoliosApi("?type=case_studies"),
    select: (data) => data?.data.portfolios,
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (caseStudies) {
      const fetchUrls = async () => {
        const urls: { [key: string]: string } = {};
        for (const caseStudy of caseStudies) {
          for (const media of caseStudy.media) {
            if (media.key && media.type !== "text") {
              try {
                const signedUrl = await getSignedUrlApi(media.key);
                if (signedUrl?.data?.signedUrl) {
                  urls[media.key] = signedUrl.data.signedUrl;
                } else {
                  console.error(`Invalid signed URL response for ${media.key}`);
                }
              } catch (error) {
                console.error(
                  `Failed to fetch signed URL for ${media.key}:`,
                  error
                );
              }
            }
          }
        }
        setMediaUrls(urls);
      };
      fetchUrls();
    }
  }, [caseStudies]);



  return (
    <div className="min-h-screen bg-background">
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Our Works", `/${user.role == "agency" ? "agency" : "client"}/`],
          ["Case Studies", ""],
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {caseStudies?.map((caseStudy) => (
            <Card
              key={caseStudy._id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden">
                  {caseStudy.media.length > 0 && (
                    <div className="transform group-hover:scale-105 transition-transform duration-300">
                      <MediaItem
                        media={{
                          type: caseStudy.media[0]?.type || "text",
                          url:
                            mediaUrls[caseStudy.media[0]?.key] ||
                            "/placeholder.svg",
                        }}
                      />
                    </div>
                  )}
                  {caseStudy.media.length > 1 && (
                    <Badge
                      variant="secondary"
                      className="absolute top-3 right-3"
                    >
                      {caseStudy.media.length} assets
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {caseStudy.type && (
                  <Badge variant="outline" className="mb-2 text-xs font-medium">
                    {caseStudy.type}
                  </Badge>
                )}

                <h3 className="text-md font-bold  line-clamp-2 group-hover:text-primary transition-colors">
                  {caseStudy.title.toUpperCase()}
                </h3>

                {caseStudy.description && (
                  <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                    {caseStudy.description}
                  </p>
                )}


              </CardContent>

              <CardFooter className="px-6 pb-3 pt-0 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {caseStudy.createdAt &&
                      formatDate(new Date(caseStudy.createdAt))}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {getReadingTime(caseStudy.description || "")}
                  </div>
                </div>

                <Button
                  key={caseStudy._id}
                  variant="ghost"
                  size="sm"
                  className="group/btn"
                  onClick={() => {
                    console.log(caseStudy,"casetudhin clicked")
                    setSelectedCaseStudy(caseStudy)
                    setModals((prev)=>({...prev,isDetialsModalOpen:!prev.isDetialsModalOpen}))
                  }}
                >
                  Read Case Study
                  <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
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
            isAddPortfolioOpen: !prev.isAddPortfolioOpen,
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
            isDetialsModalOpen: !prev.isDetialsModalOpen,
          }))
        }
      >
        {selectedCaseStudy && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{selectedCaseStudy.title}</h3>
           <div className="w-full">
      <Carousel className="w-full">
        <CarouselContent>
          {selectedCaseStudy.media?.map((media, index) => (
            <CarouselItem key={index} className="pl-4">
              {media.type === "image" && media.key && mediaUrls[media.key] && (
                <img
                  src={mediaUrls[media.key] || "/placeholder.svg"}
                  alt={`Media ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              {media.type === "video" && media.key && mediaUrls[media.key] && (
                <video
                  src={mediaUrls[media.key]}
                  controls
                  className="w-full h-64 object-contain rounded-lg"
                />
              )}
              {media.type === "text" && (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-500" />
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious />
        <CarouselNext /> */}
      </Carousel>
    </div>
            {selectedCaseStudy.description && (
                <p className="text-muted-foreground leading-relaxed max-h-[20rem] overflow-y-auto overflow-hidden">
                  {selectedCaseStudy.description}
                </p>
            )}
            {selectedCaseStudy.createdAt && (
              <p className="text-sm text-muted-foreground">
                Created: {formatDate(new Date(selectedCaseStudy.createdAt))}
              </p>
            )}
            {selectedCaseStudy.type && (
              <Badge variant="outline">{selectedCaseStudy.type}</Badge>
            )}
          </div>
        )}
      </DetailModal>
    </div>
  );
};
