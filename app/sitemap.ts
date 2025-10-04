import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sellery.com' // Update this to your actual domain

  // Static pages
  const staticPages = [
    '',
    '/cart',
    '/checkout',
    '/account',
    '/about',
    '/contact',
    '/shipping',
    '/returns',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Product pages
  const productIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  const productPages = productIds.map((id) => ({
    url: `${baseUrl}/product/${id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...productPages]
}
