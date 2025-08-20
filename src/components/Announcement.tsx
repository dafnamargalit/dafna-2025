import Link from 'next/link';

interface AnnouncementProps {
  isMobile: boolean;
}

export default function Announcement({ isMobile }: AnnouncementProps) {
  return (
    <Link 
      href={'https://www.youtube.com/watch?v=Vo0xX_MkdCU'} 
      className={`hover:opacity-70 bg-cyan-300 flex ${isMobile ? 'mt-40' : ''} items-center justify-center ${isMobile ? 'p-1 text-sm' : 'p-2'} border-solid border-2 border-cyan-500 text-cyan-700 cursor-pointer`}
      aria-label="WATCH THE BADBADNEWS MUSIC VIDEO"
    >
      <i>WATCH THE BADBADNEWS MUSIC VIDEO</i>
    </Link>
  );
}