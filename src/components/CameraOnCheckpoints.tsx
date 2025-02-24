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
  // This ref holds the current "t" along the spline for smooth interpolation.
  const currentTRef = useRef<number>(checkpoints[checkpointIndex])
  // Ref used to throttle scroll events.
  const canScrollRef = useRef<boolean>(true)
  // Lock so we don't start a new transition until the current one is done.
  const transitionLockRef = useRef<boolean>(false)

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // If we're throttled or a transition is in progress, ignore further scrolls.
      if (!canScrollRef.current || transitionLockRef.current) return

      // Start a new transition
      transitionLockRef.current = true
      canScrollRef.current = false

      setCheckpointIndex((prev) => {
        if (e.deltaY > 0) {
          // Scroll down: go to next checkpoint (wrap to 0 at end)
          return prev < checkpoints.length - 1 ? prev + 1 : 0
        } else if (e.deltaY < 0) {
          // Scroll up: go to previous checkpoint if possible
          return prev > 0 ? prev - 1 : prev
        }
        return prev
      })

      // Allow new scroll events after 200ms.
      setTimeout(() => {
        canScrollRef.current = true
      }, 200)
    }

    window.addEventListener('wheel', onWheel)
    return () => window.removeEventListener('wheel', onWheel)
  }, [setCheckpointIndex])

  useFrame((_, delta) => {
    const targetT: number = checkpoints[checkpointIndex] || 0
    // Smoothly interpolate currentT toward targetT.
    currentTRef.current = THREE.MathUtils.lerp(currentTRef.current, targetT, delta * 2)
    const t: number = currentTRef.current

    // Update camera position along the spline.
    const pos: THREE.Vector3 = spline.getPointAt(t)
    camera.position.copy(pos)
    // Make the camera look slightly ahead along the curve.
    const lookAt: THREE.Vector3 = spline.getPointAt((t + 0.01) % 1)
    camera.lookAt(lookAt)

    // Once we're close enough to the target, release the transition lock.
    if (Math.abs(t - targetT) < 0.001) {
      transitionLockRef.current = false
    }
  })

  return null
}

export default CameraOnCheckpoints
