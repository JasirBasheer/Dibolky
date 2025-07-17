import { Route, Routes } from 'react-router-dom'
import AdminRoutes from './routes/admin'
import PortalRoutes from './routes/portal'
import AgencyRoutes from './routes/agency'
import ClientRoutes from './routes/client'


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