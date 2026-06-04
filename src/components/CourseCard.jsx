import { useState } from 'react'

const GRADIENTS = [
  'linear-gradient(135deg, rgba(255,255,255,.08) 0%, rgba(255,255,255,.02) 100%)',
  'linear-gradient(135deg, rgba(99,102,241,.15) 0%, rgba(99,102,241,.03) 100%)',
  'linear-gradient(135deg, rgba(236,72,153,.12) 0%, rgba(236,72,153,.02) 100%)',
  'linear-gradient(135deg, rgba(16,185,129,.12) 0%, rgba(16,185,129,.02) 100%)',
  'linear-gradient(135deg, rgba(245,158,11,.12) 0%, rgba(245,158,11,.02) 100%)',
]

export default function CourseCard({
  title = 'Working Out for Beginners',
  meta = '3 Videos · 40 min',
  tag = 'Premium',
  bgImg = null,
  gradientIndex = 0,
  save = false,
}) {
  const [saved, setSaved] = useState(save)

  const tagClass =
    tag === 'Premium'    ? 'course-tag premium' :
    tag === 'Completed'  ? 'course-tag completed' :
    tag === 'Inprogress' ? 'course-tag inprogress' :
    'course-tag free'

  const bgStyle = bgImg
    ? { backgroundImage: `url('${bgImg}')` }
    : { background: GRADIENTS[gradientIndex % GRADIENTS.length] }

  return (
    <div className="course-card">
      <div className="course-card-img" style={bgStyle}>
        {/* Decorative circle */}
        {!bgImg && (
          <div className="course-card-placeholder">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </div>
        )}
        <button
          className={`course-save-btn ${saved ? 'saved' : ''}`}
          onClick={() => setSaved(s => !s)}
          aria-label={saved ? 'Unsave' : 'Save'}
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? '#fff' : 'none'} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
