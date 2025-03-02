import { useEffect, useState } from 'react';
import { Upload, Instagram, Facebook, Image, Check, X, ArrowUpRight, Calendar, Film, } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from '@/utils/axios';
import { message } from 'antd';
import { IContentData, IFile, IFiles, IMetaAccount, IPlatforms, IReviewBucket, RootState } from '@/types/common.types';
import { useNavigate } from 'react-router-dom';
import InstagramAccountModal from '@/components/common.components/instagram.acccounts.list';
import { InitiateS3BatchUpload, saveContentApi } from '@/services/common/post.services';
import { getContentsApi } from '@/services/common/get.services';

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



const AgencyClientContent = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<IPlatforms[]>([]);
  const [selectedContentType, setSelectedContentType] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File[]>([]);
  const [reviewBucket, setReviewBucket] = useState<IContentData[]>([]);
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [caption, setCaption] = useState<string>("")
  const user = useSelector((state: RootState) => state.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accounts, setAccounts] = useState<IMetaAccount[]>([])
  const [contentUrls, setContentUrls] = useState<Record<string, string>>({})
  const navigate = useNavigate()



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



  const fetchSignedUrls = async () => {
    const urlMap: Record<string, string> = {};

    for (const item of reviewBucket) {
      for (const file of item.files) {
        try {
          const response = await axios.post(`/api/entities/get-signedUrl`, { key: file.key });
          urlMap[file.key] = response.data.signedUrl;
        } catch (error) {
          console.error(`Error fetching URL for ${file.key}:`, error);
          urlMap[file.key] = ""
        }
      }
    }
    setContentUrls(urlMap);
  };

  const fetchUserReviewBucket = async () => {
    try {
      const res = await getContentsApi(user.user_id == "" ? user.ownerId : user.user_id)
      if (res.status === 200) {
        setReviewBucket(Array.isArray(res.data.reviewBucket) ? res.data.reviewBucket : [])
      }
    } catch (error) {
      console.error('Failed to fetch review bucket', error)
      message.error('Failed to fetch review bucket')
    }
  }

  const handleApproveContent = async (content_id: string) => {
    try {
      message.loading('Uploading content')
      await axios.post(`/api/entities/approve-content`, { content_id, platform: user.user_id == "" ? "agency" : "client", user_id: user.user_id == "" ? user.ownerId : user.user_id })
      fetchUserReviewBucket()
      message.success('Content approved successfully')
    } catch (error) {
      console.error('Failed to approve content', error)
      message.error('Failed to approve content')
    }
  }

  const handleRejectContent = async (content_id: string) => {
    try {
      await axios.get(`/api/client/reject-content/${content_id}`)
      fetchUserReviewBucket()
      alert('Content rejected successfully')
    } catch (error) {
      console.error('Failed to reject content', error)
      alert('Failed to reject content')
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
      navigate(`/agency/settings?required=${requiredPlatforms.join(',')}&`)
      return
    }


    if (selectedPlatforms.some((p: IPlatforms) => ['instagram', 'facebook'].includes(p.platform)) && !selectedAccount) {
      const response = await axios.get(`/api/entities/get-meta-pages/${!user.facebookAccessToken ? user.instagramAccessToken : user.facebookAccessToken}`)
      console.log(response.data)
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

      console.log(contentData);
      const savedContent = await saveContentApi(
        user.user_id == "" ? "agency" : "client",
        user.user_id == "" ? "agency" : user.user_id,
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

      fetchUserReviewBucket();
    } catch (error) {
      console.error('Upload Error:', error);
      message.error('Upload failed');
    }
  }

  useEffect(() => {
    if (user.ownerId != "" || user.user_id != "")
      fetchUserReviewBucket()
  }, [user.ownerId, user.user_id])


  useEffect(() => {
    fetchSignedUrls();

    const refreshInterval = setInterval(fetchSignedUrls, 50 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [reviewBucket])




  const handleAccountSelect = (accountId: string) => {
    setSelectedAccount(accountId);
    setTimeout(() => setModalOpen(false), 200);
  };
  return (
    <>
      <InstagramAccountModal
        accounts={accounts}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleAccountSelect}
      />

      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 p-8 pt-4 pb-5 mb-16">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex gap-8">
            <Card className="flex-1 shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader className="border-b border-blue-100/30 pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Content Creation Studio
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <section>
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Distribution Channels
                  </h2>
                  <div className="flex gap-3">
                    {PLATFORMS.map((platform) => (
                      <Button
                        key={platform.name}
                        variant={selectedPlatforms.some(p => p.platform === platform.name) ? "default" : "outline"}
                        onClick={() => handlePlatformToggle(platform?.name as string)}
                        className={`flex items-center gap-2 px-4 py-2 transition-all ${selectedPlatforms.some(p => p.platform === platform.name)
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'hover:border-blue-300'
                          }`}
                      >
                        {platform.icon}
                        <span className="capitalize">{platform.name}</span>
                      </Button>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Content Format
                  </h2>
                  <div className="flex gap-3">
                    {CONTENT_TYPES.map((type) => (
                      <Button
                        key={type.name}
                        variant={selectedContentType === type.name ? "default" : "outline"}
                        onClick={() => {
                          setSelectedContentType(type.name)
                          setUploadedFile([])
                        }}
                        className={`flex items-center gap-2 ${selectedContentType === type.name
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'hover:border-blue-300'
                          }`}
                      >
                        {type.icon}
                        <span>{type.name}</span>
                      </Button>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Upload Content
                  </h2>
                  <div className="border-2  border-blue-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      className="hidden"
                      id="fileUpload"
                      onChange={handleFileUpload}
                      accept={CONTENT_TYPES.find(t => t.name === selectedContentType)?.accepts}
                      multiple={selectedContentType === "Post"}
                    />

                    <label htmlFor="fileUpload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Drag and drop your file here or click here</p>

                    </label>
                    {uploadedFile && (
                      uploadedFile.map(item =>
                        <p className="mt-4 text-sm text-gray-600">
                          Selected: {item.name}
                        </p>

                      )
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="caption"
                      className="block text-lg font-semibold text-gray-700"
                    >
                      Caption
                    </label>
                    <input
                      onChange={(e) => setCaption(e.target.value)}
                      id="caption"
                      name="caption"
                      type="text"
                      placeholder="Enter your caption..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 transition-colors placeholder:text-gray-400"
                      aria-describedby="caption-hint"
                    />

                  </div>

                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isScheduled}
                        onChange={(e) => {
                          setIsScheduled(e.target.checked)
                          handleSchedule("")
                        }}
                        className="w-4 h-4 text-blue-600"
                      />
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700">Schedule Post</span>
                    </label>
                    {isScheduled && (
                      <input
                        onChange={(e) => handleSchedule(e.target.value)}
                        type="datetime-local"
                        className="border border-blue-200 rounded px-3 py-2"
                      />
                    )}
                  </div>



                  <div className="flex gap-4 mt-6">
                    <Button
                      onClick={handleUpload}
                      disabled={!uploadedFile || selectedPlatforms.length === 0}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                    >
                      <ArrowUpRight className="mr-2" /> Upload Content
                    </Button>
                  </div>
                </section>
              </CardContent>
            </Card>


            <Card className="flex-1 shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader className="border-b border-blue-100/30 pb-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Content Review
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {reviewBucket.length === 0 ? (
                  <div className="text-center py-12">
                    <Upload className="w-16 h-16 text-blue-200 mx-auto mb-4" />
                    <p className="text-gray-500">No content pending review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviewBucket.map((item: IReviewBucket) => (
                      item.status !== "Approved" && (
                        <div
                          key={item._id}
                          className="bg-white rounded-lg p-4 border border-blue-100 hover:border-blue-200 transition-colors flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="media-slider">
                              {item.files!.map((file: IFiles) => {
                                console.log(file.key, contentUrls[file.key], file.contentType);
                                return (
                                  <div key={file.key} className="media-item">
                                    {file.contentType.startsWith('video') ? (
                                      <video src={contentUrls[file.key]} className="media-content" controls />
                                    ) : (
                                      <img src={contentUrls[file.key]} alt={file.fileName} className="media-content" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            <div>
                              <h3 className="font-medium text-gray-800">{item.caption}</h3>
                              <p className="text-sm text-gray-500">Pending Review </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApproveContent(item?._id as string)}
                              variant="outline"
                              className="border-green-300 hover:bg-green-50"
                            >
                              <Check className="w-4 h-4 text-green-500 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectContent(item?._id as string)}
                              variant="outline"
                              className="border-red-300 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 text-red-500 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgencyClientContent;