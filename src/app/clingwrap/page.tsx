'use client'

import { useEffect, Suspense } from 'react'
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

function ClingwrapContent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get the source from URL parameters
    const source = searchParams?.get('source') || 'direct'
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    // Track the event in Google Analytics
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'clingwrap_redirect', {
        source: source,
        is_mobile: isMobile,
        timestamp: new Date().toISOString()
      })
    }

    // Redirect to the ticket page
    window.location.href = 'https://on.soundcloud.com/DkUVsyrQL1p6Xkfrk1'
  }, [searchParams])

  return null
}

export default function Clingwrap() {
  return (
    <Suspense fallback={null}>
      <ClingwrapContent />
    </Suspense>
  )
}
