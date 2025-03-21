// components/CameraOnCheckpoints.tsx
import React, { useState, useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import spline from '@/lib/spline'

// Generate checkpoints along the spline (here, 21 checkpoints from 0 to 1)

interface CameraOnCheckpointsProps {
  checkpointIndex: number
  setCheckpointIndex: React.Dispatch<React.SetStateAction<number>>
  checkpoints: number[]
  numCheckpoints: number
}

const CameraOnCheckpoints: React.FC<CameraOnCheckpointsProps> = ({ checkpointIndex, setCheckpointIndex, checkpoints, numCheckpoints }) => {
  const { camera } = useThree()
  // Instead of keeping currentT strictly in [0,1], use an absolute value that can exceed 1.
  const absoluteTRef = useRef<number>(checkpoints[checkpointIndex])
  // Ref used to throttle scroll events.
  // Lock so that new transitions don't start until the current one finishes.
  const transitionLockRef = useRef<boolean>(false)


  useFrame((_, delta) => {
    // Get the current absolute parameter and the target fractional checkpoint.
    const currentAbs = absoluteTRef.current
    const currentFraction = currentAbs % 1
    const targetFraction = checkpoints[checkpointIndex]

    // Compute the desired absolute target.
    // Start with the floor of currentAbs plus targetFraction.
    let desiredAbs = Math.floor(currentAbs) + targetFraction
    // If the targetFraction is less than the current fraction, we must be wrapping forward.
    if (targetFraction < currentFraction) {
      desiredAbs += 1
    }

    // Interpolate smoothly towards the desired absolute value.
    absoluteTRef.current = THREE.MathUtils.lerp(currentAbs, desiredAbs, delta * 2)
    // Use the modulo value to get the position on the closed curve.
    const t = absoluteTRef.current % 1

    // Update camera position.
    const pos: THREE.Vector3 = spline.getPointAt(t)
    camera.position.copy(pos)
    // Look ahead slightly.
    const lookAt: THREE.Vector3 = spline.getPointAt((t + 0.01) % 1)
    camera.lookAt(lookAt)

    // When close enough to the desired absolute value, release the transition lock.
    if (Math.abs(absoluteTRef.current - desiredAbs) < 0.001) {
      transitionLockRef.current = false
    }
  })

  return null
}

export default CameraOnCheckpoints