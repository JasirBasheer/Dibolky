import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  EyeOff,
  MessageCircle,
  MoreHorizontal,
  Send,
  Trash2,
} from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";
import { deleteCommentApi, hideCommentApi, replayCommentApi } from "@/services";
import { useSelector } from "react-redux";
import { RootState } from "@/types";
import { formatTimestamp } from "@/utils/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface InstagramComment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  replies?: InstagramComment[];
}

interface FacebookComment {
  id: string;
  message: string;
  from: {
    name: string;
    id: string;
  };
  created_time: string;
  like_count: number;
  comment_count: number;
}

interface NormalizedComment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  replies?: NormalizedComment[];
  platform: "instagram" | "facebook";
  originalData: InstagramComment | FacebookComment;
}

const Comments = ({ content }) => {
  const user = useSelector((state: RootState) => state.user);

  const [comments, setComments] = useState(content?.comments || []);

  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [showReplyInput, setShowReplyInput] = useState<Record<string, boolean>>(
    {}
  );
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setComments(content?.comments || []);
  }, [content?.comments]);

  const normalizeComments = (
    commentsToNormalize,
    platform: string
  ): NormalizedComment[] => {
    if (!commentsToNormalize) return [];

    return commentsToNormalize.map((comment) => {
      if (platform === "facebook") {
        const fbComment = comment;
        return {
          id: fbComment.id,
          text: fbComment.message,
          username: fbComment.from.name,
          timestamp: fbComment.created_time,
          replies: fbComment.replies
            ? normalizeComments(fbComment.replies, platform)
            : [],
          platform: "facebook" as const,
          originalData: fbComment,
        };
      } else {
        const igComment = comment as InstagramComment;
        return {
          id: igComment.id,
          text: igComment.text,
          username: igComment.username,
          timestamp: igComment.timestamp,
          replies: igComment.replies
            ? normalizeComments(igComment.replies, platform)
            : [],
          platform: "instagram" as const,
          originalData: igComment,
        };
      }
    });
  };

  function formatCommentText(text: string): React.ReactNode {
    const lines = text?.split("\n");
    return lines?.map((line, index) => (
      <span key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </span>
    ));
  }

  const handleReplyInputChange = (commentId: string, value: string) => {
    setReplyInputs((prev) => ({
      ...prev,
      [commentId]: value,
    }));
  };

  const toggleReplyInput = (commentId: string) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const addReplyToComments = (
    commentsList: NormalizedComment[],
    commentId: string,
    newReply: object
  ) => {
    return commentsList.map((comment) => {
      if (comment.id === commentId) {
        const replies = comment.replies ? [...comment.replies] : [];
        return {
          ...comment,
          replies: [...replies, newReply],
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToComments(comment.replies, commentId, newReply),
        };
      } else {
        return comment;
      }
    });
  };

  const handleReplySubmit = async (
    commentId: string,
    platform: string,
    username?: string
  ) => {
    let replyMessage = replyInputs[commentId]?.trim();

    if (!replyMessage) {
      return;
    }
    if (platform === "instagram" && username && username !== "") {
      const commentWithMention = `@${username} ${replyMessage}`;
      replyMessage = commentWithMention;
    }

    setIsSubmitting((prev) => ({ ...prev, [commentId]: true }));

    try {
      const response = await replayCommentApi(
        user.role,
        user.user_id,
        content.media.platform,
        commentId,
        replyMessage,
        content.media.pageId
      );

      const newReply =
        platform === "facebook"
          ? {
              id: response.data.comment.id,
              message: replyMessage,
              from: {
                name: content.media.username || "You",
                id: user.user_id,
              },
              created_time: new Date().toISOString(),
              like_count: 0,
              replies: [],
            }
          : {
              id: response.data.comment.id,
              text: replyMessage,
              username: content.media.username || "You",
              timestamp: new Date().toISOString(),
              replies: [],
            };

      setComments((prevComments) =>
        addReplyToComments(prevComments, commentId, newReply)
      );

      setReplyInputs((prev) => ({ ...prev, [commentId]: "" }));
      setShowReplyInput((prev) => ({ ...prev, [commentId]: false }));
    } catch (error) {
      console.log(error);
      toast.error("Failed to post reply");
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const removeCommentById = (commentsList, commentId: string) => {
    return commentsList
      .map((comment) => {
        if (comment.id === commentId) return null;

        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: removeCommentById(comment.replies, commentId),
          };
        }

        return comment;
      })
      .filter(Boolean);
  };

  const handleHideComment = async (
    platform: string,
    pageId: string,
    commentId: string
  ) => {
    try {
      const res = await hideCommentApi(
        platform,
        commentId,
        user.user_id,
        user.role === "agency" ? "agency" : "client",
        pageId
      );
      if (res.status === 200) {
        setComments((prev) => removeCommentById(prev, commentId));
        toast.success("Comment hidden successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to hide comment");
    }
  };

  const handleDeleteComment = async (
    platform: string,
    pageId: string,
    commentId: string
  ) => {
    try {
      const res = await deleteCommentApi(
        platform,
        commentId,
        user.user_id,
        user.role === "agency" ? "agency" : "client",
        pageId
      );
      if (res.status === 200) {
        setComments((prev) => removeCommentById(prev, commentId));
        toast.success("Comment deleted successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete comment");
    }
  };

  const platform = content?.media?.platform || "instagram";

  const normalizedComments = normalizeComments(comments, platform);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Comments</h2>
        <p className="text-muted-foreground">
          {normalizedComments.length} comments
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
            {platform}
          </span>
        </p>
      </div>
      <div className="space-y-6">
        {normalizedComments.map((comment) => {
          return (
            <Card
              key={comment.id}
              className="border-0 shadow-none bg-transparent"
            >
              <CardContent className="p-0">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 border">
                    <AvatarImage
                      src={`/placeholder.svg?height=40&width=40&text=${comment.username
                        .charAt(0)
                        .toUpperCase()}`}
                      alt={`@${comment.username}`}
                    />
                    <AvatarFallback>
                      {comment.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {platform === "facebook"
                          ? comment.username
                          : `@${comment.username}`}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(comment.timestamp)}
                      </span>
                      {platform === "facebook" &&
                        comment.originalData &&
                        "like_count" in comment.originalData && (
                          <span className="text-xs text-muted-foreground">
                            • {comment.originalData.like_count} likes
                          </span>
                        )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-auto"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          {comment.platform == "instagram" && (
                            <DropdownMenuItem
                              className="text-sm"
                              onClick={() =>
                                handleHideComment(
                                  content.media.platform,
                                  content.media.pageId,
                                  comment.id
                                )
                              }
                            >
                              <EyeOff className="mr-2 h-3 w-3" />
                              Hide
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-sm text-destructive"
                            onClick={() =>
                              handleDeleteComment(
                                content.media.platform,
                                content.media.pageId,
                                comment.id
                              )
                            }
                          >
                            <Trash2 className="mr-2 h-3 w-3" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="text-sm leading-relaxed break-words mb-2">
                      {formatCommentText(comment.text)}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleReplyInput(comment.id)}
                      className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground -ml-2"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Reply
                    </Button>

                    {showReplyInput[comment.id] && (
                      <div className="mt-3 space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Write a reply..."
                            value={replyInputs[comment.id] || ""}
                            onChange={(e) =>
                              handleReplyInputChange(comment.id, e.target.value)
                            }
                            className="text-sm"
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleReplySubmit(
                                  comment.id,
                                  platform,
                                  comment.username
                                );
                              }
                            }}
                            disabled={isSubmitting[comment.id]}
                          />
                          <Button
                            size="sm"
                            onClick={() =>
                              handleReplySubmit(
                                comment.id,
                                platform,
                                comment.username
                              )
                            }
                            disabled={
                              isSubmitting[comment.id] ||
                              !replyInputs[comment.id]?.trim()
                            }
                          >
                            {isSubmitting[comment.id] ? (
                              "Posting..."
                            ) : (
                              <Send className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReplyInput(comment.id)}
                          className="text-xs h-6 px-2 text-muted-foreground"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                    {comment.replies &&
                      comment.replies.length > 0 &&
                      (showReplies[comment.id] ? (
                        <div className="mt-4 ml-4 space-y-3 border-l-2 border-gray-100 pl-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={`/placeholder.svg?height=32&width=32&text=${reply.username
                                    .charAt(0)
                                    .toUpperCase()}`}
                                  alt={`@${reply.username}`}
                                />
                                <AvatarFallback>
                                  {reply.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-xs">
                                      {platform === "facebook"
                                        ? reply.username
                                        : `@${reply.username}`}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatTimestamp(reply.timestamp)}
                                    </span>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 ml-auto"
                                        >
                                          <MoreHorizontal className="h-3 w-3" />
                                          <span className="sr-only">
                                            More options
                                          </span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="w-32"
                                      >
                                        {comment.platform == "instagram" && (
                                          <DropdownMenuItem
                                            className="text-sm"
                                            onClick={() =>
                                              handleHideComment(
                                                content.media.platform,
                                                content.media.pageId,
                                                reply.id
                                              )
                                            }
                                          >
                                            <EyeOff className="mr-2 h-3 w-3" />
                                            Hide
                                          </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                          className="text-sm text-destructive"
                                          onClick={() =>
                                            handleDeleteComment(
                                              content.media.platform,
                                              content.media.pageId,
                                              reply.id
                                            )
                                          }
                                        >
                                          <Trash2 className="mr-2 h-3 w-3" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                  <div className="text-xs text-gray-700">
                                    {formatCommentText(reply.text)}
                                  </div>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleReplyInput(reply.id)}
                                  className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground -ml-2"
                                >
                                  <MessageCircle className="w-3 h-3 mr-1" />
                                  Reply
                                </Button>

                                {showReplyInput[reply.id] && (
                                  <div className="mt-3 space-y-2">
                                    <div className="flex gap-2">
                                      <Input
                                        placeholder="Write a reply..."
                                        value={replyInputs[reply.id] || ""}
                                        onChange={(e) =>
                                          handleReplyInputChange(
                                            reply.id,
                                            e.target.value
                                          )
                                        }
                                        className="text-sm"
                                        onKeyPress={(e) => {
                                          if (
                                            e.key === "Enter" &&
                                            !e.shiftKey
                                          ) {
                                            e.preventDefault();
                                            handleReplySubmit(
                                              reply.id,
                                              platform,
                                              reply.username
                                            );
                                          }
                                        }}
                                        disabled={isSubmitting[reply.id]}
                                      />
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          handleReplySubmit(
                                            reply.id,
                                            platform,
                                            reply.username
                                          )
                                        }
                                        disabled={
                                          isSubmitting[reply.id] ||
                                          !replyInputs[reply.id]?.trim()
                                        }
                                      >
                                        {isSubmitting[reply.id] ? (
                                          "Posting..."
                                        ) : (
                                          <Send className="w-3 h-3" />
                                        )}
                                      </Button>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleReplyInput(reply.id)}
                                      className="text-xs h-6 px-2 text-muted-foreground"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          <div className="mt-2">
                            <Button
                              onClick={() =>
                                setShowReplies((prev) => ({
                                  ...prev,
                                  [comment.id]: !prev[comment.id],
                                }))
                              }
                              variant="ghost"
                              size="sm"
                              className="text-xs h-6 px-2 text-blue-600 hover:text-blue-800"
                            >
                              Hide replies
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <Button
                            onClick={() =>
                              setShowReplies((prev) => ({
                                ...prev,
                                [comment.id]: !prev[comment.id],
                              }))
                            }
                            variant="ghost"
                            size="sm"
                            className="text-xs h-6 px-2 text-blue-600 hover:text-blue-800"
                          >
                            View {comment.replies.length} replies
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Comments;
