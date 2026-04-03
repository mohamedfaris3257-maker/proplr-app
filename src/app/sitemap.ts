import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://proplr.ae'

  const pages: {
    path: string
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
    priority: number
  }[] = [
    // Core / high-traffic
    { path: '',              changeFrequency: 'weekly',  priority: 1.0 },
    { path: '/foundation',   changeFrequency: 'monthly', priority: 0.8 },
    { path: '/impact',       changeFrequency: 'monthly', priority: 0.8 },
    { path: '/summer-camp',  changeFrequency: 'weekly',  priority: 0.9 },
    { path: '/compass',      changeFrequency: 'monthly', priority: 0.8 },
    { path: '/showcase',     changeFrequency: 'weekly',  priority: 0.8 },

    // Product / conversion
    { path: '/pricing',      changeFrequency: 'monthly', priority: 0.8 },
    { path: '/about',        changeFrequency: 'monthly', priority: 0.7 },
    { path: '/blog',         changeFrequency: 'weekly',  priority: 0.8 },
    { path: '/partners',     changeFrequency: 'monthly', priority: 0.7 },
    { path: '/mentorship',   changeFrequency: 'monthly', priority: 0.7 },
    { path: '/faq',          changeFrequency: 'monthly', priority: 0.6 },
    { path: '/careers',      changeFrequency: 'weekly',  priority: 0.6 },
    { path: '/start-a-club', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/shop',         changeFrequency: 'weekly',  priority: 0.7 },

    // Auth / onboarding
    { path: '/login',        changeFrequency: 'yearly',  priority: 0.4 },
    { path: '/register',     changeFrequency: 'yearly',  priority: 0.5 },
    { path: '/enroll',       changeFrequency: 'monthly', priority: 0.9 },

    // Legal
    { path: '/privacy',      changeFrequency: 'yearly',  priority: 0.3 },
    { path: '/terms',        changeFrequency: 'yearly',  priority: 0.3 },
    { path: '/cookies',      changeFrequency: 'yearly',  priority: 0.3 },
  ]

  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
