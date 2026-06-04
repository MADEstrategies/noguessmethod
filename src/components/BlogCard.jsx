export default function BlogCard({
  num = '01',
  title = 'Chest',
  description = '',
  date = 'In Progress',
  bgImg = '',
  href = '',
  tags = [],
}) {
  return (
    <a
      className="blog-card"
      href={href || undefined}
      style={{ '--bg-img': `url('${bgImg}')` }}
    >
      <div className="blog-card-num">{num}</div>
      <div className="blog-card-body">
        <h3 className="blog-card-title">{title}</h3>
        {description && <p className="blog-card-desc">{description}</p>}
        <div className="blog-card-footer">
          <span className="blog-card-date">{date}</span>
          {tags.map(tag => (
            <span key={tag} className="blog-card-tag">{tag}</span>
          ))}
        </div>
      </div>
    </a>
  )
}
