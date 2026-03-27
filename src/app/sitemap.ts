import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://proplr.ae'

  const staticPages = [
    '',
    '/foundation',
    '/impact',
    '/compass',
    '/showcase',
    '/summer-camp',
    '/pricing',
    '/about',
    '/blog',
    '/faq',
    '/partners',
    '/mentorship',
    '/careers',
    '/start-a-club',
    '/enroll',
    '/register',
    '/privacy',
    '/terms',
    '/cookies',
  ]

  return staticPages.map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' as const : 'monthly' as const,
    priority: path === '' ? 1 : path === '/enroll' ? 0.9 : 0.7,
  }))
}
