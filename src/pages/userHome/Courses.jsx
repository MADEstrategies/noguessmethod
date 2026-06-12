import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import UserHomeLayout from './UserHomeLayout'
import CourseCard from '../../components/CourseCard'

export default function Courses() {
  const { session } = useAuth()
  const [courses,   setCourses]   = useState([])
  const [library,   setLibrary]   = useState([])
  const [isPremium, setIsPremium] = useState(false)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('published', true)
        .order('sort_order')

      setCourses(courseData ?? [])

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

        if (premium) {
          const { data: libData } = await supabase
            .from('user_library')
            .select('course_id')
            .eq('user_id', session.user.id)
          setLibrary((libData ?? []).map(r => r.course_id))
        }
      }

      setLoading(false)
    }
    load()
  }, [session])

  async function toggleSave(courseId) {
    if (!session || !isPremium) return
    const saved = library.includes(courseId)
    if (saved) {
      await supabase.from('user_library').delete()
        .eq('user_id', session.user.id).eq('course_id', courseId)
      setLibrary(l => l.filter(id => id !== courseId))
    } else {
      await supabase.from('user_library').insert({
        user_id: session.user.id, course_id: courseId, status: 'saved'
      })
      setLibrary(l => [...l, courseId])
    }
  }

  return (
    <UserHomeLayout title="Courses">

      {/* Paywall banner for free users */}
      {!isPremium && !loading && (
        <div className="courses-paywall-banner">
          <div className="courses-paywall-text">
            <strong>Premium unlocks all courses.</strong>
            <span>Upgrade to save, track, and access the full library.</span>
          </div>
          <Link to="/upgrade" className="btn primary">Upgrade — $19.99/mo</Link>
        </div>
      )}

      {loading ? (
        <div className="uhome-empty"><p>Loading...</p></div>
      ) : (
        <div className="uhome-grid">
          {courses.map((course, i) => (
            <CourseCard
              key={course.id}
              title={course.title}
              meta={`${course.video_count} Videos · ${course.duration_mins} min`}
              tag={course.tag}
              bgImg={course.thumbnail_url}
              gradientIndex={i}
              save={library.includes(course.id)}
              locked={!isPremium}
              onSave={() => toggleSave(course.id)}
            />
          ))}
        </div>
      )}
    </UserHomeLayout>
  )
}
