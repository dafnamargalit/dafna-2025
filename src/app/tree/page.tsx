'use client'

import Layout from '@/components/FlatSite/Layout'
import Link from 'next/link'
import retroFont from '@/components/RetroFont'
import { DafnaLogo } from '@/components/Icons'
import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { pageview, event } from '@/lib/gtag'
import AudioPlayer from '@/components/AudioPlayer'

// Google Analytics event tracking
const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  event({ action: eventName, params: eventParams })
}

function TreeContent() {
  const searchParams = useSearchParams()

  // Track page view and source
  useEffect(() => {
    const source = searchParams?.get('source') || 'direct'
    pageview(window.location.pathname + window.location.search)
    trackEvent('page_view', {
      page_title: 'Tree Page',
      source: source
    })
  }, [searchParams])

  const announcements = [
        {
      title: 'PRESAVE LUVRGIRL',
      link: 'https://ffm.to/luvrgirl',
      description: 'out july 1st'
    },
    {
      title: 'CHOOSE YOUR OWN ADVENTURE',
      link: 'https://dafna.music/quiz',
      description: 'which song are you???'
    },
    {
      title: 'NEW MERCH ALERT',
      link: 'https://shop.dafna.music',
      description: 'maybe we can twin'
    },
    {
      title: 'STREAM CONTROLLEDCHAOS',
      link: 'https://ffm.to/dafna-controlledchaos',
      description: 'out now'
    },
    {
      title:'visit full site',
      link: 'https://dafna.music',
      description: ''
    }
  ]

  return (
    <Layout>
      <div className={`relative z-10 overflow-x-auto overflow-y-auto snap-y snap-mandatory h-screen w-screen flex justify-center p-4 text-cyan-700 min-h-screen ${retroFont.className}`}>
        <div className="max-w-2xl w-full space-y-2 py-8 overflow-y-auto h-full">

          <Link href="/" className="flex justify-center mb-2">
            <DafnaLogo width={200} height={100} />
          </Link>

          <div className="h-8"></div>

          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <Link
                key={index}
                href={announcement.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('announcement_click', {
                  announcement_title: announcement.title,
                  announcement_index: index
                })}
                className="block p-4 sm:p-6 bg-cyan/40 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <h2 className="text-lg sm:text-2xl font-semibold text-cyan-500 mb-1 sm:mb-2">{announcement.title}</h2>
                <p className="text-sm sm:text-base text-yellow-300">{announcement.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default function TreePage() {
  return (
    <Suspense fallback={null}>
      <TreeContent />
    </Suspense>
  )
}
