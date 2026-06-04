import UserHomeLayout from './UserHomeLayout'
import CourseCard from '../../components/CourseCard'

const LIBRARY = [
  { title: 'Strength Foundations',   meta: '6 Videos · 55 min', tag: 'Completed',  gradientIndex: 0 },
  { title: 'Fat Loss Blueprint',      meta: '4 Videos · 40 min', tag: 'Inprogress', gradientIndex: 1 },
  { title: 'Mobility for Lifters',    meta: '3 Videos · 30 min', tag: 'Inprogress', gradientIndex: 3 },
  { title: 'Nutrition Fundamentals',  meta: '5 Videos · 45 min', tag: 'Inprogress', gradientIndex: 4 },
  { title: 'Recovery & Sleep Protocol', meta: '3 Videos · 25 min', tag: 'Inprogress', gradientIndex: 2 },
]

export default function Library() {
  return (
    <UserHomeLayout title="Library">
      <div className="uhome-grid">
        {LIBRARY.map((item, i) => (
          <CourseCard key={i} {...item} />
        ))}
      </div>
    </UserHomeLayout>
  )
}
