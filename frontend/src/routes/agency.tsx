import { Route, Routes } from 'react-router-dom'
import Clients from '@/pages/agency.pages/Clients'
import Layout from '@/pages/agency.pages/Layout'
import Login from '@/pages/authentication.pages/login'
import Inbox from '@/components/common.components/inbox'
import AgencyCalendar from '@/pages/agency.pages/Calendar'
import AgencyLeads from '@/pages/agency.pages/Leads'
import AgencyContent from '@/pages/agency.pages/Content'
import AgencyMessages from '@/pages/agency.pages/message'
import AgencyProject from '@/pages/agency.pages/projects'
import AgencyAnalytics from '@/pages/agency.pages/Analytics'
import SettingsPage from '@/components/agency.components/settings'
import ProtectedRoute from '@/pages/authentication.pages/protected.route'
import UnProtectedRoute from '@/pages/authentication.pages/unProtected.route'
import CreateClient from '@/components/agency.components/agencyside.components/createClient'
import AgencyDashboard from '@/components/agency.components/agencyside.components/agencyDashoard'
import {
  ForgotPassword,
  ResetPassword
} from '@/pages/authentication.pages/forgotPassword'


export default function AgencyRoutes() {
  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoute role={"agency"} >
          <Layout />
        </ProtectedRoute>
      } >
        <Route index element={<AgencyDashboard />} />
        <Route path='analytics' element={<AgencyAnalytics />} />
        <Route path='clients' element={<Clients />} />
        {/* need to check it */}
        <Route path='create-client' element={<CreateClient />} />
        <Route path='contents' element={<AgencyContent />} />
        <Route path='leads' element={<AgencyLeads />} />
        <Route path='messages' element={<AgencyMessages />} />
        <Route path='projects' element={<AgencyProject />} />
        <Route path='settings' element={<SettingsPage />} />
        {/* need to check it */}
        <Route path='inbox' element={<Inbox />} />
        <Route path='calendar' element={<AgencyCalendar />} />
      </Route>


      <Route path='/login' element={<UnProtectedRoute role={"agency"}><Login role={"agency"} /></UnProtectedRoute>} />
      <Route path='/forgot-password' element={<ForgotPassword role={"agency"} />} />
      <Route path='/reset-password/:token' element={<ResetPassword role={"agency"} />} />

    </Routes>
  )
}