import React, { useEffect, useRef } from 'react'
import { Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { use3DInteraction } from '../hooks/use3DInteraction'

interface RecordPlayerProps {
  setShowVinyls: (show: boolean) => void;
  showVinyls: boolean;
  isMobile: boolean;
}

export default function RecordPlayer({ setShowVinyls, showVinyls, isMobile }: RecordPlayerProps) {
  const { scene } = useGLTF('/models/recordplayer_draco.glb')
  const { hover, handlePointerOver, handlePointerOut } = use3DInteraction(scene);
  
  // Create a target for the spotlight
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D())

  // Access Three.js scene to add the target
  const { scene: threeScene } = useThree()

  // Add the spotlight target to the scene and set its position
  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.position.set(0, 0, -330) // Adjust as needed
      threeScene.add(targetRef.current)
      
      // Clean up on component unmount
      return () => {
        threeScene.remove(targetRef.current)
      }
    }
  }, [threeScene])

  // Scale the record player model based on device
  useEffect(() => {
    if (isMobile) {
      scene.scale.set(0.04, 0.04, 0.04)
    } else {
      scene.scale.set(0.05, 0.05, 0.05)
    }
  }, [scene, isMobile])

  const recordPlayerPosition = [0, 0, -330]

  return (
    <>
      <group>
        {/* Spotlight */}
        <spotLight
          position={[0, 6, -320]} // Above the record player
          angle={0.9}           // Wide beam angle
          penumbra={0.5}
          intensity={10}
          distance={15}
          decay={0}             // Use decay=0 for consistent brightness
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
          target={targetRef.current}
        />

        {/* Invisible target for spotlight */}
        <primitive object={targetRef.current} />

        {/* Ambient light */}
        <ambientLight intensity={2} />
        <directionalLight position={[10,-30,-10]} intensity={0.2} castShadow shadow-mapSize={[2024, 2024]} />
        <directionalLight position={[-10,30,0]} intensity={0.2} castShadow shadow-mapSize={[2024, 2024]} />
        <directionalLight position={[0,-30,0]} intensity={0.2} castShadow shadow-mapSize={[2024, 2024]} />
        <directionalLight position={[10,30,0]} intensity={0.2} castShadow shadow-mapSize={[2024, 2024]} />
        
        {/* Record Player Model */}
        <Float floatIntensity={1} speed={10} floatingRange={[-0.2,0.2]} rotationIntensity={0}>
          <primitive
            object={scene}
            position={recordPlayerPosition}
            rotation={[0, Math.PI / 2, Math.PI / 4]}
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
              setShowVinyls(!showVinyls)
            }}
          />
        </Float>
      </group>
    </>
  )
}