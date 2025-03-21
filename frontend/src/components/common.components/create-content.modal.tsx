import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { IContentData, IFile, IMetaAccount, IPlatforms, RootState } from '@/types/common.types';
import { toggleCreateContentModal } from '@/redux/slices/ui.slice';
import { Button } from '../ui/button';
import InstagramAccountModal from './instagram.acccounts.list';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { getMetaPages } from '@/services/common/get.services';
import { InitiateS3BatchUpload, saveContentApi } from '@/services/common/post.services';
import axios from 'axios';
import { ArrowUpRight, Calendar, Facebook, Film, Image, Instagram, Upload } from 'lucide-react';
import { Separator } from '@radix-ui/react-select';
import { ScrollArea } from '../ui/scroll-area';

const CreateContent = () => {
  const ui = useSelector((state: RootState) => state.ui)
  const dispatch = useDispatch()
  const [selectedPlatforms, setSelectedPlatforms] = useState<IPlatforms[]>([]);
  const [selectedContentType, setSelectedContentType] = useState<string>("Reel");
  const [uploadedFile, setUploadedFile] = useState<File[]>([]);
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [caption, setCaption] = useState<string>("")
  const user = useSelector((state: RootState) => state.user);
  const agency = useSelector((state: RootState) => state.agency);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accounts, setAccounts] = useState<IMetaAccount[]>([])
  const navigate = useNavigate()



  const PLATFORMS = [
    {
      name: 'instagram',
      icon: <Instagram className="w-5 h-5 text-pink-500" />,
      uploadTypes: ['image', 'video', 'reel']
    },
    {
      name: 'facebook',
      icon: <Facebook className="w-5 h-5 text-blue-600" />,
      uploadTypes: ['image', 'video', 'post']
    },
  ];


  const CONTENT_TYPES = [
    {
      name: 'Post',
      icon: <Image className="w-5 h-5 text-blue-500" />,
      accepts: 'image/*, video/*'
    },
    {
      name: 'Reel',
      icon: <Film className="w-5 h-5 text-blue-500" />,
      accepts: 'video/*'
    }
  ];


  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => prev.some(p => p.platform === platform) ? prev.filter(p => p.platform !== platform)
      : [...prev, { platform: platform, scheduledDate: '' }]
    );
  };



  const handleSchedule = (date: string) => {
    setSelectedPlatforms(prev => prev.map(item => ({
      ...item, scheduledDate: date
    }))
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    let file = Array.from(event.target.files || []);
    if (file.length > 4) {
      file = file.splice(0, 4)
      message.warning("Since post limit is 4 , only selected the first 4 images")
    }
    if (file) {
      setUploadedFile(file)
    }
  }



  const handleUpload = async () => {

    if (!uploadedFile || !selectedContentType ||
      !selectedPlatforms || !caption ||
      selectedPlatforms.length === 0
    ) {
      message.error('Full the inputs accordingly inorder to upolad content')
      return
    }


    const requiredPlatforms: string[] = []
    for (const item of selectedPlatforms as IPlatforms[]) {
      if (item.platform == 'instagram' && user.instagramAccessToken == "") {
        requiredPlatforms.push('instagram')
      } else if (item.platform == 'facebook' && user.facebookAccessToken == "") {
        requiredPlatforms.push('facebook')
      }
    }


    if (requiredPlatforms.length > 0) {
      navigate(`/agency/settings?tab=social-integrations&required=${requiredPlatforms.join(',')}&`)
      dispatch(toggleCreateContentModal())
      return
    }


    if (selectedPlatforms.some((p: IPlatforms) => ['instagram', 'facebook'].includes(p.platform)) && !selectedAccount) {

      const response = await getMetaPages(!user.facebookAccessToken ? user.instagramAccessToken : user.facebookAccessToken)
      setAccounts(response?.data?.pages)
      setModalOpen(true)
      return
    }

    try {
      const files = uploadedFile.map((file: File) => {
        const type = file.type.startsWith('video/') ? 'video' : 'photo';
        return {
          file,
          type,
          id: `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`,
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
      const uploadInfos = initResponse.data.filesInfo;
      const uploadedFiles = [];

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

      const contentData: IContentData = {
        files: uploadedFiles.map(file => ({
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
        contentType: selectedContentType
      };

      const savedContent = await saveContentApi(
        user.user_id == agency.user_id ? "agency" : "client",
        user.user_id == agency.user_id ? agency.user_id : user.user_id,
        contentData
      );

      setUploadedFile([]);
      setSelectedContentType("");
      setSelectedPlatforms([]);
      setCaption('');
      setSelectedAccount('');

      if (savedContent) {
        message.success(`Content ${isScheduled ? 'scheduled' : 'uploaded'} successfully!`);
      } else {
        message.error('Failed to upload content');
      }

    } catch (error) {
      console.error('Upload Error:', error);
      message.error('Upload failed');
    }
  }


  const handleOpenChange = () => {
    dispatch(toggleCreateContentModal());
  };

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccount(accountId);
    setTimeout(() => setModalOpen(false), 200);
  };

  return (
    <Dialog open={ui.createContentModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl w-full sm:max-h-[90vh] h-full p-0 gap-0 overflow-hidden sm:rounded-lg">
        <DialogHeader className="  px-6 py-4 border-b">
          <DialogTitle className="text-xl font-lazare font-bold">Create Content</DialogTitle>
        </DialogHeader>

        <InstagramAccountModal
        accounts={accounts}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleAccountSelect}
      />
        <ScrollArea className="max-h-[calc(90vh-4rem)]">
          <div className="px-6 py-4 space-y-9">
            <section>
              <h2 className="text-sm  text-gray-800 dark:text-gray-200 font-lazare font-bold mb-3">Distribution Channels</h2>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((platform) => (
                  <Button
                    key={platform.name}
                    variant={selectedPlatforms.some((p) => p.platform === platform.name) ? "default" : "outline"}
                    onClick={() => handlePlatformToggle(platform.name)}
                    className={`flex items-center gap-2 h-9 px-3 py-1 text-sm transition-all ${selectedPlatforms.some((p) => p.platform === platform.name)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                      }`}
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
              <h2 className="text-sm dark:text-gray-200 font-lazare font-bold text-gray-800 mb-3">Content Format</h2>
              <div className="flex flex-wrap gap-2">
                {CONTENT_TYPES.map((type) => (
                  <Button
                    key={type.name}
                    variant={selectedContentType === type.name ? "default" : "outline"}
                    onClick={() => {
                      setSelectedContentType(type.name)
                      setUploadedFile([])
                    }}
                    className={`flex items-center gap-2 h-9 px-3 py-1 text-sm ${selectedContentType === type.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    size="sm"
                  >
                    {type.icon}
                    <span>{type.name}</span>
                  </Button>
                ))}
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h2 className="text-sm dark:text-gray-200 font-lazare font-bold text-gray-800">Upload Content</h2>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  id="fileUpload"
                  onChange={handleFileUpload}
                  accept={CONTENT_TYPES.find((t) => t.name === selectedContentType)?.accepts}
                  multiple={selectedContentType === "Post"}
                />

                <label htmlFor="fileUpload" className="cursor-pointer block">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-1 text-sm dark:text-gray-200 font-lazare font-bold">Drag and drop your file here or click to browse</p>
                  <p className="text-xs text-gray-400">
                    {selectedContentType === "Post" ? "You can upload multiple images" : "Only one file allowed"}
                  </p>
                </label>

                {uploadedFile.length > 0 && (
                  <div className="mt-4 space-y-1">
                    {uploadedFile.map((item, index) => (
                      <p key={index} className="text-sm text-gray-600 flex items-center justify-center">
                        <span className="i-lucide-check-circle w-4 h-4 mr-1 text-green-500" />
                        {item.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="caption" className="block text-sm dark:text-gray-200 font-lazare font-bold text-gray-800">
                  Caption
                </label>
                <textarea
                  onChange={(e) => setCaption(e.target.value)}
                  id="caption"
                  name="caption"
                  placeholder="Enter your caption..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary focus:border-primary transition-colors placeholder:text-gray-400 min-h-[80px] text-sm"
                  aria-describedby="caption-hint"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 dark:bg-[#181e2a]  rounded-md">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={(e) => {
                      setIsScheduled(e.target.checked)
                      handleSchedule("")
                    }}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-200 font-lazare font-bold  text-sm">Schedule Post</span>
                </label>
                {isScheduled && (
                  <input
                    onChange={(e) => handleSchedule(e.target.value)}
                    type="datetime-local"
                    className="border border-gray-200 rounded px-3 py-1.5 text-sm w-full sm:w-auto"
                  />
                )}
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 bg-white dark:bg-[#181e2a] border-t px-6 py-4 flex justify-end">
            <div className="flex gap-3 w-full sm:w-auto">
              <Button variant="outline" onClick={handleOpenChange} className="flex-1 sm:flex-initial">
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploadedFile.length === 0 || selectedPlatforms.length === 0}
                className="flex-1 sm:flex-initial "
              >
                <ArrowUpRight className="mr-2 h-4 w-4" /> Upload Content
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(CreateContent)