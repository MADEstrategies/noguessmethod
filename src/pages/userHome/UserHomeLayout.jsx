import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const NAV_ITEMS = [
  { to: '/workouts', label: 'Workouts' },
  { to: '/courses',  label: 'Courses' },
  { to: '/library',  label: 'Library' },
]

export default function UserHomeLayout({ children, title }) {
  const location = useLocation()
  const [search, setSearch] = useState('')

  return (
    <>
      <Header />
      <div className="uhome-wrap">

        {/* Sidebar */}
        <aside className="uhome-sidebar">
          <div className="uhome-search-wrap">
            <svg className="uhome-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="uhome-search"
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <nav className="uhome-nav">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`uhome-nav-link${location.pathname.startsWith(item.to) ? ' active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="uhome-main">
          <div className="uhome-main-header">
            <h2>{title}.</h2>
          </div>
          {children}
        </main>

      </div>
      <Footer />
    </>
  )
}
