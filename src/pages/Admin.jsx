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

// ── Blog Editor ───────────────────────────────────────────────────────────────

function BlogEditor({ post, onSave, onCancel }) {
  const [title,     setTitle]     = useState(post?.title     ?? '')
  const [slug,      setSlug]      = useState(post?.slug      ?? '')
  const [excerpt,   setExcerpt]   = useState(post?.excerpt   ?? '')
  const [content,   setContent]   = useState(post?.content   ?? '')
  const [tags,      setTags]      = useState((post?.tags ?? []).join(', '))
  const [published, setPublished] = useState(post?.published ?? false)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')

  function generateSlug(t) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  function handleTitleChange(val) {
    setTitle(val)
    if (!post) setSlug(generateSlug(val))
  }

  async function handleSave() {
    if (!title.trim() || !slug.trim() || !excerpt.trim() || !content.trim()) {
      setError('Title, slug, excerpt and content are required.'); return
    }
    setSaving(true)
    setError('')
    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean)
    const payload = { title, slug, excerpt, content, tags: tagsArray, published }

    const { error: err } = post
      ? await supabase.from('blog_posts').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', post.id)
      : await supabase.from('blog_posts').insert(payload)

    if (err) { setError(err.message); setSaving(false); return }
    setSaving(false)
    onSave()
  }

  return (
    <div className="admin-section" style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <h3 style={{ margin: 0 }}>{post ? 'Edit Post' : 'New Post'}</h3>
        <button className="tbl-btn" onClick={onCancel}>Cancel</button>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 700 }}>
          Title
          <input value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Post title" />
        </label>

        <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 700 }}>
          Slug
          <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="post-slug-here" />
        </label>

        <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 700 }}>
          Excerpt
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short summary shown on the blog listing page." style={{ minHeight: 80 }} />
        </label>

        <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 700 }}>
          Content
          <p style={{ margin: 0, fontSize: 12, color: 'var(--soft)', fontWeight: 400 }}>Use ## for headings, **bold** for bold text. Blank lines = new paragraph.</p>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Full post content..." style={{ minHeight: 320, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6 }} />
        </label>

        <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 700 }}>
          Tags
          <input value={tags} onChange={e => setTags(e.target.value)} placeholder="programming, intermediate, plateau" />
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            className={`toggle-btn${published ? ' on' : ''}`}
            onClick={() => setPublished(p => !p)}
            aria-pressed={published}
          >
            <span className="toggle-knob" />
          </button>
          <span style={{ fontSize: 14 }}>{published ? 'Published' : 'Draft'}</span>
        </div>

        {error && <p style={{ color: '#ff6b6b', fontSize: 13, margin: 0 }}>{error}</p>}

        <button className="btn primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : post ? 'Save Changes' : 'Publish Post'}
        </button>
      </div>
    </div>
  )
}

// ── Main Admin Page ───────────────────────────────────────────────────────────

