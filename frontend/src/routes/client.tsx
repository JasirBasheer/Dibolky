import { CaseStudiesPage, ClientLayout, ForgotPassword, Login, PortfolioPage, ProtectedRoute, ResetPassword, TestimonialsPage, UnProtectedRoute } from "@/pages";
import ChatPage from "@/pages/chat/chatPage";
import ClientContent from "@/pages/client/client.content";
import ClientDashboard from "@/pages/dashboard/clientDashboard";
import Integrations from "@/pages/common/Integrations";
import Invoices from "@/pages/common/Invoices";
import Overdues from "@/pages/common/Overdues";
import Payments from "@/pages/common/Payments";
import { Route, Routes } from "react-router-dom";
import Media from "@/pages/media/MediaPage";
import Inbox from "@/components/common/inbox";


export default function ClientRoutes() {
    return (
      <Routes>
        <Route path='/' element={
          <ProtectedRoute role={"client"} >
            <ClientLayout />
          </ProtectedRoute>
        } >
          <Route index element={<ClientDashboard />} />
          <Route path='contents' element={<ClientContent />} />
          <Route path='messages' element={<ChatPage />} />
          <Route path='invoices' element={<Invoices />} />
          <Route path='invoices/payments' element={<Payments />} />
          <Route path='invoices/overdue' element={<Overdues />} />
          <Route path='integrations' element={<Integrations />} />
          <Route path='work/portfolio' element={<PortfolioPage />} />
          <Route path='work/case-studies' element={<CaseStudiesPage />} />
          <Route path='work/testimonials' element={<TestimonialsPage />} />

          <Route path='media' element={<Media />} />
          <Route path='inbox' element={<Inbox />} />

          
        </Route>
  
        <Route path='/login' element={<UnProtectedRoute role={"client"} ><Login role={"client"} /></UnProtectedRoute>} />
        <Route path='/forgot-password' element={<ForgotPassword role={"client"} />} />
        <Route path='/reset-password/:token' element={<ResetPassword role={"client"} />} />
      </Routes>
    )
  }