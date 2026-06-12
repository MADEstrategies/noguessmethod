import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GRADIENTS = [
  'linear-gradient(135deg, rgba(255,255,255,.08) 0%, rgba(255,255,255,.02) 100%)',
  'linear-gradient(135deg, rgba(99,102,241,.15) 0%, rgba(99,102,241,.03) 100%)',
  'linear-gradient(135deg, rgba(236,72,153,.12) 0%, rgba(236,72,153,.02) 100%)',
  'linear-gradient(135deg, rgba(16,185,129,.12) 0%, rgba(16,185,129,.02) 100%)',
  'linear-gradient(135deg, rgba(245,158,11,.12) 0%, rgba(245,158,11,.02) 100%)',
]

export default function CourseCard({
  id = null,
  title = 'Course Title',
  meta = '0 Videos · 0 min',
  tag = 'Free',
  bgImg = null,
  gradientIndex = 0,
  save = false,
  locked = false,
  onSave = null,
}) {
  const [saved, setSaved] = useState(save)
  const navigate = useNavigate()

  const tagClass =
    tag === 'Premium'    ? 'course-tag premium' :
    tag === 'Completed'  ? 'course-tag completed' :
    tag === 'Inprogress' ? 'course-tag inprogress' :
    tag === 'Saved'      ? 'course-tag inprogress' :
    'course-tag free'

  const bgStyle = bgImg
    ? { backgroundImage: `url('${bgImg}')` }
    : { background: GRADIENTS[gradientIndex % GRADIENTS.length] }

  function handleSave(e) {
    e.stopPropagation()
    if (locked) return
    setSaved(s => !s)
    if (onSave) onSave()
  }

  function handleClick() {
    if (id) navigate(`/courses/${id}`)
  }

  return (
    <div
      className={`course-card${locked ? ' locked' : ''}${id ? ' clickable' : ''}`}
      onClick={handleClick}
      style={id ? { cursor: 'pointer' } : {}}
    >
      <div className="course-card-img" style={bgStyle}>
        {!bgImg && (
          <div className="course-card-placeholder">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </div>
        )}

        {locked && (
          <div className="course-lock-overlay">
            <div className="course-lock-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          </div>
        )}

        {!locked && (
          <button
            className={`course-save-btn ${saved ? 'saved' : ''}`}
            onClick={handleSave}
            aria-label={saved ? 'Unsave' : 'Save'}
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? '#fff' : 'none'} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        )}
      </div>

      <div className="course-card-body">
        <p className="course-card-title">{title}</p>
        <p className="course-card-meta">{meta}</p>
        <span className={tagClass}>{tag}</span>
      </div>
    </div>
  )
}
