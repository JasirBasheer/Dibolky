import { FreeTrialCards, Home, MainLoginPage, PurchasePlan } from "@/pages";
import { Route, Routes } from "react-router-dom";


export default function PortalRoutes() {
    return (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<MainLoginPage />} />
        <Route path='/trial' element={<FreeTrialCards />} />
        <Route path='/purchase/:plan_id' element={<PurchasePlan />} />
      </Routes>
    )
  }
