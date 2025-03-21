import { useEffect, useState } from 'react';
import { Upload, Check, X, Search, Filter, Eye, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { message } from 'antd';
import { IContentData, IPlatforms, IReviewBucket, RootState } from '@/types/common.types';
import { approveContentApi, getSignedUrlApi } from '@/services/common/post.services';
import { getContentsApi } from '@/services/common/get.services';
import { rejectContentApi } from '@/services/client/get.services';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ContentDetailModal } from '../common.components/content-details.modal';


const AgencyClientContent = () => {
  const [reviewBucket, setReviewBucket] = useState<IContentData[]>([]);
  const user = useSelector((state: RootState) => state.user);
  const agency = useSelector((state: RootState) => state.agency);
  const [contentUrls, setContentUrls] = useState<Record<string, string>>({})
  const [selectedContent, setSelectedContent] = useState<IReviewBucket | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTab, setCurrentTab] = useState("all")

  const filteredContent = reviewBucket.filter((item) => {
    const matchesSearch =
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    if (currentTab === "all") return matchesSearch
    return matchesSearch && item.status.toLowerCase() === currentTab
  })

  const handleViewContent = (content: IReviewBucket) => {
    setSelectedContent(content)
  }

  const handleCloseModal = () => {
    setSelectedContent(null)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }




  const fetchSignedUrls = async () => {
    const urlMap: Record<string, string> = {};

    for (const item of reviewBucket) {
      for (const file of item.files) {
        try {
          const response = await getSignedUrlApi(file.key)
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
      const res = await getContentsApi(user.user_id)
      console.log(res)
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
      await approveContentApi(content_id, user.user_id == agency.user_id ? "agency" : "client", user.user_id == agency.user_id ? user.main_id : user.user_id)
      fetchUserReviewBucket()
      message.success('Content approved successfully')
    } catch (error) {
      console.error('Failed to approve content', error)
      message.error('Failed to approve content')
    }
  }

  const handleRejectContent = async (content_id: string) => {
    try {
      await rejectContentApi(content_id)
      fetchUserReviewBucket()
      alert('Content rejected successfully')
    } catch (error) {
      console.error('Failed to reject content', error)
      alert('Failed to reject content')
    }
  }

  useEffect(() => {
    if (user.main_id != "" || user.user_id != "")
      fetchUserReviewBucket()
  }, [user.main_id, user.user_id])


  useEffect(() => {
    fetchSignedUrls();

    const refreshInterval = setInterval(fetchSignedUrls, 50 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [reviewBucket])




  return (

    <div className='p-11'>
    <Card className="shadow-md border-0 bg-white">
      <CardHeader className="border-b pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-xl font-semibold text-gray-800">Content Review</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search content..."
                className="pl-9 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <div className="px-6 py-4">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={currentTab} className="mt-0">
            {filteredContent.length === 0 ? (
              <div className="text-center py-16">
                <Upload className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No content found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchQuery ? "Try a different search term" : "Upload some content to get started"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Content
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Platform
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredContent.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewContent(item)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              {item.files &&
                                item.files.length > 0 &&
                                (item.files[0].contentType.startsWith("video") ? (
                                  <video
                                    src={contentUrls[item.files[0].key]}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <img
                                    src={contentUrls[item.files[0].key] || "/placeholder.svg"}
                                    alt={item.files[0].fileName}
                                    className="w-full h-full object-cover"
                                  />
                                ))}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-800 line-clamp-1">{item.caption}</span>
                              {item.files && (
                                <span className="text-xs text-gray-500">
                                  {item.files.length} {item.files.length === 1 ? "file" : "files"}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {item.platforms.map((item:IPlatforms,index:number)=>{
                            return (
                              <span key={index} className="capitalize text-sm text-gray-600">{item.platform || "Unknown"} </span>
                            )
                          })}
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-600">
                            {item.createdAt ? formatDate(item.createdAt) : "N/A"}
                          </span>
                        </td>
                        <td className="py-4 px-6">{getStatusBadge(item.status)}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewContent(item)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {item.status === "Pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // onApprove(item._id)
                                  }}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // onReject(item._id)
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                {item.status === "Pending" && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleApproveContent(item._id as string)}>Approve</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRejectContent(item._id as string)}>Reject</DropdownMenuItem>
                                  </>
                                )}
                                {item.status === "Approved" && (
                                  <DropdownMenuItem onClick={() => handleApproveContent(item._id as string)}>
                                    Mark as Rejected
                                  </DropdownMenuItem>
                                )}
                                {item.status === "Rejected" && (
                                  <DropdownMenuItem onClick={() => handleRejectContent(item._id as string)}>
                                    Mark as Approved
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

    {selectedContent && (
      <ContentDetailModal
        content={selectedContent}
        contentUrls={contentUrls}
        onClose={handleCloseModal}
        onApprove={handleApproveContent}
        onReject={handleRejectContent}
      />
    )}
  </div>
  );
};

export default AgencyClientContent;