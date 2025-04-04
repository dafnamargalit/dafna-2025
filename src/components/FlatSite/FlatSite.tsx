import React, { useRef, useState, useEffect } from 'react';
import Layout from './Layout';
import Home from './Home';
import ProgressNav from '../ProgressNav';
import { NavigationProvider, useNavigation } from '@/contexts/NavigationContext';
import About from './About';

const FlatSite: React.FC = () => {
  const sections = {
    home: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    music: useRef<HTMLDivElement>(null),
    videos: useRef<HTMLDivElement>(null),
    merch: useRef<HTMLDivElement>(null),
    tour: useRef<HTMLDivElement>(null),
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 

  const FlatSiteContent = () => {
    const { checkpointIndex, setCheckpointIndex } = useNavigation();

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = Object.keys(sections).length - 1 - Object.keys(sections).indexOf(entry.target.id);
              setCheckpointIndex(index);
            }
          });
        },
        { threshold: 0.5 }
      );
  
      Object.values(sections).forEach((ref) => {
        if (ref.current) {
          observer.observe(ref.current);
        }
      });
  
      return () => {
        Object.values(sections).forEach((ref) => {
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        });
      };
    }, [setCheckpointIndex]);

    return (
      <>
        <ProgressNav isMobile={isMobile} is2D={true} />

        {/* Content Sections */}
        <div className="relative z-10 h-screen w-screen overflow-x-auto overflow-y-auto snap-y snap-mandatory">
          {/* Home Section */}
          <section ref={sections.home} id="home" className="h-screen flex items-center justify-center bg-transparent text-white snap-center">
            <Home />
          </section>

          {/* About Section */}
          <section ref={sections.about} id="about" className="h-screen flex items-center justify-center bg-transparent snap-center">
            <About />
          </section>

          {/* Music Section */}
          <section ref={sections.music} id="music" className="h-screen flex items-center justify-center bg-transparent snap-center">
            <h1 className="text-6xl font-bold text-[#67E8F9] drop-shadow-[0_0_10px_rgba(103,232,249,0.5)]">Music</h1>
          </section>

          {/* Videos Section */}
          <section ref={sections.videos} id="videos" className="h-screen flex items-center justify-center bg-transparent snap-center">
            <h1 className="text-6xl font-bold text-[#67E8F9] drop-shadow-[0_0_10px_rgba(103,232,249,0.5)]">Videos</h1>
          </section>

          {/* Merch Section */}
          <section ref={sections.merch} id="merch" className="h-screen flex items-center justify-center bg-transparent snap-center">
            <h1 className="text-6xl font-bold text-[#67E8F9] drop-shadow-[0_0_10px_rgba(103,232,249,0.5)]">Merch</h1>
          </section>

          {/* Tour Section */}
          <section ref={sections.tour} id="tour" className="h-screen flex items-center justify-center bg-transparent snap-center">
            <h1 className="text-6xl font-bold text-[#67E8F9] drop-shadow-[0_0_10px_rgba(103,232,249,0.5)]">Tour</h1>
          </section>
        </div>
      </>
    );
  };

  return (
    <Layout>
      <NavigationProvider checkpoints={Object.keys(sections)}>
        <FlatSiteContent />
      </NavigationProvider>
    </Layout>
  );
};

export default FlatSite; 