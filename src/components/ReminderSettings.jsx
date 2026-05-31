import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const TIMEZONES = [
  { label: 'Eastern (ET)',     value: 'America/New_York' },
  { label: 'Central (CT)',     value: 'America/Chicago' },
  { label: 'Mountain (MT)',    value: 'America/Denver' },
  { label: 'Pacific (PT)',     value: 'America/Los_Angeles' },
  { label: 'Alaska (AKT)',     value: 'America/Anchorage' },
  { label: 'Hawaii (HT)',      value: 'Pacific/Honolulu' },
  { label: 'London (GMT/BST)', value: 'Europe/London' },
  { label: 'Paris (CET/CEST)', value: 'Europe/Paris' },
  { label: 'Dubai (GST)',      value: 'Asia/Dubai' },
  { label: 'Singapore (SGT)',  value: 'Asia/Singapore' },
  { label: 'Tokyo (JST)',      value: 'Asia/Tokyo' },
  { label: 'Sydney (AEST)',    value: 'Australia/Sydney' },
]

// Generate time slots every 15 minutes
function generateTimeSlots() {
  const slots = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hh     = String(h).padStart(2, '0')
      const mm     = String(m).padStart(2, '0')
      const value  = `${hh}:${mm}`
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
      const ampm   = h < 12 ? 'AM' : 'PM'
      const label  = `${hour12}:${mm} ${ampm}`
      slots.push({ value, label })
    }
  }
  return slots
}

const TIME_SLOTS = generateTimeSlots()

// Convert local HH:MM + timezone → UTC HH:MM for storage
function localTimeToUTC(timeStr: string, timezone: string): string {
  const [hh, mm] = timeStr.split(':').map(Number)
  const now = new Date()
  const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, 0)
  const utcDate   = new Date(localDate.toLocaleString('en-US', { timeZone: 'UTC' }))
  const tzDate    = new Date(localDate.toLocaleString('en-US', { timeZone: timezone }))
  const diff      = utcDate.getTime() - tzDate.getTime()
  const utc       = new Date(localDate.getTime() + diff)
  return `${String(utc.getHours()).padStart(2,'0')}:${String(utc.getMinutes()).padStart(2,'0')}`
}

// Convert stored UTC HH:MM → local HH:MM for display
function utcTimeToLocal(utcStr: string, timezone: string): string {
  if (!utcStr) return '07:00'
  const [hh, mm] = utcStr.split(':').map(Number)
  const now = new Date()
  const utcDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm))
  const local   = utcDate.toLocaleTimeString('en-US', {
    timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false,
  })
  // Snap to nearest 15-min slot
  const [lh, lm] = local.slice(0, 5).split(':').map(Number)
  const snapped  = Math.round(lm / 15) * 15
  const finalM   = snapped === 60 ? 0 : snapped
  const finalH   = snapped === 60 ? (lh + 1) % 24 : lh
  return `${String(finalH).padStart(2,'0')}:${String(finalM).padStart(2,'0')}`
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      className={`toggle-btn ${on ? 'on' : ''}`}
      onClick={onToggle}
      aria-pressed={on}
    >
      <span className="toggle-knob" />
    </button>
  )
}

export default function ReminderSettings({ userId }: { userId: string }) {
  const [emailEnabled, setEmailEnabled] = useState(false)
  const [smsEnabled,   setSmsEnabled]   = useState(false)
  const [time,         setTime]         = useState('07:00')
  const [timezone,     setTimezone]     = useState('America/New_York')
  const [phone,        setPhone]        = useState('')
  const [status,       setStatus]       = useState<'idle'|'saving'|'saved'|'error'>('idle')
  const [loaded,       setLoaded]       = useState(false)

  // Auto-detect timezone
  useEffect(() => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
    const match    = TIMEZONES.find(tz => tz.value === detected)
    if (match) setTimezone(detected)
  }, [])

  // Load existing settings
  useEffect(() => {
    supabase
      .from('profiles')
      .select('reminder_email_enabled, reminder_sms_enabled, reminder_time, reminder_timezone, phone_number')
      .eq('id', userId)
      .single()
      .then(({ data }) => {
        if (!data) return
        setEmailEnabled(data.reminder_email_enabled ?? false)
        setSmsEnabled(data.reminder_sms_enabled ?? false)
        setPhone(data.phone_number ?? '')
        const tz = data.reminder_timezone ?? 'America/New_York'
        setTimezone(tz)
        if (data.reminder_time) setTime(utcTimeToLocal(data.reminder_time, tz))
        setLoaded(true)
      })
  }, [userId])

  async function handleSave() {
    setStatus('saving')
    const utcTime = localTimeToUTC(time, timezone)
    const { error } = await supabase
      .from('profiles')
      .update({
        reminder_email_enabled: emailEnabled,
        reminder_sms_enabled:   smsEnabled,
        reminder_time:          (emailEnabled || smsEnabled) ? utcTime : null,
        reminder_timezone:      timezone,
        phone_number:           phone.trim() || null,
      })
      .eq('id', userId)

    if (error) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    } else {
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2500)
    }
  }

  if (!loaded) return null

  const anyEnabled = emailEnabled || smsEnabled

  return (
    <div className="settings-section">
      <div className="settings-label">Workout Reminders</div>
      <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--muted)' }}>
        Get notified when it's time to train. Reminders fire every 15 minutes — pick the closest slot.
      </p>

      {/* Email toggle */}
      <div className="reminder-toggle-row">
        <div>
          <strong style={{ fontSize: 15 }}>Email reminder</strong>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: 'var(--muted)' }}>
            Daily email with your workout.
          </p>
        </div>
        <Toggle on={emailEnabled} onToggle={() => setEmailEnabled(e => !e)} />
      </div>

      {/* SMS toggle */}
      <div className="reminder-toggle-row" style={{ marginTop: 14 }}>
        <div>
          <strong style={{ fontSize: 15 }}>SMS reminder</strong>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: 'var(--muted)' }}>
            Text message to your phone.
          </p>
        </div>
        <Toggle on={smsEnabled} onToggle={() => setSmsEnabled(s => !s)} />
      </div>

      {/* Phone number — only shown when SMS enabled */}
      {smsEnabled && (
        <div style={{ marginTop: 14 }}>
          <label>
            <span className="settings-label">Phone number</span>
            <input
              type="tel"
              placeholder="+1 212 555 1234"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{ marginTop: 6 }}
            />
          </label>
          <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--soft)' }}>
            Include country code, e.g. +1 for US.
          </p>
        </div>
      )}

      {/* Time + timezone — only shown when at least one is enabled */}
      {anyEnabled && (
        <div className="reminder-fields" style={{ marginTop: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label>
              <span className="settings-label">Reminder time</span>
              <select value={time} onChange={e => setTime(e.target.value)} style={{ marginTop: 6 }}>
                {TIME_SLOTS.map(slot => (
                  <option key={slot.value} value={slot.value}>{slot.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="settings-label">Timezone</span>
              <select value={timezone} onChange={e => setTimezone(e.target.value)} style={{ marginTop: 6 }}>
                {TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}

      {/* Save */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
        <button
          className="btn primary"
          onClick={handleSave}
          disabled={status === 'saving'}
          style={{ minWidth: 120 }}
        >
          {status === 'saving' ? 'Saving...' : 'Save'}
        </button>
        {status === 'saved' && <span className="settings-status ok">✓ Saved</span>}
        {status === 'error' && <span className="settings-status err">Something went wrong</span>}
      </div>
    </div>
  )
}
