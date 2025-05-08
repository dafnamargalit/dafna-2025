'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// Add type declaration for gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params: {
        source: string
        is_mobile: boolean
        timestamp: string
      }
    ) => void
  }
}

export default function Tickets() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get the source from URL parameters
    const source = searchParams.get('source') || 'direct'
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    // Track the event in Google Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'ticket_redirect', {
        source: source,
        is_mobile: isMobile,
        timestamp: new Date().toISOString()
      })
    }

    // Redirect to the ticket page
    window.location.href = 'https://www.hotelcafe.com/tickets/?s=events_view&id=14653'
  }, [searchParams])

  return null
}
