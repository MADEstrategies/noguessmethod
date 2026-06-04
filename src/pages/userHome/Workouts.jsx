import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import UserHomeLayout from './UserHomeLayout'
import BlogCard from '../../components/BlogCard'

export default function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    supabase
      .from('workouts_content')
      .select('*')
      .eq('published', true)
      .order('sort_order')
      .then(({ data }) => {
        setWorkouts(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <UserHomeLayout title="Workouts">
      {loading ? (
        <div className="uhome-empty"><p>Loading...</p></div>
      ) : (
        <div className="uhome-blog-grid">
          {workouts.map(w => (
            <BlogCard
              key={w.id}
              title={w.title}
              num={w.num}
              description={w.description ?? ''}
              date="In Progress"
              bgImg={w.image_url ?? ''}
            />
          ))}
        </div>
      )}
    </UserHomeLayout>
  )
}
