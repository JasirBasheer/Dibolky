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
      await sendMailApi(to,subject,message)
  }