export default function Admin() {
  const { session } = useAuth()
  const [authorized,    setAuthorized]    = useState(false)
  const [authError,     setAuthError]     = useState('')
  const [tab,           setTab]           = useState('members')
  const [members,       setMembers]       = useState([])
  const [cancellations, setCancellations] = useState([])
  const [reasonCounts,  setReasonCounts]  = useState({})
  const [logsPerUser,   setLogsPerUser]   = useState({})
  const [videosPerUser, setVideosPerUser] = useState({})
  const [stats,         setStats]         = useState({})
  const [search,        setSearch]        = useState('')
  const [loading,       setLoading]       = useState(false)

  // Blog state
  const [posts,      setPosts]      = useState([])
  const [editingPost, setEditingPost] = useState(null)   // null = list, {} = new, {id,...} = edit
  const [postsLoading, setPostsLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

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
      setVideosPerUser(data.videosPerUser)
      setStats(data.stats)
    } catch (err) {
      setAuthError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadPosts() {
    setPostsLoading(true)
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug, published, created_at')
      .order('created_at', { ascending: false })
    setPosts(data ?? [])
    setPostsLoading(false)
  }

  useEffect(() => {
    if (tab === 'blog' && authorized) loadPosts()
  }, [tab, authorized])

  async function deletePost(id) {
    await supabase.from('blog_posts').delete().eq('id', id)
    setDeleteConfirm(null)
    loadPosts()
  }

  async function togglePublished(post) {
    await supabase.from('blog_posts').update({ published: !post.published }).eq('id', post.id)
    loadPosts()
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

  if (authError) return (
    <PageTransition><Header />
      <p className="admin-loading">{authError}</p>
    <Footer /></PageTransition>
  )

  if (!authorized) return (
    <PageTransition><Header />
      <p className="admin-loading">Checking authorization...</p>
    <Footer /></PageTransition>
  )

  const filteredMembers = search
    ? members.filter(m =>
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.username.toLowerCase().includes(search.toLowerCase())
      )
    : members

  const TABS = ['members', 'cancellations', 'reminders', 'blog']

  return (
    <PageTransition>
      <Header />
      <div className="admin-wrap">

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0 }}>Admin.</h2>
          <button className="btn" onClick={() => loadData(session.access_token)} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-card"><div className="stat-num">{stats.totalMembers ?? 0}</div><div className="stat-lbl">Total Members</div></div>
          <div className="stat-card"><div className="stat-num">{stats.premiumMembers ?? 0}</div><div className="stat-lbl">Premium</div></div>
          <div className="stat-card"><div className="stat-num">{stats.totalLogs ?? 0}</div><div className="stat-lbl">Workouts Logged</div></div>
          <div className="stat-card"><div className="stat-num">{stats.totalCancels ?? 0}</div><div className="stat-lbl">Cancellations</div></div>
          <div className="stat-card"><div className="stat-num">{stats.emailReminders ?? 0}</div><div className="stat-lbl">Email Reminders</div></div>
          <div className="stat-card"><div className="stat-num">{stats.smsReminders ?? 0}</div><div className="stat-lbl">SMS Reminders</div></div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {TABS.map(t => (
            <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t === 'members' ? 'Members' : t === 'cancellations' ? 'Cancellations' : t === 'reminders' ? 'Reminders' : 'Blog'}
            </button>
          ))}
        </div>

        {/* Members */}
        {tab === 'members' && (
          <div className="admin-panel visible">
            <div className="admin-section">
              <div className="admin-section-head">
                <h3>All Members ({filteredMembers.length})</h3>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search email or username..."
                  style={{ background: 'rgba(0,0,0,.3)', border: '1px solid var(--line)', borderRadius: 12, padding: '8px 14px', color: '#fff', fontSize: 13, width: 220 }} />
              </div>
              {filteredMembers.length === 0 ? (
                <div className="empty-row">{search ? 'No members match that search.' : 'No members yet.'}</div>
              ) : (
                <table className="admin-tbl">
                  <thead><tr><th>Email</th><th>Username</th><th>Status</th><th>Level</th><th>Goal</th><th>Workouts</th><th>Videos</th><th>Joined</th><th>Action</th></tr></thead>
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
                            {isAdm ? <span style={{ color: 'var(--soft)', fontSize: 12 }}>Admin</span>
                              : isPrem ? <button className="tbl-btn danger" onClick={e => setSub(m.id, 'free', e.currentTarget)}>Revoke</button>
                              : <button className="tbl-btn" onClick={e => setSub(m.id, 'premium', e.currentTarget)}>Make Premium</button>}
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

        {/* Cancellations */}
        {tab === 'cancellations' && (
          <div className="admin-panel visible">
            {Object.keys(reasonCounts).length > 0 && (
              <div className="admin-section" style={{ marginBottom: 14 }}>
                <div className="admin-section-head"><h3>Cancellation Reasons</h3></div>
                <table className="admin-tbl">
                  <thead><tr><th>Reason</th><th>Count</th></tr></thead>
                  <tbody>
                    {Object.entries(reasonCounts).sort((a, b) => b[1] - a[1]).map(([reason, count]) => (
                      <tr key={reason}><td>{reason}</td><td>{count}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="admin-section">
              <div className="admin-section-head"><h3>Cancellation Log</h3></div>
              {cancellations.length === 0 ? <div className="empty-row">No cancellations yet.</div> : (
                <table className="admin-tbl">
                  <thead><tr><th>Date</th><th>Reason</th></tr></thead>
                  <tbody>
                    {cancellations.map((c, i) => (
                      <tr key={i}><td style={{ whiteSpace: 'nowrap' }}>{fmt(c.created_at)}</td><td>{c.reason || '—'}</td></tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Reminders */}
        {tab === 'reminders' && (
          <div className="admin-panel visible">
            <div className="admin-section">
              <div className="admin-section-head"><h3>Reminder Subscribers</h3></div>
              {members.filter(m => m.reminder_email_enabled || m.reminder_sms_enabled).length === 0 ? (
                <div className="empty-row">No reminder subscribers yet.</div>
              ) : (
                <table className="admin-tbl">
                  <thead><tr><th>Username</th><th>Email</th><th>Email Reminder</th><th>SMS Reminder</th><th>Phone Verified</th></tr></thead>
                  <tbody>
                    {members.filter(m => m.reminder_email_enabled || m.reminder_sms_enabled).map(m => (
                      <tr key={m.id}>
                        <td>{m.username}</td>
                        <td>{m.email}</td>
                        <td><span className={`badge ${m.reminder_email_enabled ? 'badge-premium' : 'badge-free'}`}>{m.reminder_email_enabled ? 'On' : 'Off'}</span></td>
                        <td><span className={`badge ${m.reminder_sms_enabled ? 'badge-premium' : 'badge-free'}`}>{m.reminder_sms_enabled ? 'On' : 'Off'}</span></td>
                        <td><span className={`badge ${m.phone_verified ? 'badge-premium' : 'badge-free'}`}>{m.phone_verified ? 'Yes' : 'No'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Blog */}
        {tab === 'blog' && (
          <div className="admin-panel visible">
            {editingPost !== null ? (
              <BlogEditor
                post={editingPost.id ? editingPost : null}
                onSave={() => { setEditingPost(null); loadPosts() }}
                onCancel={() => setEditingPost(null)}
              />
            ) : (
              <div className="admin-section">
                <div className="admin-section-head">
                  <h3>Blog Posts ({posts.length})</h3>
                  <button className="tbl-btn" onClick={() => setEditingPost({})}>+ New Post</button>
                </div>
                {postsLoading ? (
                  <div className="empty-row">Loading...</div>
                ) : posts.length === 0 ? (
                  <div className="empty-row">No posts yet. Create your first post.</div>
                ) : (
                  <table className="admin-tbl">
                    <thead><tr><th>Title</th><th>Slug</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                    <tbody>
                      {posts.map(p => (
                        <tr key={p.id}>
                          <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
                          <td style={{ fontSize: 12, color: 'var(--soft)' }}>{p.slug}</td>
                          <td>
                            <span className={`badge ${p.published ? 'badge-premium' : 'badge-free'}`}>
                              {p.published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>{fmt(p.created_at)}</td>
                          <td style={{ display: 'flex', gap: 8 }}>
                            <button className="tbl-btn" onClick={async () => {
                              const { data } = await supabase.from('blog_posts').select('*').eq('id', p.id).single()
                              setEditingPost(data)
                            }}>Edit</button>
                            <button className="tbl-btn" onClick={() => togglePublished(p)}>
                              {p.published ? 'Unpublish' : 'Publish'}
                            </button>
                            {deleteConfirm === p.id ? (
                              <>
                                <button className="tbl-btn danger" onClick={() => deletePost(p.id)}>Confirm</button>
                                <button className="tbl-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                              </>
                            ) : (
                              <button className="tbl-btn danger" onClick={() => setDeleteConfirm(p.id)}>Delete</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

      </div>
      <Footer />
    </PageTransition>
  )
}
