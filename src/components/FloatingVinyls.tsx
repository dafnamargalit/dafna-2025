import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface VinylProps {
  position: [number, number, number]
  path: string
}

const Vinyl: React.FC<VinylProps> = ({ path, position }) => {
  const { scene } = useGLTF(path)
  const [hover, setHover] = useState(false)

  // Clone the loaded scene so each instance is unique.
  const clonedScene = useMemo(() => scene.clone(), [scene])

  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'auto'
  }, [hover])

  // Adjust scale and rotation for the clone
  clonedScene.scale.set(0.1, 0.1, 0.1)
  
  return (
    <primitive
      object={clonedScene}
      rotation={[Math.PI / 2, 0, 0]}
      position={position}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={() => window.open("https://www.youtube.com/@ThisIsDafna")}
    />
  )
}

export const FloatingVinyls: React.FC = () => {
  const parentRef = useRef<THREE.Group>(null)
  const offsetDistance = 5.5

  // Create four offset vectors (east, north, west, south)
  const offsets: THREE.Vector3[] = [
    new THREE.Vector3(1, 0, 0).setLength(offsetDistance),
    new THREE.Vector3(0, 1, 0).setLength(offsetDistance),
    new THREE.Vector3(-1, 0, 0).setLength(offsetDistance),
    new THREE.Vector3(0, -1, 0).setLength(offsetDistance),
  ]

  const paths = [
    '/vinyl.glb',
    '/vinyl.glb',
    '/vinyl.glb',
    '/vinyl.glb'
  ]
  // Animate the parent group and counter-rotate each child if needed.
  useFrame(() => {
    if (parentRef.current) {
      parentRef.current.rotation.z += 0.001
      parentRef.current.children.forEach((child) => {
        child.rotation.y -= 0.001
      })
    }
  })

  return (
    <group ref={parentRef} position={[0, 0, -313]}>
      {offsets.map((offset, idx) => (
        <Vinyl path={paths[idx]} key={idx} position={[offset.x, offset.y, offset.z]} />
      ))}
    </group>
  )
}

useGLTF.preload('/vinyl.glb')