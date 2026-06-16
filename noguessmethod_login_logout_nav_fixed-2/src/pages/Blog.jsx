import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import { supabase } from '../lib/supabase'

function fmt(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function Blog() {
  const [posts,   setPosts]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, tags, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <PageTransition>
      <Header />
      <main className="wrap">
        <div className="blog-hero">
          <h1>The NGM Blog.</h1>
          <p className="lead">Training insights for intermediate lifters. No fluff, no motivation content — just what actually works.</p>
        </div>

        {loading ? (
          <div className="blog-loading">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="blog-empty">No posts yet. Check back soon.</div>
        ) : (
          <div className="blog-grid">
            {posts.map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="blog-post-card">
                <div className="blog-post-card-body">
                  <div className="blog-post-tags">
                    {(post.tags ?? []).map(tag => (
                      <span key={tag} className="blog-post-tag">{tag}</span>
                    ))}
                  </div>
                  <h2 className="blog-post-title">{post.title}</h2>
                  <p className="blog-post-excerpt">{post.excerpt}</p>
                </div>
                <div className="blog-post-footer">
                  <span className="blog-post-date">{fmt(post.created_at)}</span>
                  <span className="blog-post-read">Read →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </PageTransition>
  )
}
