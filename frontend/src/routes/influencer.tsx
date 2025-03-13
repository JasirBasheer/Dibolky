import { Route, Routes } from "react-router-dom";
import Login from "@/pages/authentication.pages/login";
import ProtectedRoute from "@/pages/authentication.pages/protected.route";
import UnProtectedRoute from "@/pages/authentication.pages/unProtected.route";
import ClientLayout from "@/pages/client.pages/client.layout";
import { 
    ForgotPassword, 
    ResetPassword 
} from "@/pages/authentication.pages/forgotPassword";


export default function InfluencerRoutes() {
    return (
      <Routes>
        <Route path='/' element={
          <ProtectedRoute role={"influencer"} >
            <ClientLayout />
            </ProtectedRoute>
          } >
          
     
        </Route>
  
        <Route path='/login' element={<UnProtectedRoute role={"influencer"} ><Login role={"influencer"} /></UnProtectedRoute>} />
        <Route path='/forgot-password' element={<ForgotPassword role={"influencer"} />} />
        <Route path='/reset-password/:token' element={<ResetPassword role={"influencer"} />} />
      </Routes>
    )
  }