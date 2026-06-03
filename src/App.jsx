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
import Free from './pages/Free'
import Investors from './pages/Investors'
import NotFound from './pages/NotFound'
import Checkout from './pages/Checkout'
import Macros from './pages/Macros'
import Cancel from './pages/Cancel'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        
        <Route path='/courses' element={<Course/>}/>
        <Route path='/store' element={<Store/>}/>
        
        <Route path='/library' element={<Library/>}/>
        <Route path='/workouts' element={<Workouts/>}/>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/signup"    element={<Signup />} />
        <Route path="/free"      element={<Free />} />
        <Route path="/upgrade"   element={<Upgrade />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/account"   element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/workout"   element={<ProtectedRoute><Workout /></ProtectedRoute>} />
        <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/macros"    element={<ProtectedRoute><Macros /></ProtectedRoute>} />
        <Route path="/checkout"  element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/cancel" element={<ProtectedRoute><Cancel /></ProtectedRoute>} />
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
