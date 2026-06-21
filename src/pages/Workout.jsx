import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { getWorkouts, getTodayIndex, getWeekLabel } from '../data/workouts'

function getLocalDateString() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// ── Exercise type detection ───────────────────────────────────────────────────

function getExerciseType(reps) {
  const r = String(reps).toLowerCase()
  if (r.includes('min') || r.includes('sec')) return 'time'
  return 'reps'
}

// ── Set Row ───────────────────────────────────────────────────────────────────

function SetRow({ setNumber, weight, reps, onChange, exerciseType, repsLabel }) {
  if (exerciseType === 'time') {
    return (
      <div className="set-row">
        <span className="set-number">Set {setNumber}</span>
        <label className="set-input-wrap" style={{ flex: 1 }}>
          <input
            type="text"
            inputMode="text"
            placeholder={repsLabel || 'duration'}
            value={reps}
            onChange={e => onChange('reps', e.target.value)}
            className="set-input"
          />
          <span className="set-input-unit">dur</span>
        </label>
      </div>
    )
  }

  return (
    <div className="set-row">
      <span className="set-number">Set {setNumber}</span>
      <label className="set-input-wrap">
        <input
          type="number" inputMode="decimal" placeholder="lbs"
          value={weight} min={0}
          onChange={e => onChange('weight', e.target.value)}
          className="set-input"
        />
        <span className="set-input-unit">lbs</span>
      </label>
      <span className="set-sep">×</span>
      <label className="set-input-wrap">
        <input
          type="number" inputMode="numeric" placeholder="reps"
          value={reps} min={0}
          onChange={e => onChange('reps', e.target.value)}
          className="set-input"
        />
        <span className="set-input-unit">reps</span>
      </label>
    </div>
  )
}

// ── Log Modal ─────────────────────────────────────────────────────────────────

