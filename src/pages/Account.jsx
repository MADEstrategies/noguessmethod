import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Account() {
  const { session, signOut } = useAuth()
  const [profile, setProfile] = useState(null)
  const [portalStatus, setPortalStatus] = useState('')

  useEffect(() => {
    if (!session) return
    supabase.from('profiles').select('role,subscription,stripe_customer_id').eq('id', session.user.id).single()
      .then(({ data }) => setProfile(data))
  }, [session])

  const isPremium = profile?.subscription === 'premium' || profile?.subscription === 'canceling' || profile?.role === 'admin'

  const openPortal = async () => {
    setPortalStatus('')
    const btn = document.getElementById('portal-btn')
    if (btn) { btn.textContent = 'Loading...'; btn.disabled = true }
    try {
      const res = await fetch('/api/create-portal', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url }
      else throw new Error(data.error || 'Could not open billing portal.')
    } catch (err) {
      setPortalStatus(err.message)
      if (btn) { btn.textContent = 'Manage Subscription'; btn.disabled = false }
    }
  }

  return (
    <PageTransition>
      <Header />
      <main className="member-hero">
        <section className="card member-card">
          <img className="auth-logo" src="/assets/ngm-logo-square.jpeg" alt="NGM" />
          <h2>Welcome In.</h2>
          <p>{session ? 'You are signed in.' : 'Checking your session...'}</p>

          <div className="membership-box">
            <div className="membership-top">
              <strong>{isPremium ? 'Premium Member' : 'Free Member'}</strong>
              <span>NoGuessMethod access layer</span>
            </div>
            <div className="membership-perks">
              <div className="perk"><b>Email</b><span>{session?.user?.email || '—'}</span></div>
              <div className="perk"><b>Member Since</b><span>{session ? new Date(session.user.created_at).toLocaleDateString() : '—'}</span></div>
              <div className="perk"><b>Today's Workout</b><span>Unlocked</span></div>
              <div className="perk"><b>Courses</b><span>{isPremium ? 'Full Access' : 'Free Courses Only'}</span></div>
              <div className="perk"><b>Premium Systems</b><span>{isPremium ? 'Active' : 'Locked'}</span></div>
              {isPremium && profile?.stripe_customer_id && (
                <div className="perk">
                  <b>Billing</b>
                  <button id="portal-btn" type="button" className="btn" style={{ minHeight: 32, padding: '6px 14px', fontSize: 13 }} onClick={openPortal}>
                    Manage Subscription
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="actions">
            <Link className="btn primary" to="/workout">Today's Workout</Link>
            <Link className="btn" to="/courses">Courses</Link>
            {!isPremium && <Link className="btn" to="/upgrade">Upgrade — $19.99/mo</Link>}
            {isPremium && <Link className="btn" to="/cancel">Subscription</Link>}
            <Link className="btn" to="/settings">Settings</Link>
            <button type="button" className="logout-button" onClick={async () => { await signOut(); window.location.href = '/' }}>Log Out</button>
          </div>
          {portalStatus && <p style={{ marginTop: 10, fontSize: 13, color: 'var(--muted)' }}>{portalStatus}</p>}
        </section>

        <section className="card hero-copy">
          <h2>Structure over Guesswork.</h2>
          <p className="lead">Your account is the home base for your daily program, courses, and premium tools built for intermediate lifters.</p>
         <div className="feature-row">
  <Link to="/workout" className="mini">
    <strong>Daily Workout</strong>
    <span>Your program updates every day. No guessing what to do.</span>
  </Link>
  <Link to="/courses" className="mini">
    <strong>Courses</strong>
    <span>Educational content to sharpen your training knowledge.</span>
  </Link>
  <Link to={isPremium ? '/account' : '/upgrade'} className="mini">
    <strong>Premium</strong>
    <span>Progression rules, form cues, and daily nutrition briefs.</span>
  </Link>
</div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
