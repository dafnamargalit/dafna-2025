"use client"

import React, { useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import GridPlane from './GridPlane'
import { CameraShake, Stars } from '@react-three/drei'
import { LoadingIndicator } from './LoadingIndicator'


export function Tunnel({ isMobile } : {isMobile: boolean}) {
  return (
    <>
      {/* Left Wall */}
      <group position={[-8, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <GridPlane width={1000} height={20} widthSegments={isMobile ? 500 : 1000} heightSegments={20} color="#25b5f7" />
      </group>
      {/* Right Wall */}
      <group position={[8, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <GridPlane width={1000} height={20} widthSegments={isMobile ? 500 : 1000} heightSegments={20} color="#25b5f7" />
      </group>
      {/* Floor */}
      <group position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <GridPlane width={16} height={1000} widthSegments={20} heightSegments={isMobile ? 500 : 1000} color="#25b5f7" />
      </group>
      {/* Ceiling */}
      <group position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <GridPlane width={16} height={1000} widthSegments={20} heightSegments={isMobile ? 500 : 1000} color="#25b5f7" />
      </group>
      {/* End Wall */}
      <group position={[0, 0, -300]}>
        <GridPlane width={16} height={20} widthSegments={20} heightSegments={20} color="#25b5f7" />
      </group>
    </>
  )
}


export default function TunnelSceneContent() {
  const [isLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isMobile, setIsMobile] = useState(false);
  // Camera shake configuration
  const cameraShakeConfig = {
    maxYaw: 0.1,
    maxPitch: 0.2,
    maxRoll: 0.1,
    yawFrequency: 0.1,
    pitchFrequency: 0.2,
    rollFrequency: 0.1,
    intensity: 0.6,
    decay: false,
    decayRate: 0.65,
    controls: undefined,
  }
  
    // Check if device is mobile
    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 768);
        };
    
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    
  return (
    <div className="fixed inset-0">
      {isLoading && <LoadingIndicator />}
        <Canvas 
          shadows 
          ref={canvasRef} 
          gl={{ antialias: false, powerPreference: 'low-power', preserveDrawingBuffer: true }} 
          style={{ touchAction: 'auto !important'}} 
          camera={{ position: [0, 0, -480], fov: 75 }} 
          dpr={[1, 1.5]} 
          performance={{ min: 0.1, max: 0.5 }}
        >
          <CameraShake {...cameraShakeConfig} />
          <ambientLight intensity={0.015} />
        
          <Tunnel isMobile={isMobile} />
          <fogExp2 attach="fog" args={[0x000000, 0.005]} />
          <Stars
            radius={500}
            depth={10}
            count={isMobile ? 10000 : 20000}
            factor={15}
            saturation={0}
          />
        </Canvas>
    </div>
  )
}
