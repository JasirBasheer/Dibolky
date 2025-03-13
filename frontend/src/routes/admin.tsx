import { Route, Routes } from 'react-router-dom'
import Plans from '@/pages/admin.pages/Plans'
import AdminLayout from '@/pages/admin.pages/Layout '
import AgencyLeads from '@/pages/agency.pages/Leads'
import Login from '@/pages/authentication.pages/login'
import AdminClients from '@/pages/admin.pages/Clients'
import AdminDashboard from '@/pages/admin.pages/DashBoard'
import ProtectedRoute from '@/pages/authentication.pages/protected.route'
import UnProtectedRoute from '@/pages/authentication.pages/unProtected.route'
import {
    ForgotPassword,
    ResetPassword
} from '@/pages/authentication.pages/forgotPassword'

export default function AdminRoutes() {
    return (
        <Routes>
            <Route path='/' element={<ProtectedRoute role={"admin"} ><AdminLayout /></ProtectedRoute>} >
                <Route index element={<AdminDashboard />} />
                <Route path='plans' element={<Plans />} />
                {/* <Route path='analytics' element={<AgencyAnalytics />} /> */}
                <Route path='clients' element={<AdminClients />} />
                <Route path='leads' element={<AgencyLeads />} />
            </Route>

            <Route path='/login' element={<UnProtectedRoute role={"admin"}><Login role={"admin"} /></UnProtectedRoute>} />
            <Route path='/forgot-password' element={<ForgotPassword role={"admin"} />} />
            <Route path='/reset-password/:token' element={<ResetPassword role={"admin"} />} />
        </Routes>
    )
}