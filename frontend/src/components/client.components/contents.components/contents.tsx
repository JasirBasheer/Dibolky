import React, { useEffect, useState } from 'react';
import {Upload,Check,X} from 'lucide-react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from '@/utils/axios';
import { message } from 'antd';
import { IReviewBucket, RootState } from '@/types/common.types';



const ClientContentComponent = () => {
  const [bucketItems, setBucketItems] = useState([]);
  const user = useSelector((state:RootState) => state.user);
  const [onReview,setOnReview] = useState([])


  const fetchUserReviewBucket = async () => {
    try {
      const res = await axios.get(`/api/client/contents/${user.user_id}`)

      
      if (res.status === 200) {
        setBucketItems(Array.isArray(res.data.reviewBucket) ? res.data.reviewBucket : [])
        const filteredOnReviewContents = res.data.reviewBucket.filter((item: {status:string}) => item.status != "Approved" && item.status !="Rejected");
        setOnReview(filteredOnReviewContents)
      }

    } catch (error) {
      console.error('Failed to fetch review bucket', error)
      alert('Failed to fetch review bucket')
    }
  }



  const handleApproveContent = async (contentId: string) => {
    try {
      message.loading('Uploading content')
      await axios.get(`/api/client/approve-content/${contentId}/${user.user_id}`)
      fetchUserReviewBucket()
      message.success('Content approved successfully')
    } catch (error) {
      console.error('Failed to approve content', error)
      alert('Failed to approve content')
    }
  }

  const handleRejectContent = async (contentId:string) => {
    try {
      await axios.get(`/api/client/reject-content/${contentId}`)
      fetchUserReviewBucket()
      alert('Content rejected successfully')
    } catch (error) {
      console.error('Failed to reject content', error)
      alert('Failed to reject content')
    }
  }



  useEffect(() => {
    if (user?.user_id) {
      fetchUserReviewBucket()
    }
  }, [])


  return (
    <div className="min-h-screen bg-gradient-to-b p-8 pt-4 pb-5 mb-16">

      <div className="max-w-2xl mx-auto space-y-8 pr-5">
        <div className="flex gap-8">
    
          <Card className="flex-1 shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="border-b border-blue-100/30 pb-6">
              <CardTitle className="text-1xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Content Review
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {onReview.length === 0 ? (
                <div className="text-center py-12">
                  <Upload className="w-12 h-12 text-blue-200 mx-auto mb-4 " />
                  <p className="text-gray-500 text-sm">No content pending review</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {onReview.map((item :IReviewBucket) => (
                    item.status && (
                      <div
                        key={item._id}
                        className="bg-white rounded-lg p-4 border border-blue-100 hover:border-blue-200 transition-colors flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 bg-blue-50 rounded-lg overflow-hidden">
                        
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{item.caption}</h3>
                            <p className="text-sm text-gray-500">Pending Review </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApproveContent(item._id as string)}
                            variant="outline"
                            className="border-green-300 hover:bg-green-50"
                          >
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectContent(item._id as string)}
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

export default ClientContentComponent