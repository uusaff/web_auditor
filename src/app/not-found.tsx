import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden text-white font-['var(--font-montserrat)'] flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image src="/bg-custom.jpg" alt="Background" fill className="object-cover object-center" priority unoptimized />
        <div className="absolute inset-0 bg-[#101b13]/90" />
      </div>

      <div className="relative z-10 text-center flex flex-col items-center px-6">
        <div className="text-[#ccb999] font-['VictoryStriker'] text-9xl tracking-widest mb-4 drop-shadow-[0_0_15px_rgba(204,185,153,0.5)]">
          404
        </div>
        <h2 className="text-3xl font-light tracking-[0.2em] mb-6 uppercase">System Malfunction</h2>
        <p className="text-white/60 max-w-lg mb-12 text-lg">
          The node you are trying to access does not exist in our index. It may have been relocated, deleted, or you might have mistyped the coordinates.
        </p>
        <Link 
          href="/" 
          className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all backdrop-blur-md font-bold tracking-wider"
        >
          Return to Hub
        </Link>
      </div>
    </main>
  );
}
