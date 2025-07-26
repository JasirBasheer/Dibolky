"use client"

import { Clock, User, ActivityIcon, Building2, Users, CreditCard, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IActivityType } from "@/types"
import { Link } from "react-router-dom"
// import { useRouter } from "next/navigation"

const getActivityIcon = (activityType: string) => {
  switch (activityType) {
    case "account_created":
      return <Building2 className="h-4 w-4" />
    case "client_created":
      return <Users className="h-4 w-4" />
    case "plan_upgraded":
      return <CreditCard className="h-4 w-4" />
    case "content_approved":
      return <CheckCircle className="h-4 w-4" />
    case "content_rejected":
      return <XCircle className="h-4 w-4" />
    default:
      return <ActivityIcon className="h-4 w-4" />
  }
}

// const getActivityColor = (activityType: string) => {
//   switch (activityType) {
//     case "account_created":
//       return "bg-blue-100 text-blue-800 border-blue-200"
//     case "client_created":
//       return "bg-purple-100 text-purple-800 border-purple-200"
//     case "plan_upgraded":
//       return "bg-green-100 text-green-800 border-green-200"
//     case "content_approved":
//       return "bg-emerald-100 text-emerald-800 border-emerald-200"
//     case "content_rejected":
//       return "bg-red-100 text-red-800 border-red-200"
//     default:
//       return "bg-gray-100 text-gray-800 border-gray-200"
//   }
// }

const getEntityIcon = (entityType: string) => {
  switch (entityType) {
    case "agency":
      return <Building2 className="h-3 w-3" />
    case "client":
      return <Users className="h-3 w-3" />
    default:
      return <ActivityIcon className="h-3 w-3" />
  }
}

const formatTimeAgo = (isoString: string) => {
  const now = new Date()
  const activityTime = new Date(isoString)
  const diffInMs = now.getTime() - activityTime.getTime()

  const minutes = Math.floor(diffInMs / (1000 * 60))
  const hours = Math.floor(diffInMs / (1000 * 60 * 60))
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return minutes <= 1 ? "Just now" : `${minutes} minutes ago`
  } else if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`
  } else {
    return days === 1 ? "1 day ago" : `${days} days ago`
  }
}

const formatActivityType = (activityType: string) => {
  return activityType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

interface ActivityFeedProps {
  activities: IActivityType[]
  showLoadMore?: boolean
  onLoadMore?: () => void
  emptyStateTitle?: string
  emptyStateDescription?: string
}

export default function ActivityFeed({
  activities,
  showLoadMore = true,
  onLoadMore,
  emptyStateTitle = "No activity found as of now..",
  emptyStateDescription = "Activities will appear here when actions are performed",
}: ActivityFeedProps) {



  return (
    <div className="w-full h-full flex justify-center items-center lg:justify-start lg:items-start overflow-hidden overflow-y-auto flex-wrap gap-5 p-2 pt-3">
      {!activities || activities.length === 0 ? (
        <div className="w-full h-[14rem] flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <ActivityIcon className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 text-center">{emptyStateTitle}</p>
          <p className="text-xs text-gray-400 text-center">{emptyStateDescription}</p>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="space-y-3">
            {activities?.map((activity) => (
              <Card
                key={activity._id}
                className="transition-all duration-200  border-x-transparent border-t-transparent rounded-none shadow-none cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">


                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-xs px-2 py-1 `}
                        >
                          {getActivityIcon(activity.activityType)}
                          <span className="ml-1">{formatActivityType(activity.activityType)}</span>
                        </Badge>

                        <Badge variant="secondary" className="text-xs px-2 py-1">
                          {getEntityIcon(activity.entity.type)}
                          <span className="ml-1 capitalize">{activity.entity.type}</span>
                        </Badge>

                        {activity.timestamp &&
                          <span className="text-xs text-gray-500 flex items-center gap-1 ml-auto">
                          <Clock className="h-3 w-3" />
                        { formatTimeAgo(activity.timestamp)}
                        </span>
                      }
                      </div>

                      <p className="text-sm text-gray-800 leading-relaxed mb-2 transition-colors">
                        {activity.activity}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <User className="h-3 w-3" />
                          <span>by {activity.user.username}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400">{activity.user.email}</span>
                        </div>

                        <Link to={activity.redirectUrl} className="text-xs text-blue-600 hover:text-blue-800 font-medium">View details →</Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
{/* 
          {showLoadMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={onLoadMore}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Load more activities
              </button>
            </div>
          )} */}
        </div>
      )}
    </div>
  )
}
