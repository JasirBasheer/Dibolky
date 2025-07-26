import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUploadUrlApi } from "@/services";
import { createPortfolioApi } from "@/services/agency/post.services";
import axios from "axios";
import { UseQueryResult } from "@tanstack/react-query";

interface AddPortfolioProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: UseQueryResult["refetch"];
}

interface IPortfolio {
  title: string;
  description?: string;
  media: {
    type: string;
    url?: string;
  }[];
  tags?: string[];
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const AddPortfolio: React.FC<AddPortfolioProps> = ({ open, onOpenChange,refetch }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    type: "",
  });  
  const [medias, setMedias] = useState<{ type: string; file?: File; url?: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newMedia = Array.from(files).map((file) => ({
        type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "text",
        file,
      }));
      setMedias((prev) => [...prev, ...newMedia]);
    }
  };

  const uploadToS3 = async (file: File): Promise<{key:string,url:string,contentType:string}> => {
    try {
      const response = await getUploadUrlApi({fileName: file.name, fileType: file.type})
       await axios.put(response?.data?.s3file.url, file, {
                    headers: {
                        'Content-Type': response?.data?.s3file.contentType,
                        'Content-Disposition': 'inline',
                    },
                });
      return response.data.s3file
    } catch (error) {
      console.error("S3 upload error:", error);
      throw new Error("Failed to upload file to S3");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const uploadedMedia = await Promise.all(
        medias.map(async (media) => {
          if (media.file) {
            const {key} = await uploadToS3(media.file);
            return { type: media.type, key };
          }
          return media;
        })
      );

      const portfolioData: IPortfolio = {
        title: formData.title,
        description: formData.description,
        media: uploadedMedia,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0),
        type: formData.type,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = await createPortfolioApi(portfolioData)

      if (response.status == 200) {
        toast.success("Success: Portfolio created successfully");
        setFormData({ title: "", description: "", tags: "", type: "" });
        setMedias([]);
        onOpenChange(false);
        refetch()
      } else {
        throw new Error("Failed to save portfolio");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error: Failed to create portfolio");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Let's showcase</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Portfolio title"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your portfolio"
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select onValueChange={handleTypeChange} value={formData.type}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select portfolio type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portfolio">Portfolio</SelectItem>
                <SelectItem value="case_studies">Case Studies</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., design, web, mobile"
            />
          </div>
          <div>
            <Label htmlFor="media">Media</Label>
            <Input
              id="media"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
            {medias.length > 0 && (
              <div className="mt-2">
                <p>Selected files:</p>
                <ul className="list-disc pl-5">
                  {medias.map((media, index) => (
                    <li key={index}>{media.file?.name || media.url} ({media.type})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Create Portfolio"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

