import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function fmt(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

// Simple markdown-like renderer
function renderContent(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      return <h2 key={i} className="blog-content-h2">{line.slice(3)}</h2>
    }
    if (line.startsWith('# ')) {
      return <h1 key={i} className="blog-content-h1">{line.slice(2)}</h1>
    }
    if (line.trim() === '') {
      return <br key={i} />
    }
    // Handle **bold**
    const parts = line.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} className="blog-content-p">
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j}>{part.slice(2, -2)}</strong>
          }
          return part
        })}
      </p>
    )
  })
}

// Count words and split at ~300 words
function splitContent(content) {
  const paragraphs = content.split('\n')
  let wordCount = 0
  let splitIndex = paragraphs.length

  for (let i = 0; i < paragraphs.length; i++) {
    wordCount += paragraphs[i].split(' ').length
    if (wordCount >= 300) {
      splitIndex = i + 1
      break
    }
  }

  return {
    preview: paragraphs.slice(0, splitIndex).join('\n'),
    rest:    paragraphs.slice(splitIndex).join('\n'),
  }
}

export default function BlogPost() {
  const { slug }    = useParams()
  const { session } = useAuth()
  const [post,    setPost]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(({ data }) => {
        if (!data) { setNotFound(true); setLoading(false); return }
        setPost(data)
        setLoading(false)
      })
  }, [slug])

  if (loading) return (
    <PageTransition><Header />
      <main className="wrap"><p className="blog-loading">Loading...</p></main>
    <Footer /></PageTransition>
  )

  if (notFound) return (
    <PageTransition><Header />
      <main className="wrap">
        <div className="blog-hero">
          <h1>Post not found.</h1>
          <Link to="/blog" className="btn" style={{ marginTop: 20, display: 'inline-flex' }}>← Back to Blog</Link>
        </div>
      </main>
    <Footer /></PageTransition>
  )

  const { preview, rest } = splitContent(post.content)
  const hasMore = rest.trim().length > 0

  return (
    <PageTransition>
      <Header />
      <main className="wrap">
        <div className="blog-post-wrap">

          <Link to="/blog" className="blog-back">← Back to Blog</Link>

          <div className="blog-post-header">
            <div className="blog-post-tags">
              {(post.tags ?? []).map(tag => (
                <span key={tag} className="blog-post-tag">{tag}</span>
              ))}
            </div>
            <h1 className="blog-post-headline">{post.title}</h1>
            <p className="blog-post-meta-date">{fmt(post.created_at)}</p>
          </div>

          <div className="blog-content">
            {renderContent(preview)}
          </div>

          {hasMore && !session && (
            <>
              <div className="blog-blur-wrap">
                <div className="blog-blur-content">
                  {renderContent(rest.slice(0, 400))}
                </div>
                <div className="blog-blur-overlay" />
              </div>
              <div className="blog-paywall">
                <h2>Continue Reading.</h2>
                <p>Create a free NoGuessMethod account to read the full article and access your daily structured workout.</p>
                <div className="actions" style={{ justifyContent: 'center', marginTop: 24 }}>
                  <Link to="/signup" className="btn primary">Create Free Account</Link>
                  <Link to="/login" className="btn">Login</Link>
                </div>
              </div>
            </>
          )}

          {hasMore && session && (
            <div className="blog-content">
              {renderContent(rest)}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </PageTransition>
  )
}
