// Google Analytics measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID

// Log page views
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID as string, {
      page_path: url,
    })
  }
}

// Log specific events
export const event = ({ action, params }: { action: string; params: any }) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, params)
  }
} 