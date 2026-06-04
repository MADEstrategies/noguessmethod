import { useState } from 'react'

export default function CourseCard({
  title = 'Working Out for Beginners',
  meta = '3 Videos · 40 min',
  tag = 'Premium',
  bgImg = null,
  save = false,
}) {
  const [saved, setSaved] = useState(save)

  const tagClass =
    tag === 'Premium'    ? 'course-tag premium' :
    tag === 'Completed'  ? 'course-tag completed' :
    tag === 'Inprogress' ? 'course-tag inprogress' :
    'course-tag free'

  return (
    <div className="course-card">
      <div
        className="course-card-img"
        style={bgImg ? { backgroundImage: `url('${bgImg}')` } : {}}
      >
        <button
          className={`course-save-btn ${saved ? 'saved' : ''}`}
          onClick={() => setSaved(s => !s)}
          aria-label={saved ? 'Unsave' : 'Save'}
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? '#fff' : 'none'} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
      <div className="course-card-body">
        <p className="course-card-title">{title}</p>
        <p className="course-card-meta">{meta}</p>
        <span className={tagClass}>{tag}</span>
      </div>
    </div>
  )
}
