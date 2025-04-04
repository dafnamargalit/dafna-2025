import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { aboutVideos } from '@/lib/constants'
import { useThree, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

interface ComputerProps {
  isMobile: boolean,
  showing: boolean
}

export const Computer: React.FC<ComputerProps> = ({ isMobile, showing }) => {
  // 1. All hooks that don't depend on other hooks
  const { scene } = useGLTF('/models/tvandcomputer.glb')
  const { camera } = useThree()
  const videoRefs = useRef<HTMLVideoElement[]>([])
  const videoTexturesRef = useRef<THREE.VideoTexture[]>([])
  const [videoTexturesLoaded, setVideoTexturesLoaded] = useState(false)
  const distanceToCamera = useRef(0)
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const typingSpeed = 30 // milliseconds per character
  const fullText = `Hi, I'm Dafna! I'm a software engineer and musician based in Los Angeles. I make indie pop music and write code. This website is one of my experiments– keep scrolling to explore!`
  
  // 2. Memoized values
  const modelProps = useMemo(() => {
    const scale = 2.5
    const position = isMobile ? [0, -6, -320] : [-3.5, -6, -320]
    
    scene.scale.set(scale, scale, scale)
    
    return { position }
  }, [scene])
  
  // Typewriter effect
  useEffect(() => {
    if (!isTyping) return

    const timer = setTimeout(() => {
      if (displayText.length < fullText.length) {
        fullText[displayText.length - 1] === '.' ? setTimeout(() => setDisplayText(fullText.slice(0, displayText.length + 1)), 500) : setDisplayText(fullText.slice(0, displayText.length + 1))
      } else {
        setIsTyping(false)
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [displayText, isTyping])

  useEffect(() => {
    if(showing) {
      setIsTyping(true)
    } else {
      setDisplayText('')
      setIsTyping(false)
    }
  }, [showing])
  
  // 3. Frame updates
  useFrame(() => {
    if (!videoTexturesLoaded) return
    
    const tvPosition = new THREE.Vector3(modelProps.position[0], modelProps.position[1], modelProps.position[2])
    distanceToCamera.current = camera.position.distanceTo(tvPosition)
    
    const shouldPlay = distanceToCamera.current < 300
    
    videoRefs.current.forEach(video => {
      if (shouldPlay && video.paused) {
        video.play().catch(err => console.warn('Video play failed:', err))
      } else if (!shouldPlay && !video.paused) {
        video.pause()
      }
    })
  })
  
  // 4. Cleanup effect
  useEffect(() => {
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
  
  // 5. Video initialization effect
  useEffect(() => {
    let mounted = true
    let videosLoaded = 0
    const totalVideos = aboutVideos.length
    videoRefs.current = []
    videoTexturesRef.current = []
    
    aboutVideos.forEach((vid, i) => {
      const video = document.createElement('video')
      video.src = vid.src
      video.crossOrigin = 'Anonymous'
      video.loop = true
      video.muted = true
      video.playsInline = true
      video.preload = 'auto'
      video.autoplay = true
      
      video.addEventListener('error', (e) => {
        const videoError = video.error;
        console.error('Video error:', {
          code: videoError?.code,
          message: videoError?.message,
          src: vid.src,
          networkState: video.networkState,
          readyState: video.readyState
        });
      });
      
      video.addEventListener('loadstart', () => {
        console.log('Video load started:', vid.src);
      });
      
      video.addEventListener('loadedmetadata', () => {
        console.log('Video metadata loaded:', vid.src);
      });
      
      if (isMobile) {
        video.width = 256
        video.height = 144
      }
      
      videoRefs.current.push(video)
      
      const handleCanPlay = () => {
        if (!mounted) return
        
        try {
          const videoTexture = new THREE.VideoTexture(video)
          videoTexture.minFilter = THREE.LinearFilter
          videoTexture.magFilter = THREE.LinearFilter
          videoTexture.format = THREE.RGBFormat
          videoTexture.flipY = true
          videoTexturesRef.current.push(videoTexture)
          
          const screenObj = scene.getObjectByName(vid.name)
          if (screenObj && screenObj instanceof THREE.Mesh) {
            screenObj.material = new THREE.MeshBasicMaterial({ 
              map: videoTexture,
              toneMapped: false,
              side: THREE.FrontSide
            })
            
            if (screenObj.geometry) {
              const geometry = screenObj.geometry.clone()
              
              const uvAttribute = geometry.attributes.uv
              if (uvAttribute) {
                for (let i = 0; i < uvAttribute.count; i++) {
                  const u = uvAttribute.getX(i)
                  const v = uvAttribute.getY(i)
                  
                  uvAttribute.setXY(i, v, 1 - u)
                }
                uvAttribute.needsUpdate = true
              }
              
              screenObj.geometry = geometry
            }
          }
          
          videosLoaded++
          if (videosLoaded === totalVideos) {
            setVideoTexturesLoaded(true)
          }
        } catch (error) {
          console.error('Error creating video texture:', error);
        }
      }
      
      video.addEventListener('canplaythrough', handleCanPlay, { once: true })
      video.load()
    })
    
    return () => {
      mounted = false
    }
  }, [scene, isMobile])

  return (
    <group>
      <primitive 
        object={scene} 
        position={modelProps.position}
      />
      {showing && <Html
        position={isMobile ? [0, 5, -320] : [4.5, 0.5, -320]}
        center
        style={{
          color: '#ffeb3b',
          fontSize: isMobile ? '0.8rem' : '1.2rem',
          fontWeight: 'bold',
          textShadow: '0 0 10px #ffeb3b',
          fontFamily: 'var(--font-retrotech), system-ui, sans-serif',
          pointerEvents: 'none',
          userSelect: 'none',
          width: isMobile ? '250px' : '300px',
          textAlign: isMobile ? 'center' : 'left',
          lineHeight: '1.4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <div>
          {displayText}
        </div>
      </Html>}
    </group>
  )
}