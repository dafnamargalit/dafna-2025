import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import GridPlane from './GridPlane'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import Image from 'next/image'
import { motion } from "framer-motion";
import { DafnaLogo } from './Icons'


// Define checkpoints along the Z axis.
const CHECKPOINTS = [500, 300, 100, 0, -100, -300, -480]

function Tunnel() {
  return (
    <>
      {/* Left Wall */}
      <group position={[-8, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <GridPlane width={1000} height={20} widthSegments={1000} heightSegments={20} color="#25b5f7" />
      </group>
      {/* Right Wall */}
      <group position={[8, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <GridPlane width={1000} height={20} widthSegments={1000} heightSegments={20} color="#25b5f7" />
      </group>
      {/* Floor */}
      <group position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <GridPlane width={16} height={1000} widthSegments={20} heightSegments={1000} color="#25b5f7" />
      </group>
      {/* Ceiling */}
      <group position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <GridPlane width={16} height={1000} widthSegments={20} heightSegments={1000} color="#25b5f7" />
      </group>
      {/* End Wall */}
      <group position={[0, 0, -500]}>
        <GridPlane width={16} height={20} widthSegments={20} heightSegments={20} color="#25b5f7" />
      </group>
    </>
  )
}

function CameraController({ checkpointIndex }: { checkpointIndex: number }) {
  useFrame(({ camera }) => {
    const target = CHECKPOINTS[checkpointIndex]
    // Smoothly interpolate the camera's z position toward the target.
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, target, 0.1)
  })
  return null
}

export default function TunnelScene() {
  const [checkpointIndex, setCheckpointIndex] = useState(0)
  const [pageLoaded, setPageLoaded] = useState(false);
  // Ref for throttling scroll events.
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleNext = () => {
    setCheckpointIndex(prev => Math.min(prev + 1, CHECKPOINTS.length - 1))
  }
  const handleBack = () => {
    setCheckpointIndex(prev => Math.max(prev - 1, 0))
  }

  useEffect(() => {
    if(!pageLoaded){
        setCheckpointIndex(CHECKPOINTS.length - 1);
        setPageLoaded(true);
    }
  }, [pageLoaded])

  // Handle scroll events to trigger checkpoint changes.
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Throttle to one scroll action per 800ms (adjust as needed)
    if (throttleTimeoutRef.current) return

    if (e.deltaY > 0) {
      handleNext()
    } else {
      handleBack()
    }
    throttleTimeoutRef.current = setTimeout(() => {
      throttleTimeoutRef.current = null
    }, 1400)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (throttleTimeoutRef.current) return

      // Up arrow goes forward (next)
      if (e.key === "ArrowUp") {
        handleNext()
      }
      // Down arrow goes backward (back)
      else if (e.key === "ArrowDown") {
        handleBack()
      }

      throttleTimeoutRef.current = setTimeout(() => {
        throttleTimeoutRef.current = null
      }, 1400)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="w-screen h-screen relative" onWheel={handleWheel}>
      <Canvas camera={{ position: [0, 0, CHECKPOINTS[0]], fov: 75 }}>
        <CameraController checkpointIndex={checkpointIndex} />
        <Tunnel />
        {/* <fogExp2 attach="fog" args={[0x000000, 0.005]} /> */}
        <Stars
          radius={500}   // Stars distributed within a sphere of radius 500
          depth={10}     // Spread over 90 units in depth
          count={20000}  // More stars for more wow
          factor={15}    // Controls star size
          saturation={0} // Optional: adjust color saturation        // Optional: fade stars with distance
        />
      </Canvas>
      <div className="absolute bottom-4 px-4 flex flex-col items-center justify-center h-screen w-screen z-10">
        <DafnaLogo width={400} height={400}/>
       <div  className="absolute flex bottom-4 px-4 justify-between w-screen z-10">
        {/* <button onClick={handleBack} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500">
          Back
        </button>
        <button onClick={handleNext} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500">
          Next
        </button> */}
        </div>
      </div>
    </div>
  )
}
