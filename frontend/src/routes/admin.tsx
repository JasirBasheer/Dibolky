import { Route, Routes } from 'react-router-dom'
import Plans from '@/pages/admin/Plans'
import AgencyLeads from '@/pages/agency/Leads'
import AdminClients from '@/pages/admin/Clients'
import AdminDashboard from '@/pages/dashboard/adminDashboard'
import { AdminLayout, ForgotPassword, Login, ProtectedRoute, ResetPassword, UnProtectedRoute } from '@/pages'

export default function AdminRoutes() {
    return (
        <Routes>
            <Route path='/' element={
                <ProtectedRoute role={"admin"} >
                    <AdminLayout />
                </ProtectedRoute>
            } >

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