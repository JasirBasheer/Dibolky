import { Route, Routes } from "react-router-dom";
import Login from "@/pages/authentication.pages/login";
import ProtectedRoute from "@/pages/authentication.pages/protected.route";
import UnProtectedRoute from "@/pages/authentication.pages/unProtected.route";
import ClientLayout from "@/pages/client.pages/client.layout";
import { 
    ForgotPassword, 
    ResetPassword 
} from "@/pages/authentication.pages/forgotPassword";


export default function ManagerRoutes() {
    return (
      <Routes>
        <Route path='/' element={
          <ProtectedRoute role={"manager"} >
            <ClientLayout />
            </ProtectedRoute>
          } >
     
        </Route>
  
        <Route path='/login' element={<UnProtectedRoute role={"manager"} ><Login role={"manager"} /></UnProtectedRoute>} />
        <Route path='/forgot-password' element={<ForgotPassword role={"manager"} />} />
        <Route path='/reset-password/:token' element={<ResetPassword role={"manager"} />} />
      </Routes>
    )
  }