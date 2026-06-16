import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export default async (request, context) => {
  const url = new URL(request.url)
  const slug = url.pathname.replace('/blog/', '').replace(/\/$/, '')

  if (!slug || slug === 'blog') {
    return context.next()
  }

  try {
    const supabase = createClient(
      Deno.env.get('VITE_SUPABASE_URL'),
      Deno.env.get('VITE_SUPABASE_ANON_KEY')
    )

    const { data: post } = await supabase
      .from('blog_posts')
      .select('title, excerpt, slug, created_at, tags')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (!post) return context.next()

    // Get the original response (the React app HTML)
    const response = await context.next()
    const html = await response.text()

    const title = `${post.title} — NoGuessMethod`
    const description = post.excerpt
    const canonical = `https://noguessmethod.com/blog/${post.slug}`
    const image = 'https://noguessmethod.com/assets/ngm-logo-square.jpeg'

    const structuredData = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.created_at,
      author: { '@type': 'Organization', name: 'NoGuessMethod', url: 'https://noguessmethod.com' },
      publisher: {
        '@type': 'Organization',
        name: 'NoGuessMethod',
        url: 'https://noguessmethod.com',
        logo: { '@type': 'ImageObject', url: image },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      keywords: (post.tags ?? []).join(', '),
    })

    const metaTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:image" content="${image}" />
    <meta property="og:site_name" content="NoGuessMethod" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="canonical" href="${canonical}" />
    <script type="application/ld+json">${structuredData}</script>`

    // Replace the default title and inject meta tags
    const updatedHtml = html
      .replace(
        /<title>.*?<\/title>/,
        `<title>${title}</title>`
      )
      .replace(
        '</head>',
        `${metaTags}\n</head>`
      )

    return new Response(updatedHtml, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        'content-type': 'text/html; charset=utf-8',
      },
    })
  } catch (err) {
    console.error('blog-meta edge function error:', err)
    return context.next()
  }
}

export const config = {
  path: '/blog/*',
}
