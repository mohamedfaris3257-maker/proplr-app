import pexelsImages from './pexels-images.json'

type PexelsImage = {
  url: string
  large: string
  medium: string
  photographer: string
  pexelsUrl: string
  width: number
  height: number
  alt: string
}

const px = pexelsImages as Record<string, PexelsImage>

export const images = {
  hero: px.hero?.large || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80',
  mentorship: px.mentorship?.large || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
  presentation: px.presentation?.large || 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
  university: px.university?.large || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
  foundation: px.foundation?.large || 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
  dubaiOffice: px['dubai-office']?.large || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
  workshop: px.workshop?.large || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
  certificate: px.certificate?.large || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
  summerCamp: px['summer-camp']?.large || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80',
  showcase: px.showcase?.large || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
  entrepreneurship: px.entrepreneurship?.large || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
  partners: px.partners?.large || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
}

// Attribution helper - Pexels requires attribution
export const imageAttribution = Object.entries(pexelsImages).reduce((acc, [key, img]) => {
  const image = img as PexelsImage
  acc[key] = { photographer: image.photographer, url: image.pexelsUrl }
  return acc
}, {} as Record<string, { photographer: string; url: string }>)
