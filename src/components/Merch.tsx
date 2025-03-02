import React, { useEffect, useRef, useState } from 'react'
import { Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Merch() {
    const { scene } = useGLTF('/tshirts.glb')
    const [hover, setHover] = useState(false);
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

    const position = [0,-10,-130];
    
  return (
    <>
        <group>
        <ambientLight intensity={2} />
        <directionalLight intensity={3} position={[10, 10, 5]} />
          <primitive 
            object={scene} 
            position={position} 
            scale={0.006}
            rotation={[0, Math.PI / 3, 0]}
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
              setHover(true); 
              window.open("https://shop.dafna.rocks");
            }}
          />
        </group>
    </>
  )
}

useGLTF.preload('/tshirts.glb')

