import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black/40 border-t border-white/10 backdrop-blur-md pt-16 pb-8 px-6 md:px-12 text-white font-['var(--font-montserrat)'] relative z-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Left Column: Brand & Bio */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold tracking-widest uppercase text-[#ccb999]">Usaf's Creations</h2>
            <div className="flex items-center gap-4 text-xs font-bold tracking-wider text-white/80 mt-2">
              <a href="https://github.com/uusaff" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GITHUB</a>
              <a href="https://linkedin.com/in/uusaff" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LINKEDIN</a>
              <a href="#" className="hover:text-white transition-colors">INSTAGRAM</a>
              <a href="mailto:uussaff@gmail.com" className="hover:text-white transition-colors">EMAIL</a>
            </div>
          </div>

          {/* Middle Column: Quick Links */}
          <div className="flex flex-col gap-6 md:px-8">
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#ccb999] uppercase">Quick Links</h3>
            <div className="flex flex-col gap-4 text-sm font-bold tracking-wider text-white/80">
              <Link href="/" className="hover:text-white transition-colors">HOME</Link>
              <Link href="/about" className="hover:text-white transition-colors">ABOUT</Link>
              <Link href="/features" className="hover:text-white transition-colors">FEATURES</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">PRICING</Link>
              <Link href="/enterprise" className="hover:text-white transition-colors">ENTERPRISE</Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">DASHBOARD</Link>
            </div>
          </div>

          {/* Right Column: Connect */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#ccb999] uppercase">Connect</h3>
            <div className="flex flex-col gap-4 text-sm text-white/70">
              <a href="mailto:uussaff@gmail.com" className="hover:text-white transition-colors">uussaff@gmail.com</a>
              <a href="https://github.com/uusaff" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">github.com/uusaff</a>
              <a href="https://linkedin.com/in/uusaff" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">linkedin.com/in/uusaff</a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold tracking-widest text-white/40 uppercase">
          <div>
            &copy; {new Date().getFullYear()} USAF'S CREATIONS. ALL RIGHTS RESERVED.
          </div>
          <div className="text-center">
            BUILT WITH NEXT.JS, TYPESCRIPT, TAILWIND CSS & FRAMER MOTION.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
            <span>&middot;</span>
            <Link href="/terms" className="hover:text-white transition-colors">TERMS OF SERVICE</Link>
            <span>&middot;</span>
            <Link href="/rss" className="hover:text-white transition-colors">RSS FEED</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
