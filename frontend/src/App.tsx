import { Route, Routes } from 'react-router-dom'
import Home from './pages/portal.pages/home'
import PurchasePlan from './pages/portal.pages/purchasePlan'
import Login from './pages/authentication.pages/login'
import { ForgotPassword, ResetPassword } from './pages/authentication.pages/forgotPassword'
import UnProtectedRoute from './pages/authentication.pages/unProtected.route'
import ProtectedRoute from './pages/authentication.pages/protected.route'
import MainloginPage from './pages/authentication.pages/mainLogin.page'
import Layout from './pages/agency.pages/Layout'
import AgencyDashboard from './pages/agency.pages/Dashboard'
import AgencyAnalytics from './pages/agency.pages/Analytics'
import CreateClient from './components/agency.components/agencyside.components/createClient'
import AgencyLeads from './pages/agency.pages/Leads'
import AdminDashboard from './pages/admin.pages/DashBoard'
import Plans from './pages/admin.pages/Plans'
import AdminClients from './pages/admin.pages/Clients'
import Clients from './pages/agency.pages/Clients'
import ClientLayout from './pages/client.pages/client.layout'
import AdminLayout from './pages/admin.pages/Layout '
import AgencyContent from './pages/agency.pages/Content'
import ClientDashboard from './pages/client.pages/client.dashboard'
import ClientContent from './pages/client.pages/client.content'
import ClientProjects from './pages/client.pages/client.projects'
import AgencyMessages from './pages/agency.pages/message'
import ClientMessages from './pages/client.pages/client.message'
import AgencyProject from './pages/agency.pages/projects'
import SettingsPage from './components/agency.components/settings'


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
      <Route path='/' element={<ProtectedRoute role={"agency"} ><Layout /></ProtectedRoute>} >
        <Route index element={<AgencyDashboard />} />
        <Route path='analytics' element={<AgencyAnalytics />} />
        <Route path='clients' element={<Clients />} />
        <Route path='create-client' element={<CreateClient />} />
        <Route path='contents' element={<AgencyContent />} />
        <Route path='leads' element={<AgencyLeads />} />
        <Route path='messages' element={<AgencyMessages />} />
        <Route path='projects' element={<AgencyProject />} />
        <Route path='settings' element={<SettingsPage />} />
      </Route>

      <Route path='/login' element={<UnProtectedRoute role={"agency"}><Login role={"agency"} /></UnProtectedRoute>} />
      <Route path='/forgot-password' element={<ForgotPassword role={"agency"} />} />
      <Route path='/reset-password/:token' element={<ResetPassword role={"agency"} />} />
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
        <Route index element={<ClientDashboard />} />
        <Route path='contents' element={<ClientContent />} />
        <Route path='projects' element={<ClientProjects />} />
        <Route path='message' element={<ClientMessages />} />
      </Route>

      <Route path='/login' element={<UnProtectedRoute role={"Client"} ><Login role={"Client"} /></UnProtectedRoute>} />
      <Route path='/forgot-password' element={<ForgotPassword role={"Client"} />} />
      <Route path='/reset-password/:token' element={<ResetPassword role={"Client"} />} />
    </Routes>
  )
}


