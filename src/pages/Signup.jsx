import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import { supabase } from '../lib/supabase'

const STEPS = ['Account', 'About You', 'Goals', 'Preferences']
const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say']
const LEVELS  = ['Beginner', 'Intermediate', 'Advanced']

const GOALS = [
  { id: 'muscle',    label: 'Build Muscle',    sub: 'Hypertrophy & size' },
  { id: 'fat-loss',  label: 'Lose Fat',        sub: 'Cut & lean out' },
  { id: 'strength',  label: 'Get Stronger',    sub: 'Max strength focus' },
  { id: 'endurance', label: 'Boost Endurance', sub: 'Cardio & stamina' },
  { id: 'general',   label: 'General Fitness', sub: 'Overall wellness' },
]

const SIDE = [
  {
    eyebrow: 'Why NGM',
    headline: 'Stop guessing.\nStart progressing.',
    sub: 'Everything in your program has a reason. Nothing random, nothing filler. Just work that actually moves the needle.',
    perks: [
      { title: 'Science-backed programming', body: 'Rep ranges, rest periods, and splits built on what actually works, not what looks good online.' },
      { title: 'Built around your goal',     body: 'Muscle, strength, fat loss. Your plan is shaped by what you are actually chasing.' },
      { title: 'Progress you can see',       body: 'Log every session and watch your numbers go up week after week.' },
    ],
    quote: {
      text: 'I went from randomly lifting to actually having a plan. My numbers have gone up every single week.',
      author: 'Alex M., 3 months in',
    },
  },
  {
    eyebrow: 'Personalization',
    headline: 'Built for\nyour body.',
    sub: 'Your age, experience level, and background all go into how your program is built. Not some generic template.',
    perks: [
      { title: 'Beginner to advanced', body: 'Volume and intensity match where you are right now, not where someone else is.' },
      { title: 'Grows with you',       body: 'As you get stronger the program adjusts. You will not plateau.' },
      { title: 'Nothing wasted',       body: 'Exercises and loads that do not serve your profile get removed automatically.' },
    ],
  },
  {
    eyebrow: 'Goal specific',
    headline: 'One goal.\nEvery decision made for it.',
    sub: 'Pick what you are chasing and your entire program is structured around that from day one.',
    perks: [
      { title: 'Build Muscle',  body: 'Hypertrophy focused splits with progressive overload and the right training volume.' },
      { title: 'Lose Fat',      body: 'Training that keeps your muscle while you cut. Not just cardio and suffering.' },
      { title: 'Get Stronger',  body: 'Periodized lifting designed to move heavier numbers every single block.' },
    ],
  },
  {
    eyebrow: 'Consistency',
    headline: 'Show up.\nEvery day.',
    stat: { num: '3×', label: 'more workouts completed by members who turn reminders on' },
    perks: [
      { title: 'Email or SMS',             body: 'Pick how you want to be reached. Use one or both.' },
      { title: 'Your timezone, your time', body: 'Reminders go out exactly when you want to train.' },
      { title: 'No pressure at all',       body: 'Turn them off or change the time anytime from Settings.' },
    ],
  },
]

const slideVariants = {
  enter:  (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
  exit:   (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0, transition: { duration: 0.2 } }),
}

