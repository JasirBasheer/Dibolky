import { Route, Routes } from 'react-router-dom'
import Clients from '@/pages/agency/Clients'
import Login from '@/pages/authentication.pages/login'
import Inbox from '@/components/common/inbox'
import AgencyCalendar from '@/pages/agency/Calendar'
import AgencyLeads from '@/pages/agency/Leads'
import AgencyContent from '@/pages/agency/Content'
import AgencyMessages from '@/pages/agency/message'
import AgencyProject from '@/pages/agency/projects'
import AgencyAnalytics from '@/pages/agency/Analytics'
import SettingsPage from '@/components/agency/settings'
import ProtectedRoute from '@/pages/authentication.pages/protected.route'
import UnProtectedRoute from '@/pages/authentication.pages/unProtected.route'
import CreateClient from '@/components/agency/agencyside.components/createClient'
import {
  ForgotPassword,
  ResetPassword
} from '@/pages/authentication.pages/forgotPassword'
import Layout from '@/pages/agency/Layout'
import Integrations from '@/pages/common/Integrations'
import Invoices from '@/pages/common/Invoices'
import Dashboard from '@/pages/agency/Dashoard'
import Payments from '@/pages/common/Payments'
import CreateInvoice from '@/pages/agency/CreateInvoice'
import Overdues from '@/pages/common/Overdues'


export default function AgencyRoutes() {
  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoute role={"agency"} >
          <Layout />
        </ProtectedRoute>
      } >
        <Route index element={<Dashboard />} />
        <Route path='analytics' element={<AgencyAnalytics />} />
        <Route path='clients' element={<Clients />} />
        <Route path='integrations' element={<Integrations />} />
        <Route path='invoices' element={<Invoices />} />
        <Route path='invoices/payments' element={<Payments />} />
        <Route path='invoices/create' element={<CreateInvoice />} />
        <Route path='invoices/overdue' element={<Overdues />} />

        
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