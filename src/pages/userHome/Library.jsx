import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import UserHomeLayout from './UserHomeLayout'
import CourseCard from '../../components/CourseCard'

export default function Library() {
  const { session } = useAuth()
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) return
    async function load() {
      const { data } = await supabase
        .from('user_library')
        .select('status, course_id, courses(*)')
        .eq('user_id', session.user.id)
        .order('saved_at', { ascending: false })
      setItems(data ?? [])
      setLoading(false)
    }
    load()
  }, [session])

  function getTag(status) {
    if (status === 'completed')  return 'Completed'
    if (status === 'inprogress') return 'In Progress'
    return 'Saved'
  }

  return (
    <UserHomeLayout title="Library">
      {loading ? (
        <div className="uhome-empty"><p>Loading...</p></div>
      ) : items.length === 0 ? (
        <div className="uhome-empty">
          <div className="uhome-empty-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <p>No saved courses yet. Browse Courses to get started.</p>
        </div>
      ) : (
        <div className="uhome-grid">
          {items.map((item, i) => (
            <CourseCard
              key={item.course_id}
              id={item.course_id}
              title={item.courses.title}
              meta={`${item.courses.video_count} Videos · ${item.courses.duration_mins} min`}
              tag={getTag(item.status)}
              bgImg={item.courses.thumbnail_url}
              gradientIndex={i}
              save={true}
            />
          ))}
        </div>
      )}
    </UserHomeLayout>
  )
}
