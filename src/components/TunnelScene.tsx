// components/TunnelScene.tsx
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import GridPlane from './GridPlane'
import { Stars } from '@react-three/drei'

// Define five checkpoints along the Z axis.
// The first is the starting position (e.g., 100) and the last is the end wall position (-153).
const CHECKPOINTS = [500, 80, 0, -80, -480]

function Tunnel() {
    return (
      <>
        {/* Left Wall */}
        <group position={[-8, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <GridPlane 
            width={1000}       // Extends along Z
            height={20}       // Wall height
            widthSegments={1000}
            heightSegments={20}
            color="#25b5f7"
          />
        </group>
  
        {/* Right Wall */}
        <group position={[8, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <GridPlane 
            width={1000}
            height={20}
            widthSegments={1000}
            heightSegments={20}
            color="#25b5f7"
          />
        </group>
  
        {/* Floor */}
        <group position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <GridPlane
            width={16}       // Extends along Z
            height={1000}     // Extends along X
            widthSegments={20}
            heightSegments={1000}
            color="#25b5f7"
          />
        </group>
  
        {/* Ceiling */}
        <group position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <GridPlane
            width={16}       // Extends along Z
            height={1000}     // Extends along X
            widthSegments={20}
            heightSegments={1000}
            color="#25b5f7"
          />
        </group>
  
        {/* End Wall */}
        <group position={[0, 0, -500]}>
          <GridPlane
            width={16}       // Matches corridor cross-section (x = -8 to 8)
            height={20}      // Matches corridor cross-section (y = -10 to 10)
            widthSegments={20}
            heightSegments={20}
            color="#25b5f7"
          />
        </group>
      </>
    )
  }
  
  function CameraController({ checkpointIndex }: { checkpointIndex: number }) {
    useFrame(({ camera }) => {
      camera.position.z = CHECKPOINTS[checkpointIndex]
    })
    return null
  }
  
  export default function TunnelScene() {
    const [checkpointIndex, setCheckpointIndex] = useState(0)
    // Use a ref to prevent handling multiple scroll events in quick succession
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
    const handleNext = () => {
      setCheckpointIndex(prev => Math.min(prev + 1, CHECKPOINTS.length - 1))
    }
    const handleBack = () => {
      setCheckpointIndex(prev => Math.max(prev - 1, 0))
    }
  
    const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
      // If we're already handling a scroll event, ignore further ones until the timeout resets.
      if (scrollTimeoutRef.current) return
  
      if (e.deltaY > 0) {
        handleNext()
      } else if (e.deltaY < 0) {
        handleBack()
      }
      // Set a cooldown so additional scroll events within 300ms are ignored.
      scrollTimeoutRef.current = setTimeout(() => {
        scrollTimeoutRef.current = null
      }, 300)
    }
  
    return (
      <div onWheel={onWheel} className="w-screen h-screen relative">
        <Canvas camera={{ position: [0, 0, CHECKPOINTS[0]], fov: 75 }}>
          <CameraController checkpointIndex={checkpointIndex} />
          <Tunnel />
          <Stars radius={1000} count={10000} />
        </Canvas>
        <div className="absolute top-4 left-4 space-x-2 z-10">
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
          >
            Next
          </button>
        </div>
      </div>
    )
  }
