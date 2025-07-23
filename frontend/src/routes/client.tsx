import { ForgotPassword, ResetPassword } from "@/pages/authentication.pages/forgotPassword";
import Login from "@/pages/authentication.pages/login";
import ProtectedRoute from "@/pages/authentication.pages/protected.route";
import UnProtectedRoute from "@/pages/authentication.pages/unProtected.route";
import ChatPage from "@/pages/chat/chatPage";
import ClientContent from "@/pages/client/client.content";
import ClientDashboard from "@/pages/client/client.dashboard";
import Layout from "@/pages/client/Layout";
import Integrations from "@/pages/common/Integrations";
import Invoices from "@/pages/common/Invoices";
import Overdues from "@/pages/common/Overdues";
import Payments from "@/pages/common/Payments";
import { Route, Routes } from "react-router-dom";


export default function ClientRoutes() {
    return (
      <Routes>
        <Route path='/' element={
          <ProtectedRoute role={"client"} >
            <Layout />
          </ProtectedRoute>
        } >
          <Route index element={<ClientDashboard />} />
          <Route path='contents' element={<ClientContent />} />
          <Route path='messages' element={<ChatPage />} />
          <Route path='invoices' element={<Invoices />} />
          <Route path='invoices/payments' element={<Payments />} />
          <Route path='invoices/overdue' element={<Overdues />} />
          <Route path='integrations' element={<Integrations />} />
        </Route>
  
        <Route path='/login' element={<UnProtectedRoute role={"client"} ><Login role={"client"} /></UnProtectedRoute>} />
        <Route path='/forgot-password' element={<ForgotPassword role={"client"} />} />
        <Route path='/reset-password/:token' element={<ResetPassword role={"client"} />} />
      </Routes>
    )
  }