// e.g., components/CustomFont.tsx
import localFont from 'next/font/local';

const retroFont = localFont({
  src: [
    {
      path: '../../public/fonts/RETROTECH.ttf',
      weight: '400', // adjust as needed
      style: 'normal',
    },
  ],
  // Optionally, assign a CSS variable name:
  variable: '--font-retrotech',
});

export default retroFont;
