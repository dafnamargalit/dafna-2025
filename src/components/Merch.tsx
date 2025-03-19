import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { use3DInteraction } from '../hooks/use3DInteraction'

export default function Merch() {
  const { scene } = useGLTF('/models/tshirts_draco.glb')
  const { hover, handlePointerOver, handlePointerOut } = use3DInteraction(scene);

  // Optionally scale and adjust as needed
  const position = [0, -8, -20];

  return (
    <>
      <group>
        <directionalLight 
          intensity={1} 
          position={[13, -4, -10]} 
          castShadow 
          shadow-mapSize={[2024, 2024]}
        />
        <directionalLight 
          intensity={3} 
          position={[-13, 5, -10]} 
          castShadow 
          shadow-mapSize={[2024, 2024]}
        />
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
            window.open("https://shop.dafna.rocks", "_blank", "noopener,noreferrer");
          }}
        />
      </group>
    </>
  )
}