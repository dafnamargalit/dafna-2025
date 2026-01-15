'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

/**
 * Track page views with Meta Pixel
 */
function PixelContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      ;(window as any).fbq('track', 'PageView', { path: url })
    }
  }, [pathname, searchParams])

  return null
}

/**
 * Load Meta Pixel globally and track page views
 */
export default function MetaPixel() {
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <>
      {/* Base Meta Pixel script */}
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '327530587927629');
            fbq('track', 'PageView');
          `,
        }}
      />
      {/* No-JS fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=327530587927629&ev=PageView&noscript=1"
        />
      </noscript>

      {/* Track route/page changes */}
      <Suspense fallback={null}>
        <PixelContent />
      </Suspense>
    </>
  )
}
