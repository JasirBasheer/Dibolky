import { Route, Routes } from "react-router-dom";
import Home from "@/pages/portal.pages/home";
import PurchasePlan from "@/pages/portal.pages/purchasePlan";
import MainLoginPage from "@/pages/authentication.pages/mainLogin.page";

export default function PortalRoutes() {
    return (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<MainLoginPage />} />
        <Route path='/purchase/:platform/:id' element={<PurchasePlan />} />
      </Routes>
    )
  }