import UserHomeLayout from './UserHomeLayout'
import CourseCard from '../../components/CourseCard'

const COURSES = [
  { title: 'Strength Foundations',      meta: '6 Videos · 55 min', tag: 'Premium',    gradientIndex: 0 },
  { title: 'Fat Loss Blueprint',         meta: '4 Videos · 40 min', tag: 'Free',       gradientIndex: 1 },
  { title: 'Hypertrophy Masterclass',    meta: '8 Videos · 70 min', tag: 'Premium',    gradientIndex: 2 },
  { title: 'Mobility for Lifters',       meta: '3 Videos · 30 min', tag: 'Free',       gradientIndex: 3 },
  { title: 'Nutrition Fundamentals',     meta: '5 Videos · 45 min', tag: 'Free',       gradientIndex: 4 },
  { title: 'Progressive Overload Guide', meta: '4 Videos · 35 min', tag: 'Premium',    gradientIndex: 1 },
  { title: 'Recovery & Sleep Protocol',  meta: '3 Videos · 25 min', tag: 'Free',       gradientIndex: 2 },
]

export default function Courses() {
  return (
    <UserHomeLayout title="Courses">
      <div className="uhome-grid">
        {COURSES.map((course, i) => (
          <CourseCard key={i} {...course} />
        ))}
      </div>
    </UserHomeLayout>
  )
}
