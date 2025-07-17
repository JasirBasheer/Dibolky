import type React from "react"

import { useState, useRef } from "react"
import { Paperclip, X, FileText, Film, Tag } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/utils/shardcn"
import axios from "axios"
import { InitiateS3BatchUpload } from "@/services/common/post.services"
import { IFile, RootState } from "@/types/common.types"
import { rejectContentApi } from "@/services/common/post.services"
import { useSelector } from "react-redux"

interface MediaItem {
  type: "image" | "video" | "file"
  url: string
  fileName?: string
  file?: File 
}

interface ContentDetailModalProps {
  contentId: string
  onClose: () => void
}

const COMMON_REASONS = [
  { id: "audio-quality", label: "Audio/music quality is poor" },
  { id: "content-irrelevant", label: "Content is irrelevant to target audience" },
  { id: "branding-issues", label: "Doesn't align with brand guidelines" },
  { id: "copyright-concerns", label: "Potential copyright concerns" },
]



export function RejectContentModal({ contentId, onClose }: ContentDetailModalProps) {
  const user = useSelector((state: RootState) => state.user)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [note, setNote] = useState("")
  const [media, setMedia] = useState<MediaItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedReasons, setSelectedReasons] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newMedia: MediaItem[] = []

    Array.from(files).forEach((file) => {
      const fileType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file"

      newMedia.push({
        type: fileType,
        url: URL.createObjectURL(file),
        fileName: file.name,
        file,
      })
    })

    setMedia([...media, ...newMedia])
    e.target.value = ""
  }

  const removeMedia = (index: number) => {
    const newMedia = [...media]
    if (newMedia[index].url.startsWith("blob:")) {
      URL.revokeObjectURL(newMedia[index].url)
    }
    newMedia.splice(index, 1)
    setMedia(newMedia)
  }

  const toggleReason = (reasonId: string) => {
    if (selectedReasons.includes(reasonId)) {
      setSelectedReasons(selectedReasons.filter((id) => id !== reasonId))
    } else {
      setSelectedReasons([...selectedReasons, reasonId])
    }
  }

  const applySelectedReasons = () => {
    const selectedReasonTexts = selectedReasons
      .map((id) => COMMON_REASONS.find((reason) => reason.id === id)?.label)
      .filter(Boolean)
      .join("\n• ")

    if (selectedReasonTexts) {
      const newNote = note
        ? `${note}\n\nRejection reasons:\n• ${selectedReasonTexts}`
        : `Rejection reasons:\n• ${selectedReasonTexts}`
      setNote(newNote)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setNote(value)
  }



  const handleSubmit = async () => {
    if (!note.trim() && selectedReasons.length === 0) {
      setError("Please provide a reason for rejection")
      return
    }

    if (selectedReasons.length > 0 && !note.includes("Rejection reasons:")) {
      applySelectedReasons()
      return
    }

    setIsSubmitting(true)
    setError(null)


    try {
      const uploadedFiles = [];

      if (media.length > 0) {
        const files = media.map((file) => {
          const type = file.type.startsWith('video/') ? 'video' : 'image';
          return {
            file: file.file,
            type,
            id: `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.fileName}`,
          } as IFile
        });


        const filesMetadata = files.map((file: IFile) => ({
          id: file.id,
          fileName: file.file.name,
          fileType: file.file.type,
          fileSize: file.file.size,
          contentType: file.type,
        }));

        const initResponse = await InitiateS3BatchUpload(filesMetadata);
        const uploadInfos = initResponse.data.filesInfo;

        for (const fileObj of files) {
          const uploadInfo = uploadInfos.find((info: { fileId: string }) => info.fileId === fileObj.id);

          if (!uploadInfo) {
            console.error(`No upload information found for file ${fileObj.id}`);
            continue;
          }

          try {
            await axios.put(uploadInfo.url, fileObj.file, {
              headers: {
                'Content-Type': fileObj.file.type,
                'Content-Disposition': 'inline',
              },
            });


            uploadedFiles.push({
              id: fileObj.id,
              fileName: fileObj.file.name,
              contentType: fileObj.type,
              key: uploadInfo.key,
            });

          } catch (error) {
            console.error(`Error uploading file ${fileObj.id}:`, error);
            throw error;
          }
        }
    
      }

      const combinedNote = { 
        entityType:"content",
        entityId:contentId, 
        addedBy:user.user_id,
        addedByModel: user.role === "agency-client" ? "Client" : "Ownerdetail", 
        note: typeof note === "string" ? note : "", 
        media: [...(uploadedFiles || [])]
       };

      await rejectContentApi(contentId,combinedNote);

      setIsSubmitting(false)
      setTimeout(()=> onClose(),500)
    
    } catch (error) {
      console.log(error)
    }
  }




  return (
    <Dialog open={!!contentId} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">Reject Content</DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-2">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Common Rejection Reasons</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {COMMON_REASONS.map((reason) => (
                  <Button
                    key={reason.id}
                    type="button"
                    variant={selectedReasons.includes(reason.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleReason(reason.id)}
                    className={cn(
                      "h-auto py-1 px-3 text-xs",
                      selectedReasons.includes(reason.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground",
                    )}
                  >
                    {reason.label}
                  </Button>
                ))}
              </div>
              {selectedReasons.length > 0 && (
                <Button variant="secondary" size="sm" onClick={applySelectedReasons} className="mb-3">
                  <Tag className="h-3.5 w-3.5 mr-1.5" />
                  Apply Selected Reasons
                </Button>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="rejection-reason" className="text-sm font-medium">
                  Rejection Note <span className="text-red-500">*</span>
                </Label>
              </div>
              <div className="relative mt-1.5">
                <Textarea
                  ref={textareaRef}
                  id="rejection-reason"
                  placeholder="Please explain why this content is being rejected..."
                  className="min-h-[120px]"
                  value={note}
                  onChange={handleTextareaChange}
                />

              </div>
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>

            <div>
              <Label className="text-sm font-medium mb-1.5 block">Attachments (Optional)</Label>

              {media.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  {media.map((item, index) => (
                    <div key={index} className="relative group border rounded-md overflow-hidden h-24 bg-muted/30">
                      {item.type === "image" ? (
                        <img
                          src={item.url || "/placeholder.svg"}
                          alt={item.fileName || "Attachment"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full p-2">
                          {item.type === "video" ? (
                            <Film className="h-8 w-8 text-muted-foreground" />
                          ) : (
                            <FileText className="h-8 w-8 text-muted-foreground" />
                          )}
                          <span className="text-xs text-muted-foreground mt-1 text-center line-clamp-2">
                            {item.fileName}
                          </span>
                        </div>
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeMedia(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center">
                <Label
                  htmlFor="file-upload"
                  className={cn(
                    "flex items-center gap-2 text-sm border rounded-md px-3 py-2 cursor-pointer",
                    "hover:bg-muted/50 transition-colors",
                  )}
                >
                  <Paperclip className="h-4 w-4" />
                  <span>Attach files</span>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                </Label>
                <p className="text-xs text-muted-foreground ml-3">Images, videos, and documents</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 flex gap-2 flex-row">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white">
            {isSubmitting ? "Submitting..." : "Reject Content"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

