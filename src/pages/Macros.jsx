import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

// ─── Calculation Logic ────────────────────────────────────────────────────────

function calcBMR(weight, heightCm, age, sex) {
  // Mifflin-St Jeor
  if (sex === 'male') {
    return 10 * weight + 6.25 * heightCm - 5 * age + 5
  }
  return 10 * weight + 6.25 * heightCm - 5 * age - 161
}

const ACTIVITY_MULTIPLIERS = {
  sedentary:    1.2,
  light:        1.375,
  moderate:     1.55,
  active:       1.725,
  very_active:  1.9,
}

const ACTIVITY_LABELS = {
  sedentary:   'Sedentary (desk job, no exercise)',
  light:       'Lightly active (1–3 days/week)',
  moderate:    'Moderately active (3–5 days/week)',
  active:      'Very active (6–7 days/week)',
  very_active: 'Extremely active (twice/day)',
}

function calcMacros(inputs) {
  const { weightKg, heightCm, age, sex, activity } = inputs

  const bmr    = calcBMR(weightKg, heightCm, age, sex)
  const tdee   = bmr * ACTIVITY_MULTIPLIERS[activity]

  // Recomp: slight deficit on rest days, slight surplus on training days
  // We show maintenance as the base with recomp-adjusted macros
  const calories = Math.round(tdee)

  // Protein: 1g per lb of bodyweight (recomp priority)
  const weightLbs = weightKg * 2.2046
  const protein   = Math.round(weightLbs)

  // Fat: 25% of calories
  const fat = Math.round((calories * 0.25) / 9)

  // Carbs: remaining calories
  const proteinCals = protein * 4
  const fatCals     = fat * 9
  const carbs       = Math.round((calories - proteinCals - fatCals) / 4)

  // Water: bodyweight in lbs / 2 = oz, convert to cups and litres
  const waterOz    = Math.round(weightLbs / 2)
  const waterCups  = Math.round(waterOz / 8)
  const waterLitres = (waterOz * 0.0295735).toFixed(1)

  return { calories, protein, carbs, fat, waterOz, waterCups, waterLitres, tdee: Math.round(tdee) }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function UnitToggle({ unit, onChange }) {
  return (
    <div className="unit-toggle">
      <button
        className={`unit-btn ${unit === 'imperial' ? 'active' : ''}`}
        onClick={() => onChange('imperial')}
      >
        Imperial
      </button>
      <button
        className={`unit-btn ${unit === 'metric' ? 'active' : ''}`}
        onClick={() => onChange('metric')}
      >
        Metric
      </button>
    </div>
  )
}

function MacroRing({ label, value, unit, percent, color }) {
  const r        = 30
  const circ     = 2 * Math.PI * r
  const dash     = (percent / 100) * circ
  const gap      = circ - dash

  return (
    <div className="macro-ring-wrap">
      <svg viewBox="0 0 80 80" className="macro-ring-svg">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="7" />
        <circle
          cx="40" cy="40" r={r} fill="none"
          stroke={color} strokeWidth="7"
          strokeDasharray={`${dash} ${gap}`}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
          style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1)' }}
        />
        <text x="40" y="44" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">
          {value}
        </text>
      </svg>
      <span className="macro-ring-label">{label}</span>
      <span className="macro-ring-unit">{unit}</span>
    </div>
  )
}

