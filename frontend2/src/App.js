import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import SceneListPage from './pages/SceneListPage'
import SceneEditorPage from './pages/SceneEditorPage'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {isAuthenticated &&
          <>
            <Route path="/" element={<SceneListPage />} />
            <Route path="/escenas/nueva" element={<SceneEditorPage />} />
            <Route path="/escenas/:id" element={<SceneEditorPage />} />
          </>
        }
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
