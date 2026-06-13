import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function fmt(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Admin() {
  const { session } = useAuth()
  const [authorized,    setAuthorized]    = useState(false)
  const [authError,     setAuthError]     = useState('')
  const [tab,           setTab]           = useState('members')
  const [members,       setMembers]       = useState([])
  const [cancellations, setCancellations] = useState([])
  const [reasonCounts,  setReasonCounts]  = useState({})
  const [logsPerUser,   setLogsPerUser]   = useState({})
  const [coursesPerUser,setCoursesPerUser]= useState({})
  const [videosPerUser, setVideosPerUser] = useState({})
  const [stats,         setStats]         = useState({})
  const [search,        setSearch]        = useState('')
  const [loading,       setLoading]       = useState(false)

  useEffect(() => {
    if (!session) return
    supabase.from('profiles').select('role').eq('id', session.user.id).single()
      .then(({ data }) => {
        if (data?.role !== 'admin') { setAuthError('Access denied. Admin only.'); return }
        setAuthorized(true)
        loadData(session.access_token)
      })
  }, [session])

  async function loadData(token) {
    setLoading(true)
    try {
      const res  = await fetch('/api/admin-data', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMembers(data.members)
      setCancellations(data.cancellations)
      setReasonCounts(data.reasonCounts)
      setLogsPerUser(data.logsPerUser)
      setCoursesPerUser(data.coursesPerUser)
      setVideosPerUser(data.videosPerUser)
      setStats(data.stats)
    } catch (err) {
      setAuthError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function setSub(targetId, subscription, btn) {
    btn.disabled = true; btn.textContent = '...'
    try {
      const res  = await fetch('/api/admin-set-subscription', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId, subscription }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || 'Failed')
      setMembers(prev => prev.map(m => m.id === targetId ? { ...m, subscription } : m))
    } catch (err) {
      btn.disabled = false
      btn.textContent = subscription === 'premium' ? 'Make Premium' : 'Revoke'
      alert(err.message)
    }
  }

  if (authError) {
    return (
      <PageTransition><Header />
        <p className="admin-loading">{authError}</p>
      <Footer /></PageTransition>
    )
  }
  if (!authorized) {
    return (
      <PageTransition><Header />
        <p className="admin-loading">Checking authorization...</p>
      <Footer /></PageTransition>
    )
  }

  const filteredMembers = search
    ? members.filter(m =>
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.username.toLowerCase().includes(search.toLowerCase())
      )
    : members

  const TABS = ['members', 'cancellations', 'reminders']

  return (
    <PageTransition>
      <Header />
      <div className="admin-wrap">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0 }}>Admin.</h2>
          <button className="btn" onClick={() => loadData(session.access_token)} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-num">{stats.totalMembers ?? 0}</div>
            <div className="stat-lbl">Total Members</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{stats.premiumMembers ?? 0}</div>
            <div className="stat-lbl">Premium</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{stats.totalLogs ?? 0}</div>
            <div className="stat-lbl">Workouts Logged</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{stats.totalCancels ?? 0}</div>
            <div className="stat-lbl">Cancellations</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{stats.emailReminders ?? 0}</div>
            <div className="stat-lbl">Email Reminders</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{stats.smsReminders ?? 0}</div>
            <div className="stat-lbl">SMS Reminders</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {TABS.map(t => (
            <button
              key={t}
              className={`tab-btn${tab === t ? ' active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'members' ? 'Members' : t === 'cancellations' ? 'Cancellations' : 'Reminders'}
            </button>
          ))}
        </div>

        {/* Members tab */}
        {tab === 'members' && (
          <div className="admin-panel visible">
            <div className="admin-section">
              <div className="admin-section-head">
                <h3>All Members ({filteredMembers.length})</h3>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search email or username..."
                  style={{ background: 'rgba(0,0,0,.3)', border: '1px solid var(--line)', borderRadius: 12, padding: '8px 14px', color: '#fff', fontSize: 13, width: 220 }}
                />
              </div>
              {filteredMembers.length === 0 ? (
                <div className="empty-row">{search ? 'No members match that search.' : 'No members yet.'}</div>
              ) : (
                <table className="admin-tbl">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Username</th>
                      <th>Status</th>
                      <th>Level</th>
                      <th>Goal</th>
                      <th>Workouts</th>
                      <th>Videos</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map(m => {
                      const isPrem = m.subscription === 'premium' || m.subscription === 'canceling'
                      const isAdm  = m.role === 'admin'
                      return (
                        <tr key={m.id}>
                          <td>{m.email}</td>
                          <td>{m.username}</td>
                          <td>
                            <span className={`badge ${isPrem ? 'badge-premium' : 'badge-free'}`}>
                              {m.subscription === 'canceling' ? 'Canceling' : isPrem ? 'Premium' : 'Free'}
                            </span>
                            {isAdm && <span className="badge badge-admin" style={{ marginLeft: 6 }}>Admin</span>}
                          </td>
                          <td>{m.fitness_level}</td>
                          <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.primary_goal}</td>
                          <td style={{ textAlign: 'center' }}>{logsPerUser[m.id] ?? 0}</td>
                          <td style={{ textAlign: 'center' }}>{videosPerUser[m.id] ?? 0}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{fmt(m.created_at)}</td>
                          <td>
                            {isAdm ? (
                              <span style={{ color: 'var(--soft)', fontSize: 12 }}>Admin</span>
                            ) : isPrem ? (
                              <button className="tbl-btn danger" onClick={e => setSub(m.id, 'free', e.currentTarget)}>Revoke</button>
                            ) : (
                              <button className="tbl-btn" onClick={e => setSub(m.id, 'premium', e.currentTarget)}>Make Premium</button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Cancellations tab */}
        {tab === 'cancellations' && (
          <div className="admin-panel visible">

            {/* Reason breakdown */}
            {Object.keys(reasonCounts).length > 0 && (
              <div className="admin-section" style={{ marginBottom: 14 }}>
                <div className="admin-section-head"><h3>Cancellation Reasons</h3></div>
                <table className="admin-tbl">
                  <thead><tr><th>Reason</th><th>Count</th></tr></thead>
                  <tbody>
                    {Object.entries(reasonCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([reason, count]) => (
                        <tr key={reason}>
                          <td>{reason}</td>
                          <td>{count}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Cancellation log */}
            <div className="admin-section">
              <div className="admin-section-head"><h3>Cancellation Log</h3></div>
              {cancellations.length === 0 ? (
                <div className="empty-row">No cancellations yet.</div>
              ) : (
                <table className="admin-tbl">
                  <thead><tr><th>Date</th><th>Reason</th></tr></thead>
                  <tbody>
                    {cancellations.map((c, i) => (
                      <tr key={i}>
                        <td style={{ whiteSpace: 'nowrap' }}>{fmt(c.created_at)}</td>
                        <td>{c.reason || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Reminders tab */}
        {tab === 'reminders' && (
          <div className="admin-panel visible">
            <div className="admin-section">
              <div className="admin-section-head"><h3>Reminder Subscribers</h3></div>
              {members.filter(m => m.reminder_email_enabled || m.reminder_sms_enabled).length === 0 ? (
                <div className="empty-row">No reminder subscribers yet.</div>
              ) : (
                <table className="admin-tbl">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Email Reminder</th>
                      <th>SMS Reminder</th>
                      <th>Phone Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members
                      .filter(m => m.reminder_email_enabled || m.reminder_sms_enabled)
                      .map(m => (
                        <tr key={m.id}>
                          <td>{m.username}</td>
                          <td>{m.email}</td>
                          <td>
                            <span className={`badge ${m.reminder_email_enabled ? 'badge-premium' : 'badge-free'}`}>
                              {m.reminder_email_enabled ? 'On' : 'Off'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${m.reminder_sms_enabled ? 'badge-premium' : 'badge-free'}`}>
                              {m.reminder_sms_enabled ? 'On' : 'Off'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${m.phone_verified ? 'badge-premium' : 'badge-free'}`}>
                              {m.phone_verified ? 'Yes' : 'No'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

      </div>
      <Footer />
    </PageTransition>
  )
}
