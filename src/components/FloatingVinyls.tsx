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
  const [hover, setHover] = useState(false)

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

  // Handle hover effects
  useEffect(() => {
    if (!clonedScene) return

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material && 'emissive' in child.material) {
        if (hover) {
          child.material.emissive = new THREE.Color('#67E8F9')
          child.material.emissiveIntensity = 0.3
        } else {
          child.material.emissive = new THREE.Color('black')
          child.material.emissiveIntensity = 0
        }
      }
    })
  }, [hover, clonedScene])

  // Handle cursor style
  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hover])

  if (!clonedScene) return null

  return (
    <primitive
      object={clonedScene}
      rotation={path === '/models/chaos.glb' ? [-Math.PI/2, -Math.PI/2, 0] : [Math.PI, -Math.PI/2, 0]}
      position={position}
      castShadow
      receiveShadow
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
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

  // 1) Add your new model here
  const paths = useMemo(
    () => [
      '/models/chaos.glb',
      '/models/paradox.glb',
      '/models/wiwwy_draco.glb',
      '/models/ily.glb',
      '/models/submerge_draco.glb',
    ],
    []
  )

  // (Optional) Preload to avoid a pop-in on first hover/click
  useMemo(() => {
    paths.forEach((p) => useGLTF.preload(p))
  }, [paths])

  // 2) Compute evenly spaced offsets around a circle for however many paths we have
  const finalOffsets = useMemo(() => {
    const N = paths.length
    const angleOffset = Math.PI / 2 // start one at the top (nice layout)
    return Array.from({ length: N }, (_, i) => {
      const theta = (i / N) * Math.PI * 2 + angleOffset
      return new THREE.Vector3(
        Math.cos(theta) * offsetDistance,
        Math.sin(theta) * offsetDistance,
        0
      )
    })
  }, [paths.length, offsetDistance, paths])

  // Animation progress reference
  const progressRef = useRef(0)

  // Vinyl rotation + entrance animation
  useFrame((state, delta) => {
    if (progressRef.current < 1) {
      progressRef.current = Math.min(progressRef.current + delta, 1)
    }

    if (parentRef.current) {
      const finalScale = isMobile ? 0.08 : 0.1
      const time = state.clock.getElapsedTime()

      // make sure we only iterate over the children we actually render
      const childCount = Math.min(parentRef.current.children.length, finalOffsets.length)

      for (let idx = 0; idx < childCount; idx++) {
        const child = parentRef.current.children[idx] as THREE.Object3D
        const finalOffset = finalOffsets[idx]

        // Position: center -> ring
        child.position.set(
          finalOffset.x * progressRef.current,
          finalOffset.y * progressRef.current,
          finalOffset.z * progressRef.current + 0.5
        )

        // Scale: 0 -> final
        const s = finalScale * progressRef.current
        child.scale.set(s, s, s)

        // Gentle wobble + slow spin
        child.rotation.z = Math.sin(time * 0.5 + idx * 0.3) * 0.05
        child.rotation.y = Math.sin(time * 0.5 + idx * 0.2) * 0.7
      }

      parentRef.current.rotation.z -= 0.001
    }
  })

  return (
    <group ref={parentRef} position={[0.5, 0, -120]}>
      {paths.map((path, idx) => (
        <Vinyl
          key={path}
          path={path}
          setShowModal={setShowModal}
          position={[0, 0, 0]} // they animate outward from center
        />
      ))}
    </group>
  )
}
