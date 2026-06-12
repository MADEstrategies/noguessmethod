import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [status,   setStatus]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate('/account')
    } catch (err) {
      setStatus(err.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <Header />
      <main className="auth signup-layout">

        {/* ── Form panel ── */}
        <section className="card auth-panel signup-panel">
          <img className="auth-logo" src="/assets/ngm-logo-square.jpeg" alt="NGM" />
          <h2>Welcome Back.</h2>
          <p style={{ marginTop: 8 }}>Sign in to your NoGuessMethod account and continue from your member hub.</p>

          <form className="form" style={{ marginTop: 24 }} onSubmit={handleSubmit}>
            <label>
              Email
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
            </label>
            <label>
              Password
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required />
            </label>
            <button className="btn primary" type="submit" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          {status && <p className="signup-error" style={{ marginTop: 14 }}>{status}</p>}

          <p className="signup-trust" style={{ marginTop: 20 }}>
            <span>Don't have an account?</span>
            <span className="signup-trust-dot">·</span>
            <Link to="/signup">Sign up free</Link>
          </p>
        </section>

        {/* ── Right panel ── */}
        <section className="card signup-side">
          <div className="signup-side-bg">
            <img src="/assets/ngm-logo-banner.jpeg" alt="" aria-hidden="true" />
            <div className="signup-side-bg-overlay" />
          </div>
          <div className="signup-side-inner">
            <div>
              <h2 className="signup-side-headline">Stop guessing.{'\n'}Start progressing.</h2>
              <p className="signup-side-sub">
                Your structured daily program is waiting. Every exercise has a reason. Every set has a purpose.
              </p>
            </div>
            <div className="signup-perks">
              <div className="signup-perk">
                <div className="signup-perk-dot" />
                <div className="signup-perk-content">
                  <strong>Daily structured workout</strong>
                  <span>Push, Pull, Legs, Core, Recovery. A new session every day.</span>
                </div>
              </div>
              <div className="signup-perk">
                <div className="signup-perk-dot" />
                <div className="signup-perk-content">
                  <strong>Exact progression rules</strong>
                  <span>Know precisely when to add weight and when to hold.</span>
                </div>
              </div>
              <div className="signup-perk">
                <div className="signup-perk-dot" />
                <div className="signup-perk-content">
                  <strong>Daily nutrition brief</strong>
                  <span>Fuel your session the right way, every single day.</span>
                </div>
              </div>
            </div>
            <div className="signup-quote">
              <p className="signup-quote-text">"I cant believe how much I've gained out of this."</p>
              <span className="signup-quote-author">Shirley T., 3 months in</span>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </PageTransition>
  )
}
