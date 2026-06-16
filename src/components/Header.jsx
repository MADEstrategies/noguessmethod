import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { session, signOut } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
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

  const navLinks = (
    <>
      {!session && <Link to="/blog"   className={navClass('/blog')}>Blog</Link>}
      {!session && <Link to="/signup" className={navClass('/signup')}>Sign Up</Link>}
      {!session && <Link to="/login"  className={navClass('/login')}>Login</Link>}
      {session && <Link to="/workout" className={navClass('/workout')}>Today's Workout</Link>}
      {session && <Link to="/courses" className={navClass('/courses')}>Courses</Link>}
      {session && <Link to="/blog"    className={navClass('/blog')}>Blog</Link>}
      {session && <Link to="/macros"  className={navClass('/macros')}>Macros</Link>}
      {session && <Link to="/account" className={navClass('/account')}>Member Hub</Link>}
      {session && (
        <button type="button" className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      )}
    </>
  )

  return (
    <header className="site-header">
      <Link to="/" className="brand" aria-label="NoGuessMethod home">
        <img src="/assets/ngm-logo-square.jpeg" alt="NGM" className="logo-square" />
      </Link>

      <nav className="nav">
        {navLinks}
      </nav>

      <button
        type="button"
        className={`hamburger${open ? ' open' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span /><span /><span />
      </button>

      <div className={`mobile-nav${open ? ' open' : ''}`} aria-hidden={!open}>
        <button
          type="button"
          className="mobile-nav-close"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >✕</button>
        <nav className="mobile-nav-links" onClick={() => setOpen(false)}>
          {navLinks}
        </nav>
      </div>
    </header>
  )
}
