import { Route, Routes } from 'react-router-dom'
import Plans from '@/pages/admin/Plans'
import AdminClients from '@/pages/admin/Clients'
import AdminDashboard from '@/pages/dashboard/adminDashboard'
import { AdminLayout, ForgotPassword, Login, ProtectedRoute, ResetPassword, UnProtectedRoute } from '@/pages'
import Transactions from '@/pages/admin/Transactions'

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
                <Route path='clients' element={<AdminClients />} />
                <Route path='transactions' element={<Transactions />} />
                
            </Route>

            <Route path='/login' element={<UnProtectedRoute role={"admin"}><Login role={"admin"} /></UnProtectedRoute>} />
            <Route path='/forgot-password' element={<ForgotPassword role={"admin"} />} />
            <Route path='/reset-password/:token' element={<ResetPassword role={"admin"} />} />
        </Routes>
    )
}