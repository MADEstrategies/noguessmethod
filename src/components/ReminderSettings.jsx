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

// Convert local HH:MM in a given timezone to UTC HH:MM
// Strategy: find the UTC offset by converting a known UTC time to local,
// then apply the inverse offset to the user's chosen time.
function localTimeToUTC(timeStr, timezone) {
  const [hh, mm] = timeStr.split(':').map(Number)
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-CA', { timeZone: timezone }) // YYYY-MM-DD
  // Use noon UTC as reference — convert to local to find offset
  const testDate = new Date(`${dateStr}T12:00:00Z`)
  const localStr = testDate.toLocaleTimeString('en-US', {
    timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false,
  })
  const [localH, localM] = localStr.split(':').map(Number)
  const offsetMins = (12 * 60) - (localH * 60 + localM)
  const utcMins = hh * 60 + mm + offsetMins
  const normalized = ((utcMins % 1440) + 1440) % 1440
  const utcH = Math.floor(normalized / 60)
  const utcM = normalized % 60
  return `${String(utcH).padStart(2, '0')}:${String(utcM).padStart(2, '0')}`
}

// Convert stored UTC HH:MM back to local time in the given timezone
function utcTimeToLocal(utcStr, timezone) {
  if (!utcStr) return '07:00'
  const [hh, mm] = utcStr.split(':').map(Number)
  const now = new Date()
  const utcDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm))
  const local = utcDate.toLocaleTimeString('en-US', {
    timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false,
  })
  const [lh, lm] = local.slice(0, 5).split(':').map(Number)
  const snapped = Math.round(lm / 15) * 15
  const finalM  = snapped === 60 ? 0 : snapped
  const finalH  = snapped === 60 ? (lh + 1) % 24 : lh
  return `${String(finalH).padStart(2, '0')}:${String(finalM).padStart(2, '0')}`
}

function normalizePhoneClient(raw) {
  if (!raw) return null
  const p = String(raw).trim().replace(/[\s\-().]/g, '')
  if (p.startsWith('+')) {
    const digits = p.slice(1).replace(/\D/g, '')
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null
  }
  const digits = p.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}

function Toggle({ on, onToggle }) {
  return (
    <button
      className={`toggle-btn ${on ? 'on' : ''}`}
      onClick={onToggle}
      aria-pressed={on}
      type="button"
    >
      <span className="toggle-knob" />
    </button>
  )
}

