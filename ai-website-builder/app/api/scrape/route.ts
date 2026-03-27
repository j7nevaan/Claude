import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { url } = await request.json()

  if (!url) {
    return Response.json({ error: 'URL required' }, { status: 400 })
  }

  try {
    const targetUrl = url.startsWith('http') ? url : `https://${url}`
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WebsiteBuilder/1.0)' },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()
    const scraped = parseHtml(html, targetUrl)
    return Response.json({ success: true, data: scraped })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to scrape'
    return Response.json({ error: message }, { status: 422 })
  }
}

function parseHtml(html: string, url: string) {
  // Simple regex-based extraction (no DOM parser needed)
  const stripTags = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const extract = (pattern: RegExp) => {
    const m = html.match(pattern)
    return m ? stripTags(m[1] || m[0]) : ''
  }

  // Phone numbers
  const phoneMatch = html.match(/(?:tel:|phone|call)[:\s"]*([+\d\s().-]{7,20})/i) ||
    html.match(/(\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4})/)
  const phone = phoneMatch ? phoneMatch[1].trim() : ''

  // Email
  const emailMatch = html.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)
  const email = emailMatch ? emailMatch[1] : ''

  // Title / business name
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const title = titleMatch ? stripTags(titleMatch[1]).replace(/\|.*$/, '').trim() : ''

  // Meta description
  const metaMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)
  const description = metaMatch ? metaMatch[1] : ''

  // Services - look for nav items, h2/h3 headings
  const servicePatterns = [
    /class=["'][^"']*service[^"']*["'][^>]*>([^<]{3,50})</gi,
    /<li[^>]*>([^<]{5,50})<\/li>/gi,
    /<h[23][^>]*>([^<]{5,60})<\/h[23]>/gi,
  ]

  const serviceSet = new Set<string>()
  for (const pattern of servicePatterns) {
    let m: RegExpExecArray | null
    while ((m = pattern.exec(html)) !== null) {
      const text = stripTags(m[1]).trim()
      if (text.length > 3 && text.length < 60 && !/copyright|privacy|terms|home|about|contact|menu/i.test(text)) {
        serviceSet.add(text)
        if (serviceSet.size >= 10) break
      }
    }
  }

  // Address
  const addressMatch = html.match(/(\d+\s+[\w\s]+(?:St|Ave|Rd|Blvd|Dr|Ln|Way|Ct|Pl)[.,\s]+[\w\s]+,\s*[A-Z]{2}\s+\d{5})/i)
  const address = addressMatch ? addressMatch[1] : ''

  // About section
  const aboutMatch = html.match(/<section[^>]*about[^>]*>([\s\S]{100,1000}?)<\/section>/i) ||
    html.match(/<div[^>]*about[^>]*>([\s\S]{100,600}?)<\/div>/i)
  const about = aboutMatch ? stripTags(aboutMatch[1]).slice(0, 400) : description

  return {
    title,
    description: about,
    phone,
    email,
    address,
    services: Array.from(serviceSet).slice(0, 8),
    sourceUrl: url,
  }
}
