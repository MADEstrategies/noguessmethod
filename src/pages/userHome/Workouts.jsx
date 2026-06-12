import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import UserHomeLayout from './UserHomeLayout'

export default function Workouts() {
  const { session } = useAuth()
  const [workouts,  setWorkouts]  = useState([])
  const [progress,  setProgress]  = useState({}) // workout_id -> status
  const [loading,   setLoading]   = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('workouts_content')
        .select('*')
        .eq('published', true)
        .order('sort_order')

      setWorkouts(data ?? [])

      if (session) {
        const { data: prog } = await supabase
          .from('user_workout_progress')
          .select('workout_id, status')
          .eq('user_id', session.user.id)

        const map = {}
        ;(prog ?? []).forEach(p => { map[p.workout_id] = p.status })
        setProgress(map)
      }

      setLoading(false)
    }
    load()
  }, [session])

  return (
    <UserHomeLayout title="Workouts">
      {loading ? (
        <div className="uhome-empty"><p>Loading...</p></div>
      ) : (
        <div className="uhome-blog-grid">
          {workouts.map(w => {
            const status = progress[w.id]
            return (
              <div
                key={w.id}
                className="blog-card"
                style={{ '--bg-img': `url('${w.image_url ?? ''}')`, cursor: 'pointer' }}
                onClick={() => navigate(`/workouts/${w.id}`)}
              >
                <div className="blog-card-num">{w.num}</div>
                <div className="blog-card-body">
                  <h3 className="blog-card-title">{w.title}</h3>
                  {w.description && <p className="blog-card-desc">{w.description}</p>}
                  <div className="blog-card-footer">
                    {status === 'completed' && <span className="blog-card-tag" style={{ color: '#6dff8a', borderColor: 'rgba(109,255,138,.3)' }}>Completed</span>}
                    {status === 'inprogress' && <span className="blog-card-tag" style={{ color: '#ffc800', borderColor: 'rgba(255,200,0,.3)' }}>In Progress</span>}
                    {!status && <span className="blog-card-date">Not started</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </UserHomeLayout>
  )
}
