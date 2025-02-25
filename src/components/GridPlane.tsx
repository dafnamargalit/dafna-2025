// components/GridPlane.tsx
import React, { useMemo } from 'react'
import * as THREE from 'three'

type GridPlaneProps = {
  width: number
  height: number
  widthSegments?: number
  heightSegments?: number
  color?: string
}

export default function GridPlane({
  width,
  height,
  widthSegments = 9,
  heightSegments = 9,
  color = '#25b5f7',
}: GridPlaneProps) {
  const lineGeom = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const lines: number[] = []

    const halfW = width / 2
    const halfH = height / 2
    const stepW = width / widthSegments
    const stepH = height / heightSegments

    // Horizontal lines
    for (let i = 0; i <= heightSegments; i++) {
      const y = -halfH + i * stepH
      lines.push(-halfW, y, 0, halfW, y, 0)
    }

    // Vertical lines
    for (let j = 0; j <= widthSegments; j++) {
      const x = -halfW + j * stepW
      lines.push(x, -halfH, 0, x, halfH, 0)
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lines), 3))
    return geometry
  }, [width, height, widthSegments, heightSegments])

  return (
    <lineSegments geometry={lineGeom}>
      <lineBasicMaterial color={color} />
    </lineSegments>
  )
}
