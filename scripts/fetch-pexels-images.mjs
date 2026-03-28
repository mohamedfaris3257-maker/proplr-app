import { writeFileSync } from 'fs'

const API_KEY = process.env.PEXELS_API_KEY

if (!API_KEY) {
  console.error('PEXELS_API_KEY not set in environment')
  process.exit(1)
}

const searches = [
  { query: 'students collaboration UAE', filename: 'hero', orientation: 'landscape' },
  { query: 'student mentorship professional', filename: 'mentorship', orientation: 'landscape' },
  { query: 'young professional presentation', filename: 'presentation', orientation: 'landscape' },
  { query: 'university students studying', filename: 'university', orientation: 'landscape' },
  { query: 'high school students teamwork', filename: 'foundation', orientation: 'landscape' },
  { query: 'Dubai modern office business', filename: 'dubai-office', orientation: 'landscape' },
  { query: 'career workshop team', filename: 'workshop', orientation: 'landscape' },
  { query: 'student award certificate', filename: 'certificate', orientation: 'landscape' },
  { query: 'summer camp youth activities', filename: 'summer-camp', orientation: 'landscape' },
  { query: 'conference stage speaker audience', filename: 'showcase', orientation: 'landscape' },
  { query: 'student entrepreneur startup pitch', filename: 'entrepreneurship', orientation: 'landscape' },
  { query: 'business partners meeting', filename: 'partners', orientation: 'landscape' },
]

async function fetchBestImage(query, orientation) {
  const params = new URLSearchParams({
    query,
    per_page: '5',
    orientation,
    size: 'large',
  })

  const res = await fetch(`https://api.pexels.com/v1/search?${params}`, {
    headers: { Authorization: API_KEY }
  })

  if (!res.ok) {
    console.error(`API error ${res.status}: ${await res.text()}`)
    return null
  }

  const data = await res.json()
  const photo = data.photos?.[0]
  if (!photo) return null

  return {
    url: photo.src.original,
    large: photo.src.large2x,
    medium: photo.src.large,
    photographer: photo.photographer,
    pexelsUrl: photo.url,
    width: photo.width,
    height: photo.height,
    alt: photo.alt || query,
  }
}

const results = {}
for (const { query, filename, orientation } of searches) {
  console.log(`Fetching: ${query}...`)
  const image = await fetchBestImage(query, orientation)
  if (image) {
    results[filename] = image
    console.log(`  ✓ ${filename}: ${image.large.substring(0, 80)}...`)
  } else {
    console.log(`  ✗ ${filename}: no results`)
  }
  await new Promise(r => setTimeout(r, 250))
}

console.log('\n=== RESULTS ===')
console.log(`Found ${Object.keys(results).length} / ${searches.length} images\n`)

writeFileSync('src/lib/pexels-images.json', JSON.stringify(results, null, 2))
console.log('Saved to src/lib/pexels-images.json')
