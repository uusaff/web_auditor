import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
  return (
    <main className="relative min-h-screen w-full text-white font-['var(--font-montserrat)'] flex flex-col items-center justify-center bg-transparent">

      <div className="relative z-10 text-center flex flex-col items-center px-6 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-['VictoryStriker'] text-[#ccb999] tracking-widest mb-6">TERMS OF SERVICE</h1>
        <div className="bg-black/40 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md text-left w-full h-[50vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p className="text-white/60 mb-6 font-light leading-relaxed">
            By accessing and using our application, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
          </p>
          <h2 className="text-xl font-bold mb-4">2. Description of Service</h2>
          <p className="text-white/60 mb-6 font-light leading-relaxed">
            Our platform provides users with access to a rich collection of resources, including various communications tools, forums, shopping services, personalized content, and branded programming through its network of properties which may be accessed through any various medium or device now known or hereafter developed.
          </p>
          <h2 className="text-xl font-bold mb-4">3. User Conduct</h2>
          <p className="text-white/60 font-light leading-relaxed">
            You understand that all information, data, text, software, music, sound, photographs, graphics, video, messages, tags, or other materials, whether publicly posted or privately transmitted, are the sole responsibility of the person from whom such Content originated. This means that you, and not us, are entirely responsible for all Content that you upload, post, email, transmit or otherwise make available via the Service.
          </p>
        </div>
        <Link href="/" className="mt-8 text-white/40 hover:text-white transition-colors underline underline-offset-4">
          Return to Hub
        </Link>
      </div>
    </main>
  );
}
