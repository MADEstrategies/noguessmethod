import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import UserHomeLayout from './UserHomeLayout'

export default function Workouts() {
  const { session } = useAuth()
  const [workouts,      setWorkouts]      = useState([])
  const [progress,      setProgress]      = useState({})
  const [fitnessLevel,  setFitnessLevel]  = useState('Intermediate')
  const [loading,       setLoading]       = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      let level = 'Intermediate'

      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('fitness_level')
          .eq('id', session.user.id)
          .single()

        if (profile?.fitness_level) level = profile.fitness_level
        setFitnessLevel(level)
      }

      // Fetch workouts matching user's level, fallback to Intermediate
      const { data } = await supabase
        .from('workouts_content')
        .select('*')
        .eq('published', true)
        .eq('fitness_level', level)
        .order('sort_order')

      // If no workouts for their level, fall back to Intermediate
      if (!data || data.length === 0) {
        const { data: fallback } = await supabase
          .from('workouts_content')
          .select('*')
          .eq('published', true)
          .eq('fitness_level', 'Intermediate')
          .order('sort_order')
        setWorkouts(fallback ?? [])
      } else {
        setWorkouts(data)
      }

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
        <>
          {workouts.length === 0 ? (
            <div className="uhome-empty">
              <p>No workouts available for your level yet. Check back soon.</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--soft)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                  Showing {fitnessLevel} workouts
                </span>
              </div>
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
            </>
          )}
        </>
      )}
    </UserHomeLayout>
  )
}
