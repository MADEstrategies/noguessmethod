import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [status,   setStatus]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [view,     setView]     = useState('login') // 'login' | 'reset'
  const [resetSent, setResetSent] = useState(false)
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

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://noguessmethod.com/update-password',
      })
      if (error) throw error
      setResetSent(true)
    } catch (err) {
      setStatus(err.message || 'Could not send reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <Header />
      <main className="auth signup-layout">

        {/* Form panel */}
        <section className="card auth-panel signup-panel">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <img className="auth-logo" src="/assets/ngm-logo-square.jpeg" alt="NGM" />

            {view === 'login' ? (
              <>
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
                  <button
                    type="button"
                    onClick={() => { setView('reset'); setStatus(''); setResetSent(false) }}
                    style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                  >
                    Forgot password?
                  </button>
                  <span className="signup-trust-dot">·</span>
                  <Link to="/signup">Sign up free</Link>
                </p>
              </>
            ) : (
              <>
                <h2>Reset Password.</h2>
                <p style={{ marginTop: 8 }}>Enter your email and we'll send you a link to reset your password.</p>

                {resetSent ? (
                  <div style={{ marginTop: 24 }}>
                    <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6 }}>
                      Check your inbox — a reset link has been sent to <strong style={{ color: '#fff' }}>{email}</strong>.
                    </p>
                    <button
                      type="button"
                      className="btn"
                      style={{ marginTop: 20 }}
                      onClick={() => { setView('login'); setResetSent(false); setStatus('') }}
                    >
                      Back to Login
                    </button>
                  </div>
                ) : (
                  <>
                    <form className="form" style={{ marginTop: 24 }} onSubmit={handleReset}>
                      <label>
                        Email
                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
                      </label>
                      <button className="btn primary" type="submit" disabled={loading} style={{ marginTop: 4 }}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                      </button>
                    </form>

                    {status && <p className="signup-error" style={{ marginTop: 14 }}>{status}</p>}

                    <p className="signup-trust" style={{ marginTop: 20 }}>
                      <button
                        type="button"
                        onClick={() => { setView('login'); setStatus('') }}
                        style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                      >
                        Back to Login
                      </button>
                    </p>
                  </>
                )}
              </>
            )}
          </motion.div>
        </section>

        {/* Right panel */}
        <section className="card signup-side">
          <div className="signup-side-bg">
            <img src="/assets/ngm-logo-banner.jpeg" alt="" aria-hidden="true" />
            <div className="signup-side-bg-overlay" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: '100%' }}
          >
            <div className="signup-side-inner">
              <div>
                <h2 className="signup-side-headline" style={{ whiteSpace: 'pre-line' }}>{'Stop guessing.\nStart progressing.'}</h2>
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
                <p className="signup-quote-text">"I can't believe how much I've gained out of this."</p>
                <span className="signup-quote-author">Shirley T., 3 months in</span>
              </div>
            </div>
          </motion.div>
        </section>

      </main>
      <Footer />
    </PageTransition>
  )
}