function ResultCard({ results, unit }) {
  const totalMacroCals = results.protein * 4 + results.carbs * 4 + results.fat * 9
  const proteinPct     = Math.round((results.protein * 4 / totalMacroCals) * 100)
  const carbsPct       = Math.round((results.carbs   * 4 / totalMacroCals) * 100)
  const fatPct         = Math.round((results.fat     * 9 / totalMacroCals) * 100)

  return (
    <div className="macros-results">

      {/* Calories */}
      <div className="card macros-calories-card">
        <div className="eyebrow">Daily Calories</div>
        <div className="macros-calorie-num">{results.calories.toLocaleString()}</div>
        <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--muted)' }}>
          Based on your TDEE of {results.tdee.toLocaleString()} kcal. Recomp targets maintenance
          calories — the split between training and rest days is handled by your macro ratios.
        </p>
      </div>

      {/* Macros */}
      <div className="card macros-split-card">
        <div className="eyebrow">Macro Split</div>
        <div className="macro-rings">
          <MacroRing label="Protein" value={results.protein} unit="g" percent={proteinPct} color="#ffffff" />
          <MacroRing label="Carbs"   value={results.carbs}   unit="g" percent={carbsPct}   color="rgba(255,255,255,.55)" />
          <MacroRing label="Fat"     value={results.fat}     unit="g" percent={fatPct}      color="rgba(255,255,255,.3)" />
        </div>
        <div className="macro-bars">
          <div className="macro-bar-row">
            <span className="macro-bar-label">Protein</span>
            <div className="macro-bar-track">
              <div className="macro-bar-fill" style={{ width: `${proteinPct}%`, background: '#fff' }} />
            </div>
            <span className="macro-bar-pct">{proteinPct}%</span>
          </div>
          <div className="macro-bar-row">
            <span className="macro-bar-label">Carbs</span>
            <div className="macro-bar-track">
              <div className="macro-bar-fill" style={{ width: `${carbsPct}%`, background: 'rgba(255,255,255,.55)' }} />
            </div>
            <span className="macro-bar-pct">{carbsPct}%</span>
          </div>
          <div className="macro-bar-row">
            <span className="macro-bar-label">Fat</span>
            <div className="macro-bar-track">
              <div className="macro-bar-fill" style={{ width: `${fatPct}%`, background: 'rgba(255,255,255,.3)' }} />
            </div>
            <span className="macro-bar-pct">{fatPct}%</span>
          </div>
        </div>
      </div>

      {/* Water */}
      <div className="card macros-water-card">
        <div className="eyebrow">Daily Water</div>
        <div className="macros-water-num">
          {unit === 'imperial'
            ? <>{results.waterOz}<span className="macros-water-unit">oz</span></>
            : <>{results.waterLitres}<span className="macros-water-unit">L</span></>
          }
        </div>
        <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--muted)' }}>
          {unit === 'imperial'
            ? `${results.waterCups} cups per day. Increase by 16–20 oz on training days.`
            : `Increase by 500ml on training days.`
          }
        </p>
      </div>

      {/* Recomp notes */}
      <div className="card macros-notes-card">
        <div className="eyebrow">Recomp Protocol</div>
        <div className="macros-notes">
          <div className="macros-note">
            <span className="macros-note-label">Protein priority</span>
            <span className="macros-note-val">{results.protein}g daily — non-negotiable</span>
          </div>
          <div className="macros-note">
            <span className="macros-note-label">Training days</span>
            <span className="macros-note-val">Shift 30–50g carbs from fat day total</span>
          </div>
          <div className="macros-note">
            <span className="macros-note-label">Rest days</span>
            <span className="macros-note-val">Lower carbs, slightly higher fat</span>
          </div>
          <div className="macros-note">
            <span className="macros-note-label">Meal timing</span>
            <span className="macros-note-val">40–50g protein within 45 min post-workout</span>
          </div>
        </div>
      </div>

    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Macros() {
  const [unit, setUnit]         = useState('imperial')
  const [sex,  setSex]          = useState('male')
  const [age,  setAge]          = useState('')
  const [activity, setActivity] = useState('moderate')
  const [results,  setResults]  = useState(null)
  const [errors,   setErrors]   = useState({})

  // Imperial inputs
  const [lbs,     setLbs]     = useState('')
  const [feet,    setFeet]    = useState('')
  const [inches,  setInches]  = useState('')

  // Metric inputs
  const [kg,      setKg]      = useState('')
  const [cm,      setCm]      = useState('')

  function validate() {
    const errs = {}
    if (!age || age < 13 || age > 100) errs.age = 'Enter a valid age (13–100)'

    if (unit === 'imperial') {
      if (!lbs || lbs < 50 || lbs > 700)   errs.weight = 'Enter a valid weight'
      if (!feet || feet < 3 || feet > 8)    errs.height = 'Enter a valid height'
    } else {
      if (!kg || kg < 20 || kg > 320)       errs.weight = 'Enter a valid weight'
      if (!cm || cm < 90 || cm > 250)       errs.height = 'Enter a valid height'
    }
    return errs
  }

  function handleCalculate() {
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    let weightKg, heightCm
    if (unit === 'imperial') {
      weightKg = parseFloat(lbs) * 0.453592
      heightCm = (parseFloat(feet) * 12 + parseFloat(inches || 0)) * 2.54
    } else {
      weightKg = parseFloat(kg)
      heightCm = parseFloat(cm)
    }

    const result = calcMacros({
      weightKg,
      heightCm,
      age:      parseFloat(age),
      sex,
      activity,
    })
    setResults(result)
    // Scroll to results on mobile
    setTimeout(() => {
      document.getElementById('macros-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <PageTransition>
      <Header />
      <main className="macros-wrap">

        {/* Header */}
        <div className="card macros-hero-card">
          <div className="eyebrow">Macro Calculator</div>
          <h2>Your Numbers.<br />No Guessing.</h2>
          <p className="lead" style={{ marginTop: 12 }}>
            Built for recomp — losing fat and building muscle simultaneously.
            Enter your stats and get your exact daily targets.
          </p>
        </div>

        <div className="macros-layout">

          {/* Form */}
          <div className="card macros-form-card">

            {/* Unit toggle */}
            <div className="macros-form-section">
              <div className="settings-label">Units</div>
              <UnitToggle unit={unit} onChange={u => { setUnit(u); setErrors({}) }} />
            </div>

            {/* Sex */}
            <div className="macros-form-section">
              <div className="settings-label">Biological sex</div>
              <div className="macros-sex-btns">
                <button
                  className={`macros-sex-btn ${sex === 'male' ? 'active' : ''}`}
                  onClick={() => setSex('male')}
                >Male</button>
                <button
                  className={`macros-sex-btn ${sex === 'female' ? 'active' : ''}`}
                  onClick={() => setSex('female')}
                >Female</button>
              </div>
            </div>

            {/* Age */}
            <div className="macros-form-section">
              <label>
                <span className="settings-label">Age</span>
                <input
                  type="number" inputMode="numeric"
                  placeholder="25"
                  value={age}
                  min={13} max={100}
                  onChange={e => setAge(e.target.value)}
                  style={{ marginTop: 6 }}
                />
              </label>
              {errors.age && <p className="macros-error">{errors.age}</p>}
            </div>

            {/* Weight */}
            <div className="macros-form-section">
              <div className="settings-label">Weight</div>
              {unit === 'imperial' ? (
                <input
                  type="number" inputMode="decimal"
                  placeholder="175 lbs"
                  value={lbs}
                  onChange={e => setLbs(e.target.value)}
                  style={{ marginTop: 6 }}
                />
              ) : (
                <input
                  type="number" inputMode="decimal"
                  placeholder="80 kg"
                  value={kg}
                  onChange={e => setKg(e.target.value)}
                  style={{ marginTop: 6 }}
                />
              )}
              {errors.weight && <p className="macros-error">{errors.weight}</p>}
            </div>

            {/* Height */}
            <div className="macros-form-section">
              <div className="settings-label">Height</div>
              {unit === 'imperial' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 6 }}>
                  <input
                    type="number" inputMode="numeric"
                    placeholder="5 ft"
                    value={feet}
                    min={3} max={8}
                    onChange={e => setFeet(e.target.value)}
                  />
                  <input
                    type="number" inputMode="numeric"
                    placeholder="10 in"
                    value={inches}
                    min={0} max={11}
                    onChange={e => setInches(e.target.value)}
                  />
                </div>
              ) : (
                <input
                  type="number" inputMode="numeric"
                  placeholder="178 cm"
                  value={cm}
                  onChange={e => setCm(e.target.value)}
                  style={{ marginTop: 6 }}
                />
              )}
              {errors.height && <p className="macros-error">{errors.height}</p>}
            </div>

            {/* Activity */}
            <div className="macros-form-section">
              <div className="settings-label">Activity level</div>
              <div className="macros-activity-list" style={{ marginTop: 6 }}>
                {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    className={`macros-activity-btn ${activity === key ? 'active' : ''}`}
                    onClick={() => setActivity(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn primary full-width" onClick={handleCalculate}>
              Calculate My Macros
            </button>
          </div>

          {/* Results */}
          <div id="macros-results">
            {results
              ? <ResultCard results={results} unit={unit} />
              : (
                <div className="macros-empty">
                  <div className="macros-empty-icon">⚡</div>
                  <p>Fill in your stats and hit Calculate to see your daily targets.</p>
                </div>
              )
            }
          </div>

        </div>
      </main>
      <Footer />
    </PageTransition>
  )
}
