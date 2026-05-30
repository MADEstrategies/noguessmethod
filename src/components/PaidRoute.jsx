import { useLocation, Navigate } from 'react-router-dom'

export default function PaidRoute({ children }) {
  const location = useLocation()
  if (!location.state?.paid) {
    return <Navigate to="/upgrade" replace />
  }
  return children
}
