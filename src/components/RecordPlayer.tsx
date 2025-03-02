import React, { useEffect, useState } from 'react'
import { Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function RecordPlayer({ setShowVinyls, showVinyls }: { setShowVinyls: (set: boolean) => void, showVinyls: boolean }) {
  const { scene } = useGLTF('/recordplayer.glb')
  const [hover, setHover] = useState(false)
  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
      // Check the screen size only after the component has mounted
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
      };
  
      // Run the resize handler once on mount
      handleResize();
  
      // Add a resize event listener
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
    }, []);

  // Function to set emissive glow on all meshes in the scene
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

  // Update the cursor and model glow on hover change
  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'auto'
    setEmissive(scene, hover)
  }, [hover, scene])

  // Scale and position the model as needed
  isMobile ? scene.scale.set(0.03, 0.03, 0.03) : scene.scale.set(0.05, 0.05, 0.05);

  const position = [0, 0, -330]

  return (
    <Float floatIntensity={0.01} speed={0.1} floatingRange={[1, 1]} rotationIntensity={0.02}>
      <ambientLight intensity={2} />
      <directionalLight intensity={5} position={[10, 10, 5]} />
      <group>
        <primitive 
          object={scene}
          position={position}
          rotation={[0, Math.PI / 2, Math.PI / 4]}
          onPointerOver={(e: any) => {
            e.stopPropagation()
            setHover(true)
          }}
          onPointerOut={(e: any) => {
            e.stopPropagation()
            setHover(false)
          }}
          onClick={(e: any) => {
            e.stopPropagation()
            setShowVinyls(!showVinyls)
          }}
        />
      </group>
    </Float>
  )
}

useGLTF.preload('/recordplayer.glb')
