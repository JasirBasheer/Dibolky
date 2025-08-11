/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Search,
  ArrowUpDown,
  Plus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { message } from "antd";
import {
  IReviewBucket,
  RootState,
} from "@/types/common";
import {
  approveContentApi,
  getSignedUrlApi,
  rescheduleContentApi,
} from "@/services/common/post.services";
import { getContentsApi } from "@/services/common/get.services";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { ContentDetailModal } from "./components/content-details.modal";
import { RejectContentModal } from "../../components/agency/reject-content.modal";
import { useQuery } from "@tanstack/react-query";
import { useFilter, usePagination } from "@/hooks";
import PaginationControls from "@/components/ui/PaginationControls";
import Skeleton from "react-loading-skeleton";
import SelectInput from "@/components/ui/selectInput";
import { DataTable } from "@/components/ui/data-table";
import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs";
import { openCreateContentModal } from "@/redux/slices/ui.slice";

const Contents = () => {
  const user = useSelector((state: RootState) => state.user);
  const agency = useSelector((state: RootState) => state.agency);

  const [contentUrls, setContentUrls] = useState<Record<string, string>>({});
  const [selectedContent, setSelectedContent] = useState<IReviewBucket | null>(
    null
  );
  const [rejectingContent, setRejectingContent] = useState<string | null>("");
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({
    query: "",
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
    type: "",
  });

  const { page, limit, nextPage, prevPage, reset } = usePagination(1, 10);
  const debouncedFilter = useFilter(filter, 900);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["contents", page, limit, debouncedFilter, user.user_id],
    queryFn: () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        query: debouncedFilter.query,
        status: debouncedFilter.status,
        sortBy: debouncedFilter.sortBy,
        sortOrder: debouncedFilter.sortOrder,
        type: debouncedFilter.type,
      }).toString();

      return getContentsApi(user.role, user.user_id, `?${searchParams}`);
    },
    select: (data) => data?.data,
    enabled: !!user.user_id && !!user.main_id,
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    reset();
  }, [debouncedFilter, user.user_id]);

  useEffect(() => {
    fetchSignedUrls();
  }, [data?.contents]);



  const handleCloseModal = () => {
    setSelectedContent(null);
  };

  const fetchSignedUrls = async () => {
    const urlMap: Record<string, string> = {};

    await Promise.all(
      data?.contents?.flatMap((item: { files: { key: string; }[]; }) =>
        item.files.map(async (file: { key: string; }) => {
          try {
            const response = await getSignedUrlApi(file.key);
            urlMap[file.key] = response.data.signedUrl;
          } catch (error) {
            console.error(`Error fetching URL for ${file.key}:`, error);
            urlMap[file.key] = "";
          }
        })
      )
    );

    setContentUrls(urlMap);
  };

  const handleApproveContent = async (content_id: string) => {
    try {
      message.loading("Uploading content");
      await approveContentApi(
        content_id,
        user.user_id == agency.user_id ? "agency" : "client",
        user.user_id == agency.user_id ? user.main_id : user.user_id
      );
      refetch();
      message.success("Content approved successfully");
    } catch (error) {
      console.error("Failed to approve content", error);
      message.error("Failed to approve content");
    }
  };

  const handleRejectContent = async (content_id: string) => {
    setRejectingContent(content_id);
  };

  const handleReschedule = async (date:string,platformId:string, contentId:string) => {
    try {
       await rescheduleContentApi(user.user_id,contentId,platformId,date)
       refetch();
    } catch (error) {
      console.log(error)
    }
  };




  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          [
            "Content & Projects",
            `/${user.role == "agency" ? "agency" : "client"}/contents`,
          ],
          ["All Contents", ""],
        ]}
      />

      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by client name, invoice number, or service..."
                    value={filter.query}
                    onChange={(e) =>
                      setFilter((prev) => ({ ...prev, query: e.target.value }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <SelectInput
                placeholder="Filter by status"
                value={filter.status}
                options={[
                  { label: "All Status", value: "all" },
                  { label: "Rejected", value: "Rejected" },
                  { label: "Pending", value: "Pending" },
                  { label: "Approved", value: "Approved" },
                ]}
                onChange={(value) =>
                  setFilter((prev) => ({ ...prev, status: value }))
                }
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
                  }))
                }
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
                {user.role !="client" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => dispatch(openCreateContentModal())}
              >
                <Plus className="h-4 w-4" />
                Create
              </Button>)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Contents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isLoading ? (
              <DataTable
                data={data?.contents || []}
                onRowClick={(content) =>
                  setSelectedContent(content as IReviewBucket)
                }
                columns={[
                  {
                    header: "Media",
                    render: (content: IReviewBucket) => (
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        {content.files &&
                          content.files.length > 0 &&
                          (content.files[0].contentType.startsWith("video") ? (
                            <video
                              src={contentUrls[content.files[0].key]}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={
                                contentUrls[content.files[0].key] ||
                                "/placeholder.svg"
                              }
                              alt={content.files[0].fileName}
                              className="w-full h-full object-cover"
                            />
                          ))}
                      </div>
                    ),
                  },
                  {
                    header: "Caption",
                    render: (content) => (
                      <p className="max-w-[151px] truncate">
                        {content.caption}
                      </p>
                    ),
                  },
                  {
                    header: "Platforms",
                    render: (content) => (
                      <div className="flex items-center gap-1">
                        {content.platforms.map((p) => (
                          <Badge key={p.platform} variant="outline">
                            {p.platform}
                          </Badge>
                        ))}
                      </div>
                    ),
                  },
                  {
                    header: "Type",
                    render: (content) => (
                      <div className="flex items-center gap-1">
                        {content.contentType}
                      </div>
                    ),
                  },
                  {
                    header: "isScheduled",
                    render: (content) => (
                      <div className="flex items-center gap-1">
                        {content.platforms.find(
                          (p) => p.scheduledDate != ""
                        ) ? (
                          <Badge variant="default">Scheduled</Badge>
                        ) : (
                          <Badge variant="outline">Not Scheduled</Badge>
                        )}
                      </div>
                    ),
                  },
                  {
                    header: "Status",
                    render: (content) => (
                      <Badge
                        className={
                          content.status === "Approved"
                            ? "bg-green-500 text-white hover:bg-green-500"
                            : content.status === "Rejected"
                            ? "bg-red-500 text-white hover:bg-red-500"
                            : "bg-gray-200 text-black hover:bg-gray-200 "
                        }
                      >
                        {content.status}
                      </Badge>
                    ),
                  },
                ]}
              />
            ) : (
              <Skeleton count={5} height={48} />
            )}
          </CardContent>
        </Card>

        <PaginationControls
          page={page}
          totalPages={data?.totalPages || 1}
          onNext={nextPage}
          onPrev={prevPage}
        />

        {selectedContent && (
          <ContentDetailModal
            content={selectedContent}
            contentUrls={contentUrls}
            onClose={handleCloseModal}
            onApprove={handleApproveContent}
            onReject={handleRejectContent}
            onReschedule={handleReschedule}
          />
        )}

        {rejectingContent && (
          <RejectContentModal
            contentId={rejectingContent}
            onClose={() => setRejectingContent(null)}
          />
        )}
      </div>
    </>
  );
};

export default Contents;
