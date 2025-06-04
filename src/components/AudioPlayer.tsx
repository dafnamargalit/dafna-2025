import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface AudioPlayerProps {
  src: string
  title: string
  totalDuration?: number
  onPlay?: () => void
  onPause?: () => void
  onComplete?: () => void
  onSeek?: (time: number) => void
}

export default function AudioPlayer({
  src,
  title,
  totalDuration = 68,
  onPlay,
  onPause,
  onComplete,
  onSeek
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        onPause?.()
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      } else {
        audioRef.current.currentTime = 0
        setCurrentTime(0)
        audioRef.current.play()
        onPlay?.()
        timeoutRef.current = setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.pause()
            setIsPlaying(false)
            onComplete?.()
          }
        }, totalDuration * 1000)
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
    const newTime = Math.min(percentage * totalDuration, totalDuration)
    
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
    onSeek?.(newTime)
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
      if (audio.currentTime >= totalDuration) {
        audio.pause()
        setIsPlaying(false)
        setCurrentTime(0)
        onComplete?.()
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }

    audio.addEventListener('timeupdate', updateProgress)
    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
    }
  }, [totalDuration, onComplete])

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
    <div className="bg-cyan-300/20 backdrop-blur-sm rounded-xl border border-cyan-300/40 p-4 w-full max-w-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-cyan-300 text-lg">{title}</span>
        <button 
          onClick={togglePlay}
          className="text-cyan-300 hover:text-cyan-100 transition-colors"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>
      <audio 
        ref={audioRef}
        src={src}
        onEnded={() => {
          setIsPlaying(false)
          setCurrentTime(0)
          onComplete?.()
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
            width: `${(currentTime / totalDuration) * 100}%` 
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
          style={{ 
            left: `${(currentTime / totalDuration) * 100}%` 
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
  )
} 