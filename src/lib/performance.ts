export const performanceHeaders = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
  'CDN-Cache-Control': 'public, s-maxage=3600',
  'Vary': 'Accept-Encoding',
}

export const apiCacheHeaders = {
  'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
}

export function setCacheHeaders(response: Response, headers: Record<string, string> = apiCacheHeaders) {
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

export function createOptimizedResponse(data: any, headers: Record<string, string> = apiCacheHeaders) {
  const response = new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
  return response
}