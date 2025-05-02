import { Route, Routes } from "react-router-dom";
import Home from "@/pages/portal.pages/home";
import PurchasePlan from "@/pages/portal.pages/purchase";
import MainLoginPage from "@/pages/authentication.pages/mainLogin.page";
import Trial from "@/pages/portal.pages/trial";

export default function PortalRoutes() {
    return (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<MainLoginPage />} />
        <Route path='/trial' element={<Trial />} />
        <Route path='/purchase/:plan_id' element={<PurchasePlan />} />
      </Routes>
    )
  }