import Link from 'next/link';

interface AnnouncementProps {
  isMobile: boolean;
}

export default function Announcement({ isMobile }: AnnouncementProps) {
  return (
    <Link 
      href={'https://apollodistro.lnk.to/Dafna-CLINGWRAP'} 
      className={`hover:opacity-70 bg-cyan-300 flex ${isMobile ? 'mt-40' : ''} items-center justify-center ${isMobile ? 'p-1 text-sm' : 'p-2'} border-solid border-2 border-cyan-500 text-cyan-700 cursor-pointer`}
      aria-label="STREAM CLINGWRAP"
    >
      <i>STREAM "CLINGWRAP"</i>
    </Link>
  );
}