const sideVariants = {
  enter:  { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit:   { opacity: 0, y: -12, transition: { duration: 0.18 } },
}

function Progress({ step }) {
  return (
    <div className="signup-progress">
      {STEPS.flatMap((s, i) => {
        const done   = i < step
        const active = i === step
        const items  = [
          <div key={`s${i}`} className={`signup-step${active ? ' active' : ''}${done ? ' done' : ''}`}>
            <div className="signup-dot">{done ? '✓' : i + 1}</div>
            <span className="signup-step-label">{s}</span>
          </div>,
        ]
        if (i < STEPS.length - 1) {
          items.push(<div key={`l${i}`} className={`signup-connector${done ? ' done' : ''}`} />)
        }
        return items
      })}
    </div>
  )
}

function ChipGroup({ label, options, value, onChange }) {
  return (
    <div>
      <div className="chip-label">{label}</div>
      <div className="chip-group">
        {options.map(o => (
          <button
            key={o}
            type="button"
            className={`chip${value === o ? ' active' : ''}`}
            onClick={() => onChange(value === o ? '' : o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

function ToggleRow({ label, sub, on, onToggle }) {
  return (
    <div className="pref-row">
      <div>
        <strong style={{ fontSize: 15 }}>{label}</strong>
        <p style={{ margin: '3px 0 0', fontSize: 13, color: 'var(--muted)' }}>{sub}</p>
      </div>
      <button type="button" className={`toggle-btn${on ? ' on' : ''}`} onClick={onToggle} aria-pressed={on}>
        <span className="toggle-knob" />
      </button>
    </div>
  )
}

function SidePanel({ step }) {
  const s = SIDE[step]
  return (
    <div className="signup-side-inner">
      <div>
        <div className="eyebrow" style={{ marginBottom: 16 }}>{s.eyebrow}</div>
        <h2 className="signup-side-headline" style={{ whiteSpace: 'pre-line' }}>{s.headline}</h2>
        {s.sub && <p className="signup-side-sub">{s.sub}</p>}
      </div>
      {s.stat && (
        <div className="signup-stat-block">
          <div className="signup-stat-num">{s.stat.num}</div>
          <div className="signup-stat-label">{s.stat.label}</div>
        </div>
      )}
      <div className="signup-perks">
        {s.perks.map((p, i) => (
          <div key={i} className="signup-perk">
            <div className="signup-perk-dot" />
            <div className="signup-perk-content">
              <strong>{p.title}</strong>
              <span>{p.body}</span>
            </div>
          </div>
        ))}
      </div>
      {s.quote && (
        <div className="signup-quote">
          <p className="signup-quote-text">"{s.quote.text}"</p>
          <span className="signup-quote-author">{s.quote.author}</span>
        </div>
      )}
    </div>
  )
}

export default function Signup() {
  const [step,      setStep]      = useState(0)
  const [direction, setDirection] = useState(1)

  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')

  const [gender, setGender] = useState('')
  const [age,    setAge]    = useState('')
  const [level,  setLevel]  = useState('')

  const [goal, setGoal] = useState('')

  const [emailReminder, setEmailReminder] = useState(false)
  const [smsReminder,   setSmsReminder]   = useState(false)
  const [phone,         setPhone]         = useState('')

  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  function advance() {
    setError('')
    if (step === 0) {
      if (!username.trim() || !email.trim() || !password || !confirm) {
        setError('Please fill in all fields.'); return
      }
      if (password !== confirm) {
        setError('Passwords do not match.'); return
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.'); return
      }
    }
    setDirection(1)
    setStep(s => s + 1)
  }

  function back() {
    setError('')
    setDirection(-1)
    setStep(s => s - 1)
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email, password,
        options: {
          data: { username },
          emailRedirectTo: `${window.location.origin}/account`,
        },
      })
      if (signUpError) throw signUpError

      if (data.user) {
        await supabase.from('profiles').insert({
          id:                     data.user.id,
          username,
          role:                   'member',
          gender:                 gender  || null,
          age:                    age ? parseInt(age, 10) : null,
          fitness_level:          level   || null,
          primary_goal:           goal    || null,
          reminder_email_enabled: emailReminder,
          reminder_sms_enabled:   smsReminder,
          phone_number:           phone.trim() || null,
        })
      }
      setDone(true)
    } catch (err) {
      setError(err.message || 'Signup failed.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <PageTransition>
        <Header />
        <main className="auth signup-layout">
          <section className="card auth-panel signup-panel">
            <div className="eyebrow">You're in</div>
            <img className="auth-logo" src="/assets/ngm-logo-square.jpeg" alt="NGM" />
            <h2>Account Created.</h2>
            <p style={{ marginTop: 10 }}>Check your email to confirm your account, then log in and start training.</p>
            <div style={{ marginTop: 28 }}>
              <Link to="/login" className="btn primary" style={{ display: 'flex', justifyContent: 'center' }}>
                Go to Login →
              </Link>
            </div>
          </section>
          <section className="card signup-side">
            <div className="signup-side-bg">
              <img src="/assets/ngm-logo-banner.jpeg" alt="" aria-hidden="true" />
              <div className="signup-side-bg-overlay" />
            </div>
            <SidePanel step={0} />
          </section>
        </main>
        <Footer />
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <Header />
      <main className="auth signup-layout">

        {/* ── Form panel ── */}
        <section className="card auth-panel signup-panel">
          <Progress step={step} />

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="signup-body"
            >
              {step === 0 && (
                <>
                  <div className="eyebrow">Create Account</div>
                  <h2>Let's get started.</h2>
                  <p style={{ marginTop: 8 }}>Create your NoGuessMethod account — free forever.</p>
                  <div className="form" style={{ marginTop: 20 }}>
                    <label>
                      Username
                      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" autoFocus required />
                    </label>
                    <label>
                      Email
                      <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
                    </label>
                    <div className="form-row-2">
                      <label>
                        Password
                        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Min 8 characters" required />
                      </label>
                      <label>
                        Confirm Password
                        <input value={confirm} onChange={e => setConfirm(e.target.value)} type="password" placeholder="Repeat password" required />
                      </label>
                    </div>
                  </div>
                  {error && <p className="signup-error">{error}</p>}
                  <div className="signup-actions" style={{ marginTop: 22 }}>
                    <button className="btn primary signup-cta" type="button" onClick={advance}>
                      Get Started, It's Free →
                    </button>
                  </div>
                  <p className="signup-trust">
                    <span>🔒 No credit card required</span>
                    <span className="signup-trust-dot">·</span>
                    <span>Already have an account? <Link to="/login">Login</Link></span>
                  </p>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="eyebrow">Step 2 of 4</div>
                  <h2>About You.</h2>
                  <p style={{ marginTop: 8 }}>Help us personalize your program.</p>
                  <div className="form" style={{ marginTop: 22 }}>
                    <ChipGroup label="Gender" options={GENDERS} value={gender} onChange={setGender} />
                    <label style={{ maxWidth: 160 }}>
                      Age
                      <input value={age} onChange={e => setAge(e.target.value)} type="number" min="13" max="100" placeholder="e.g. 24" />
                    </label>
                    <ChipGroup label="Experience Level" options={LEVELS} value={level} onChange={setLevel} />
                  </div>
                  {error && <p className="signup-error">{error}</p>}
                  <div className="signup-actions">
                    <button className="btn signup-back" type="button" onClick={back}>← Back</button>
                    <button className="btn primary signup-cta" type="button" onClick={advance}>Continue →</button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="eyebrow">Step 3 of 4</div>
                  <h2>Your Goal.</h2>
                  <p style={{ marginTop: 8 }}>Pick your primary training focus.</p>
                  <div className="goal-grid">
                    {GOALS.map(g => (
                      <button
                        key={g.id}
                        type="button"
                        className={`goal-card${goal === g.id ? ' active' : ''}`}
                        onClick={() => setGoal(goal === g.id ? '' : g.id)}
                      >
                        <span className="goal-label">{g.label}</span>
                        <span className="goal-sub">{g.sub}</span>
                      </button>
                    ))}
                  </div>
                  {error && <p className="signup-error">{error}</p>}
                  <div className="signup-actions">
                    <button className="btn signup-back" type="button" onClick={back}>← Back</button>
                    <button className="btn primary signup-cta" type="button" onClick={advance}>Continue →</button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="eyebrow">Step 4 of 4</div>
                  <h2>Stay on Track.</h2>
                  <p style={{ marginTop: 8 }}>Get reminded when it's time to train. Change anytime in Settings.</p>
                  <div className="pref-list">
                    <ToggleRow
                      label="Email reminders"
                      sub="Daily workout summary in your inbox."
                      on={emailReminder}
                      onToggle={() => setEmailReminder(v => !v)}
                    />
                    <ToggleRow
                      label="SMS reminders"
                      sub="Text message to your phone."
                      on={smsReminder}
                      onToggle={() => setSmsReminder(v => !v)}
                    />
                    {smsReminder && (
                      <div className="pref-phone">
                        <label>
                          <span className="chip-label">Phone number</span>
                          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 212 555 1234" style={{ marginTop: 8 }} />
                        </label>
                        <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--soft)' }}>
                          Include country code. Verify in Settings after signup.
                        </p>
                      </div>
                    )}
                  </div>
                  {error && <p className="signup-error">{error}</p>}
                  <div className="signup-actions">
                    <button className="btn signup-back" type="button" onClick={back}>← Back</button>
                    <button className="btn primary signup-cta" type="button" onClick={handleSubmit} disabled={loading}>
                      {loading ? 'Creating...' : 'Create My Account →'}
                    </button>
                  </div>
                  <p style={{ marginTop: 12, fontSize: 12, color: 'var(--soft)', textAlign: 'center' }}>
                    By signing up you agree to our terms of service.
                  </p>
                </>
              )}

            </motion.div>
          </AnimatePresence>
        </section>

        {/* ── Right panel ── */}
        <section className="card signup-side">
          <div className="signup-side-bg">
            <img src="/assets/ngm-logo-banner.jpeg" alt="" aria-hidden="true" />
            <div className="signup-side-bg-overlay" />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`side-${step}`}
              variants={sideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ height: '100%' }}
            >
              <SidePanel step={step} />
            </motion.div>
          </AnimatePresence>
        </section>

      </main>
      <Footer />
    </PageTransition>
  )
}