function LogModal({ workout, workoutKey, idx, userId, onClose, onLogged }) {
  const initialSets = Object.fromEntries(
    workout.exercises.map(ex => [
      ex.name,
      Array.from({ length: ex.sets }, () => ({ weight: '', reps: '' }))
    ])
  )
  const exerciseTypes = Object.fromEntries(
    workout.exercises.map(ex => [ex.name, getExerciseType(ex.reps)])
  )
  const [sets, setSets]     = useState(initialSets)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)
  const modalRef = useRef()

  function handleBackdrop(e) {
    if (e.target === modalRef.current) onClose()
  }

  function updateSet(exerciseName, setIndex, field, value) {
    setSets(prev => ({
      ...prev,
      [exerciseName]: prev[exerciseName].map((s, i) =>
        i === setIndex ? { ...s, [field]: value } : s
      )
    }))
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const { data: logData, error: logError } = await supabase
        .from('workout_logs')
        .insert({ user_id: userId, workout_key: workoutKey, day_index: idx })
        .select('id')
        .single()
      if (logError) throw logError

      const workoutLogId = logData.id
      const setRows = []
      for (const ex of workout.exercises) {
        const exType = getExerciseType(ex.reps)
        sets[ex.name].forEach((s, i) => {
          if (exType === 'time') {
            if (!s.reps || !s.reps.trim()) return
            setRows.push({
              workout_log_id: workoutLogId,
              user_id: userId,
              exercise_name: ex.name,
              set_number: i + 1,
              weight: null,
              reps: 0, // store 0 for time-based
            })
          } else {
            const repsVal = parseInt(s.reps)
            if (!repsVal || repsVal < 1) return
            setRows.push({
              workout_log_id: workoutLogId,
              user_id: userId,
              exercise_name: ex.name,
              set_number: i + 1,
              weight: s.weight !== '' ? parseFloat(s.weight) : null,
              reps: repsVal,
            })
          }
        })
      }

      if (setRows.length > 0) {
        const { error: setsError } = await supabase.from('set_logs').insert(setRows)
        if (setsError) throw setsError
      }

      onLogged(sets)
      onClose()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" ref={modalRef} onClick={handleBackdrop}>
      <div className="modal-sheet">
        <div className="modal-header">
          <div>
            <h3 className="modal-title">{workout.label}</h3>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {workout.exercises.map(ex => (
            <div key={ex.name} className="log-exercise">
              <div className="log-exercise-header">
                <span className="log-exercise-name">{ex.name}</span>
                <span className="log-exercise-meta">{ex.sets} sets · {ex.reps} reps</span>
              </div>
              <div className="set-rows">
                {sets[ex.name].map((s, i) => (
                  <SetRow
                    key={i} setNumber={i + 1}
                    weight={s.weight} reps={s.reps}
                    exerciseType={exerciseTypes[ex.name]}
                    repsLabel={String(ex.reps)}
                    onChange={(field, val) => updateSet(ex.name, i, field, val)}
                  />
                ))}
              </div>
            </div>
          ))}
          {error && <p className="log-error">{error}</p>}
        </div>
        <div className="modal-footer">
          <p className="log-hint">Leave weight blank for bodyweight exercises.</p>
          <button className="btn primary full-width" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Workout'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── PR Banner ─────────────────────────────────────────────────────────────────

function PRBanner({ prs }) {
  if (!prs || prs.length === 0) return null
  return (
    <div className="pr-banner">
      <span className="pr-trophy">🏆</span>
      <div className="pr-text">
        <strong>New PR{prs.length > 1 ? 's' : ''}!</strong>{' '}
        {prs.map((pr, i) => (
          <span key={i}>
            {pr.exercise_name} — {pr.weight} lbs × {pr.reps} reps
            {i < prs.length - 1 ? ', ' : ''}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Streak Banner ─────────────────────────────────────────────────────────────

function StreakBanner({ streak }) {
  if (!streak || streak < 2) return null
  const emoji = streak >= 30 ? '🔥🔥🔥' : streak >= 14 ? '🔥🔥' : '🔥'
  return (
    <div className="pr-banner">
      <span className="pr-trophy">{emoji}</span>
      <div className="pr-text">
        <strong>{streak}-day streak!</strong>{' '}
        <span>You've logged workouts {streak} days in a row. Keep it going.</span>
      </div>
    </div>
  )
}

// ── Deload Banner ─────────────────────────────────────────────────────────────

function DeloadBanner() {
  return (
    <div className="pr-banner" style={{ borderColor: 'rgba(255,200,0,.3)', background: 'linear-gradient(135deg, rgba(255,200,0,.08) 0%, rgba(255,200,0,.02) 100%)' }}>
      <span className="pr-trophy">⚠️</span>
      <div className="pr-text">
        <strong>Consider a deload this week.</strong>{' '}
        <span>You've missed your target reps on key lifts two sessions in a row. A lighter week will help you recover and come back stronger.</span>
      </div>
    </div>
  )
}

// ── Exercise Card ─────────────────────────────────────────────────────────────

function ExerciseCard({ ex, isPremium }) {
  return (
    <div className="exercise-card">
      <h3 className="exercise-name">{ex.name}</h3>
      <div className="exercise-stats">
        <div className="stat"><span className="stat-label">Sets</span><span className="stat-value">{ex.sets}</span></div>
        <div className="stat"><span className="stat-label">Reps</span><span className="stat-value">{ex.reps}</span></div>
        <div className="stat"><span className="stat-label">Rest</span><span className="stat-value">{ex.rest}</span></div>
      </div>
      {isPremium ? (
        <div className="exercise-premium">
          <div className="premium-row"><span className="premium-label">Primary Muscles</span><span className="premium-value">{ex.muscles}</span></div>
          <div className="premium-row"><span className="premium-label">Form Cue</span><span className="premium-value">{ex.cue}</span></div>
          <div className="premium-row"><span className="premium-label">Progression Rule</span><span className="premium-value">{ex.progression}</span></div>
        </div>
      ) : (
        <div className="premium-locked">
          <div className="premium-lock-overlay">
            <span>&#128274;</span>
            <span>Form cues &amp; progression rules — <strong>Premium</strong></span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Nutrition Card ────────────────────────────────────────────────────────────

function NutritionCard({ workout, isPremium }) {
  if (isPremium) {
    return (
      <div className="card nutrition-card">
        <h3 className="nutrition-title">{workout.label}</h3>
        <p>{workout.nutrition}</p>
        <div className="rationale-block">
          <p style={{ margin: '10px 0 0' }}>{workout.rationale}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="card nutrition-card">
      <h3 className="nutrition-title">Fuel Your Session</h3>
      <div className="premium-lock-overlay" style={{ marginTop: 16 }}>
        <span>&#128274;</span>
        <span>Daily nutrition brief &amp; program rationale — <strong>Premium only.</strong></span>
      </div>
    </div>
  )
}

// ── Deload Detection ──────────────────────────────────────────────────────────

async function checkDeload(userId, workoutKey, workout) {
  try {
    if (!workoutKey) return false

    // Get last 2 workout logs for this workout key
    const { data: logs } = await supabase
      .from('workout_logs')
      .select('id')
      .eq('user_id', userId)
      .eq('workout_key', workoutKey)
      .order('logged_at', { ascending: false })
      .limit(2)

    if (!logs || logs.length < 2) return false

    const primaryExercises = workout.exercises.slice(0, 2)

    let failCount = 0

    for (const ex of primaryExercises) {
      const targetReps = parseInt(ex.reps.toString().split('–')[0].split('-')[0])
      if (!targetReps || isNaN(targetReps)) continue

      const { data: setData } = await supabase
        .from('set_logs')
        .select('reps, workout_log_id')
        .in('workout_log_id', logs.map(l => l.id))
        .eq('exercise_name', ex.name)

      if (!setData || setData.length === 0) continue

      const bySession = {}
      setData.forEach(s => {
        if (!bySession[s.workout_log_id]) bySession[s.workout_log_id] = []
        bySession[s.workout_log_id].push(s.reps)
      })

      const sessions = Object.values(bySession)
      if (sessions.length < 2) continue

      const bothFailed = sessions.every(sessionSets =>
        sessionSets.some(reps => reps < targetReps)
      )

      if (bothFailed) failCount++
    }

    return failCount >= 1
  } catch {
    return false
  }
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Workout() {
  const { session } = useAuth()
  const [isPremium,    setIsPremium]    = useState(false)
  const [joinedAt,     setJoinedAt]     = useState(null)
  const [seed,         setSeed]         = useState(0)
  const [fitnessLevel, setFitnessLevel] = useState('Intermediate')
  const [loaded,       setLoaded]       = useState(false)
  const [showModal,    setShowModal]    = useState(false)
  const [newPRs,       setNewPRs]       = useState([])
  const [loggedToday,  setLoggedToday]  = useState(false)
  const [streak,       setStreak]       = useState(0)
  const [needsDeload,  setNeedsDeload]  = useState(false)

  useEffect(() => {
    if (!session) return
    supabase
      .from('profiles')
      .select('role, subscription, joined_at, schedule_seed, fitness_level')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        setIsPremium(data?.subscription === 'premium' || data?.subscription === 'canceling' || data?.role === 'admin')
        setJoinedAt(data?.joined_at ?? null)
        setSeed(data?.schedule_seed ?? 0)
        setFitnessLevel(data?.fitness_level ?? 'Intermediate')
        setLoaded(true)
      })
  }, [session])

  useEffect(() => {
    if (!session) return

    // Check logged today
    const today = getLocalDateString()
    supabase
      .from('workout_logs')
      .select('id')
      .eq('user_id', session.user.id)
      .gte('logged_at', today + 'T00:00:00')
      .lte('logged_at', today + 'T23:59:59')
      .then(({ data }) => {
        if (data && data.length > 0) setLoggedToday(true)
      })

    // Get streak
    supabase
      .from('user_streaks')
      .select('streak')
      .eq('user_id', session.user.id)
      .single()
      .then(({ data }) => {
        if (data?.streak) setStreak(data.streak)
      })
  }, [session])

  const { workouts: WORKOUTS, schedule: SCHEDULE } = getWorkouts(fitnessLevel)
  const idx        = getTodayIndex(joinedAt, seed, fitnessLevel)
  const workoutKey = SCHEDULE[idx]
  const workout    = WORKOUTS[workoutKey]

  // Check deload after component loads
  useEffect(() => {
    if (!session || !loaded || !workout) return
    checkDeload(session.user.id, workoutKey, workout).then(setNeedsDeload)
  }, [session, loaded, workoutKey, fitnessLevel])

  async function handleLogged(loggedSets) {
    setLoggedToday(true)
    setStreak(s => s + 1)

    // Check for new PRs
    const today = getLocalDateString()
    const { data } = await supabase
      .from('personal_records')
      .select('exercise_name, weight, reps')
      .eq('user_id', session.user.id)
      .gte('achieved_at', today + 'T00:00:00')
    if (data && data.length > 0) setNewPRs(data)

    // Re-check deload after logging
    const deload = await checkDeload(session.user.id, workoutKey, workout)
    setNeedsDeload(deload)
  }

  if (!loaded) {
    return (
      <PageTransition>
        <Header />
        <main className="workout-wrap">
          <p className="workout-status">Loading your program...</p>
        </main>
        <Footer />
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <Header />
      <main className="workout-wrap">

        {newPRs.length > 0 && <PRBanner prs={newPRs} />}
        {streak > 1 && !newPRs.length && <StreakBanner streak={streak} />}
        {needsDeload && <DeloadBanner />}

        <div className="card day-header">
          <div>
            <h2>{workout.label}</h2>
            <div className="day-pills">
              <span className="pill">{workout.focus}</span>
              <span className="pill">Day {idx + 1} of {SCHEDULE.length} · {getWeekLabel(idx)}</span>
              {streak > 0 && (
                <span className="pill">🔥 {streak}-day streak</span>
              )}
            </div>
          </div>
          <button
            className={`btn log-btn ${loggedToday ? 'logged' : 'primary'}`}
            onClick={() => !loggedToday && setShowModal(true)}
            disabled={loggedToday}
          >
            {loggedToday ? '✓ Logged' : 'Log Workout'}
          </button>
        </div>

        <div className="exercise-grid">
          {workout.exercises.map((ex, i) => (
            <ExerciseCard key={i} ex={ex} isPremium={isPremium} />
          ))}
        </div>

        <NutritionCard workout={workout} isPremium={isPremium} />

        {!isPremium && (
          <div className="card upgrade-cta">
            <h2>Get the Full System.</h2>
            <p className="lead">Unlock progression rules, form cues, primary muscle targets, and your daily nutrition brief.</p>
            <div className="actions">
              <Link to="/upgrade" className="btn primary">Upgrade — $19.99/mo</Link>
            </div>
          </div>
        )}

      </main>
      <Footer />

      {showModal && (
        <LogModal
          workout={workout}
          workoutKey={workoutKey}
          idx={idx}
          userId={session.user.id}
          onClose={() => setShowModal(false)}
          onLogged={handleLogged}
        />
      )}
    </PageTransition>
  )
}
