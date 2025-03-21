import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { RemoveScroll } from "react-remove-scroll";
import retroFont from "./RetroFont";
import { CameraController, Tunnel } from "./TunnelScene";
import { NavigationProvider, useNavigation } from "@/contexts/NavigationContext";
import { CameraShake, Stars } from "@react-three/drei";
import { quizQuestions } from "@/lib/constants";

// Adjust checkpoints to match tunnel length and ensure proper positioning
const CHECKPOINTS = [2000, 1900, 1800, 1700, 1600, 1500, 1400, 1300, 1200, 1100, 1000, 900, 800, 700, 600, 500, 400, 300, 200, 100, 0]

function SongQuizContent() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isMobile, setIsMobile] = useState(false);
  const { checkpointIndex, setCheckpointIndex, handleBack } = useNavigation();
  const [key, setKey] = useState(0); // Add key for forcing Canvas remount

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

  const handleAnswer = (nextId: number) => {
    handleBack();
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
    setKey(prev => prev + 1); // Force Canvas remount
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
          key={key} // Add key to force remount
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
        <div className={`absolute ${isMobile ? 'bottom-24' : 'bottom-4'} px-4 flex flex-col overscroll-none overflow-hidden items-center justify-center h-screen w-screen z-10`}>
          {result ? 
            <div className="flex flex-col items-center p-6 text-center text-white">
              <h1 className="text-2xl font-bold">Your Song Match: {result} 🎶</h1>
              <p className="mt-4">Listen to your song and let us know if it fits your vibe!</p>
              <button 
                className="mt-6 px-4 py-2 bg-cyan-300 text-cyan-700 hover:bg-cyan-400 transition-colors" 
                onClick={handleRestart}
              >
                Restart Quiz
              </button>
            </div> 
            :  
            <div className="flex flex-col items-center p-6 text-center text-white">
              <h1 className="text-2xl font-bold">{question?.question}</h1>
              <div className="mt-4 space-y-4">
                {question?.options?.map((option, index) => (
                  <button 
                    key={index} 
                    className="w-full hover:text-cyan-400 transition-colors" 
                    onClick={() => handleAnswer(option.next)}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          }
        </div>
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