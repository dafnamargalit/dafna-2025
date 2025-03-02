import React, { useEffect, useState } from 'react'
import { Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function FloatingTVModel(props: any) {
  const { scene } = useGLTF('/models/old_tv.glb')
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

  // Setup video texture on the TV screen
  useEffect(() => {
    // Create a video element with your provided URL
    const video = document.createElement('video')
    video.src = 'https://teck.s3.us-east-1.amazonaws.com/portfolio/iwannafeel.mp4'
    video.crossOrigin = 'Anonymous'
    video.loop = true
    video.muted = true
    video.autoplay = true

    // Debug logging
    video.addEventListener('loadeddata', () => {
      console.log('Video loaded data')
    })

    video.addEventListener('canplay', () => {
      console.log('Video can play')
      video.play().catch((err) => {
        console.error('Video play failed:', err)
      })

      // Create a VideoTexture from the video element
      const videoTexture = new THREE.VideoTexture(video)
      videoTexture.minFilter = THREE.LinearFilter
      videoTexture.magFilter = THREE.LinearFilter
      videoTexture.format = THREE.RGBFormat

      // Find the mesh representing the TV screen
      const screenObj = scene.getObjectByName('TV_TV_0')
      if (screenObj && screenObj instanceof THREE.Mesh) {
        // For testing, replace the material entirely with a basic material:
        screenObj.material = new THREE.MeshBasicMaterial({ map: videoTexture })
      } else {
        console.warn("Screen mesh not found or it doesn't support materials!")
      }
    })

    // Clean up event listeners on unmount
    return () => {
      video.removeEventListener('loadeddata', () => {})
      video.removeEventListener('canplay', () => {})
    }
  }, [scene])

  // Adjust model scale and position
  scene.scale.set(0.015, 0.015, 0.015)
  const position = [-2, -5, -20]

  return (
    <Float floatIntensity={0.1} speed={0.1} floatingRange={[1, 2]}>
      <group>
        <primitive 
          object={scene} 
          position={position} 
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          onClick={() => window.open("https://www.youtube.com/@ThisIsDafna")}
        />
      </group>
    </Float>
  )
}

useGLTF.preload('/models/old_tv.glb')
