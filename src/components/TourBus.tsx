import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { use3DInteraction } from '../hooks/use3DInteraction'

interface TourBusProps {
  isMobile: boolean;
  setShowTourDates: (show: boolean) => void;
}

export const TourBus: React.FC<TourBusProps> = ({ isMobile, setShowTourDates }) => {
  const { scene } = useGLTF('/models/tourbus_draco.glb')
  const { hover, handlePointerOver, handlePointerOut } = use3DInteraction(scene);
  const [position, setPosition] = useState(isMobile ? [0,-2,90] : [0,-2,40]);
  const [rotation, setRotation] = useState(isMobile ? [0,-0.6, 0] : [0,0,0]);

  const finalPosition = [0,-2,90];

  // Adjust model scale based on device type
  useEffect(() => {
    if (isMobile) {
      scene.scale.set(1.2, 1.2, 1.2);
    } else {
      scene.scale.set(1.5, 1.5, 1.5);
    }
  }, [scene, isMobile]);

  // References for wheel rotation animation
  const frontWheelRef = useRef<THREE.Object3D | null>(null)
  const backWheelRef = useRef<THREE.Object3D | null>(null)
  const frontRimsRef = useRef<THREE.Object3D | null>(null)
  const backRimsRef = useRef<THREE.Object3D | null>(null)
  const frontHubcapsRef = useRef<THREE.Object3D | null>(null)
  const backHubcapsRef = useRef<THREE.Object3D | null>(null)

  // Find wheel references once scene is loaded
  useMemo(() => {
    if (!scene || isMobile) return

    // Get wheel components by name
    frontWheelRef.current = scene.getObjectByName('Tyres_-_front') || null
    backWheelRef.current = scene.getObjectByName('Tyres_-_rear') || null
    frontRimsRef.current = scene.getObjectByName('Rims_-_front') || null
    backRimsRef.current = scene.getObjectByName('Rims_-_rear') || null
    frontHubcapsRef.current = scene.getObjectByName('Hubcaps_-_front') || null
    backHubcapsRef.current = scene.getObjectByName('Hubcaps_-_rear') || null
  }, [scene, isMobile])

  // Handle bus movement and wheel rotation animation
  useFrame(() => {
    if(position[2] !== finalPosition[2] && !isMobile){
      // Rotate wheels for animation
      if (frontWheelRef.current) frontWheelRef.current.rotation.x += 0.05
      if (backWheelRef.current) backWheelRef.current.rotation.x += 0.05
      if (frontRimsRef.current) frontRimsRef.current.rotation.x += 0.05
      if (backRimsRef.current) backRimsRef.current.rotation.x += 0.05
      if (frontHubcapsRef.current) frontHubcapsRef.current.rotation.x += 0.05
      if (backHubcapsRef.current) backHubcapsRef.current.rotation.x += 0.05

      // Move bus forward
      setPosition(prev => [0, -2, Math.min(prev[2] + 0.5, finalPosition[2])]);
      
      // Rotate bus when it gets near the final position
      if(position[2] >= 85 && rotation[1] > -Math.PI/2 + 1){
        setRotation(prev => [0, prev[1] - 0.2, 0]);
      }
    }
  })

  return (
    <>
      <group>
        <primitive 
          castShadow
          object={scene} 
          rotation={rotation}
          position={position} 
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={() => setShowTourDates(true)}
        />
      </group>
    </>
  )
}