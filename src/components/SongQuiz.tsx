import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { RemoveScroll } from "react-remove-scroll";
import retroFont from "./RetroFont";
import { CameraController, Tunnel } from "./TunnelScene";
import { NavigationProvider, useNavigation } from "@/contexts/NavigationContext";
import { CameraShake, Stars } from "@react-three/drei";
import { quizQuestions, controlledChaosResultUrls, albums } from "@/lib/constants";
import TypewriterText from "./TypewriterText";
import Modal from "./Modal";

// Adjust checkpoints to match tunnel length and ensure proper positioning
const CHECKPOINTS = [4000, 3900, 3500, 3000, 2500, 2000];

function SongQuizContent() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [result, setResult] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isMobile, setIsMobile] = useState(false);
  const [complete, setComplete] = useState(0);
  const { checkpointIndex, setCheckpointIndex, handleBack } = useNavigation();
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Set initial position to the start of the tunnel
    setCheckpointIndex(0);
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
  
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSongClick = (result: string) => {
    const song = controlledChaosResultUrls.find(song => song.name == result)

    const service = localStorage.getItem("streaming-service");
    if (service) {
      switch (service) {
        case "spotify":
          window.open(song?.spotify, '_blank');
          break;
        case "youtube":
          window.open(song?.youtube, '_blank');
          break;
        case "tidal":
          window.open(song?.tidal, '_blank');
          break;
        case "apple":
          window.open(song?.apple, '_blank');
          break;
        default:
          break;
      }
    }
  };

  const handleAnswer = async (nextId: number) => {
    if(checkpointIndex < 5) {
      handleBack();
    }

    const nextStep = quizQuestions.find((q) => q.id === nextId);
    if (nextStep?.result) {
      setResult(nextStep.result);
    } else {
      setCurrentQuestion(nextId);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(1);
    setResult(null);
    setCheckpointIndex(0);
    setComplete(0);
    setKey(prev => prev + 1);
  };

  const question = quizQuestions.find((q) => q.id === currentQuestion);

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
    <div>
      <RemoveScroll className={`absolute w-screen h-screen relative overscroll-none overflow-y-none ${retroFont.className}`}>
        <Canvas 
          key={key}
          shadows 
          ref={canvasRef} 
          gl={{ antialias: false, powerPreference: 'low-power', preserveDrawingBuffer: true }} 
          style={{ touchAction: 'auto !important'}} 
          camera={{ position: [0, 0, CHECKPOINTS[0]], fov: 75 }} 
          dpr={[1, 1.5]} 
          performance={{ min: 0.1, max: 0.5 }}
        >
          <CameraController />
          <Tunnel isMobile={isMobile} />
          <CameraShake {...cameraShakeConfig} />
          <fogExp2 attach="fog" args={[0x000000, 0.005]} />
          <Stars
            radius={500}
            depth={10}
            count={isMobile ? 10000 : 20000}
            factor={15}
            saturation={0}
          />
        </Canvas>
        {showModal ? (
        <Modal
          closeModal={() => setShowModal(false)}
          isMobile={isMobile}
          optional={false}
        />
      ) :
        <div className={`absolute ${isMobile ? 'bottom-4' : 'bottom-4'} px-4 flex flex-col overscroll-none overflow-hidden items-center justify-center h-screen w-screen z-10`}>
          {result ? 
            <div className="flex flex-col items-center p-6 text-center text-cyan-400 bg-gray-700/75">
              <h1 className="text-2xl font-bold">Your Song Match: {result}</h1>
              {result && (
                <img
                  src={`/images/chaos.jpg`}
                  alt={`controlledchaos`}
                  className="mt-6 rounded shadow-lg max-w-xs w-1/2 mx-auto"
                />
              )}
                <button 
                className="mt-6 px-4 py-2 bg-cyan-300 text-cyan-700 hover:bg-cyan-400 transition-colors" 
                onClick={() => handleSongClick(result)}
              >
                Listen Now
              </button>
              <button 
                className="mt-6 px-4 py-2 bg-cyan-300 text-cyan-700 hover:bg-cyan-400 transition-colors" 
                onClick={handleRestart}
              >
                Restart Quiz
              </button>
            </div> 
            :  
            <div className="flex flex-col items-center p-6 text-center text-cyan-100">
              <h1 className="text-2xl font-bold">
                <TypewriterText 
                  text={question?.question || ''}
                  setComplete={setComplete}
                  complete={1}
                /></h1>
              <div className="mt-4 space-y-4">
                {question?.options?.map((option, index) => (
                  <button 
                    key={index} 
                    disabled={complete < 3}
                    className={`w-full ${complete < 3 ? 'cursor-not-allowed' : 'hover:text-cyan-400 transition-colors'}`} 
                    onClick={() => {setComplete(0); handleAnswer(option.next)}}
                  >
                    {complete >= index + 1 && <TypewriterText 
                      text={option.text}
                      setComplete={setComplete}
                      complete={index + 2}
                    />}
                  </button>
                ))}
              </div>
            </div>
          }
        </div>
}
      </RemoveScroll>
    </div>
  );
}

export default function SongQuiz() {
  return (
    <NavigationProvider checkpoints={CHECKPOINTS}>
      <SongQuizContent />
    </NavigationProvider>
  );
}