import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { use3DInteraction } from '../hooks/use3DInteraction'

interface VinylProps {
  position: [number, number, number]
  path: string
  setShowModal: (show: string | null) => void
}

const Vinyl: React.FC<VinylProps> = ({ path, position, setShowModal }) => {
  const { scene } = useGLTF(path)
  const { hover, handlePointerOver, handlePointerOut } = use3DInteraction(scene)

  // Deep-clone the scene and then override materials with MeshPhysicalMaterial for a sheen
  const clonedScene = useMemo(() => {
    if (!scene) return null

    const clone = scene.clone()
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        // Store original material references
        const originalMat = child.material as THREE.MeshStandardMaterial

        // Create a new MeshPhysicalMaterial, preserving the original texture maps if they exist.
        const physicalMat = new THREE.MeshPhysicalMaterial({
          // Transfer common properties from original material (maps, color, etc.)
          map: originalMat.map || null,
          normalMap: originalMat.normalMap || null,
          roughnessMap: originalMat.roughnessMap || null,
          metalnessMap: originalMat.metalnessMap || null,
          color: originalMat.color.clone(),

          // PBR properties for vinyl sheen
          metalness: 0.2,
          roughness: 0.4,
          clearcoat: 1.0,
          clearcoatRoughness: 0.5,
          
          // Sheen requires WebGL2 / MeshPhysicalMaterial
          sheen: 1.0,
          sheenColor: new THREE.Color('#ffffff'),
          sheenRoughness: 0.5,
        })

        // Assign the new physical material
        child.material = physicalMat
      }
    })
    return clone
  }, [scene])

  if (!clonedScene) return null

  return (
    <primitive
      object={clonedScene}
      rotation={[0, Math.PI - 0.4, -Math.PI]}
      position={position}
      castShadow
      receiveShadow
      onPointerOver={(e: any) => {
        e.stopPropagation()
        handlePointerOver()
      }}
      onPointerOut={(e: any) => {
        e.stopPropagation()
        handlePointerOut()
      }}
      onClick={(e: any) => {
        e.stopPropagation()
        const albumName = path.split('/').pop()?.split('.')[0]
        setShowModal(albumName || null)
      }}
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
    '/models/wiwwy_draco.glb',
    '/models/ily.glb',
    '/models/submerge_draco.glb'
  ]

  // Animation progress reference
  const progressRef = useRef(0)

  // Vinyl rotation animation
  useFrame((state, delta) => {
    // Increase progress gradually until it reaches 1.
    if (progressRef.current < 1) {
      progressRef.current = Math.min(progressRef.current + delta, 1)
    }
    
    if (parentRef.current) {
      // Define final scale based on device type
      const finalScale = isMobile ? 0.08 : 0.1

      parentRef.current.children.forEach((child, idx) => {
        const finalOffset = finalOffsets[idx]
        
        // Update position: from center ([0,0,0]) to finalOffset
        child.position.set(
          finalOffset.x * progressRef.current,
          finalOffset.y * progressRef.current,
          finalOffset.z * progressRef.current
        )
        
        // Update scale: start from 0 and grow to finalScale
        child.scale.set(
          finalScale * progressRef.current,
          finalScale * progressRef.current,
          finalScale * progressRef.current
        )
        
        // Rotate each vinyl
        child.rotation.z -= 0.001
        child.rotation.y += 0.001
        child.rotation.y -= 0.0012
      })
      
      // Optionally, add a slow rotation to the whole group
      parentRef.current.rotation.z -= 0.001
    }
  })

  return (
    // The parent group is positioned in the tunnel
    <group ref={parentRef} position={[0.5, 0, -313]}>
      {finalOffsets.map((_, idx) => (
        // Initially, each vinyl is placed at the center with position [0,0,0]
        <Vinyl 
          setShowModal={setShowModal} 
          path={paths[idx]} 
          key={idx} 
          position={[0, 0, 0]} 
        />
      ))}
    </group>
  )
}