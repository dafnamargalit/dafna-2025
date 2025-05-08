'use client'

import Layout from '@/components/FlatSite/Layout'
import Link from 'next/link'
import retroFont from '@/components/RetroFont'
import { DafnaLogo } from '@/components/Icons'
import { useEffect, useRef, useState, Suspense } from 'react'
import Image from 'next/image'
import Script from 'next/script'
import { useSearchParams } from 'next/navigation'

// Google Analytics event tracking
const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', eventName, eventParams)
  }
}

function TreeContent() {
  const searchParams = useSearchParams()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const TOTAL_DURATION = 30 // 30 seconds total duration

  // Track page view and source
  useEffect(() => {
    const source = searchParams.get('source') || 'direct'
    trackEvent('page_view', {
      page_title: 'Tree Page',
      source: source
    })
  }, [searchParams])

  const announcements = [
    {
      title: 'Dafna at Hotel Cafe on June 9th',
      link: 'https://www.hotelcafe.com/tickets/?s=events_view&id=14653',
      description: 'Playing my songs with a string quartet!'
    },
    {
      title: 'Stream "BADPEOPLEBADTHINGS"',
      link: 'https://apollodistro.lnk.to/Dafna-BPBT',
      description: 'Listen to my latest release'
    }
  ]

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        trackEvent('audio_pause', {
          current_time: audioRef.current.currentTime
        })
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      } else {
        audioRef.current.currentTime = 0
        setCurrentTime(0)
        audioRef.current.play()
        trackEvent('audio_play')
        timeoutRef.current = setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.pause()
            setIsPlaying(false)
            trackEvent('audio_complete')
          }
        }, TOTAL_DURATION * 1000)
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const percentage = x / rect.width
    const newTime = Math.min(percentage * TOTAL_DURATION, TOTAL_DURATION)
    
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
    trackEvent('audio_seek', {
      seek_time: newTime
    })
  }

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Update progress bar
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      setCurrentTime(audio.currentTime)
      if (audio.currentTime >= TOTAL_DURATION) {
        audio.pause()
        setIsPlaying(false)
        setCurrentTime(0)
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }

    audio.addEventListener('timeupdate', updateProgress)
    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
    }
  }, [])

  // Handle drag events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && progressBarRef.current) {
        handleSeek(e as unknown as React.MouseEvent<HTMLDivElement>)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && progressBarRef.current) {
        handleSeek(e as unknown as React.TouchEvent<HTMLDivElement>)
      }
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <Layout>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `,
        }}
      />

      <div className={`min-h-screen flex justify-center p-4 text-cyan-700 ${retroFont.className}`}>
        <div className="max-w-2xl w-full space-y-2">

          <div className="flex justify-center mb-2">
            <DafnaLogo width={200} height={100} />
          </div>

          <div className="h-8"></div>

          <div className="flex justify-center mb-24">
            <div className="bg-cyan-300/20 backdrop-blur-sm rounded-xl border border-cyan-300/40 p-4 w-full max-w-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-cyan-300 text-lg">BADPEOPLEBADTHINGS</span>
                <button 
                  onClick={togglePlay}
                  className="text-cyan-300 hover:text-cyan-100 transition-colors"
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
              </div>
              <audio 
                ref={audioRef}
                src="/audio/badpeoplebadthings.wav"
                onEnded={() => {
                  setIsPlaying(false)
                  setCurrentTime(0)
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                  }
                }}
                className="w-full"
              />
              <div 
                ref={progressBarRef}
                className="relative w-full h-1 bg-cyan-300/20 rounded-full overflow-visible cursor-pointer"
                onClick={handleSeek}
                onTouchStart={handleSeek}
              >
                <div 
                  className="absolute h-full bg-cyan-300 transition-all duration-100"
                  style={{ 
                    width: `${(currentTime / TOTAL_DURATION) * 100}%` 
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
                  style={{ 
                    left: `${(currentTime / TOTAL_DURATION) * 100}%` 
                  }}
                  onMouseDown={handleDragStart}
                  onTouchStart={handleDragStart}
                >
                  <Image
                    src="/favicon.ico"
                    alt="Scrubber"
                    width={16}
                    height={16}
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

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
    <Suspense fallback={<div>Loading...</div>}>
      <TreeContent />
    </Suspense>
  )
}
