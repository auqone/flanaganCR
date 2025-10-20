import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://example.com' // Update this to your actual domain

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/account/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
