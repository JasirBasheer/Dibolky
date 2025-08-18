"use client"

import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Calendar, ExternalLink, Eye, MousePointer, TrendingUp, Users, Loader2, Plus } from 'lucide-react'
import DetailModal from "@/components/modals/details-modal"

const AdsListWithInsights = ({ ads, isAdsLoading }) => {
  const [selectedAd, setSelectedAd] = useState(null)
  const [isCreateAdModalOpen,setIsCreateAdModalOpen] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200"
      case "PAUSED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  const formatNumber = (num) => {
    return parseInt(num).toLocaleString()
  }

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`
  }

  const openModal = (ad) => {
    setSelectedAd(ad)
  }

  const closeModal = () => {
    setSelectedAd(null)
  }

  return (
    <>
<DetailModal
        title="Create Campaign"
        open={isCreateAdModalOpen}
        onOpenChange={setIsCreateAdModalOpen}
      >
        <form  className="space-y-6">
              {/* Ad Section */}
              <div>
                <h3 className="font-medium mb-2">Ad Details</h3>

                <label
                  htmlFor="adName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ad Name
                </label>
                <input
                  id="adName"
                  name="adName"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="My Ad"
                />

                <label
                  htmlFor="adCreativeId"
                  className="block text-sm font-medium text-gray-700 mt-4"
                >
                  Ad Creative ID
                </label>
                <input
                  id="adCreativeId"
                  name="adCreativeId"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="1234567890"
                />

                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mt-4"
                >
                  Ad Status
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="PAUSED">Paused</option>
                  <option value="ACTIVE">Active</option>
                </select>
              </div>

            </form>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setIsCreateAdModalOpen(false)}
          >
            Close
          </Button>
          <Button
            variant="default"
            onClick={() => setIsCreateAdModalOpen(false)}
          >
            Create
          </Button>
        </div>
      </DetailModal>




    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ads</h2>
        <Button
              size="sm"
              className=" bg-black text-white"
              onClick={()=> setIsCreateAdModalOpen(true)}
            >
              <Plus className="h-4 w-4 "  />
            </Button>
      </div>

      {isAdsLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="mx-auto h-12 w-12 text-muted-foreground animate-spin" />
              <p className="text-muted-foreground">Loading ads...</p>
            </div>
          </CardContent>
        </Card>
      ) : ads.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No ads available</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {ads.map((ad) => (
            <Card 
              key={ad.id} 
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => openModal(ad)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{ad.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Campaign: {ad.campaign_id}</span>
                      <span>•</span>
                      <span>Ad Set: {ad.adset_id}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(ad.status)}>
                    {ad.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedAd} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedAd && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedAd.name}</DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="creative">Creative</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="leads">Leads</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ad Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Status</p>
                          <Badge className={getStatusColor(selectedAd.status)}>
                            {selectedAd.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Ad Set ID</p>
                          <p className="font-mono text-sm">{selectedAd.adset_id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Campaign ID</p>
                          <p className="font-mono text-sm">{selectedAd.campaign_id}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="creative" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Creative Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedAd.creativeDetails?.object_story_spec ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Page ID</p>
                              <p className="font-mono text-sm">
                                {selectedAd.creativeDetails.object_story_spec.page_id || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Instagram User ID</p>
                              <p className="font-mono text-sm">
                                {selectedAd.creativeDetails.object_story_spec.instagram_user_id || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Video ID</p>
                              <p className="font-mono text-sm">
                                {selectedAd.creativeDetails.object_story_spec.video_data?.video_id || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Call To Action</p>
                              <p className="text-sm">
                                {selectedAd.creativeDetails.object_story_spec.video_data?.call_to_action?.type || "N/A"}
                              </p>
                            </div>
                          </div>
                          
                          {selectedAd.creativeDetails.object_story_spec.video_data?.image_url && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">Creative Image</p>
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={selectedAd.creativeDetails.object_story_spec.video_data.image_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Image
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            </div>
                          )}

                          {selectedAd.creativeDetails.object_story_spec.video_data?.call_to_action?.value?.link && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-2">CTA Link</p>
                              <Button variant="outline" size="sm" asChild>
                                <a
                                  href={selectedAd.creativeDetails.object_story_spec.video_data.call_to_action.value.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Open Link
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No creative details available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="insights" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedAd.insights ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 border rounded-lg">
                              <Eye className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                              <p className="text-2xl font-bold">{formatNumber(selectedAd.insights.impressions)}</p>
                              <p className="text-sm text-muted-foreground">Impressions</p>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                              <MousePointer className="h-6 w-6 mx-auto mb-2 text-green-600" />
                              <p className="text-2xl font-bold">{formatNumber(selectedAd.insights.clicks)}</p>
                              <p className="text-sm text-muted-foreground">Clicks</p>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                              <p className="text-2xl font-bold">{formatCurrency(selectedAd.insights.spend)}</p>
                              <p className="text-sm text-muted-foreground">Spend</p>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                              <BarChart3 className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                              <p className="text-2xl font-bold">{selectedAd.insights.ctr}%</p>
                              <p className="text-sm text-muted-foreground">CTR</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No insights available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="leads" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Leads
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {!selectedAd.leads || selectedAd.leads.length === 0 ? (
                        <div className="text-center py-8">
                          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No leads found for this ad</p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Lead ID</TableHead>
                              <TableHead>Created Time</TableHead>
                              <TableHead>Field Data</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedAd.leads.map((lead) => (
                              <TableRow key={lead.id}>
                                <TableCell className="font-mono text-sm">{lead.id}</TableCell>
                                <TableCell>
                                  {new Date(lead.created_time).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  {lead.field_data
                                    ? lead.field_data
                                        .map((field) => `${field.name}: ${field.values.join(", ")}`)
                                        .join("; ")
                                    : "N/A"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </>

  )
}

export default AdsListWithInsights
