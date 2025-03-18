import React, { useCallback, useEffect, useState } from 'react'
import { Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { videos } from '@/lib/constants'

interface FloatingTVProps {
  isMobile: boolean
}

export const FloatingTV: React.FC<FloatingTVProps> = ({ isMobile }) =>{
  const { scene } = useGLTF('/models/old_tv_draco.glb')
  const [hover, setHover] = useState(false)

  // Update emissive effect on hover
  const setEmissive = (object: THREE.Object3D, highlight: boolean) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material && 'emissive' in child.material) {
        if (highlight) {
          child.material.emissive = new THREE.Color('#67E8F9')
          child.material.emissiveIntensity = 0.3
        } else {
          child.material.emissive = new THREE.Color('black')
          child.material.emissiveIntensity = 0
        }
      }
    })
  }

  // Update cursor and emissive effect on hover change
  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'auto'
    setEmissive(scene, hover)
  }, [hover, scene])

  const handlePointerOver = useCallback(() => setHover(true), []);
  const handlePointerOut = useCallback(() => setHover(false), []);

  // Setup video texture on the TV screen
  useEffect(() => {
    // Create a video element with your provided URL
    videos.map((vid, i) => {
      const video = document.createElement('video')
      video.src = vid.src;
      video.crossOrigin = 'Anonymous'
      video.loop = true
      video.muted = true
      video.autoplay = true
      video.playsInline = true
  
      video.addEventListener('canplay', () => {
        video.play().catch((err) => {
          console.error('Video play failed:', err)
        })
  
        // Create a VideoTexture from the video element
        const videoTexture = new THREE.VideoTexture(video)
        videoTexture.flipY = false;
        videoTexture.minFilter = THREE.LinearFilter
        videoTexture.magFilter = THREE.LinearFilter
        videoTexture.format = THREE.RGBFormat
  
        // Find the mesh representing the TV screen
        const screenObj = scene.getObjectByName(vid.name)
        if (screenObj && screenObj instanceof THREE.Mesh) {
          // For testing, replace the material entirely with a basic material:
          screenObj.material = new THREE.MeshBasicMaterial({ map: videoTexture })
        } else {
          console.warn("Screen mesh not found or it doesn't support materials!")
        }
      })
  
      // Clean up event listeners on unmount
      return () => {
        video.removeEventListener('canplay', () => {})
      }
    })
    
  }, [scene])

  // Adjust model scale and position
  isMobile ? scene.scale.set(0.011, 0.011, 0.011) : scene.scale.set(0.012, 0.012, 0.012)
  const position = isMobile ? [0,-8,-125] : [0,-8,-120];
    

  return (
    <>
      <group>
        <primitive 
          castShadow
          object={scene} 
          position={position} 
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={() => window.open("https://www.youtube.com/@ThisIsDafna")}
        />
      </group>
    </>
  )
}
