import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const REASONS = [
  { value: 'too_expensive',    label: 'Too expensive' },
  { value: 'not_using',        label: "Not using it enough" },
  { value: 'missing_features', label: 'Missing features I need' },
  { value: 'found_alternative',label: 'Found a better alternative' },
  { value: 'taking_break',     label: 'Taking a break from training' },
  { value: 'other',            label: 'Other' },
]

const STEPS = { SELECT: 'select', CONFIRM: 'confirm', DONE: 'done' }

export default function Cancel() {
  const { session } = useAuth()
  const navigate    = useNavigate()
  const [profile,   setProfile]   = useState(null)
  const [reason,    setReason]    = useState('')
  const [details,   setDetails]   = useState('')
  const [step,      setStep]      = useState(STEPS.SELECT)
  const [cancelAt,  setCancelAt]  = useState(null)
  const [error,     setError]     = useState(null)
  const [loading,   setLoading]   = useState(false)

  useEffect(() => {
    if (!session) return
    supabase
      .from('profiles')
      .select('subscription, stripe_subscription_id, username')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        setProfile(data)
        // Redirect non-premium users away
        if (data && data.subscription !== 'premium') {
          navigate('/account')
        }
      })
  }, [session])

  async function handleCancel() {
    setLoading(true)
    setError(null)
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession.access_token}`,
        },
        body: JSON.stringify({ reason, details }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setCancelAt(new Date(data.cancelAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      }))
      setStep(STEPS.DONE)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return (
      <PageTransition>
        <Header />
        <p style={{ padding: '80px 0', textAlign: 'center', color: 'var(--muted)' }}>Loading...</p>
        <Footer />
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <Header />
      <main className="cancel-wrap">

        {/* ── Step 1: Reason survey ── */}
        {step === STEPS.SELECT && (
          <div className="card cancel-card">
            <div className="eyebrow">Cancel Subscription</div>
            <h2>Before you go.</h2>
            <p className="lead" style={{ marginTop: 12 }}>
              We're sorry to see you leave. Help us improve by telling us why you're cancelling.
            </p>

            <div className="cancel-reasons">
              {REASONS.map(r => (
                <button
                  key={r.value}
                  type="button"
                  className={`cancel-reason-btn ${reason === r.value ? 'active' : ''}`}
                  onClick={() => setReason(r.value)}
                >
                  <span className="cancel-reason-check">{reason === r.value ? '✓' : ''}</span>
                  {r.label}
                </button>
              ))}
            </div>

            {reason === 'other' && (
              <div style={{ marginTop: 14 }}>
                <label>
                  <span className="settings-label">Tell us more</span>
                  <textarea
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    placeholder="What could we have done better?"
                    style={{ marginTop: 6, minHeight: 90 }}
                  />
                </label>
              </div>
            )}

            {reason === 'too_expensive' && (
              <div className="cancel-nudge">
                <strong>Before you cancel —</strong> reply to any NGM email and we'll see what we can do.
              </div>
            )}

            <div className="cancel-actions">
              <button
                type="button"
                className="btn"
                style={{ color: 'rgba(255,255,255,.45)', borderColor: 'rgba(255,255,255,.1)' }}
                onClick={() => setStep(STEPS.CONFIRM)}
                disabled={!reason}
              >
                Continue to cancel
              </button>
              <Link to="/account" className="btn primary">Keep my subscription</Link>
            </div>
          </div>
        )}

        {/* ── Step 2: Confirm ── */}
        {step === STEPS.CONFIRM && (
          <div className="card cancel-card">
            <div className="eyebrow">Confirm Cancellation</div>
            <h2>Are you sure?</h2>
            <p className="lead" style={{ marginTop: 12 }}>
              Your premium access will remain active until the end of your current billing period.
              You won't be charged again.
            </p>

            <div className="cancel-confirm-details">
              <div className="cancel-confirm-row">
                <span>Access ends</span>
                <strong>End of current billing period</strong>
              </div>
              <div className="cancel-confirm-row">
                <span>After cancellation</span>
                <strong>Reverts to free plan</strong>
              </div>
              <div className="cancel-confirm-row">
                <span>Resubscribe anytime</span>
                <strong>Yes — no penalties</strong>
              </div>
            </div>

            {error && <p className="log-error" style={{ marginTop: 16 }}>{error}</p>}

            <div className="cancel-actions">
              <button
                type="button"
                className="btn"
                style={{ color: 'rgba(255,255,255,.45)', borderColor: 'rgba(255,255,255,.15)' }}
                onClick={handleCancel}
                disabled={loading}
              >
                {loading ? 'Cancelling...' : 'Yes, cancel my subscription'}
              </button>
              <Link to="/account" className="btn primary">Keep my subscription</Link>
            </div>
          </div>
        )}

        {/* ── Step 3: Done ── */}
        {step === STEPS.DONE && (
          <div className="card cancel-card" style={{ textAlign: 'center' }}>
            <div className="eyebrow">Subscription Cancelled</div>
            <h2>Done.</h2>
            <p className="lead" style={{ marginTop: 12, margin: '12px auto 0' }}>
              Your premium access continues until <strong>{cancelAt}</strong>.
              After that your account reverts to the free plan.
            </p>
            <p style={{ marginTop: 14, fontSize: 14, color: 'var(--muted)' }}>
              Changed your mind? You can resubscribe any time from the Member Hub.
            </p>
            <div className="actions" style={{ justifyContent: 'center', marginTop: 28 }}>
              <Link to="/account" className="btn primary">Back to Member Hub</Link>
              <Link to="/workout" className="btn">Today's Workout</Link>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </PageTransition>
  )
}
