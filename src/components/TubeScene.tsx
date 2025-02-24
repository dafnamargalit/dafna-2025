// components/TubeScene.tsx

import React, { FC, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, ThreeEvent, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import spline from './Spline'

import CameraOnCheckpoints from './CameraOnCheckpoints'

const TubeScene: FC = () => {
  const [checkpointIndex, setCheckpointIndex] = useState(0);
  const numCheckpoints: number = 20
  const checkpoints: number[] = Array.from({ length: numCheckpoints + 1 }, (_, i) => i / numCheckpoints)

  /**
   * 1) Create the main tube geometry from the spline.
   *    "222" tubular segments, radius = 0.65, radialSegments = 16, closed = true
   */
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(spline, 222, 0.65, 16, true)
  }, [])

  /**
   * 2) Create red wireframe edges for that tube.
   *    We set a small thresholdAngle to reduce diagonal lines on curved sections
   */
  const tubeEdges = useMemo(() => {
    const edgesGeom = new THREE.EdgesGeometry(tubeGeometry, 0.2)
    const lineMat = new THREE.LineBasicMaterial({ color: "#25b5f7" })
    return new THREE.LineSegments(edgesGeom, lineMat)
  }, [tubeGeometry])

  return (
    <div className='flex items-center justify-center'>
    <div className='absolute z-10 w-screen h-screen'>
    <Canvas
     className='w-screen h-screen'
     // replicate ACESFilmic + sRGB
     onCreated={({ gl }) => {
       gl.toneMapping = THREE.ACESFilmicToneMapping;
       gl.outputColorSpace = THREE.SRGBColorSpace;
     }}
     camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 5] }}
    >
      {/* FogExp2 to replicate: scene.fog = new THREE.FogExp2(0x000000, 0.3) */}
      <fogExp2 attach="fog" args={[0x000000, 0.3]} />

      {/* Edges for the tube */}
      <primitive object={tubeEdges} />

      {/* Enable OrbitControls for rotating the view */}
      <OrbitControls enableZoom={true} enablePan={true} />

      {/* This component positions the camera along the tube based on scroll */}
      <CameraOnCheckpoints numCheckpoints={numCheckpoints} setCheckpointIndex={setCheckpointIndex} checkpointIndex={checkpointIndex} checkpoints={checkpoints} />

      {/* Post-processing bloom */}
      <EffectComposer>
        <Bloom
          // approximate your original UnrealBloomPass settings
          luminanceThreshold={0.002}
          luminanceSmoothing={0.4}
          intensity={3.5}
        />
      </EffectComposer>
    </Canvas>
    </div>
    <div className='z-20 flex justify-between items-center w-screen h-screen'>
    <button className='bg-red-700 p-10 h-5' onClick={() => setCheckpointIndex((prev) => prev > 0 ? prev - 1 : numCheckpoints - 1)}>
        back
      </button>
      <button className='bg-red-700 p-10 h-5' onClick={() => setCheckpointIndex((prev) => prev < numCheckpoints - 1 ? prev + 1 : 0)}>
        next
      </button>
    </div>
    </div>
  )
}

// A canvas wrapper with toneMapping, etc.

export default TubeScene