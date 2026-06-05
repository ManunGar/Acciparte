import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import DashboardPage from './pages/DashboardPage'
import IncidentFormPage from './pages/IncidentFormPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'


function App() {

  const { isAuthenticated } = useAuth()


  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {isAuthenticated &&
            <>
              <Route
                path="/dashboard"
                element={
                    <DashboardPage />
                }
              />
              <Route
                path="/incidents/new"
                element={
                    <IncidentFormPage />
                }
              />
            </>
          }
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
