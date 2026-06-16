import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { session, signOut } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const path = location.pathname

  useEffect(() => { setOpen(false) }, [path])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleLogout = async () => {
    await signOut()
    window.location.href = '/'
  }

  function navClass(to) {
    const active = path === to || (to !== '/' && path.startsWith(to))
    return active ? 'primary' : ''
  }

  const links = session ? [
    { to: '/workout', label: "Today's Workout" },
    { to: '/courses', label: 'Courses' },
    { to: '/blog',    label: 'Blog' },
    { to: '/macros',  label: 'Macros' },
    { to: '/account', label: 'Member Hub' },
  ] : [
    { to: '/blog',   label: 'Blog' },
    { to: '/signup', label: 'Sign Up' },
    { to: '/login',  label: 'Login' },
  ]

  return (
    <header className="site-header">
      {/* Logo */}
      <Link to="/" className="brand" aria-label="NoGuessMethod home">
        <img src="/assets/ngm-logo-square.jpeg" alt="NGM" className="logo-square" />
      </Link>

      {/* Desktop nav */}
      <nav className="nav">
        {links.map(({ to, label }) => (
          <Link key={to} to={to} className={navClass(to)}>{label}</Link>
        ))}
        {session && (
          <button type="button" className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        )}
      </nav>

      {/* Hamburger */}
      <button
        type="button"
        className={`hamburger${open ? ' open' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span /><span /><span />
      </button>

      {/* Animated mobile nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-nav open"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              className="mobile-nav-close"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >✕</button>
            <nav className="mobile-nav-links" onClick={() => setOpen(false)}>
              {links.map(({ to, label }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={to} className={navClass(to)}>{label}</Link>
                </motion.div>
              ))}
              {session && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: links.length * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button type="button" className="logout-button" onClick={handleLogout}>
                    Log Out
                  </button>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
