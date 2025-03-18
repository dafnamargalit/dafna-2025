import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { videos } from '@/lib/constants'
import { useFrame } from '@react-three/fiber'

interface TourBusProps {
  isMobile: boolean;
  setShowTourDates: (show: boolean) => void;
}

export const TourBus: React.FC<TourBusProps> = ({ isMobile, setShowTourDates }) =>{
  const { scene } = useGLTF('/models/tourbus_draco.glb')
  const [hover, setHover] = useState(false)
  const [position, setPosition] = useState(isMobile ? [0,-2,90] : [0,-2,40]);
  const [rotation, setRotation] = useState(isMobile ? [0,-0.6, 0] : [0,0,0]);
  const handlePointerOver = useCallback(() => setHover(true), []);
  const handlePointerOut = useCallback(() => setHover(false), []);

  const finalPosition = [0,-2,90];
  // Update emissive effect on hover
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

  // Update cursor and emissive effect on hover change
  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'auto'
    setEmissive(scene, hover)
  }, [hover, scene])


  // Adjust model scale and position
  isMobile ? scene.scale.set(1.2, 1.2, 1.2): scene.scale.set(1.5, 1.5, 1.5);
    

  const frontWheelRef = useRef<THREE.Object3D | null>(null)
  const backWheelRef = useRef<THREE.Object3D | null>(null)

  const frontRimsRef = useRef<THREE.Object3D | null>(null)
  const backRimsRef = useRef<THREE.Object3D | null>(null)

  const frontHubcapsRef = useRef<THREE.Object3D | null>(null)
  const backHubcapsRef = useRef<THREE.Object3D | null>(null)
  // Once the scene is loaded, find the wheels by name
  useMemo(() => {
    if (!scene) return

    if(!isMobile){
    // For example, if your wheel objects are named "Wheel_FL", "Wheel_FR", etc.
    frontWheelRef.current = scene.getObjectByName('Tyres_-_front') || null
    backWheelRef.current = scene.getObjectByName('Tyres_-_rear') || null

    frontRimsRef.current = scene.getObjectByName('Rims_-_front') || null
    backRimsRef.current = scene.getObjectByName('Rims_-_rear') || null

    frontHubcapsRef.current = scene.getObjectByName('Hubcaps_-_front') || null
    backHubcapsRef.current = scene.getObjectByName('Hubcaps_-_rear') || null
    }
  }, [scene])

  useFrame(() => {
    if(position[2] !== finalPosition[2] && !isMobile){
    // If the references exist, rotate them
    if (frontWheelRef.current) frontWheelRef.current.rotation.x += 0.05
    if (backWheelRef.current) backWheelRef.current.rotation.x += 0.05
    if (frontRimsRef.current) frontRimsRef.current.rotation.x += 0.05
    if (backRimsRef.current) backRimsRef.current.rotation.x += 0.05
    if (frontHubcapsRef.current) frontHubcapsRef.current.rotation.x += 0.05
    if (backHubcapsRef.current) backHubcapsRef.current.rotation.x += 0.05

      setPosition(prev => [0, -2, prev[2] + 0.5]);
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
