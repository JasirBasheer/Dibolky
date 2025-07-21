import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, List, Instagram, Facebook, MoreVertical } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllSchduledContentsApi } from '@/services/common/get.services';
import { useSelector } from 'react-redux';
import { ICalendarContent, IReviewBucket, RootState } from '@/types/common';
import { Button } from '../ui/button';
import { approveContentApi } from '@/services/common/post.services';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const ContentScheduler = () => {
  const agency = useSelector((state: RootState) => state.agency);
  const user = useSelector((state: RootState) => state.user);
  const [date, setDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("calendar");

  const { data: scheduledContent, refetch } = useQuery({
    queryKey: ["get-scheduledContents"],
    queryFn: () => {
      return fetchAllSchduledContentsApi(user.user_id);
    },
    enabled: !!user.user_id,
    select: (data) => {
      return data.data.scheduledContents.map((item: IReviewBucket) => {
        return {
          id: item._id!.toString(),
          title: item.caption || "No caption",
          description: item.caption || "No description",
          date: item.platforms && item.platforms[0] ? new Date(item.platforms[0].scheduledDate!) : null,
          time: item.platforms && item.platforms[0] ? new Date(item.platforms[0].scheduledDate!).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : "",
          platform: item.platforms && item.platforms.map((platform) => platform.platform),
          contentType: item.contentType || "Unknown",
          status: item.status || "Pending",
          isPublished: item.isPublished || false,
          isRescheduled: item.platforms && item.platforms[0] ? item.platforms[0].status == "rescheduled" || false : false,
          mediaType: item.files && item.files[0] ? item.files[0].contentType : "unknown",
          mediaUrl: item.files && item.files[0] ? item.files[0].key : "",
          fileNames: item.files && item.files.map((file) => file.fileName),
        };
      });
    },
  });

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  const getContentForDate = (date: Date) => {
    if (!date || !scheduledContent) return [];

    return scheduledContent.filter((content: ICalendarContent) => {
      if (!content.date || !(content.date instanceof Date)) return false;
      return content.date.getDate() === date.getDate() &&
        content.date.getMonth() === date.getMonth() &&
        content.date.getFullYear() === date.getFullYear();
    });
  };

  const contentDates = scheduledContent ?
    scheduledContent.filter((content: ICalendarContent) => content.date && content.date instanceof Date).map((content: ICalendarContent) => content.date) : [];

  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case "instagram": return <Instagram className="h-4 w-4" />;
      case "facebook": return <Facebook className="h-4 w-4" />;
      default: return null;
    }
  };


  const getContentTypeColor = (contentType: string) => {
    switch (contentType) {
      case "Reel": return "bg-purple-500";
      case "Post": return "bg-green-500";
      case "Story": return "bg-amber-500";
      default: return "bg-gray-500";
    }
  };


  const formatDate = (date: Date) => {
    if (!date || isNaN(date.getTime())) return
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleApproveContent = async (contentId: string) => {
    if (!user.user_id) return
    await approveContentApi(
      contentId,
      agency.user_id == user.user_id ? "agency" : "agency-client",
      user.user_id
    )
    refetch()
  }

  const handleRescheduleContent = async (contentId: string) => {
    console.log('helo')
  }



  if (!scheduledContent || scheduledContent.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-12">
        <div className="text-center p-12 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No scheduled content</h2>
          <p className="text-gray-500">Your content calendar is empty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Calendar</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-[22rem] grid-cols-2">
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            List View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 h-fit">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Select a date to view scheduled content</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                  modifiers={{ highlight: contentDates }}
                  modifiersStyles={{ highlight: { backgroundColor: '#f3f4f6', color: '#000', fontWeight: 'bold' } }}
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {formatDate(date)}
                </CardTitle>
                <CardDescription>
                  {getContentForDate(date).length === 0
                    ? "No content scheduled for this date"
                    : `${getContentForDate(date).length} items scheduled`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getContentForDate(date).map((content: ICalendarContent) => (
                    <Card key={content.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="w-full">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium flex-grow">{content.title}</h3>
                            <Badge className={``}>
                              {content.contentType}
                            </Badge>
                          </div>

                          <div className="flex items-center mt-2 gap-2">
                            {content.platform.map((p) => (
                              <Badge key={p} className={`bg-white text-black hover:bg-white flex items-center gap-1`}>
                                {getPlatformIcon(p)} {p}
                              </Badge>
                            ))}

                            <Badge className={`bg-white text-black`}>
                              {content.isPublished ? "Published" :
                                content.isRescheduled ? "Rescheduled" :
                                  content.status}
                            </Badge>

                          </div>

                          <div className="flex items-center mt-1 text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm">{content.time}</span>
                            <div className="flex flex-col mt-4">
                              {content.fileNames && (
                                content.fileNames.map((fileName, index) => <span key={index} className="ml-3 text-sm truncate max-w-xs">{index + 1}. {fileName}</span>)
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-6 pb-28">
          <Card>
            <CardHeader>
              <CardTitle>All Scheduled Content</CardTitle>
              <CardDescription>
                View and manage all upcoming content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending" className="w-full">
                <TabsList >
                  <TabsTrigger value="pending">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Pending
                  </TabsTrigger>
                  <TabsTrigger value="uploaded">
                    <List className="mr-2 h-4 w-4" />
                    Uploaded
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                  <div className="space-y-4">
                    {scheduledContent
                      .filter((content: ICalendarContent) => content.status === "Pending")
                      .sort((a: ICalendarContent, b: ICalendarContent) => {
                        if (!a.date || !b.date) return 0;
                        return a.date.getTime() - b.date.getTime();
                      }).map((content: ICalendarContent) => (
                        <Card key={content.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="w-full">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium flex-grow">{content.title}</h3>
                                <Badge >
                                  {content.contentType}
                                </Badge>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem >
                                      Reschedule
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              <div className="flex items-center mt-2 gap-2">
                                {content.platform.map((p) => (
                                  <Badge key={p} className={`bg-white text-black hover:bg-white flex items-center gap-1`}>
                                    {getPlatformIcon(p)} {p}
                                  </Badge>
                                ))}

                                <Badge className="text-black bg-white">
                                  {content.isPublished ? "Published" : content.isRescheduled ? "Rescheduled" : new Date(content.date).getTime() < Date.now() ? "Reschedule needed" : content.status}
                                </Badge>
                              </div>

                              <div className="flex items-center mt-1 text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                <span className="text-sm">{content.time}</span>
                                <div className="flex flex-col mt-4">
                                  {content.fileNames && (
                                    content.fileNames.map((fileName, index) => <span key={index} className="ml-3 text-sm truncate max-w-xs">{index + 1}. {fileName}</span>)
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="uploaded" className="mt-6">
                  <div className="space-y-4">
                    {scheduledContent
                      .filter((content: ICalendarContent) => content.status === "Approved" && !content.isPublished && !content.isRescheduled)
                      .sort((a: ICalendarContent, b: ICalendarContent) => {
                        if (!a.date || !b.date) return 0;
                        return a.date.getTime() - b.date.getTime();
                      })
                      .map((content: ICalendarContent) => (
                        <Card key={content.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="w-full">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium flex-grow">{content.title}</h3>
                                <Badge >
                                  {content.contentType}
                                </Badge>
                              </div>

                              <div className="flex items-center mt-2 gap-2">
                                {content.platform.map((p) => (
                                  <Badge key={p} className={`bg-white text-black hover:bg-white flex items-center gap-1`}>
                                    {getPlatformIcon(p)} {p}
                                  </Badge>
                                ))}

                              </div>

                              <div className="flex items-center mt-1 text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                <span className="text-sm">{content.time}</span>
                                <div className="flex flex-col mt-4">
                                  {content.fileNames && (
                                    content.fileNames.map((fileName, index) => <span key={index} className="ml-3 text-sm truncate max-w-xs">{index + 1}. {fileName}</span>)
                                  )}
                                </div>
                              </div>

                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentScheduler;