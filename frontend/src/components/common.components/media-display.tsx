import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Expand, Play } from 'lucide-react';

const MediaDisplay = ({ url, contentType }: { url: string, contentType: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(url,contentType)

  const isImage = contentType === "image";
  const isVideo = contentType === "video";

  if (!isImage && !isVideo) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="w-full overflow-hidden group relative cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            {isImage ? (
              <div className="relative">
                <img
                  src={url}
                  alt="Image attachment"
                  className="w-full h-60 "
                  />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Expand className="text-white" size={24} />
                </div>
              </div>
            ) : (
              <div className="relative">
                <video
                  src={url}
                  className="w-full h-60 "
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                  <Play className="text-white" size={36} fill="white" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
        {isImage ? (
          <img
            src={url}
            alt="Image attachment"
            className="w-full max-h-screen object-contain"
          />
        ) : (
          <video
            src={url}
            controls
            autoPlay
            className="w-full max-h-screen"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaDisplay;
