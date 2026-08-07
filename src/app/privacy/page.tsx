import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen w-full text-white font-['var(--font-montserrat)'] flex flex-col items-center justify-center bg-transparent">

      <div className="relative z-10 text-center flex flex-col items-center px-6 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-['VictoryStriker'] text-[#ccb999] tracking-widest mb-6">PRIVACY POLICY</h1>
        <div className="bg-black/40 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md text-left w-full h-[50vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">1. Information We Collect</h2>
          <p className="text-white/60 mb-6 font-light leading-relaxed">
            We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.
          </p>
          <h2 className="text-xl font-bold mb-4">2. Use of Information</h2>
          <p className="text-white/60 mb-6 font-light leading-relaxed">
            We may use the information we collect about you to provide, maintain, and improve our services, including, for example, to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to Users and Drivers, develop safety features, authenticate users, and send product updates and administrative messages.
          </p>
          <h2 className="text-xl font-bold mb-4">3. Sharing of Information</h2>
          <p className="text-white/60 font-light leading-relaxed">
            We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows: with third parties to provide you a service you requested through a partnership or promotional offering made by a third party or us; with the general public if you submit content in a public forum, such as blog comments, social media posts, or other features of our Services that are viewable by the general public.
          </p>
        </div>
        <Link href="/" className="mt-8 text-white/40 hover:text-white transition-colors underline underline-offset-4">
          Return to Hub
        </Link>
      </div>
    </main>
  );
}
