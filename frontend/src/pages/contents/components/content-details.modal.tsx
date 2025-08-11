"use client";

import { useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Hash,
  SquarePen,
  X,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@radix-ui/react-select";
import type { IPlatforms, IReviewBucket } from "@/types/common";
import RescheduleContent from "./reschedule-modal";

interface ContentDetailModalProps {
  content: IReviewBucket;
  contentUrls: Record<string, string>;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onReschedule: (date:string,platformId:string, contentId:string) => void;
}

export function ContentDetailModal({
  content,
  contentUrls,
  onClose,
  onApprove,
  onReject,
  onReschedule,
}: ContentDetailModalProps) {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const handlePrevious = () => {
    setCurrentFileIndex((prev) =>
      prev === 0 ? content.files.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentFileIndex((prev) =>
      prev === content.files.length - 1 ? 0 : prev + 1
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Approved
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            Pending
          </Badge>
        );
    }
  };

  const currentFile = content.files[currentFileIndex];
  const isVideo = currentFile?.contentType.startsWith("video");

  const renderReason = () => {
    if (!content.reason) return null;

    const reasonText = content.reason?.note?.toString() ?? "";

    const bulletPoints: string[] = [];
    const lines = reasonText.split("\n");

    let additionalNotes = "";

    let inBulletPoints = false;

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith("Rejection reasons:")) {
        inBulletPoints = true;
        continue;
      }

      if (inBulletPoints && trimmedLine.startsWith("•")) {
        bulletPoints.push(trimmedLine.substring(1).trim());
      } else if (trimmedLine === "") {
        if (bulletPoints.length > 0) {
          inBulletPoints = false;
        }
      } else if (
        !inBulletPoints &&
        trimmedLine !== "" &&
        !trimmedLine.startsWith("Rejection reasons:")
      ) {
        additionalNotes += (additionalNotes ? " " : "") + trimmedLine;
      }
    }

    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <div className="flex items-start gap-2 mb-3">
          <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <h3 className="font-medium text-gray-900">Content Rejected</h3>
        </div>

        {bulletPoints.length > 0 && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Reasons:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              {bulletPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {additionalNotes && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Additional Notes:
            </p>
            <p className="text-sm text-gray-600">{additionalNotes}</p>
          </div>
        )}
      </div>
    );
  };


  const handleReschedulePlatformDate = (date:string,platformId:string) =>{
    onReschedule(date,platformId,content._id)
  }

  const handleCloseRecheduleModal = () =>{
    setIsRescheduleModalOpen(false)
    onClose()
  }

  return (
   <>
    <Dialog open={!!content} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Content Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="relative bg-gray-900  aspect-square flex items-center justify-center">
            {content.files && content.files.length > 0 ? (
              <>
                <div className="w-full h-full flex items-center justify-center">
                  {isVideo ? (
                    <video
                      src={contentUrls[currentFile.key]}
                      className="max-w-full max-h-full object-contain"
                      controls
                      autoPlay
                    />
                  ) : (
                    <img
                      src={contentUrls[currentFile.key] || "/placeholder.svg"}
                      alt={currentFile.fileName}
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                </div>

                {content.files.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full h-8 w-8"
                      onClick={handlePrevious}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full h-8 w-8"
                      onClick={handleNext}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>

                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                      {content.files.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentFileIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                          onClick={() => setCurrentFileIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-white/70">No media available</div>
            )}
          </div>

          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              {getStatusBadge(content.status)}
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {content.createdAt ? formatDate(content.createdAt) : "N/A"}
              </span>
            </div>

            <h3 className="text-lg font-medium text-gray-800 mb-2">Caption</h3>
            <p className="text-gray-600 mb-4">
              {content.caption || "No caption provided"}
            </p>

            {content.tags && content.tags.length > 0 && (
              <>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {content.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50">
                      <Hash className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </>
            )}

            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-gray-700">
                Platform:
              </span>

              {content.platforms.map((item: IPlatforms, index: number) => {
                return (
                  <Badge key={index} variant="outline" className="capitalize">
                    {item.platform || "Unknown"}
                  </Badge>
                );
              })}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-gray-700">
                is Scheduled:
              </span>
              {content.platforms.find((p) => p.scheduledDate != "") ? (
                <Badge variant="default">Scheduled</Badge>
              ) : (
                <Badge variant="outline">Not Scheduled</Badge>
              )}
            </div>
            {content.platforms.some((p) => p.scheduledDate) && (
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">Scheduled Timings</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {content.platforms
                    .filter((p) => p.scheduledDate)
                    .map((p) => (
                      <div
                        key={p.platform}
                        className="flex items-center gap-2 bg-gray-100 p-2 rounded-md"
                      >
                        <div>                          
                          <SquarePen 
                          className="w-4 h-4 cursor-pointer text-black"
                          onClick={()=> {
                            setIsRescheduleModalOpen(true)
                            setSelectedPlatform(p._id)
                            }}/>
                        <Badge className="text-xs">{p.platform}</Badge>
                        </div>
                   
                        <Badge variant="outline">
                          {formatDate(p.scheduledDate.toString())}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-gray-700">Files:</span>
              <span className="text-sm text-gray-600">
                {content.files.length}{" "}
                {content.files.length === 1 ? "file" : "files"}
              </span>
            </div>

            <Separator className="my-4" />
            {renderReason()}
            <Separator className="my-4" />

            {content.status === "Pending" && (
              <div className="mt-auto flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => {
                    onReject(content._id);
                    onClose();
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    onApprove(content._id);
                    onClose();
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    {isRescheduleModalOpen && 
    <RescheduleContent 
    platform={content.platforms.find((p)=> p._id == selectedPlatform)}
    onSave={handleReschedulePlatformDate}
    onClose={handleCloseRecheduleModal}
    />
    }
    </>
  );
}
