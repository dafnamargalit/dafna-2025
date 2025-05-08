// Google Analytics measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID

// Log page views
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID as string, {
      source: 'web',
      is_mobile: false,
      timestamp: new Date().toISOString()
    })
  }
}

// Log specific events
export const event = ({ action, params }: { action: string; params: any }) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, params)
  }
} 