import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { videos } from '@/lib/constants'
import { use3DInteraction } from '../hooks/use3DInteraction'
import { useThree, useFrame } from '@react-three/fiber'

interface FloatingTVProps {
  isMobile: boolean
}

export const FloatingTV: React.FC<FloatingTVProps> = ({ isMobile }) => {
  const { scene } = useGLTF('/models/old_tv_draco.glb')
  const { hover, handlePointerOver, handlePointerOut } = use3DInteraction(scene)
  const { camera } = useThree()
  const videoRefs = useRef<HTMLVideoElement[]>([])
  const videoTexturesRef = useRef<THREE.VideoTexture[]>([])
  const [videoTexturesLoaded, setVideoTexturesLoaded] = useState(false)
  const distanceToCamera = useRef(0)
  
  // Optimize model scale and position with memoization
  const modelProps = useMemo(() => {
    const scale = isMobile ? 0.011 : 0.012
    const position = isMobile ? [0, -8, -125] : [0, -8, -120]
    
    scene.scale.set(scale, scale, scale)
    
    return { position }
  }, [isMobile, scene])
  
  // Check distance to camera to enable/disable video playback
  useFrame(() => {
    if (!videoTexturesLoaded) return
    
    const tvPosition = new THREE.Vector3(modelProps.position[0], modelProps.position[1], modelProps.position[2])
    distanceToCamera.current = camera.position.distanceTo(tvPosition)
    
    // Only play videos when camera is close enough (performance optimization)
    const shouldPlay = distanceToCamera.current < 150
    
    videoRefs.current.forEach(video => {
      if (shouldPlay && video.paused) {
        video.play().catch(err => console.warn('Video play failed:', err))
      } else if (!shouldPlay && !video.paused) {
        video.pause()
      }
    })
  })
    
  // Set up videos for TV screens with optimized loading
  useEffect(() => {
    // Clean up old video references when component unmounts
    return () => {
      videoRefs.current.forEach(video => {
        video.pause()
        video.src = ''
        video.load()
      })
      
      videoTexturesRef.current.forEach(texture => {
        texture.dispose()
      })
    }
  }, [])
  
  // Initialize videos on first render
  useEffect(() => {
    let mounted = true
    let videosLoaded = 0
    const totalVideos = videos.length
    videoRefs.current = []
    videoTexturesRef.current = []
    
    // Create video elements for each screen
    videos.forEach((vid, i) => {
      const video = document.createElement('video')
      video.src = vid.src
      video.crossOrigin = 'Anonymous'
      video.loop = true
      video.muted = true
      video.playsInline = true
      video.preload = 'metadata' // Just load metadata first
      
      // Use lower quality for mobile
      if (isMobile) {
        video.width = 256
        video.height = 144
      }
      
      // Keep track of video elements
      videoRefs.current.push(video)
      
      // Handle video loaded event
      const handleCanPlay = () => {
        if (!mounted) return
        
        // Create optimized VideoTexture
        const videoTexture = new THREE.VideoTexture(video)
        videoTexture.minFilter = THREE.LinearFilter
        videoTexture.magFilter = THREE.LinearFilter
        videoTexture.format = THREE.RGBFormat
        videoTexture.flipY = false
        videoTexturesRef.current.push(videoTexture)
        
        // Find the mesh representing the TV screen
        const screenObj = scene.getObjectByName(vid.name)
        if (screenObj && screenObj instanceof THREE.Mesh) {
          // Use a simpler material with no specular or reflections
          screenObj.material = new THREE.MeshBasicMaterial({ 
            map: videoTexture,
            toneMapped: false
          })
        }
        
        // Count loaded videos
        videosLoaded++
        if (videosLoaded === totalVideos) {
          setVideoTexturesLoaded(true)
        }
      }
      
      // Type assertion for TypeScript
      (video as HTMLVideoElement).addEventListener('canplaythrough', handleCanPlay, { once: true })
      
      // Start loading
      video.load()
    })
    
    return () => {
      mounted = false
    }
  }, [scene, isMobile])

  // Optimize onClick handler with memoization
  const handleClick = useCallback(() => {
    window.open("https://www.youtube.com/@ThisIsDafna", "_blank", "noopener,noreferrer")
  }, [])

  return (
    <group>
      <primitive 
        object={scene} 
        position={modelProps.position}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
    </group>
  )
}