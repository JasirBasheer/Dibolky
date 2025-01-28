import React, { useEffect, useState } from 'react';
import {
  Upload,
  Instagram,
  Facebook,
  Send,
  PlusCircle,
  Image,
  Video,
  Check,
  X,
  ArrowUpRight,
  Calendar,
  Twitter,
  Linkedin,
  Film
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from '@/utils/axios';
import { message } from 'antd';

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
  // {
  //   name: 'x',
  //   icon: <Twitter className="w-5 h-5 text-blue-400" />,
  //   uploadTypes: ['image', 'video', 'text']
  // },
  // {
  //   name: 'linkedin',
  //   icon: <Linkedin   className="w-5 h-5 text-blue-400" />,
  //   uploadTypes: ['image', 'video', 'text']
  // }
];

const CONTENT_TYPES = [
  {
    name: 'Post',
    icon: <Image className="w-5 h-5 text-blue-500" />,
    accepts: 'image/*'
  },
  {
    name: 'Video',
    icon: <Video className="w-5 h-5 text-blue-500" />,
    accepts: 'video/*'
  },
  {
    name: 'Reel',
    icon: <Film className="w-5 h-5 text-blue-500" />,
    accepts: 'video/*'
  }
];

const AgencyClientContent = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedContentType, setSelectedContentType] = useState();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [reviewBucket, setReviewBucket] = useState([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("")
  const [caption, setCaption] = useState("")
  const details = useSelector((state) => state.user);

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const fetchUserReviewBucket = async () => {
    try {
      const res = await axios.get(`/api/agency/get-review-bucket/${details.Id}`)
      if (res.status === 200) {
        console.log(res.data.reviewBucket)
        setReviewBucket(Array.isArray(res.data.reviewBucket) ? res.data.reviewBucket : [])
      }
    } catch (error) {
      console.error('Failed to fetch review bucket', error)
      alert('Failed to fetch review bucket')
    }
  }

  const handleApproveContent = async (id: string) => {
    try {
      message.loading('Uploading content')
      await axios.get(`/api/agency/approve-content/${id}/${details.Id}`)
      fetchUserReviewBucket()
      message.success('Content approved successfully')
    } catch (error) {
      console.error('Failed to approve content', error)
      alert('Failed to approve content')
    }
  }

  const handleRejectContent = async (id) => {
    try {
      await axios.get(`/api/agency/reject-content/${id}`)
      fetchUserReviewBucket()
      alert('Content rejected successfully')
    } catch (error) {
      console.error('Failed to reject content', error)
      alert('Failed to reject content')
    }
  }

  const handleUpload = async () => {
    if (!uploadedFile || selectedPlatforms.length === 0) {
      alert('Please select a file and at least one platform')
      return
    }
    if (!uploadedFile || !selectedContentType || !selectedPlatforms || !caption) {
      message.error('Full the inputs accordingly inorder to upolad content')
      return
    }

    message.loading('Uploading content')


    const formData = new FormData()
    formData.append('file', uploadedFile)
    formData.append('selectedContentType', selectedContentType)
    formData.append('id', details.Id)
    formData.append('selectedPlatforms', JSON.stringify(selectedPlatforms))
    formData.append('caption', caption)
    formData.append('isScheduled', `${isScheduled}`)
    formData.append('scheduledDate', scheduledDate)


    try {
      await axios.post('/api/agency/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      message.success('Content uploaded successfully , waiting for upproval...')
      fetchUserReviewBucket()
    } catch (error) {
      console.error('Upload Error:', error)
      message.error('Upload failed')
    }
  }

  useEffect(() => {
    if (details?.Id) {
      fetchUserReviewBucket()
    }
  }, [details?.Id])


  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 p-8 pt-4 pb-5 mb-16">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex gap-8">
          {/* Left Column */}
          <Card className="flex-1 shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="border-b border-blue-100/30 pb-6">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Content Creation Studio
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Platform Selection */}
              <section>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Distribution Channels
                </h2>
                <div className="flex gap-3">
                  {PLATFORMS.map((platform) => (
                    <Button
                      key={platform.name}
                      variant={selectedPlatforms.includes(platform.name) ? "default" : "outline"}
                      onClick={() => handlePlatformToggle(platform.name)}
                      className={`flex items-center gap-2 px-4 py-2 transition-all ${selectedPlatforms.includes(platform.name)
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

              {/* Content Type Selection */}
              <section>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Content Format
                </h2>
                <div className="flex gap-3">
                  {CONTENT_TYPES.map((type) => (
                    <Button
                      key={type.name}
                      variant={selectedContentType === type.name ? "default" : "outline"}
                      onClick={() => setSelectedContentType(type.name)}
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

              {/* File Upload */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Upload Content
                </h2>
                <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    id="fileUpload"
                    onChange={handleFileUpload}
                    accept={CONTENT_TYPES.find(t => t.name === selectedContentType)?.accepts}
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag and drop your file here or click here</p>

                  </label>
                  {uploadedFile && (
                    <p className="mt-4 text-sm text-gray-600">
                      Selected: {uploadedFile.name}
                    </p>
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
                    onChange={(e)=>setCaption(e.target.value)}
                    id="caption"
                    name="caption"
                    type="text"
                    placeholder="Enter your caption..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 transition-colors placeholder:text-gray-400"
                    aria-describedby="caption-hint"
                  />
 
                </div>

                {/* Scheduling Option */}
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isScheduled}
                      onChange={(e) => {
                        setIsScheduled(e.target.checked)
                        setScheduledDate("")
                      } }
                      className="w-4 h-4 text-blue-600"
                    />
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Schedule Post</span>
                  </label>
                  {isScheduled && (
                    <input
                      onChange={(e)=>setScheduledDate(e.target.value)}
                      type="datetime-local"
                      className="border border-blue-200 rounded px-3 py-2"
                    />
                  )}
                </div>



                {/* Action Buttons */}
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

          {/* Right Column - Review Bucket */}
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
                  {reviewBucket.map((item) => (
                    item.status !== "Approved" && (
                      <div
                        key={item._id}
                        className="bg-white rounded-lg p-4 border border-blue-100 hover:border-blue-200 transition-colors flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 bg-blue-50 rounded-lg overflow-hidden">
                            <video
                              src={item.url}
                              className="w-full h-full object-cover"
                              controls
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{item.caption}</h3>
                            <p className="text-sm text-gray-500">Pending Review </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApproveContent(item._id)}
                            variant="outline"
                            className="border-green-300 hover:bg-green-50"
                          >
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectContent(item._id)}
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
  );
};

export default AgencyClientContent;