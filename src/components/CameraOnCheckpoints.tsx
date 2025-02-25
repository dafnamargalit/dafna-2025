// components/CameraOnCheckpoints.tsx
import React, { useState, useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import spline from './Spline'

// Generate checkpoints along the spline (here, 21 checkpoints from 0 to 1)

interface CameraOnCheckpointsProps {
  checkpointIndex: number
  setCheckpointIndex: React.Dispatch<React.SetStateAction<number>>
  checkpoints: number[]
  numCheckpoints: number
}

const CameraOnCheckpoints: React.FC<CameraOnCheckpointsProps> = ({ checkpointIndex, setCheckpointIndex, checkpoints, numCheckpoints }) => {
  const { camera } = useThree()
  // Smooth interpolation parameter
  const currentTRef = useRef<number>(checkpoints[checkpointIndex])
  // Throttle scroll events
  const canScrollRef = useRef<boolean>(true)
  // Lock new transitions until current one finishes
  const transitionLockRef = useRef<boolean>(false)

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!canScrollRef.current || transitionLockRef.current) return

      transitionLockRef.current = true
      canScrollRef.current = false

      setCheckpointIndex((prev) => {
        if (e.deltaY > 0) {
          // If at last checkpoint, wrap around to 0.
          return prev < checkpoints.length - 1 ? prev + 1 : 0
        } else if (e.deltaY < 0) {
          return prev > 0 ? prev - 1 : prev
        }
        return prev
      })

      setTimeout(() => {
        canScrollRef.current = true
      }, 200)
    }

    window.addEventListener('wheel', onWheel)
    return () => window.removeEventListener('wheel', onWheel)
  }, [setCheckpointIndex])

  useFrame((_, delta) => {
    const targetT: number = checkpoints[checkpointIndex];
    // If the target is less than the current t, we're wrapping forward.
    let effectiveTargetT = targetT;
    if (targetT < currentTRef.current) {
      effectiveTargetT = targetT + 1;
    }
    
    // Interpolate currentTRef toward effectiveTargetT.
    currentTRef.current = THREE.MathUtils.lerp(currentTRef.current, effectiveTargetT, delta * 2);
    let t: number = currentTRef.current;
    // If we've gone over 1, wrap around.
    if (t >= 1) t -= 1;
    
    // Set the camera's position along the spline.
    const pos: THREE.Vector3 = spline.getPointAt(t);
    camera.position.copy(pos);
    
    // Look slightly ahead along the spline.
    const lookAt: THREE.Vector3 = spline.getPointAt((t + 0.01) % 1);
    camera.lookAt(lookAt);
    
    // Once we're close enough to the target, release the transition lock.
    if (Math.abs(currentTRef.current - effectiveTargetT) < 0.001) {
      transitionLockRef.current = false;
    }
  });

  return null
}

export default CameraOnCheckpoints
