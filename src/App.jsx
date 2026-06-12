import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PaidRoute from './components/PaidRoute'
import Home from './pages/Home'
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
import Checkout from './pages/Checkout'
import Macros from './pages/Macros'
import Cancel from './pages/Cancel'
import Course from './pages/userHome/Courses'
import CoursePage from './pages/userHome/CoursePage'
import Workouts from './pages/userHome/Workouts'
import Store from './pages/userHome/Store'
import Library from './pages/userHome/Library'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/signup"    element={<Signup />} />
        <Route path="/upgrade"   element={<Upgrade />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/courses"     element={<ProtectedRoute><Course /></ProtectedRoute>} />
        <Route path="/courses/:id" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
        <Route path="/store"     element={<ProtectedRoute><Store /></ProtectedRoute>} />
        <Route path="/library"   element={<ProtectedRoute><Library /></ProtectedRoute>} />
        <Route path="/workouts"  element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
        <Route path="/account"   element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/workout"   element={<ProtectedRoute><Workout /></ProtectedRoute>} />
        <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/macros"    element={<ProtectedRoute><Macros /></ProtectedRoute>} />
        <Route path="/checkout"  element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/cancel"    element={<ProtectedRoute><Cancel /></ProtectedRoute>} />
        <Route path="/success"   element={<ProtectedRoute><PaidRoute><Success /></PaidRoute></ProtectedRoute>} />
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
