import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import GridPlane from './GridPlane'
import { CameraShake, OrbitControls, Preload, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { ChevronDown, DafnaLogo, IconGithub, IconInstagram, IconSpotify, IconYoutube } from './Icons'
import { FloatingTV } from './FloatingTV'
import Merch from './Merch'
import { FloatingVinyls } from './FloatingVinyls'
import Modal, { ModalData } from './Modal'
import { albums } from '@/lib/constants'
import retroFont from './RetroFont'
import { RemoveScroll } from 'react-remove-scroll'
import RecordPlayer from './RecordPlayer'
import { TourBus } from './TourBus'
import TourDates from './TourDates'

// Define checkpoints along the Z axis.
const CHECKPOINTS = [500, 300, 100, 0, -100, -300, -480]

function Tunnel() {
  return (
    <>
      {/* Left Wall */}
      <group position={[-8, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <GridPlane width={1000} height={20} widthSegments={1000} heightSegments={20} color="#25b5f7" />
      </group>
      {/* Right Wall */}
      <group position={[8, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <GridPlane width={1000} height={20} widthSegments={1000} heightSegments={20} color="#25b5f7" />
      </group>
      {/* Floor */}
      <group position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <GridPlane width={16} height={1000} widthSegments={20} heightSegments={1000} color="#25b5f7" />
      </group>
      {/* Ceiling */}
      <group position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <GridPlane width={16} height={1000} widthSegments={20} heightSegments={1000} color="#25b5f7" />
      </group>
      {/* End Wall */}
      <group position={[0, 0, -500]}>
        <GridPlane width={16} height={20} widthSegments={20} heightSegments={20} color="#25b5f7" />
      </group>
    </>
  )
}

function CameraController({ checkpointIndex }: { checkpointIndex: number }) {
  useFrame(({ camera, mouse }) => {
    // 1) Smoothly move the camera along the z-axis toward the selected checkpoint
    const targetZ = CHECKPOINTS[checkpointIndex]
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1)

    // 2) Slightly rotate camera based on mouse position (-1 to +1)
    //    Adjust `rotationFactor` and `lerp` to make the effect stronger or smoother.
    const rotationFactor = 0.4
    camera.rotation.x = THREE.MathUtils.lerp(
      camera.rotation.x,
      -mouse.y * rotationFactor,
      0.1
    )
    camera.rotation.y = THREE.MathUtils.lerp(
      camera.rotation.y,
      mouse.x * rotationFactor,
      0.1
    )
  })
  return null
}

export default function TunnelScene() {
  const [checkpointIndex, setCheckpointIndex] = useState(0)
  const [pageLoaded, setPageLoaded] = useState(false);
  // Ref for throttling scroll events.
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartY = useRef<number | null>(null)
  const [isMobile, setIsMobile] = useState(false);
  const [showVinyls, setShowVinyls] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [showTourDates, setShowTourDates] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()  // Prevent scrolling
    }

    // Be sure to set passive: false so preventDefault works
    canvas && canvas.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      canvas && canvas.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  useEffect(() => {
    const service = localStorage.getItem("streaming-service");
    albums.map((album: ModalData) => {if (showModal?.includes(album.name)) {
      switch (service) {
        case "spotify":
          window.open(album.spotify);
        break;
        case "youtube":
          window.open(album.youtube);
        break;
        case "tidal":
          window.open(album.tidal);
        break;
        case "apple":
          window.open(album.apple);
        break;
        case null:
          setModalData(album);
        break;
        default:
          setModalData(album);
          break;
      }
    }});
  }, [showModal]);

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

  const handleBack = () => {
    setCheckpointIndex(prev => Math.min(prev + 1, CHECKPOINTS.length - 1))
  }
  const handleNext = () => {
    setCheckpointIndex(prev => Math.max(prev - 1, 0))
  }

  useEffect(() => {
    if(!pageLoaded){
        setCheckpointIndex(CHECKPOINTS.length - 1);
    }
    setTimeout(() => {
      setPageLoaded(true);
    }, 1000);
  }, [pageLoaded])

  // Handle scroll events to trigger checkpoint changes.
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Throttle to one scroll action per 800ms (adjust as needed)
    if (throttleTimeoutRef.current) return

    if (e.deltaY > 0) {
      handleNext()
    } else {
      handleBack()
    }
    throttleTimeoutRef.current = setTimeout(() => {
      throttleTimeoutRef.current = null
    }, 1000)
  }
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (throttleTimeoutRef.current) return

      if (e.key === "ArrowUp") {
        handleBack()
      }
      else if (e.key === "ArrowDown") {
        handleNext()
      }
        throttleTimeoutRef.current = null
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY
  }

  // Handle touch end event (for mobile)
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current === null) return
    const touchEndY = e.changedTouches[0].clientY
    const deltaY = touchStartY.current - touchEndY
    // Use a threshold of 50px to determine if it's a swipe.
    if (!throttleTimeoutRef.current) {
      if (deltaY > 50) {
        handleNext()
      } else if (deltaY < -50) {
        handleBack()
      }
      throttleTimeoutRef.current = setTimeout(() => {
        throttleTimeoutRef.current = null
      }, 1000)
    }
    touchStartY.current = null
  }
  const config = {
    maxYaw: 0.1, // Max amount camera can yaw in either direction
    maxPitch: 0.2, // Max amount camera can pitch in either direction
    maxRoll: 0.1, // Max amount camera can roll in either direction
    yawFrequency: 0.1, // Frequency of the yaw rotation
    pitchFrequency: 0.2, // Frequency of the pitch rotation
    rollFrequency: 0.1, // Frequency of the roll rotation
    intensity: 0.6, // initial intensity of the shake
    decay: false, // should the intensity decay over time
    decayRate: 0.65, // if decay = true this is the rate at which intensity will reduce at
    controls: undefined, // if using orbit controls, pass a ref here so we can update the rotation
  }
  
  return (
    <div onWheel={handleWheel} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <RemoveScroll  className={`absolute w-screen h-screen relative overscroll-none overflow-y-none ${retroFont.className}`} >
      <Canvas shadows ref={canvasRef} gl={{ preserveDrawingBuffer: true }} style={{ touchAction: 'auto !important'}} camera={{ position: [0, 0, CHECKPOINTS[0]], fov: 75 }}>
        <CameraShake {...config} />
        <ambientLight intensity={0.015} />
        <CameraController checkpointIndex={checkpointIndex} />
        <Tunnel />
          <Preload all />
          <Suspense fallback={null}>
          {pageLoaded && <Merch />}
          </Suspense>
          <Suspense fallback={null}>
          {pageLoaded && <FloatingTV isMobile={isMobile} />}
          </Suspense>
          <Suspense fallback={null}>
          {pageLoaded && <RecordPlayer isMobile={isMobile} setShowVinyls={setShowVinyls} showVinyls={showVinyls} />}
          </Suspense>
          <Suspense fallback={null}>
          {showVinyls && <FloatingVinyls isMobile={isMobile} setShowModal={setShowModal} />}
          </Suspense>
          <Suspense fallback={null}>
          {pageLoaded && checkpointIndex === 2 && <TourBus setShowTourDates={setShowTourDates} isMobile={isMobile} />}
          </Suspense>
        <fogExp2 attach="fog" args={[0x000000, 0.005]} />
        <Stars
          radius={500}   // Stars distributed within a sphere of radius 500
          depth={10}     // Spread over 90 units in depth
          count={20000}  // More stars for more wow
          factor={15}    // Controls star size
          saturation={0} // Optional: adjust color saturation        // Optional: fade stars with distance
        />
      </Canvas>
      {(checkpointIndex === CHECKPOINTS.length - 1) && 
      <div className={`absolute ${isMobile ? 'bottom-24' : 'bottom-4'} px-4 flex flex-col overscroll-none overflow-hidden items-center justify-center h-screen w-screen z-10`}>
       <DafnaLogo width={isMobile ? 200 : 400} height={isMobile ? 200 : 400}/>
       <div className='flex flex-row space-x-2'>
            <a href='https://open.spotify.com/artist/6FR2ARlfDqNU7BMBaWjGZP?si=DSyNj67wTyi1A4G7JZF-0w'>
            <IconSpotify />
            </a>
            <a href="https://instagram.com/dafnamusic">
            <IconInstagram />
            </a>
            <a href='https://www.youtube.com/channel/UCzPtND9EY5MkOepLzllAbiw'>
            <IconYoutube />
            </a>
            <a href='https://github.com/dafnamargalit'>
            <IconGithub />
            </a>
        </div>
        <button className={`absolute text-cyan-300 items-center justify-center flex flex-col bottom-4`} onClick={handleNext}>
          <div>{isMobile ? 'swipe down' : 'scroll down'}</div>
        <ChevronDown fill="#67E8F9"/>
        </button>
      </div>}
      {modalData &&
          <Modal
            modalData={modalData}
            closeModal={() => setModalData(null)}
            isMobile={isMobile}
          />
      }
         {showTourDates && <TourDates isMobile={isMobile} closeModal={() => setShowTourDates(false)} />}
            </RemoveScroll>
    </div>
  )
}