export default function ReminderSettings({ userId }) {
  const [emailEnabled,  setEmailEnabled]  = useState(false)
  const [smsEnabled,    setSmsEnabled]    = useState(false)
  const [time,          setTime]          = useState('07:00')
  const [timezone,      setTimezone]      = useState('America/New_York')
  const [phone,         setPhone]         = useState('')
  const [verifiedPhone, setVerifiedPhone] = useState(null)
  const [code,          setCode]          = useState('')
  const [verifyStep,    setVerifyStep]    = useState('idle')
  const [verifyState,   setVerifyState]   = useState('idle')
  const [verifyMsg,     setVerifyMsg]     = useState({ msg: '', ok: null })
  const [status,        setStatus]        = useState('idle')
  const [loaded,        setLoaded]        = useState(false)

  const normalizedPhone = normalizePhoneClient(phone)
  const phoneVerified   = !!verifiedPhone && normalizedPhone === verifiedPhone

  // Load existing settings — auto-detect timezone only if none saved
  useEffect(() => {
    if (!userId) return
    supabase
      .from('profiles')
      .select('reminder_email_enabled, reminder_sms_enabled, reminder_time, reminder_timezone, phone_number, phone_verified')
      .eq('id', userId)
      .single()
      .then(({ data }) => {
        if (!data) return
        setEmailEnabled(data.reminder_email_enabled ?? false)
        setSmsEnabled(data.reminder_sms_enabled ?? false)
        setPhone(data.phone_number ?? '')
        setVerifiedPhone(data.phone_verified ? (data.phone_number ?? null) : null)
        const tz = data.reminder_timezone
          ?? Intl.DateTimeFormat().resolvedOptions().timeZone
          ?? 'America/New_York'
        setTimezone(tz)
        if (data.reminder_time) setTime(utcTimeToLocal(data.reminder_time, tz))
        setLoaded(true)
      })
  }, [userId])

  async function authToken() {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token
  }

  function onPhoneChange(value) {
    setPhone(value)
    setVerifyStep('idle')
    setCode('')
    setVerifyMsg({ msg: '', ok: null })
  }

  async function handleSendCode() {
    if (!normalizedPhone) {
      setVerifyMsg({ msg: 'Enter a valid phone number, including country code (e.g. +1 212 555 1234).', ok: false })
      return
    }
    setVerifyState('sending')
    setVerifyMsg({ msg: '', ok: null })
    try {
      const token = await authToken()
      const res = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ phone: phone.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not send code')
      setVerifyStep('code-sent')
      setCode('')
      setVerifyMsg({ msg: `Code sent to ${data.phone}. Enter it below.`, ok: true })
    } catch (err) {
      setVerifyMsg({ msg: err.message, ok: false })
    } finally {
      setVerifyState('idle')
    }
  }

  async function handleVerifyCode() {
    if (!code.trim()) {
      setVerifyMsg({ msg: 'Enter the code from the text message.', ok: false })
      return
    }
    setVerifyState('checking')
    setVerifyMsg({ msg: '', ok: null })
    try {
      const token = await authToken()
      const res = await fetch('/api/check-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ phone: phone.trim(), code: code.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not verify code')
      setVerifiedPhone(data.phone)
      setPhone(data.phone)
      setVerifyStep('idle')
      setCode('')
      setVerifyMsg({ msg: 'Phone number verified.', ok: true })
    } catch (err) {
      setVerifyMsg({ msg: err.message, ok: false })
    } finally {
      setVerifyState('idle')
    }
  }

  async function handleSave() {
    if (smsEnabled && !phoneVerified) {
      setVerifyMsg({ msg: 'Verify your phone number before enabling SMS reminders.', ok: false })
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
      return
    }
    setStatus('saving')
    const utcTime = localTimeToUTC(time, timezone)
    console.log(`Saving reminder: local=${time} tz=${timezone} utc=${utcTime}`)
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
          <p style={{ margin: '3px 0 0', fontSize: 13, color: 'var(--muted)' }}>Daily email with your workout.</p>
        </div>
        <Toggle on={emailEnabled} onToggle={() => setEmailEnabled(e => !e)} />
      </div>

      {/* SMS toggle */}
      <div className="reminder-toggle-row" style={{ marginTop: 14 }}>
        <div>
          <strong style={{ fontSize: 15 }}>SMS reminder</strong>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: 'var(--muted)' }}>Text message to your phone.</p>
        </div>
        <Toggle on={smsEnabled} onToggle={() => setSmsEnabled(s => !s)} />
      </div>

      {/* Phone + verification */}
      {smsEnabled && (
        <div style={{ marginTop: 14 }}>
          <label>
            <span className="settings-label">Phone number</span>
            <input
              type="tel"
              placeholder="+1 212 555 1234"
              value={phone}
              onChange={e => onPhoneChange(e.target.value)}
              style={{ marginTop: 6 }}
            />
          </label>
          <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--soft)' }}>
            Include country code, e.g. +1 for US.
          </p>

          {phoneVerified ? (
            <p className="settings-status ok" style={{ marginTop: 8 }}>✓ Phone verified</p>
          ) : (
            <div style={{ marginTop: 10 }}>
              {verifyStep === 'idle' ? (
                <button className="btn" type="button" onClick={handleSendCode} disabled={verifyState === 'sending'}>
                  {verifyState === 'sending' ? 'Sending...' : 'Send code'}
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <label style={{ flex: '1 1 140px' }}>
                    <span className="settings-label">Verification code</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="123456"
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      style={{ marginTop: 6 }}
                    />
                  </label>
                  <button className="btn primary" type="button" onClick={handleVerifyCode} disabled={verifyState === 'checking'}>
                    {verifyState === 'checking' ? 'Verifying...' : 'Verify'}
                  </button>
                  <button className="btn" type="button" onClick={handleSendCode} disabled={verifyState === 'sending'}>
                    Resend
                  </button>
                </div>
              )}
              {verifyMsg.msg && (
                <p
                  className={`settings-status${verifyMsg.ok === true ? ' ok' : verifyMsg.ok === false ? ' err' : ''}`}
                  style={{ marginTop: 8 }}
                >
                  {verifyMsg.msg}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Time + timezone */}
      {anyEnabled && (
        <div style={{ marginTop: 14 }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 }}>
        <button
          className="btn primary"
          type="button"
          onClick={handleSave}
          disabled={status === 'saving'}
          style={{ minWidth: 120 }}
        >
          {status === 'saving' ? 'Saving...' : 'Save Reminders'}
        </button>
        {status === 'saved' && <span className="settings-status ok">✓ Saved</span>}
        {status === 'error'  && <span className="settings-status err">Something went wrong</span>}
      </div>
    </div>
  )
}
