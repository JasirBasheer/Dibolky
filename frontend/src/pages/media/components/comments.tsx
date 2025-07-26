import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { replayCommentApi } from "@/services"

// Type definitions for different platforms
interface InstagramComment {
  id: string
  text: string
  username: string
  timestamp: string
  replies?: InstagramComment[]
}

interface FacebookComment {
  id: string
  message: string
  from: {
    name: string
    id: string
  }
  created_time: string
  like_count: number
  comment_count: number
}

interface NormalizedComment {
  id: string
  text: string
  username: string
  timestamp: string
  replies?: NormalizedComment[]
  platform: 'instagram' | 'facebook'
  originalData: InstagramComment | FacebookComment
}

const Comments = ({ content, user }) => {
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({})
  const [showReplyInput, setShowReplyInput] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState<Record<string, boolean>>({})

  // Normalize comments based on platform
  const normalizeComments = (comments: any[], platform: string): NormalizedComment[] => {
    if (!comments) return []

    return comments.map((comment) => {
      if (platform === 'facebook') {
        const fbComment = comment as FacebookComment
        return {
          id: fbComment.id,
          text: fbComment.message,
          username: fbComment.from.name,
          timestamp: fbComment.created_time,
          replies: [], // Facebook nested comments would need separate API call
          platform: 'facebook' as const,
          originalData: fbComment
        }
      } else {
        // Instagram format (existing)
        const igComment = comment as InstagramComment
        return {
          id: igComment.id,
          text: igComment.text,
          username: igComment.username,
          timestamp: igComment.timestamp,
          replies: igComment.replies ? normalizeComments(igComment.replies, platform) : [],
          platform: 'instagram' as const,
          originalData: igComment
        }
      }
    })
  }

  function formatCommentText(text: string): React.ReactNode {
    const lines = text.split("\n")
    return lines.map((line, index) => (
      <span key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </span>
    ))
  }

  function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const handleReplyInputChange = (commentId: string, value: string) => {
    setReplyInputs((prev) => ({
      ...prev,
      [commentId]: value,
    }))
  }

  const toggleReplyInput = (commentId: string) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }

  const handleReplySubmit = async (commentId: string) => {
    const replyMessage = replyInputs[commentId]?.trim()

    if (!replyMessage) {
      return
    }

    setIsSubmitting((prev) => ({ ...prev, [commentId]: true }))

    try {
      await replayCommentApi(
        user.role,
        user.user_id,
        content.media.platform,
        commentId,
        replyMessage,
        content.media.pageId
      )
      setReplyInputs((prev) => ({ ...prev, [commentId]: "" }))
      setShowReplyInput((prev) => ({ ...prev, [commentId]: false }))
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [commentId]: false }))
    }
  }

  // Get normalized comments based on platform
  const platform = content?.media?.platform || 'instagram'
  const normalizedComments = normalizeComments(content?.comments || [], platform)

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
            <Card key={comment.id} className="border-0 shadow-none bg-transparent">
              <CardContent className="p-0">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 border">
                    <AvatarImage
                      src={`/placeholder.svg?height=40&width=40&text=${comment.username.charAt(0).toUpperCase()}`}
                      alt={`@${comment.username}`}
                    />
                    <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {platform === 'facebook' ? comment.username : `@${comment.username}`}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(comment.timestamp)}
                      </span>
                      {platform === 'facebook' && comment.originalData && 'like_count' in comment.originalData && (
                        <span className="text-xs text-muted-foreground">
                          • {comment.originalData.like_count} likes
                        </span>
                      )}
                    </div>
                    <div className="text-sm leading-relaxed break-words mb-2">
                      {formatCommentText(comment.text)}
                    </div>

                    {/* Reply Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleReplyInput(comment.id)}
                      className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground -ml-2"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Reply
                    </Button>

                    {/* Reply Input Form */}
                    {showReplyInput[comment.id] && (
                      <div className="mt-3 space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Write a reply..."
                            value={replyInputs[comment.id] || ""}
                            onChange={(e) => handleReplyInputChange(comment.id, e.target.value)}
                            className="text-sm"
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleReplySubmit(comment.id)
                              }
                            }}
                            disabled={isSubmitting[comment.id]}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleReplySubmit(comment.id)}
                            disabled={isSubmitting[comment.id] || !replyInputs[comment.id]?.trim()}
                          >
                            {isSubmitting[comment.id] ? "Posting..." : <Send className="w-3 h-3" />}
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

                    {/* Display existing replies - mainly for Instagram */}
                    {comment.replies && comment.replies.length > 0 && (
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
                              <AvatarFallback>{reply.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-xs">
                                    {platform === 'facebook' ? reply.username : `@${reply.username}`}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimestamp(reply.timestamp)}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-700">
                                  {formatCommentText(reply.text)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Facebook-specific: Show comment count if there are nested comments */}
                    {platform === 'facebook' && 
                     comment.originalData && 
                     'comment_count' in comment.originalData && 
                     comment.originalData.comment_count > 0 && (
                      <div className="mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2 text-blue-600 hover:text-blue-800"
                        >
                          View {comment.originalData.comment_count} replies
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Comments