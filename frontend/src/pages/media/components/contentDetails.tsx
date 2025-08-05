import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, FileText, ImageIcon, Video } from "lucide-react";
import { Link } from "react-router-dom";
import Comments from "./comments";
import { formatDate } from "@/utils/utils";
import { useState } from "react";

const MediaContentDetails = ({
  content,
  isLoading,
}: {
  content: any;
  isLoading: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
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

  function formatText(text: string): React.ReactNode {
    const lines = text.split("\n");
    return lines.map((line, index) => (
      <span key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </span>
    ));
  }

  return (
    <>
      {isLoading ? (
        <>
          <div className="w-full h-full transition-all duration-500 ease-in-out">
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
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="text-center p-4 rounded-lg">
                          <Skeleton className="h-8 w-16 mx-auto mb-2" />
                          <Skeleton className="h-4 w-12 mx-auto" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((comment) => (
                        <div key={comment} className="flex space-x-3">
                          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </>
      ) : !content ? (
        <div className="flex justify-center w-full h-full items-center">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold mt-2">Content Manager</h2>
            <p className="text-slate-500 mb-1">
              Manage all your social media content
            </p>
            <p className="text-slate-500 text-xs">
              Select a content item to view details and analytics.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full transition-all duration-500 ease-in-out">
          <div className="w-full md:h-[73px] h-[79px] bg-gray-100 flex items-center justify-between px-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage alt={content.media.username} />
                <AvatarFallback>{content.media.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-gray-800">
                  {/* {content.media.caption} */}
                </div>
                <div className="text-sm text-gray-600">
                  {content.media.platform} • {content.media.username}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                to={content.media.permalink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Open
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full md:h-[calc(100vh-73px)] h-[calc(100vh-79px)] bg-gray-50 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Content Preview</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      {getContentIcon(content.media.thumbnail_url)}

                      <Badge variant="outline" className="capitalize">
                        {content.media.media_type}{" "}
                        {formatDate(content.media.timestamp)}
                      </Badge>
                    </div>
                    {content.media.media_type == "VIDEO" ? (
                      <video
                        src={content.media.media_url}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    ) : (
                      <img
                        src={content.media.media_url || "/placeholder.svg"}
                        alt={`Media `}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    )}

                    <div className="prose max-w-none">
                      <p
                        className={`text-gray-700 transition-all ${
                          !expanded ? "line-clamp-3" : ""
                        }`}
                      >
                        {formatText(content.media.caption)}
                      </p>
                      {content.media.caption.length > 0 && (
                        <button
                          className="text-sm text-blue-600 mt-2"
                          onClick={() => setExpanded(!expanded)}
                        >
                          {expanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    Performance Analytics
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4  rounded-lg">
                      <div className="text-2xl font-bold text-black">
                        {content.media.platform == "instagram"
                          ? content.insights.find(
                              (item) => item.name == "likes"
                            ).values[0].value
                          : content.insights.find(
                              (item) => item.name == "post_impressions_organic"
                            ).values[0].value}
                      </div>
                      <div className="text-sm text-gray-600">Likes</div>
                    </div>
                    <div className="text-center p-4  rounded-lg">
                      <div className="text-2xl font-bold text-black">
                        {content.media.platform == "instagram"
                          ? content.insights.find(
                              (item) => item.name == "comments"
                            ).values[0].value
                          : content?.comments?.length}
                      </div>
                      <div className="text-sm text-gray-600">Comments</div>
                    </div>
                    {content.insights && (
                      <div className="text-center p-4  rounded-lg">
                        <div className="text-2xl font-bold ">
                          {content.media.platform == "instagram"
                            ? content.insights.find(
                                (item) => item.name == "reach"
                              ).values[0].value
                            : content.insights.find(
                                (item) =>
                                  item.name == "post_impressions_organic"
                              ).values[0].value}
                        </div>
                        <div className="text-sm text-gray-600">Views</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Comments content={content} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaContentDetails;
