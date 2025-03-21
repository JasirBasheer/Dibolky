"use client"

import { useState } from "react"
import { Check, ChevronLeft, ChevronRight, Clock, Hash, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@radix-ui/react-select"
import { IPlatforms, IReviewBucket } from "@/types/common.types"



interface ContentDetailModalProps {
  content: IReviewBucket
  contentUrls: Record<string, string>
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function ContentDetailModal({ content, contentUrls, onClose, onApprove, onReject }: ContentDetailModalProps) {
  const [currentFileIndex, setCurrentFileIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentFileIndex((prev) => (prev === 0 ? content.files.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentFileIndex((prev) => (prev === content.files.length - 1 ? 0 : prev + 1))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejected</Badge>
      default:
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Pending</Badge>
    }
  }

  const currentFile = content.files[currentFileIndex]
  const isVideo = currentFile?.contentType.startsWith("video")

  return (
    <Dialog open={!!content} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold text-gray-800">Content Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Media Carousel */}
          <div className="relative bg-gray-900 aspect-square flex items-center justify-center">
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
                          className={`w-2 h-2 rounded-full ${index === currentFileIndex ? "bg-white" : "bg-white/50"}`}
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

          {/* Content Details */}
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              {getStatusBadge(content.status)}
              <span className="text-sm text-gray-500 flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {content.createdAt ? formatDate(content.createdAt) : "N/A"}
              </span>
            </div>

            <h3 className="text-lg font-medium text-gray-800 mb-2">Caption</h3>
            <p className="text-gray-600 mb-4">{content.caption || "No caption provided"}</p>

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
              <span className="text-sm font-medium text-gray-700">Platform:</span>

              {content.platforms.map((item: IPlatforms, index: number) => {
                return (
                  <Badge key={index} variant="outline" className="capitalize">
                    {item.platform || "Unknown"}
                  </Badge>
                )
              })}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-gray-700">Files:</span>
              <span className="text-sm text-gray-600">
                {content.files.length} {content.files.length === 1 ? "file" : "files"}
              </span>
            </div>

            <Separator className="my-4" />

            {content.status === "Pending" && (
              <div className="mt-auto flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => {
                    onReject(content._id)
                    onClose()
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    onApprove(content._id)
                    onClose()
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
  )
}

