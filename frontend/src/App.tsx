import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/portalPages/home'
import PurchasePlan from './pages/portalPages/purchasePlan'
import Login from './pages/authenticationPages/Login'
import { ForgotPassword, ResetPassword } from './pages/authenticationPages/forgotPassword'
import UnProtectedRoute from './pages/authenticationPages/unProtectedRoute'
import ProtectedRoute from './pages/authenticationPages/protectedRoute'
import MainloginPage from './pages/authenticationPages/MainloginPage'
import Layout from './pages/agencyPages/Layout'
import AgencyDashboard from './pages/agencyPages/Dashboard'
import AgencyAnalytics from './pages/agencyPages/Analytics'
import CreateClient from './components/agencyComponents/createClient'
import AgencyLeads from './pages/agencyPages/Leads'
import AdminDashboard from './pages/adminPages/DashBoard'
import Plans from './pages/adminPages/Plans'
import AdminClients from './pages/adminPages/Clients'
import Clients from './pages/agencyPages/Clients'
import ClientLayout from './pages/clientsPages/ClientLayout'
import AdminLayout from './pages/adminPages/Layout '
import AgencyClientContent from './components/agencyComponents/clientContent'
import AgencyContent from './pages/agencyPages/Content'


const App = () => {
  return (
    <Routes>
      <Route path='/*' element={<PortalRoutes />} />
      <Route path='/admin/*' element={<AdminRoutes />} />
      <Route path='/agency/*' element={<AgencyRoutes />} />
      <Route path='/company/*' element={<CompanyRoutes />} />
      <Route path='/client/*' element={<ClientRoutes />} />
    </Routes>
  )
}

export default App

function PortalRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<MainloginPage />} />
      <Route path='/purchase/:platform/:id' element={<PurchasePlan />} />
    </Routes>
  )
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute role={"Admin"} ><AdminLayout /></ProtectedRoute>} >
        <Route index element={<AdminDashboard />} />
        <Route path='plans' element={<Plans />} />
        <Route path='analytics' element={<AgencyAnalytics />} />
        <Route path='clients' element={<AdminClients />} />
        <Route path='leads' element={<AgencyLeads />} />
      </Route>

      <Route path='/login' element={<UnProtectedRoute role={"Admin"}><Login role={"Admin"} /></UnProtectedRoute>} />
      <Route path='/forgot-password' element={<ForgotPassword role={"Admin"} />} />
      <Route path='/reset-password/:token' element={<ResetPassword role={"Admin"} />} />
    </Routes>
  )
}


function AgencyRoutes() {
  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute role={"Agency"} ><Layout /></ProtectedRoute>} >
        <Route index element={<AgencyDashboard />} />
        <Route path='analytics' element={<AgencyAnalytics />} />
        <Route path='clients' element={<Clients />} />
        <Route path='create-client' element={<CreateClient />} />
        <Route path='contents' element={<AgencyContent />} />
        <Route path='leads' element={<AgencyLeads />} />
      </Route>

      <Route path='/login' element={<UnProtectedRoute role={"Agency"}><Login role={"Agency"} /></UnProtectedRoute>} />
      <Route path='/forgot-password' element={<ForgotPassword role={"Agency"} />} />
      <Route path='/reset-password/:token' element={<ResetPassword role={"Agency"} />} />
    </Routes>
  )
}

function CompanyRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<UnProtectedRoute role={"Company"} ><Login role={"Company"} /></UnProtectedRoute>} />
      <Route path='/forgot-password' element={<ForgotPassword role={"Company"} />} />
      <Route path='/reset-password/:token' element={<ResetPassword role={"Company"} />} />
    </Routes>
  )
}


function ClientRoutes() {
  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute role={"Client"} ><ClientLayout /></ProtectedRoute>} >
        {/* <Route index element={<AgencyDashboard />} /> */}
      </Route>

      <Route path='/login' element={<UnProtectedRoute role={"Client"} ><Login role={"Client"} /></UnProtectedRoute>} />
      <Route path='/forgot-password' element={<ForgotPassword role={"Client"} />} />
      <Route path='/reset-password/:token' element={<ResetPassword role={"Client"} />} />
    </Routes>
  )
}


