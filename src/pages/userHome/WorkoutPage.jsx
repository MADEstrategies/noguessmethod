import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import UserHomeLayout from './UserHomeLayout'

function VideoPlayer({ video, watched, onWatch }) {
  const [started, setStarted] = useState(false)

  function handlePlay() {
    setStarted(true)
    if (!watched) onWatch()
  }

  return (
    <div className="course-video-wrap">
      {!started ? (
        <div className="course-video-thumb" onClick={handlePlay}>
          <img
            src={`https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
            alt={video.title}
            className="course-video-thumb-img"
          />
          <div className="course-video-play">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
          {watched && (
            <div className="course-video-watched-badge">✓ Watched</div>
          )}
        </div>
      ) : (
        <iframe
          className="course-video-iframe"
          src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  )
}

function LockedVideo({ video }) {
  return (
    <div className="course-video-wrap">
      <div className="course-video-locked">
        <img
          src={`https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
          alt={video.title}
          className="course-video-thumb-img"
          style={{ filter: 'blur(4px) brightness(0.4)' }}
        />
        <div className="course-video-lock-msg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <p>Premium only</p>
          <Link to="/upgrade" className="btn primary" style={{ marginTop: 12 }}>Upgrade to Watch</Link>
        </div>
      </div>
    </div>
  )
}

export default function WorkoutPage() {
  const { id } = useParams()
  const { session } = useAuth()
  const navigate = useNavigate()

  const [workout,   setWorkout]   = useState(null)
  const [videos,    setVideos]    = useState([])
  const [watched,   setWatched]   = useState([])
  const [isPremium, setIsPremium] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      const { data: workoutData } = await supabase
        .from('workouts_content')
        .select('*')
        .eq('id', id)
        .single()

      if (!workoutData) { navigate('/workouts'); return }
      setWorkout(workoutData)

      const { data: videoData } = await supabase
        .from('workout_videos')
        .select('*')
        .eq('workout_id', id)
        .order('sort_order')

      setVideos(videoData ?? [])

      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription, role')
          .eq('id', session.user.id)
          .single()

        const premium = profile?.subscription === 'premium' ||
                        profile?.subscription === 'canceling' ||
                        profile?.role === 'admin'
        setIsPremium(premium)

        const { data: progressData } = await supabase
          .from('workout_video_progress')
          .select('video_id')
          .eq('user_id', session.user.id)
          .eq('workout_id', id)

        setWatched((progressData ?? []).map(r => r.video_id))
      }

      setLoading(false)
    }
    load()
  }, [id, session])

  async function handleWatch(videoId) {
    if (!session || !isPremium) return
    if (watched.includes(videoId)) return

    await supabase.from('workout_video_progress').insert({
      user_id:    session.user.id,
      video_id:   videoId,
      workout_id: id,
    })

    const newWatched = [...watched, videoId]
    setWatched(newWatched)

    const allWatched = videos.every(v => newWatched.includes(v.id))
    const status = allWatched ? 'completed' : 'inprogress'

    await supabase
      .from('user_workout_progress')
      .upsert({
        user_id:    session.user.id,
        workout_id: id,
        status,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,workout_id' })
  }

  if (loading) {
    return (
      <UserHomeLayout title="Workouts">
        <div className="uhome-empty"><p>Loading...</p></div>
      </UserHomeLayout>
    )
  }

  const activeVideo = videos[activeIdx]
  const progress = videos.length > 0 ? Math.round((watched.length / videos.length) * 100) : 0

  return (
    <UserHomeLayout title="Workouts">
      <div className="course-page">
        <Link to="/workouts" className="course-back">← Back to Workouts</Link>

        <div className="course-page-header">
          <h2 style={{ margin: 0 }}>{workout.title}</h2>
          <div className="course-page-meta">
            {isPremium && videos.length > 0 && (
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{progress}% complete</span>
            )}
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{videos.length} Videos</span>
          </div>
          {isPremium && videos.length > 0 && (
            <div className="course-progress-bar">
              <div className="course-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        {videos.length === 0 ? (
          <div className="uhome-empty">
            <p>No videos available yet. Check back soon.</p>
          </div>
        ) : (
          <div className="course-layout">
            <div className="course-sidebar">
              {videos.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  className={`course-lesson-btn${activeIdx === i ? ' active' : ''}${watched.includes(v.id) ? ' watched' : ''}`}
                  onClick={() => setActiveIdx(i)}
                >
                  <div className="course-lesson-num">
                    {watched.includes(v.id) ? (
                      <span className="course-lesson-check">✓</span>
                    ) : (
                      <span>{String(i + 1).padStart(2, '0')}</span>
                    )}
                  </div>
                  <span className="course-lesson-title">{v.title}</span>
                </button>
              ))}
            </div>

            <div className="course-main">
              {isPremium ? (
                <VideoPlayer
                  video={activeVideo}
                  watched={watched.includes(activeVideo.id)}
                  onWatch={() => handleWatch(activeVideo.id)}
                />
              ) : (
                <LockedVideo video={activeVideo} />
              )}

              <div className="course-content">
                <h3 className="course-content-title">{activeVideo.title}</h3>
                {activeVideo.notes && (
                  <div className="course-notes">
                    {activeVideo.notes.split('\n').map((line, i) => (
                      line.trim() === '' ? <br key={i} /> : <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </UserHomeLayout>
  )
}
