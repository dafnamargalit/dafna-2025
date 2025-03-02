import React, { useEffect, useState } from 'react'
import { Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function RecordPlayer({ setShowVinyls, showVinyls, isMobile }: { setShowVinyls: (set: boolean) => void, showVinyls: boolean, isMobile: boolean }) {
  const { scene } = useGLTF('/models/recordplayer.glb')
  const [hover, setHover] = useState(false)

  // Function to set emissive glow on all meshes in the scene
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

  // Update the cursor and model glow on hover change
  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'auto'
    setEmissive(scene, hover)
  }, [hover, scene])

  // Scale and position the model as needed
  isMobile ? scene.scale.set(0.03, 0.03, 0.03) : scene.scale.set(0.05, 0.05, 0.05);

  const position = isMobile ? [1,0,-330] : [0, 0, -330]

  return (
    <Float floatIntensity={0.01} speed={0.1} floatingRange={[1, 1]} rotationIntensity={0.02}>
      <group>
        <primitive 
          object={scene}
          position={position}
          rotation={[0, Math.PI / 2, Math.PI / 4]}
          onPointerOver={(e: any) => {
            e.stopPropagation()
            setHover(true)
          }}
          onPointerOut={(e: any) => {
            e.stopPropagation()
            setHover(false)
          }}
          onClick={(e: any) => {
            e.stopPropagation()
            setShowVinyls(!showVinyls)
          }}
        />
      </group>
    </Float>
  )
}

useGLTF.preload('/models/recordplayer.glb')
