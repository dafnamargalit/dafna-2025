import React, { useEffect, useRef, useState } from 'react'
import { Float, useFBX, useGLTF } from '@react-three/drei'

export default function Merch() {
    const { scene } = useGLTF('/tshirts.glb')
    const [hover, setHover] = useState(false);

    useEffect(() => {
       document.body.style.cursor = hover ? 'pointer' : 'auto'
    }, [hover])
    // Optionally scale and adjust as needed

    const position = [0,-10,-130];
    
  return (
    <>
        <group>
        <ambientLight intensity={2} />
        <directionalLight intensity={hover ? -100 : 3} position={[10, 10, 5]} />
          <primitive 
            object={scene} 
            position={position} 
            scale={0.006}
            rotation={[0, Math.PI / 3, 0]}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            onClick={() => {setHover(true); window.open("https://shop.dafna.rocks")}}
          />
        </group>
    </>
  )
}

useGLTF.preload('/tshirts.glb')

