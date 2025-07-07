import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import GridPlane from './GridPlane'
import { CameraShake, OrbitControls, Preload, Stars, useGLTF } from '@react-three/drei'
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
import ProgressNav from './ProgressNav'
import Link from 'next/link'
import { NavigationProvider, useNavigation } from '../contexts/NavigationContext'
import { LoadingIndicator } from './LoadingIndicator'
import { Computer } from './Computer'
import TypewriterText from './TypewriterText'
import Announcement from './Announcement'

// Define checkpoints along the Z axis.
const CHECKPOINTS = [300, 100, 0, -100, -300, -480]

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
      <group position={[0, 0, -500]}>
        <GridPlane width={16} height={20} widthSegments={20} heightSegments={20} color="#25b5f7" />
      </group>
    </>
  )
}

export function CameraController() {
  const { checkpointIndex } = useNavigation();
  
  useFrame(({ camera, mouse }) => {
    // 1) Smoothly move the camera along the z-axis toward the selected checkpoint
    const targetZ = CHECKPOINTS[checkpointIndex]
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.2)

    // 2) Slightly rotate camera based on mouse position (-1 to +1)
    const rotationFactor = 0.4
    camera.rotation.x = THREE.MathUtils.lerp(
      camera.rotation.x,
      -mouse.y * rotationFactor,
      0.2
    )
    camera.rotation.y = THREE.MathUtils.lerp(
      camera.rotation.y,
      mouse.x * rotationFactor,
      0.2
    )
  })
  return null
}

// Preload all models to improve performance
function ModelPreloader() {
  useGLTF.preload('/models/paradox.glb');
  useGLTF.preload('/models/wiwwy_draco.glb');
  useGLTF.preload('/models/ily.glb');
  useGLTF.preload('/models/submerge_draco.glb');
  useGLTF.preload('/models/tourbus_draco.glb');
  useGLTF.preload('/models/recordplayer_draco.glb');
  useGLTF.preload('/models/tshirts_draco.glb');
  useGLTF.preload('/models/old_tv_draco.glb');
  useGLTF.preload('/models/tvandcomputer.glb');
  return null;
}

