import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import GatePage from './pages/GatePage'
import MainPage from './pages/MainPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const validated = localStorage.getItem('validated') === 'true'
  return validated ? <>{children}</> : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GatePage />} />
        <Route path="/main" element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
