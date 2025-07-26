import { sendMailApi } from "@/services/agency/post.services"
import { toast } from "sonner"

export const handleSendMails = async (
    to:string[],
    message:string,
    subject:string

) => {
    if (to.length === 0) {
      toast.error("Please select at least one client to send mail.")
      return
    }
    try {
      await sendMailApi(to,subject,message)
      
    } catch (error) {
      console.error("Error sending reminders:", error)
      toast.error("Failed to send reminder emails. Please try again.")
    }
  }