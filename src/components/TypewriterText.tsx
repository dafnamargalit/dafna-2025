import React, { useEffect, useRef, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  setComplete?: (complete: number) => void;
  complete?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 50, setComplete, complete = 1}) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    const type = async () => {
      for (let i = 0; i < text.length; i++) {
        setDisplayedText(text.slice(0, i + 1));
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      setComplete?.(complete);
    };
    type();
  }, [text, speed]);

  return (
    <div className="whitespace-pre-wrap">
      {displayedText}
    </div>
  );
};

export default TypewriterText;