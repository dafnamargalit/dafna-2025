import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'


// ---------------- Vinyl Component ----------------
interface VinylProps {
  position: [number, number, number]
  path: string
  setShowModal: (show: string | null) => void
}

const Vinyl: React.FC<VinylProps> = ({ path, position, setShowModal }) => {
  const { scene } = useGLTF(path)
  if (!scene) return null

  const [hover, setHover] = useState(false)

  // Deep-clone the scene and its materials so each instance is independent.
  const clonedScene = useMemo(() => {
    const clone = scene.clone()
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        child.material = child.material.clone()
      }
    })
    return clone
  }, [scene])

  // Function to update emissive effect.
  const setEmissive = (object: THREE.Object3D, highlight: boolean) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material && 'emissive' in child.material) {
        if (highlight) {
          child.material.emissive = new THREE.Color('#67E8F9')
          child.material.emissiveIntensity = 0.3
        } else {
          child.material.emissive = new THREE.Color('black')
          child.material.emissiveIntensity = 0.1
        }
      }
    })
  }

  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'auto'
    setEmissive(clonedScene, hover)
  }, [hover, clonedScene])


  return (
    <primitive
      object={clonedScene}
      rotation={[0, Math.PI, -Math.PI]}
      position={position}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={() => setShowModal(path)}
    />
  )
}
interface FloatingVinylsProps {
  setShowModal: (show: string | null) => void
  isMobile: boolean
}

export const FloatingVinyls: React.FC<FloatingVinylsProps> = ({ setShowModal, isMobile }) => {
  
  const parentRef = useRef<THREE.Group>(null)
  const offsetDistance = isMobile ? 3.5 : 5.5

  // Define final offsets for each vinyl (east, north, west, south).
  const finalOffsets: THREE.Vector3[] = [
    new THREE.Vector3(1, 0, 0).setLength(offsetDistance),
    new THREE.Vector3(0, 1, 0).setLength(offsetDistance),
    new THREE.Vector3(-1, 0, 0).setLength(offsetDistance),
    new THREE.Vector3(0, -1, 0).setLength(offsetDistance),
  ]

  const paths = [
    '/models/paradox.glb',
    '/models/wiwwy.glb',
    '/models/ily.glb',
    '/models/submerge.glb'
  ]

  // A ref to store the animation progress (from 0: at center to 1: full offset).
  const progressRef = useRef(0)

  // Animate the parent group: update position and scale for each child vinyl.
  useFrame((state, delta) => {
    // Increase progress gradually until it reaches 1.
    if (progressRef.current < 1) {
      progressRef.current = Math.min(progressRef.current + delta, 1)
    }
    if (parentRef.current) {
      // Define final scale based on device type.
      const finalScale = isMobile ? 0.08 : 0.1

      parentRef.current.children.forEach((child, idx) => {
        const finalOffset = finalOffsets[idx]
        // Update position: from center ([0,0,0]) to finalOffset.
        child.position.set(
          finalOffset.x * progressRef.current,
          finalOffset.y * progressRef.current,
          finalOffset.z * progressRef.current
        )
        // Update scale: start from 0 and grow to finalScale.
        child.scale.set(
          finalScale * progressRef.current,
          finalScale * progressRef.current,
          finalScale * progressRef.current
        )
        child.rotation.z -= 0.001
      })
      // Optionally, add a slow rotation to the whole group.
      parentRef.current.rotation.z -= 0.001
    }
  })

  return (
    // The parent group is positioned as before.
    <group ref={parentRef} position={[0.5, 0, -313]}>
      {finalOffsets.map((_, idx) => (
        // Initially, each vinyl is placed at the center with position [0,0,0].
        <Vinyl setShowModal={setShowModal} path={paths[idx]} key={idx} position={[0, 0, 0]} />
      ))}
    </group>
  )
}

useGLTF.preload('/models/paradox.glb')
useGLTF.preload('/models/wiwwy.glb')
useGLTF.preload('/models/ily.glb')
useGLTF.preload('/models/submerge.glb')