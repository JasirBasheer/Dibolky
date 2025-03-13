import { ForgotPassword, ResetPassword } from "@/pages/authentication.pages/forgotPassword";
import Login from "@/pages/authentication.pages/login";
import ProtectedRoute from "@/pages/authentication.pages/protected.route";
import UnProtectedRoute from "@/pages/authentication.pages/unProtected.route";
import ClientContent from "@/pages/client.pages/client.content";
import ClientDashboard from "@/pages/client.pages/client.dashboard";
import ClientLayout from "@/pages/client.pages/client.layout";
import ClientMessages from "@/pages/client.pages/client.message";
import { Route, Routes } from "react-router-dom";


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
          <Route path='message' element={<ClientMessages />} />
        </Route>
  
        <Route path='/login' element={<UnProtectedRoute role={"client"} ><Login role={"client"} /></UnProtectedRoute>} />
        <Route path='/forgot-password' element={<ForgotPassword role={"client"} />} />
        <Route path='/reset-password/:token' element={<ResetPassword role={"client"} />} />
      </Routes>
    )
  }