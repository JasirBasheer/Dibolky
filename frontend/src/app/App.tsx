import { Route, Routes } from 'react-router-dom'
import { AdminRoutes, AgencyRoutes, ClientRoutes, PortalRoutes } from '@/routes'

const App = () => {
  return (
    <Routes>
      <Route path='/*' element={<PortalRoutes />} />
      <Route path='/admin/*' element={<AdminRoutes />} />
      <Route path='/agency/*' element={<AgencyRoutes />} />
      <Route path='/client/*' element={<ClientRoutes />} />
    </Routes>
  )
}
export default App