"use client";

import type React from "react";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@radix-ui/react-select";
import {
  ArrowUpRight,
  Calendar,
  Facebook,
  Film,
  ImageIcon,
  Upload,
  MessageSquare,
  Camera,
  Linkedin,
  Twitter,
  Lock,
  Crown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  IContentData,
  IMetaAccount,
  IPlatforms,
  RootState,
} from "@/types/common";
import {
  closeCreateContentModal,
  toggleCreateContentModal,
} from "@/redux/slices/ui.slice";
import { useNavigate } from "react-router-dom";
import InstagramAccountModal from "../../../components/common/instagram.acccounts.list";
import { fetchConnections, getMetaPages } from "@/services/common/get.services";
import {
  InitiateS3BatchUpload,
  saveContentApi,
} from "@/services/common/post.services";
import axios from "@/utils/axios";
import { useQueryClient } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import { toast } from "sonner";

interface IPlatform {
  platform: string;
  scheduledDate: string;
}

interface IFile {
  file: File;
  type: string;
  id: string;
}

const CreateContentModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ui = useSelector((state: RootState) => state.ui);
  const user = useSelector((state: RootState) => state.user);
  const agency = useSelector((state: RootState) => state.agency);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<IPlatform[]>([]);
  const [selectedContentType, setSelectedContentType] =
    useState<string>("post");
  const [uploadedFile, setUploadedFile] = useState<File[]>([]);
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [caption, setCaption] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accounts, setAccounts] = useState<IMetaAccount[]>([]);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Content");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const PLATFORMS = [
    {
      name: "instagram",
      icon: <ImageIcon className="w-5 h-5 text-pink-500" />,
      supportedTypes: ["reel", "video", "story", "post"],
    },
    {
      name: "facebook",
      icon: <Facebook className="w-5 h-5 text-blue-600" />,
      supportedTypes: ["thought", "reel", "video", "story", "post"],
    },
    {
      name: "x",
      icon: <Twitter className="w-5 h-5 text-gray-900" />,
      supportedTypes: ["thought"],
    },
    {
      name: "linkedin",
      icon: <Linkedin className="w-5 h-5 text-blue-700" />,
      supportedTypes: ["thought", "reel", "video", "post"],
    },
  ];

  const CONTENT_TYPES = [
    {
      name: "thought",
      icon: <MessageSquare className="w-5 h-5 text-green-500" />,
      accepts: "",
      description: "Text-only post",
    },
    {
      name: "post",
      icon: <ImageIcon className="w-5 h-5 text-blue-500" />,
      accepts: "image/*",
      description: "Single or multiple images",
    },
    {
      name: "video",
      icon: <Film className="w-5 h-5 text-purple-500" />,
      accepts: "video/*",
      description: "Video content",
    },
    {
      name: "reel",
      icon: <Film className="w-5 h-5 text-orange-500" />,
      accepts: "video/*",
      description: "Short-form video",
    },
    {
      name: "story",
      icon: <Camera className="w-5 h-5 text-pink-500" />,
      accepts: "image/*, video/*",
      description: "24-hour temporary content",
    },
  ];

  const SUGGESTED_TIMES = {
    instagram: [
      {
        label: "Morning Peak",
        time: "09:00",
        description: "9:00 AM - High engagement",
      },
      {
        label: "Lunch Break",
        time: "12:30",
        description: "12:30 PM - Active users",
      },
      {
        label: "Evening Prime",
        time: "19:00",
        description: "7:00 PM - Peak activity",
      },
      {
        label: "Night Scroll",
        time: "21:30",
        description: "9:30 PM - Story time",
      },
    ],
    facebook: [
      {
        label: "Morning Coffee",
        time: "08:00",
        description: "8:00 AM - Commute time",
      },
      {
        label: "Lunch Hour",
        time: "13:00",
        description: "1:00 PM - Break time",
      },
      {
        label: "After Work",
        time: "18:00",
        description: "6:00 PM - Wind down",
      },
      {
        label: "Evening Social",
        time: "20:00",
        description: "8:00 PM - Social hour",
      },
    ],
    x: [
      {
        label: "Morning News",
        time: "07:30",
        description: "7:30 AM - News check",
      },
      {
        label: "Lunch Break",
        time: "12:00",
        description: "12:00 PM - Quick scroll",
      },
      {
        label: "Commute Home",
        time: "17:30",
        description: "5:30 PM - Travel time",
      },
      {
        label: "Evening Chat",
        time: "20:30",
        description: "8:30 PM - Discussion time",
      },
    ],
    linkedin: [
      {
        label: "Work Start",
        time: "08:30",
        description: "8:30 AM - Professional check",
      },
      {
        label: "Mid Morning",
        time: "10:00",
        description: "10:00 AM - Coffee break",
      },
      {
        label: "Lunch Network",
        time: "12:00",
        description: "12:00 PM - Networking time",
      },
      {
        label: "End of Day",
        time: "17:00",
        description: "5:00 PM - Wrap up time",
      },
    ],
  };

  const availableContentTypes = useMemo(() => {
    if (selectedPlatforms.length === 0) {
      return CONTENT_TYPES;
    }

    const supportedTypes = selectedPlatforms.reduce((acc, platform) => {
      const platformConfig = PLATFORMS.find(
        (p) => p.name === platform.platform
      );
      if (platformConfig) {
        return acc.filter((type) =>
          platformConfig.supportedTypes.includes(type.name)
        );
      }
      return acc;
    }, CONTENT_TYPES);

    return supportedTypes;
  }, [selectedPlatforms]);

  const isContentTypeSupported = useMemo(() => {
    if (selectedPlatforms.length === 0) return true;

    return selectedPlatforms.every((platform) => {
      const platformConfig = PLATFORMS.find(
        (p) => p.name === platform.platform
      );
      return platformConfig?.supportedTypes.includes(selectedContentType);
    });
  }, [selectedPlatforms, selectedContentType]);

  const handlePlatformToggle = (platformName: string) => {
    setSelectedPlatforms((prev) => {
      const exists = prev.find((p) => p.platform === platformName);
      if (exists) {
        return prev.filter((p) => p.platform !== platformName);
      } else {
        return [...prev, { platform: platformName, scheduledDate: "" }];
      }
    });
  };

  const handleScheduleChange = (platformName: string, date: string) => {
    setSelectedPlatforms((prev) =>
      prev.map((platform) =>
        platform.platform === platformName
          ? { ...platform, scheduledDate: date }
          : platform
      )
    );
  };

  const handleContentTypeChange = (contentType: string) => {
    setSelectedContentType(contentType);
    setUploadedFile([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(event.target.files || []);

    if (selectedContentType === "post" && files.length > 4) {
      files = files.slice(0, 4);
      toast.warning("Post limit is 4, only selected the first 4 images");
    } else if (
      ["video", "reel", "story"].includes(selectedContentType) &&
      files.length > 1
    ) {
      files = files.slice(0, 1);
      toast.warning("Only one file allowed for this content type");
    }

    setUploadedFile(files);
  };

  const handleUpload = async () => {
    if (!selectedPlatforms.length) {
      toast.error("Please select at least one platform");
      return;
    }

    if (!selectedContentType) {
      toast.error("Please select a content type");
      return;
    }

    if (selectedContentType !== "thought" && uploadedFile.length === 0) {
      toast.error("Please upload a file");
      return;
    }

    if (!caption.trim()) {
      toast.error("Please enter a caption");
      return;
    }

    if (isScheduled) {
      const unscheduledPlatforms = selectedPlatforms.filter(
        (p) => !p.scheduledDate
      );
      if (unscheduledPlatforms.length > 0) {
        toast.error(
          `Please set schedule time for: ${unscheduledPlatforms
            .map((p) => p.platform)
            .join(", ")}`
        );
        return;
      }
    }

    const requiredPlatforms: string[] = [];
    const connections = await fetchConnections(user.role == "agency"?"agency":"client", user.user_id, `?includes=social`)
    console.log(connections.data,"connnections")
    
    for (const item of selectedPlatforms as IPlatforms[]) {
      const platform = connections.data.connections.find((acc: { platform: string; })=> acc.platform == item.platform)
      if (!platform || (platform && !platform.is_valid)) {
        requiredPlatforms.push(item.platform);
      }
    }

    if (requiredPlatforms.length > 0) {
      navigate(
        `/agency/integrations?tab=social-integrations&required=${requiredPlatforms.join(
          ","
        )}&`
      );
      dispatch(toggleCreateContentModal());
      return;
    }

    if (
      selectedPlatforms.some((p: IPlatforms) =>
        ["instagram", "facebook"].includes(p.platform)
      ) &&
      !selectedAccount
    ) {
      setIsLoading(true);
      const response = await getMetaPages(user.role,user.user_id);
      setUploadButtonText("Upload now");
      setIsLoading(false);
      setAccounts(response?.data?.pages);
      setModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      const files = uploadedFile.map((file: File) => {
        const type = file.type.startsWith("video/") ? "video" : "post";
        return {
          file,
          type,
          id: `${Date.now()}-${Math.random().toString(36).substring(2)}-${
            file.name
          }`,
        };
      });

      const filesMetadata = files.map((file: IFile) => ({
        id: file.id,
        fileName: file.file.name,
        fileType: file.file.type,
        fileSize: file.file.size,
        contentType: file.type,
      }));

      const initResponse = await InitiateS3BatchUpload(filesMetadata);
      console.log(initResponse.data);
      console.log("initResponse.data");
      const uploadInfos = initResponse.data.filesInfo;
      const uploadedFiles = [];

      for (const fileObj of files) {
        const uploadInfo = uploadInfos.find(
          (info: { fileId: string }) => info.fileId === fileObj.id
        );

        if (!uploadInfo) {
          console.error(`No upload information found for file ${fileObj.id}`);
          continue;
        }

        try {
          await axios.put(uploadInfo.url, fileObj.file, {
            headers: {
              "Content-Type": fileObj.file.type,
              "Content-Disposition": "inline",
            },
            withCredentials: false,
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

      const contentData: IContentData = {
        files: uploadedFiles.map((file) => ({
          fileName: file.fileName,
          contentType: file.contentType,
          key: file.key,
          uploadedAt: new Date().toISOString(),
        })),
        metadata: {
          caption,
          metaAccountId: selectedAccount || "",
          isScheduled: isScheduled,
        },
        platforms: selectedPlatforms,
        contentType: selectedContentType,
      };

      const savedContent = await saveContentApi(
        user.user_id == agency.user_id ? "agency" : "client",
        user.user_id == agency.user_id ? agency.user_id : user.user_id,
        contentData
      );
      setIsLoading(false);
      setSelectedPlatforms([]);
      setSelectedContentType("post");
      setUploadedFile([]);
      setIsScheduled(false);
      setCaption("");
      await queryClient.invalidateQueries({ queryKey: ["contents"] });
      dispatch(closeCreateContentModal());

      if (savedContent) {
        toast.success(
          `Content ${isScheduled ? "scheduled" : "uploaded"} successfully!`
        );
      } else {
        toast.error("Failed to upload content");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Upload failed");
    }finally{
      setIsLoading(false);
    }

    console.log("Upload data:", {
      platforms: selectedPlatforms,
      contentType: selectedContentType,
      files: uploadedFile,
      caption,
      isScheduled,
    });
  }

  const handleClose = () => {
    setSelectedPlatforms([]);
    setSelectedContentType("post");
    setUploadedFile([]);
    setIsScheduled(false);
    setCaption("");
    dispatch(toggleCreateContentModal());
  };

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccount(accountId);
    setTimeout(() => setModalOpen(false), 200);
  };

  const needsFileUpload = selectedContentType !== "thought";

  return (
    <Dialog open={ui.createContentModalOpen} onOpenChange={handleClose}>
      {!user.permissions.includes("Content & Projects") ? (
        <DialogContent className="sm:max-w-lg w-full sm:max-h-[90vh] p-0 gap-0 overflow-hidden sm:rounded-lg">
          <ScrollArea className="max-h-[calc(90vh-4rem)]">
            <div className="p-8">
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-gray-600" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    This feature is locked
                  </h3>
                  <p className="text-gray-600">
                    Upgrade your plan for content management features
                  </p>
                </div>

                <Button className="w-full" size="lg">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-lg md:max-w-2xl w-full sm:max-h-[90vh]  p-0 gap-0 overflow-hidden sm:rounded-lg">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl font-bold">
              Create Content
            </DialogTitle>
          </DialogHeader>

          <InstagramAccountModal
            accounts={accounts}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSelect={handleAccountSelect}
          />

          <ScrollArea className="max-h-[calc(90vh-4rem)]">
            <div className="px-6 py-4 space-y-6">
              <section>
                <h2 className="text-sm text-gray-800 dark:text-gray-200 font-bold mb-3">
                  Distribution Channels
                </h2>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((platform) => (
                    <Button
                      key={platform.name}
                      variant={
                        selectedPlatforms.some(
                          (p) => p.platform === platform.name
                        )
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handlePlatformToggle(platform.name)}
                      className="flex items-center gap-2 h-9 px-3 py-1 text-sm"
                      size="sm"
                    >
                      {platform.icon}
                      <span className="capitalize">{platform.name}</span>
                    </Button>
                  ))}
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-sm text-gray-800 dark:text-gray-200 font-bold mb-3">
                  Content Format
                </h2>
                <div className="flex flex-wrap gap-2">
                  {availableContentTypes.map((type) => (
                    <Button
                      key={type.name}
                      variant={
                        selectedContentType === type.name
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleContentTypeChange(type.name)}
                      className="flex items-center gap-2 h-9 px-3 py-1 text-sm"
                      size="sm"
                      disabled={
                        selectedPlatforms.length > 0 &&
                        !selectedPlatforms.every((platform) => {
                          const platformConfig = PLATFORMS.find(
                            (p) => p.name === platform.platform
                          );
                          return platformConfig?.supportedTypes.includes(
                            type.name
                          );
                        })
                      }
                    >
                      {type.icon}
                      <span className="capitalize">{type.name}</span>
                    </Button>
                  ))}
                </div>
                {selectedPlatforms.length > 0 && !isContentTypeSupported && (
                  <p className="text-sm text-red-500 mt-2">
                    This content type is not supported by all selected platforms
                  </p>
                )}
              </section>

              <Separator />

              {needsFileUpload && (
                <section className="space-y-4">
                  <h2 className="text-sm text-gray-800 dark:text-gray-200 font-bold">
                    Upload Content
                  </h2>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      className="hidden"
                      id="fileUpload"
                      onChange={handleFileUpload}
                      accept={
                        CONTENT_TYPES.find(
                          (t) => t.name === selectedContentType
                        )?.accepts
                      }
                      multiple={selectedContentType === "post"}
                    />
                    <label
                      htmlFor="fileUpload"
                      className="cursor-pointer block"
                    >
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-1 text-sm dark:text-gray-200 font-bold">
                        Drag and drop your file here or click to browse
                      </p>
                      <p className="text-xs text-gray-400">
                        {selectedContentType === "post"
                          ? "You can upload up to 4 images"
                          : "Only one file allowed"}
                      </p>
                    </label>
                    {uploadedFile.length > 0 && (
                      <div className="mt-4 space-y-1">
                        {uploadedFile.map((file, index) => (
                          <p
                            key={index}
                            className="text-sm text-gray-600 flex items-center justify-center"
                          >
                            <span className="w-4 h-4 mr-1 text-green-500">
                              ✓
                            </span>
                            {file.name}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}

              <section className="space-y-2">
                <label
                  htmlFor="caption"
                  className="block text-sm text-gray-800 dark:text-gray-200 font-bold"
                >
                  Caption
                </label>
                <textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Enter your caption..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary focus:border-primary transition-colors placeholder:text-gray-400 min-h-[80px] text-sm"
                />
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="schedule"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <label
                    htmlFor="schedule"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-200 font-bold text-sm">
                      Schedule Post
                    </span>
                  </label>
                </div>

                {isScheduled && selectedPlatforms.length > 0 && (
                  <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          Suggested Times for Better Performance
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const now = new Date();
                            const tomorrow9AM = new Date(now);
                            tomorrow9AM.setDate(tomorrow9AM.getDate() + 1);
                            tomorrow9AM.setHours(9, 0, 0, 0);

                            const year = tomorrow9AM.getFullYear();
                            const month = String(
                              tomorrow9AM.getMonth() + 1
                            ).padStart(2, "0");
                            const day = String(tomorrow9AM.getDate()).padStart(
                              2,
                              "0"
                            );
                            const hours = String(
                              tomorrow9AM.getHours()
                            ).padStart(2, "0");
                            const minutes = String(
                              tomorrow9AM.getMinutes()
                            ).padStart(2, "0");
                            const timeString = `${year}-${month}-${day}T${hours}:${minutes}`;

                            setSelectedPlatforms((prev) =>
                              prev.map((platform) => ({
                                ...platform,
                                scheduledDate: timeString,
                              }))
                            );
                          }}
                          className="text-xs"
                        >
                          Apply 9 AM Tomorrow to All
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedPlatforms.map((platform) => {
                          const suggestions =
                            SUGGESTED_TIMES[
                              platform.platform as keyof typeof SUGGESTED_TIMES
                            ] || [];
                          const platformConfig = PLATFORMS.find(
                            (p) => p.name === platform.platform
                          );

                          return (
                            <div
                              key={platform.platform}
                              className="border border-gray-200 dark:border-gray-600 rounded-lg p-3"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {platformConfig?.icon}
                                <span className="text-sm capitalize font-medium">
                                  {platform.platform}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-1">
                                {suggestions.map((suggestion) => {
                                  const tomorrow = new Date();
                                  tomorrow.setDate(tomorrow.getDate() + 1);
                                  const [hours, minutes] =
                                    suggestion.time.split(":");
                                  tomorrow.setHours(
                                    Number.parseInt(hours),
                                    Number.parseInt(minutes),
                                    0,
                                    0
                                  );

                                  const year = tomorrow.getFullYear();
                                  const month = String(
                                    tomorrow.getMonth() + 1
                                  ).padStart(2, "0");
                                  const day = String(
                                    tomorrow.getDate()
                                  ).padStart(2, "0");
                                  const formattedHours = String(
                                    tomorrow.getHours()
                                  ).padStart(2, "0");
                                  const formattedMinutes = String(
                                    tomorrow.getMinutes()
                                  ).padStart(2, "0");
                                  const timeString = `${year}-${month}-${day}T${formattedHours}:${formattedMinutes}`;

                                  return (
                                    <Button
                                      key={suggestion.label}
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleScheduleChange(
                                          platform.platform,
                                          timeString
                                        )
                                      }
                                      className="h-auto p-2 text-left flex flex-col items-start hover:bg-primary/10"
                                      title={suggestion.description}
                                    >
                                      <span className="text-xs font-medium text-primary">
                                        {suggestion.label}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {suggestion.time}
                                      </span>
                                    </Button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Or set custom times:
                      </h3>
                      {selectedPlatforms.map((platform) => {
                        const platformConfig = PLATFORMS.find(
                          (p) => p.name === platform.platform
                        );
                        return (
                          <div
                            key={platform.platform}
                            className="flex items-center gap-3"
                          >
                            <div className="flex items-center gap-2 min-w-[120px]">
                              {platformConfig?.icon}
                              <span className="text-sm capitalize font-medium">
                                {platform.platform}
                              </span>
                            </div>
                            <input
                              type="datetime-local"
                              value={platform.scheduledDate}
                              onChange={(e) =>
                                handleScheduleChange(
                                  platform.platform,
                                  e.target.value
                                )
                              }
                              className="border border-gray-200 rounded px-3 py-1.5 text-sm flex-1"
                            />
                            {platform.scheduledDate && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedPlatforms((prev) =>
                                    prev.map((p) =>
                                      p.platform !== platform.platform
                                        ? {
                                            ...p,
                                            scheduledDate:
                                              platform.scheduledDate,
                                          }
                                        : p
                                    )
                                  );
                                }}
                                className="text-xs px-2 py-1 h-auto"
                                title="Apply this time to all other platforms"
                              >
                                Apply to All
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t px-6 py-4 flex justify-end">
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 mt-1 sm:flex-initial bg-transparent"
                >
                  Cancel
                </Button>
                {isLoading ? (
                  <Skeleton  width={141} height={36} />
                ) : (
                  <Button
                    onClick={handleUpload}
                    disabled={
                      selectedPlatforms.length === 0 ||
                      !selectedContentType ||
                      (needsFileUpload && uploadedFile.length === 0) ||
                      !caption.trim()
                    }
                    className="flex-1 mt-1 sm:flex-initial"
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    {isScheduled ? "Schedule Content" : uploadButtonText}
                  </Button>
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default CreateContentModal;
