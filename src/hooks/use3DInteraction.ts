import { useState, useCallback, useEffect } from 'react'
import * as THREE from 'three'

export function use3DInteraction(scene: THREE.Object3D) {
  const [hover, setHover] = useState(false)
  
  const handlePointerOver = useCallback(() => setHover(true), [])
  const handlePointerOut = useCallback(() => setHover(false), [])
  
  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'auto'
    setEmissive(scene, hover)

    return () => {
      // Reset cursor on unmount
      document.body.style.cursor = 'auto'
    }
  }, [hover, scene])
  
  return { hover, handlePointerOver, handlePointerOut }
}

function setEmissive(object: THREE.Object3D, highlight: boolean) {
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