function TunnelSceneContent() {
  const { checkpointIndex, setCheckpointIndex, handleNext, handleBack } = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartY = useRef<number | null>(null)
  const [isMobile, setIsMobile] = useState(false);
  const [showVinyls, setShowVinyls] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [showTourDates, setShowTourDates] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isNavigating = useRef(false)

  // Prevent touch move events on canvas to avoid scrolling the page
  useEffect(() => {
    const canvas = canvasRef.current
    const handleTouchMove = (e: TouchEvent) => {
      if (!isNavigating.current) {
        e.preventDefault()
      }
    }

    canvas && canvas.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      canvas && canvas.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  // Handle streaming service selection from localStorage
  useEffect(() => {
    const service = localStorage.getItem("streaming-service");
    if (!showModal) return;
    
    albums.forEach((album: ModalData) => {
      if (showModal.includes(album.name)) {
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
          default:
            setModalData(album);
            break;
        }
      }
    });
  }, [showModal]);

  // Check if device is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize page and show loading indicator
  useEffect(() => {
    if(isLoading){
      setTimeout(() => {
        setCheckpointIndex(CHECKPOINTS.length - 3);
        setShowVinyls(true);
      }, 600);
      setCheckpointIndex(0);
      setShowVinyls(false);
    }
    
    // Simulate loading completion
    const timer = setTimeout(() => {
      setCheckpointIndex(CHECKPOINTS.length - 1);
      setIsLoading(false);
      setShowVinyls(false);
    }, 2000);


    return () => clearTimeout(timer);
  }, [setCheckpointIndex]);

  // Handle wheel events for navigation
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
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
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (throttleTimeoutRef.current) return

      if (e.key === "ArrowUp") {
        handleBack()
      }
      else if (e.key === "ArrowDown") {
        handleNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleBack, handleNext])

  // Handle touch navigation for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isNavigating.current || showModal || showTourDates) return
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isNavigating.current || showModal || showTourDates) return
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current === null || isNavigating.current || showModal || showTourDates) return
    const touchEndY = e.changedTouches[0].clientY
    const deltaY = touchStartY.current - touchEndY
    
    if (!throttleTimeoutRef.current) {
      isNavigating.current = true
      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          handleNext()
        } else {
          handleBack()
        }
      }
      
      setTimeout(() => {
        isNavigating.current = false
        throttleTimeoutRef.current = setTimeout(() => {
          throttleTimeoutRef.current = null
        }, 500)
      }, 300)
    }
    touchStartY.current = null
  }

  // Optimize model loading
  useEffect(() => {
    // Preload all models immediately for smoother transitions
    useGLTF.preload('/models/paradox.glb');
    useGLTF.preload('/models/wiwwy_draco.glb');
    useGLTF.preload('/models/ily.glb');
    useGLTF.preload('/models/submerge_draco.glb');
    useGLTF.preload('/models/tourbus_draco.glb');
    useGLTF.preload('/models/recordplayer_draco.glb');
    useGLTF.preload('/models/tshirts_draco.glb');
    useGLTF.preload('/models/old_tv_draco.glb');
  }, [isMobile])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear any pending timeouts
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current)
      }
      // Reset navigation state
      isNavigating.current = false
    }
  }, [])

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
  
  return (
    <div 
      onWheel={handleWheel} 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {isLoading && <LoadingIndicator />}
      
      <RemoveScroll className={`absolute w-screen h-screen relative overscroll-none overflow-y-none ${retroFont.className}`}>
        <Canvas 
          shadows 
          ref={canvasRef} 
          gl={{ 
            antialias: false, 
            powerPreference: 'low-power',
            preserveDrawingBuffer: true
          }} 
          style={{ touchAction: 'auto !important'}} 
          camera={{ position: [0, 0, CHECKPOINTS[0]], fov: 75 }} 
          dpr={[1, 1.5]} 
          performance={{ min: 0.1, max: 0.5 }}
        >
          <CameraShake {...cameraShakeConfig} />
          <ambientLight intensity={0.015} />
          <ModelPreloader />
          <CameraController />
          <Tunnel isMobile={isMobile} />
          <Preload all />

          <Suspense fallback={null}>
            <Computer showing={checkpointIndex === CHECKPOINTS.length - 2} isMobile={isMobile} />
          </Suspense>

          <Suspense fallback={null}>
            <RecordPlayer isMobile={isMobile} setShowVinyls={setShowVinyls} showVinyls={showVinyls} />
          </Suspense>
          
          <Suspense fallback={null}>
            {showVinyls && <FloatingVinyls isMobile={isMobile} setShowModal={setShowModal} />}
          </Suspense>
          
          <Suspense fallback={null}>
            <FloatingTV isMobile={isMobile} />
          </Suspense>
          
          <Suspense fallback={null}>
            <Merch />
          </Suspense>

          <Suspense fallback={null}>
            {checkpointIndex === 0 && <TourBus setShowTourDates={setShowTourDates} isMobile={isMobile} />}
          </Suspense>
          
          
          <fogExp2 attach="fog" args={[0x000000, 0.005]} />
          <Stars
            radius={500}
            depth={10}
            count={isMobile ? 10000 : 20000}
            factor={15}
            saturation={0}
          />
        </Canvas>
        
        {(checkpointIndex === CHECKPOINTS.length - 1) && 
          <div className={`absolute ${isMobile ? 'bottom-24' : 'bottom-4'} px-4 flex flex-col overscroll-none overflow-hidden items-center justify-center h-screen w-screen z-10`}>
            <Announcement isMobile={isMobile} />
            <DafnaLogo width={isMobile ? 200 : 400} height={isMobile ? 200 : 400}/>
            <div className='flex flex-row space-x-2'>
              <a href='https://open.spotify.com/artist/6FR2ARlfDqNU7BMBaWjGZP?si=DSyNj67wTyi1A4G7JZF-0w' aria-label="Spotify" className="cursor-pointer">
                <IconSpotify />
              </a>
              <a href="https://instagram.com/dafnamusic" aria-label="Instagram" className="cursor-pointer">
                <IconInstagram />
              </a>
              <a href='https://www.youtube.com/channel/UCzPtND9EY5MkOepLzllAbiw' aria-label="YouTube" className="cursor-pointer">
                <IconYoutube />
              </a>
              <a href='https://github.com/dafnamargalit' aria-label="GitHub" className="cursor-pointer">
                <IconGithub />
              </a>
            </div>
            <button 
              className={`absolute text-cyan-300 items-center justify-center flex flex-col bottom-4 cursor-pointer`} 
              onClick={handleNext}
              aria-label={isMobile ? 'Swipe down to explore' : 'Scroll down to explore'}
            >
              <div>{isMobile ? 'swipe down' : 'scroll down'}</div>
              <ChevronDown fill="#67E8F9"/>
            </button>
          </div>
        }
        
        {modalData && (
          <Modal
            modalData={modalData}
            closeModal={() => setModalData(null)}
            isMobile={isMobile}
          />
        )}
        
        {checkpointIndex === 0 &&   
        <div className={`absolute ${isMobile ? 'bottom-24' : 'bottom-4'} px-4 flex flex-col overscroll-none overflow-hidden items-center justify-center h-40 cursor-pointer w-screen z-10`}>
        <button 
              className={`absolute text-cyan-300 items-center justify-center flex flex-col bottom-4 cursor-pointer`} 
              onClick={() => setCheckpointIndex(CHECKPOINTS.length - 1)}
              aria-label={'back to home'}
            >
              <div className='transform rotate-180'>
                <ChevronDown fill="#67E8F9"/>
              </div>
              <div>back to home</div>
            </button>
          </div>}
        {showTourDates && <TourDates isMobile={isMobile} closeModal={() => setShowTourDates(false)} />}
        <ProgressNav isMobile={isMobile} is2D={false} />
      </RemoveScroll>
    </div>
  )
}

export default function TunnelScene() {
  return (
    <NavigationProvider checkpoints={CHECKPOINTS}>
      <TunnelSceneContent />
    </NavigationProvider>
  );
}