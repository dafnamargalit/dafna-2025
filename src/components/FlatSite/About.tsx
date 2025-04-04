import React, { useEffect, useState, useRef } from 'react';
import TypewriterText from '../TypewriterText';
import Image from 'next/image';

const About: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div ref={sectionRef} className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 text-cyan-300">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-8 text-center">About</h1>
      <div className="relative flex flex-col md:flex-row items-center md:items-start justify-center gap-2 transform md:-translate-x-1/4">
        <div className="w-full md:w-3/4">
          <Image 
            src="/images/tvgirlnoise.png" 
            alt="About" 
            width={2000} 
            height={2000}
            className="w-full h-auto" 
          />
        </div>
        <div className="w-full md:w-1/2 md:absolute md:top-0 md:right-0 md:transform md:translate-x-1/4 space-y-2 text-base md:text-xl text-yellow-300 text-center md:text-left">
          {isVisible && (
            <TypewriterText
              text={`Hi, I'm Dafna! I'm a software engineer and musician based in Los Angeles. I make indie pop music and write code. This website is one of my experiments– hit the toggle on the top right to view it in 3D ${isMobile ? '(better on desktop)' : ''} or keep scrolling for more.`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
