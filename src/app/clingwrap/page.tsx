'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { pageview, event } from '@/lib/gtag'
import { DafnaLogo } from '@/components/Icons'
import Layout from '@/components/FlatSite/Layout'
import retroFont from '@/components/RetroFont'
import Link from 'next/link'
import Image from 'next/image'
import AudioPlayer from '@/components/AudioPlayer'

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

const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  event({ action: eventName, params: eventParams })
}

function ClingwrapContent() {
  return <Layout>
      <div className={`flex justify-center p-4 text-cyan-700 min-h-screen ${retroFont.className}`}>
        <div className="max-w-2xl w-full space-y-2 py-8 overflow-y-auto h-full">

          <Link href="/" className="flex justify-center mb-2">
            <DafnaLogo width={200} height={100} />
          </Link>

          <div className="flex justify-center mb-8">
            <Image
              src="/images/CLINGWRAP.jpg"
              alt="CLINGWRAP Cover"
              width={400}
              height={400}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>

          <div className="flex justify-center mb-12">
            <AudioPlayer
              src="/audio/clingwrapsnippet.mp3"
              title="CLINGWRAP - PREVIEW"
              onPlay={() => trackEvent('audio_play')}
              onPause={() => trackEvent('audio_pause')}
              onComplete={() => trackEvent('audio_complete')}
              onSeek={(time) => trackEvent('audio_seek', { seek_time: time })}
            />
          </div>

          <div className="flex justify-center mb-8">
            <Link
              href="https://apollodistro.lnk.to/Dafna-CLINGWRAP"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('presave_click', {
                button_location: 'below_cover'
              })}
              className="px-16 py-3 bg-cyan-400 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              PRESAVE NOW – OUT JULY 11TH
            </Link>
          </div>
          </div>
      </div>
    </Layout>
}

export default function Clingwrap() {
  return (
    <Suspense fallback={null}>
      <ClingwrapContent />
    </Suspense>
  )
}
