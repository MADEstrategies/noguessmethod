import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Account from './pages/Account'
import Workout from './pages/Workout'
import Admin from './pages/Admin'
import Settings from './pages/Settings'
import Upgrade from './pages/Upgrade'
import Success from './pages/Success'
import Investors from './pages/Investors'
import NotFound from './pages/NotFound'

function GuestRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) return null
  if (session) return <Navigate to="/account" replace />
  return children
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"          element={<GuestRoute><Home /></GuestRoute>} />
        <Route path="/blog"      element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/login"     element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup"    element={<GuestRoute><Signup /></GuestRoute>} />
        <Route path="/upgrade"   element={<Upgrade />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/account"   element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/workout"   element={<ProtectedRoute><Workout /></ProtectedRoute>} />
        <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/success"   element={<ProtectedRoute><Success /></ProtectedRoute>} />
        <Route path="/admin"     element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="*"          element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
