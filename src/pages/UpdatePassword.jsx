import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import { supabase } from '../lib/supabase'

export default function UpdatePassword() {
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [status,    setStatus]    = useState('')
  const [loading,   setLoading]   = useState(false)
  const [done,      setDone]      = useState(false)
  const [validLink, setValidLink] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase automatically handles the token from the URL hash
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setValidLink(true)
      }
    })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) {
      setStatus('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setStatus('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setStatus('')
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true)
      setTimeout(() => navigate('/account'), 2500)
    } catch (err) {
      setStatus(err.message || 'Could not update password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <Header />
      <main className="auth signup-layout">
        <section className="card auth-panel signup-panel">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <img className="auth-logo" src="/assets/ngm-logo-square.jpeg" alt="NGM" />

            {done ? (
              <>
                <h2>Password Updated.</h2>
                <p style={{ marginTop: 8, color: 'var(--muted)' }}>
                  Your password has been updated. Redirecting you to your account...
                </p>
              </>
            ) : !validLink ? (
              <>
                <h2>Invalid Link.</h2>
                <p style={{ marginTop: 8, color: 'var(--muted)' }}>
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
                <button
                  className="btn primary"
                  style={{ marginTop: 20 }}
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </button>
              </>
            ) : (
              <>
                <h2>Set New Password.</h2>
                <p style={{ marginTop: 8 }}>Choose a new password for your NoGuessMethod account.</p>

                <form className="form" style={{ marginTop: 24 }} onSubmit={handleSubmit}>
                  <label>
                    New Password
                    <input
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      type="password"
                      placeholder="At least 6 characters"
                      required
                    />
                  </label>
                  <label>
                    Confirm Password
                    <input
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      type="password"
                      placeholder="Confirm new password"
                      required
                    />
                  </label>
                  <button className="btn primary" type="submit" disabled={loading} style={{ marginTop: 4 }}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>

                {status && <p className="signup-error" style={{ marginTop: 14 }}>{status}</p>}
              </>
            )}
          </motion.div>
        </section>

        <section className="card signup-side">
          <div className="signup-side-bg">
            <img src="/assets/ngm-logo-banner.jpeg" alt="" aria-hidden="true" />
            <div className="signup-side-bg-overlay" />
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  )
}
