import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

export default function Home() {
  return (
    <PageTransition>
      <Header />
      <main className="wrap">

        {/* ── Hero ── */}
        <section className="hero">
          <div className="card hero-copy">
            <div className="eyebrow">Structured training for intermediate lifters</div>
            <h1>Stop<br />Guessing.<br />Start<br />Lifting.</h1>
            <p className="lead">You've been training for a year or more. You're stuck. NoGuessMethod gives you a structured daily system — so you know exactly what to do, how to do it, and when to push more.</p>
            <div className="actions">
              <Link className="btn primary" to="/signup">Start Free</Link>
              <a className="btn" href="#how">See How It Works</a>
            </div>
            <div className="feature-row">
              <div className="mini"><strong>Daily Program</strong><span>A new structured workout every day. Push, Pull, Legs, Core, Recovery.</span></div>
              <div className="mini"><strong>Clear Progression</strong><span>Know exactly when to add weight and when to hold. No more guessing.</span></div>
              <div className="mini"><strong>Free to Start</strong><span>Full access to daily workouts at no cost. Upgrade when you're ready.</span></div>
            </div>
          </div>
          <div className="card logo-stage">
            <img src="/assets/ngm-logo-banner.jpeg" alt="NoGuessMethod" />
          </div>
        </section>

      </main>

      <hr className="lp-divider" />

      {/* ── Problem ── */}
      <section className="lp-section">
        <div className="card problem-card">
          <div className="eyebrow">The Problem</div>
          <h2>Most intermediate lifters<br />plateau for the same reasons.</h2>
          <p className="lead" style={{ maxWidth: 600, marginBottom: 28 }}>Beginner programs are behind you. Advanced programming isn't for you yet. The middle is where most lifters stall — not because they're lazy, but because nothing tells them what comes next.</p>
          <div className="feature-row">
            <div className="mini"><strong>The Plateau</strong><span>Same weight, same reps, same exercises. Progress stopped without a clear reason why.</span></div>
            <div className="mini"><strong>The Guesswork</strong><span>Searching Reddit for answers. Getting ten different opinions. Committing to none of them.</span></div>
            <div className="mini"><strong>The Drop-Off</strong><span>Inconsistency sets in when you don't know what you're working toward. The gym stops feeling worth it.</span></div>
          </div>
        </div>
      </section>

      <hr className="lp-divider" />

      {/* ── How It Works ── */}
      <section className="lp-section" id="how">
        <div className="lp-header">
          <div className="eyebrow">How It Works</div>
          <h2>Three steps.<br />No confusion.</h2>
        </div>
        <div className="how-steps">
          <div className="step card">
            <div className="step-num">01</div>
            <strong>Create a free account</strong>
            <p>Sign up in under a minute. No credit card required. Your account connects everything as NGM grows.</p>
          </div>
          <div className="step card">
            <div className="step-num">02</div>
            <strong>Get today's workout</strong>
            <p>A 30-day rotating PPL program updates daily — Push, Pull, Legs, Core, and Active Recovery. Structured for intermediate lifters, not beginners.</p>
          </div>
          <div className="step card">
            <div className="step-num">03</div>
            <strong>Follow the system</strong>
            <p>Free members get the full workout. Premium members get the exact reason behind every set, how to progress it, and how to fuel it.</p>
          </div>
        </div>
      </section>

      <hr className="lp-divider" />

      {/* ── CTA ── */}
      <section className="lp-section" style={{ paddingBottom: 80 }}>
        <div className="card home-cta-card">
          <div className="eyebrow">Get Started</div>
          <h2>No more guessing.</h2>
          <p className="lead" style={{ marginTop: 12 }}>
            Join free. Get your first structured workout today. Upgrade whenever you're ready for the full system.
          </p>
          <div className="actions" style={{ marginTop: 28 }}>
            <Link className="btn primary" to="/signup">Create Free Account</Link>
            <Link className="btn" to="/upgrade">See Pricing</Link>
          </div>
        </div>
      </section>

      <Footer />
    </PageTransition>
  )
}
