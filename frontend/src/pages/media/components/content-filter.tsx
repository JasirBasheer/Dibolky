"use client"

import { useState } from "react"
import { Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface ContentFilterProps {
  connections?: Array<{ id: string; name: string; platform: string }>
  onFilterChange: (connections: string[], platforms: string[], contentTypes: string[]) => void
  selectedConnections: string[]
  selectedPlatforms: string[]
  selectedContentTypes: string[]
}

export const ContentFilter = ({
  connections = [],
  onFilterChange,
  selectedConnections,
  selectedPlatforms,
  selectedContentTypes,
}: ContentFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const platforms = [
    { id: "instagram", name: "Instagram", color: "bg-pink-100 text-pink-800" },
    { id: "facebook", name: "Facebook", color: "bg-blue-100 text-blue-800" },
  ]

  const contentTypes = [
    { id: "post", name: "Post", icon: "📝" },
    { id: "reel", name: "Reel", icon: "🎬" },
    { id: "story", name: "Story", icon: "📸" },
    { id: "video", name: "Video", icon: "🎥" },
    { id: "carousel", name: "Carousel", icon: "🖼️" },
  ]

  const handleConnectionChange = (connectionId: string, checked: boolean) => {
    const newConnections = checked
      ? [...selectedConnections, connectionId]
      : selectedConnections.filter((id) => id !== connectionId)
    onFilterChange(newConnections, selectedPlatforms, selectedContentTypes)
  }

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    const newPlatforms = checked
      ? [...selectedPlatforms, platformId]
      : selectedPlatforms.filter((id) => id !== platformId)
    onFilterChange(selectedConnections, newPlatforms, selectedContentTypes)
  }

  const handleContentTypeChange = (contentTypeId: string, checked: boolean) => {
    const newContentTypes = checked
      ? [...selectedContentTypes, contentTypeId]
      : selectedContentTypes.filter((id) => id !== contentTypeId)
    onFilterChange(selectedConnections, selectedPlatforms, newContentTypes)
  }

  const clearAllFilters = () => {
    onFilterChange([], [], [])
  }

  const totalFilters = selectedConnections.length + selectedPlatforms.length + selectedContentTypes.length

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          <ChevronDown className="h-4 w-4 ml-2" />
          {totalFilters > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {totalFilters}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Filters</h4>
            {totalFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs h-auto p-1">
                Clear all
              </Button>
            )}
          </div>

          {/* Content Types */}
          <div>
            <DropdownMenuLabel className="px-0 text-xs font-medium text-gray-700">Content Types</DropdownMenuLabel>
            <div className="space-y-2 mt-2">
              {contentTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`content-${type.id}`}
                    checked={selectedContentTypes.includes(type.id)}
                    onCheckedChange={(checked) => handleContentTypeChange(type.id, checked as boolean)}
                  />
                  <label htmlFor={`content-${type.id}`} className="text-sm flex items-center space-x-2 cursor-pointer">
                    <span>{type.icon}</span>
                    <span>{type.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Platforms */}
          <div>
            <DropdownMenuLabel className="px-0 text-xs font-medium text-gray-700">Platforms</DropdownMenuLabel>
            <div className="space-y-2 mt-2">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`platform-${platform.id}`}
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={(checked) => handlePlatformChange(platform.id, checked as boolean)}
                  />
                  <label
                    htmlFor={`platform-${platform.id}`}
                    className="text-sm cursor-pointer flex items-center space-x-2"
                  >
                    <Badge className={`text-xs ${platform.color}`}>{platform.name}</Badge>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Connections/Pages */}
          <div>
            <DropdownMenuLabel className="px-0 text-xs font-medium text-gray-700">Pages & Accounts</DropdownMenuLabel>
            <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
              {connections.length === 0 ? (
                <p className="text-xs text-gray-500">No connections available</p>
              ) : (
                connections.map((connection) => (
                  <div key={connection.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`connection-${connection.id}`}
                      checked={selectedConnections.includes(connection.id)}
                      onCheckedChange={(checked) => handleConnectionChange(connection.id, checked as boolean)}
                    />
                    <label htmlFor={`connection-${connection.id}`} className="text-sm cursor-pointer flex-1">
                      <div className="flex items-center justify-between">
                        <span>{connection.name}</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {connection.platform}
                        </Badge>
                      </div>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
