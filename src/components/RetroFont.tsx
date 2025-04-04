// e.g., components/CustomFont.tsx
import localFont from 'next/font/local';

const retroFont = localFont({
  src: [
    {
      path: '../../public/fonts/RETROTECH.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-retrotech',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

export default retroFont;
