"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/utils/shardcn"
import { fetchAllClientsApi } from "@/services/agency/get.services"
import { useQuery } from "@tanstack/react-query"
import { createInvoiceApi } from "@/services/agency/post.services"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs"

interface IClientTenantType {
  _id: string
  orgId?: string
  main_id?: string
  name?: string
  email?: string
  profile?: string
  bio?: string
  industry?: string
  isSocialMediaInitialized: boolean
  isPaymentInitialized: boolean
  createdAt?: string | number
  updatedAt?: string | number
}

export default function CreateInvoice() {
  const [selectedClient, setSelectedClient] = useState<IClientTenantType | null>(null)
  const [dueDate, setDueDate] = useState<Date>()
  const [serviceName, setServiceName] = useState("")
  const [serviceDescription, setServiceDescription] = useState("")
  const [pricing, setPricing] = useState<number>()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["get-nav-clients"],
    queryFn: () => {
      return fetchAllClientsApi()
    },
    select: (data) => data?.data.result.clients,
    staleTime: 1000 * 60 * 60,
  })



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient || !dueDate || !serviceName || pricing <= 0) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)

    const invoiceData = {
      client: {
        clientId: selectedClient._id,
        clientName: selectedClient.name || "",
        email: selectedClient.email || "",
      },
      service: {
        serviceName,
        details: {
          budget:pricing,
          description: serviceDescription,
        },
      },
      pricing,
      dueDate,
      isPaid: false,
      orgId: selectedClient.orgId || "",
    }

    try {

       const response = await createInvoiceApi(invoiceData)
      if (response.status ==200) {
        toast.success("Invoice created successfully!")
        navigate('/agency/invoices')
      } else {
        toast.error("Error creating invoice")
      }
    } catch (error) {
      console.error("Error creating invoice:", error)
      toast.error("Error creating invoice")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
     <CustomBreadCrumbs
        breadCrumbs={[
          ["Tools & Settings", "/agency"],
          ["Settings", ""],
        ]}
      />
    <div className="container mx-auto p-6 mt-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Invoice</CardTitle>
          <CardDescription>Generate a new invoice for your client.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="client">Select Client *</Label>
              <Select
                onValueChange={(value) => {
                  const client = clients?.find((c) => c._id === value)
                  setSelectedClient(client || null)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Select a client"} />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map((client:IClientTenantType) => (
                    <SelectItem key={client._id} value={client._id}>
                      <div className="flex ">
                        <span className="font-medium mr-3">{client.name}</span>
                        <span className="text-sm text-muted-foreground mr-3"> - {client.email} -</span>
                        <span className="text-sm text-muted-foreground ">  {client.industry}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            

            {/* Service Details */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Service Details</Label>

              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name *</Label>
                <Input
                  id="serviceName"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g., Web Development, Social Media Management"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceDescription">Service Description</Label>
                <Textarea
                  id="serviceDescription"
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="Describe the service provided..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricing">Price ($) *</Label>
                <Input
                  id="pricing"
                  type="number"
                  min="0"
                  step="0.01"
                  value={pricing}
                  onChange={(e) => setPricing(Number.parseFloat(e.target.value) )}
                  placeholder="price"
                  required
                />
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Select due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {pricing > 0 && (
              <Card className="bg-primary/5">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">${pricing.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !selectedClient || !dueDate || !serviceName || pricing <= 0}>
                {loading ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
</>

  )
}
