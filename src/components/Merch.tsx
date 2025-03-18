import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Merch() {
    const { scene } = useGLTF('/models/tshirts_draco.glb')
    const [hover, setHover] = useState(false);
    const handlePointerOver = useCallback(() => setHover(true), []);
    const handlePointerOut = useCallback(() => setHover(false), []);
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
    // Optionally scale and adjust as needed
    const position = [0, -8, -20];

  return (
    <>
        <group>

        <directionalLight intensity={1} position={[13, -4, -10]} castShadow shadow-mapSize={[2024, 2024]}/>
        <directionalLight intensity={3} position={[-13, 5, -10]} castShadow shadow-mapSize={[2024, 2024]}/>
        <spotLight
          distance={5}
          angle={0.15}
        />
          <primitive 
            object={scene} 
            position={position} 
            scale={0.1}
            castShadow
            receiveShadow
            rotation={[0, Math.PI / 4, 0]}
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
              handlePointerOver()
              window.open("https://shop.dafna.rocks");
            }}
          />
        </group>
    </>
  )
}
