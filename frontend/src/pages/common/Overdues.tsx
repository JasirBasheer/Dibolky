"use client"

import { Label } from "@/components/ui/label"

import CustomBreadCrumbs from "@/components/ui/custom-breadcrumbs"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarDays, DollarSign, User, Search, ArrowUpDown, Mail, Send, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { useFilter, usePagination } from "@/hooks"
import type { InvoiceType, RootState } from "@/types"
import { getInvoices } from "@/services"
import PaginationControls from "@/components/ui/PaginationControls"
import DetailModal from "@/components/modals/details-modal"
import SelectInput from "@/components/ui/selectInput"
import { DataTable } from "@/components/ui/data-table"
import Skeleton from "react-loading-skeleton"
import axios from "@/utils/axios"

const Overdues = () => {
  const user = useSelector((state: RootState) => state.user)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | null>(null)
  const [selectedInvoices, setSelectedInvoices] = useState<InvoiceType[]>([])
  const [emailSubject, setEmailSubject] = useState("Payment Reminder - Overdue Invoice")
  const [emailMessage, setEmailMessage] = useState(`Dear [CLIENT_NAME],

We hope this message finds you well. We wanted to bring to your attention that your invoice [INVOICE_NUMBER] with a total amount of $[AMOUNT] was due on [DUE_DATE] and is currently overdue.

Please review the invoice details and arrange for payment at your earliest convenience. If you have any questions or concerns regarding this invoice, please don't hesitate to contact us.

Thank you for your prompt attention to this matter.

Best regards,
[YOUR_COMPANY]`)
  const [isSendingEmails, setIsSendingEmails] = useState(false)

  const [filter, setFilter] = useState({
    query: "",
    status: "unpaid",  
    sortBy: "dueDate",
    sortOrder: "asc",
    overdues: "true",
  })

  const { page, limit, nextPage, prevPage, reset } = usePagination(1, 10)
  const debouncedFilter = useFilter(filter, 900)

  const {
    data,
    isLoading: isInvoicesLoading,
    refetch,
  } = useQuery({
    queryKey: ["get-overdue-invoices", page, debouncedFilter],
    queryFn: () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        query: debouncedFilter.query,
        status: debouncedFilter.status,
        sortBy: debouncedFilter.sortBy,
        sortOrder: debouncedFilter.sortOrder,
        overdues: debouncedFilter.overdues,
      }).toString()
      return getInvoices(user.role, user.user_id, `?${searchParams}`)
    },
    select: (data) => data?.data,
    enabled: !!user.user_id,
  })

  useEffect(() => {
    reset()
  }, [debouncedFilter.query, debouncedFilter.status, debouncedFilter.sortBy, debouncedFilter.sortOrder])

  const openInvoiceDetails = (invoice: InvoiceType) => {
    setSelectedInvoice(invoice)
    setIsDetailModalOpen(true)
  }

  const handleSelectInvoice = (invoice: InvoiceType, checked: boolean) => {
    if (checked) {
      setSelectedInvoices((prev) => [...prev, invoice])
    } else {
      setSelectedInvoices((prev) => prev.filter((inv) => inv._id !== invoice._id))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked && data?.invoices) {
      // Add current page invoices to existing selections (avoid duplicates)
      setSelectedInvoices((prev) => {
        const existingIds = prev.map((inv) => inv._id)
        const newInvoices = data.invoices.filter((inv) => !existingIds.includes(inv._id))
        return [...prev, ...newInvoices]
      })
    } else {
      // Remove current page invoices from selections
      if (data?.invoices) {
        const currentPageIds = data.invoices.map((inv) => inv._id)
        setSelectedInvoices((prev) => prev.filter((inv) => !currentPageIds.includes(inv._id)))
      }
    }
  }

  const handleSendReminders = async () => {
    if (selectedInvoices.length === 0) {
      toast.error("Please select at least one invoice to send reminders.")
      return
    }

    setIsSendingEmails(true)

    try {
      const response = await axios.post("/api/invoices/send-reminders", {
        invoiceIds: selectedInvoices.map((inv) => inv._id),
        subject: emailSubject,
        message: emailMessage,
      })

      if (response.data.success) {
        toast.success(`Reminder emails sent to ${selectedInvoices.length} client(s) successfully!`)
        setSelectedInvoices([])
        setIsEmailModalOpen(false)
        refetch()
      }
    } catch (error) {
      console.error("Error sending reminders:", error)
      toast.error("Failed to send reminder emails. Please try again.")
    } finally {
      setIsSendingEmails(false)
    }
  }

  const getSelectedClientsInfo = () => {
    return selectedInvoices.map((invoice) => ({
      clientName: invoice.client.clientName,
      email: invoice.client.email,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.pricing,
      dueDate: invoice.dueDate,
    }))
  }

    const getDaysOverdue = (dueDate: string | Date) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <>
      <CustomBreadCrumbs
        breadCrumbs={[
          ["Invoice Management", `/${user.role == "agency" ? "agency" : "client"}/invoices`],
          ["Overdue Invoices", ""],
        ]}
      />

      <div className="p-6 space-y-6">
        {/* Stats Card */}

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by client name, invoice number, or service..."
                    value={filter.query}
                    onChange={(e) => setFilter((prev) => ({ ...prev, query: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <SelectInput
                placeholder="Sort by"
                value={filter.sortBy}
                options={[
                  { label: "Due Date", value: "dueDate" },
                  { label: "Date Created", value: "createdAt" },
                  { label: "Client Name", value: "clientName" },
                  { label: "Amount", value: "pricing" },
                ]}
                onChange={(value) => setFilter((prev) => ({ ...prev, sortBy: value }))}
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

              <Button onClick={() => setIsEmailModalOpen(true)} disabled={selectedInvoices.length === 0}>
                <Send className="h-4 w-4 mr-2" />
                Send Reminders ({selectedInvoices.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Overdue Invoices</span>
              {data?.invoices && data.invoices.length > 0 && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={
                      data?.invoices
                        ? data.invoices.every((inv) => selectedInvoices.some((selected) => selected._id === inv._id))
                        : false
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-gray-600">Select All</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isInvoicesLoading ? (
              <DataTable
                data={data?.invoices || []}
                onRowClick={openInvoiceDetails}
                columns={[
                  {
                    header: "Select",
                    render: (invoice) => (
                      <Checkbox
                        checked={selectedInvoices.some((inv) => inv._id === invoice._id)}
                        onCheckedChange={(checked) => handleSelectInvoice(invoice, checked as boolean)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ),
                  },
                  {
                    header: "Invoice #",
                    render: (invoice) => invoice.invoiceNumber,
                  },
                  {
                    header: "Client",
                    render: (invoice) => (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{invoice.client.clientName}</div>
                          <div className="text-sm text-gray-500">{invoice.client.email}</div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    header: "Service",
                    render: (invoice) => invoice.service.serviceName,
                  },
                  {
                    header: "Amount",
                    render: (invoice) => (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">${invoice.pricing}</span>
                      </div>
                    ),
                  },
                  {
                    header: "Due Date",
                    render: (invoice) => (
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-red-400" />
                        <span className="text-red-600">{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</span>
                      </div>
                    ),
                  },
                  {
                    header: "Days Overdue",
                    render: (invoice) => <Badge variant="destructive">{getDaysOverdue(invoice.dueDate)} days</Badge>,
                  },
                  {
                    header: "Status",
                    render: (invoice) => <Badge variant="destructive">Overdue</Badge>,
                  },
                ]}
              />
            ) : (
              <Skeleton count={5} height={48} />
            )}
          </CardContent>
        </Card>

        <PaginationControls page={page} totalPages={data?.totalPages || 1} onNext={nextPage} onPrev={prevPage} />

        {/* Invoice Detail Modal */}
        <DetailModal title="Invoice Details" open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          {selectedInvoice && (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{selectedInvoice.invoiceNumber}</h3>
                  <p className="text-sm text-gray-500">
                    Created: {format(new Date(selectedInvoice.createdAt), "MMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-red-600 font-medium">
                    {getDaysOverdue(selectedInvoice.dueDate)} days overdue
                  </p>
                </div>
                <Badge variant="destructive">Overdue</Badge>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Client Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span>{selectedInvoice.client.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span>{selectedInvoice.client.email}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>{selectedInvoice.service.serviceName}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>${selectedInvoice.pricing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span className="text-red-600">{format(new Date(selectedInvoice.dueDate), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Days Overdue:</span>
                    <span className="text-red-600 font-medium">{getDaysOverdue(selectedInvoice.dueDate)} days</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setSelectedInvoices([selectedInvoice])
                    setIsEmailModalOpen(true)
                    setIsDetailModalOpen(false)
                  }}
                  className=""
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reminder
                </Button>
              </div>
            </>
          )}
        </DetailModal>

        {/* Email Reminder Modal */}
        <DetailModal title="Send Payment Reminders" open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Selected Clients ({selectedInvoices.length})</h4>
              <div className="max-h-32 overflow-y-auto bg-gray-50 p-3 rounded">
                {getSelectedClientsInfo().map((client, index) => (
                  <div key={index} className="text-sm py-1">
                    <span className="font-medium">{client.clientName}</span> - {client.invoiceNumber} (${client.amount})
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="emailSubject">Email Subject</Label>
              <Input
                id="emailSubject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject..."
              />
            </div>

            <div>
              <Label htmlFor="emailMessage">Email Message</Label>
              <textarea
                id="emailMessage"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="w-full h-64 p-3 border rounded-md resize-none"
                placeholder="Email message..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Use placeholders: [CLIENT_NAME], [INVOICE_NUMBER], [AMOUNT], [DUE_DATE], [YOUR_COMPANY]
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSendReminders}
                disabled={isSendingEmails}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSendingEmails ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reminders ({selectedInvoices.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </DetailModal>
      </div>
    </>
  )
}

export default Overdues
