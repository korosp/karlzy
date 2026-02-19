import Link from 'next/link';
import { ChevronLeft, Zap, Mail, Github, Instagram } from 'lucide-react';

function IconTiktok() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/>
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#212121] text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/chat" className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[#8e8ea0] hover:text-white">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#0284c7] flex items-center justify-center">
              <Zap size={13} className="text-white fill-white" />
            </div>
            <span className="font-bold">KarlX AI</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Kontak & Sosial</h1>
        <p className="text-[#8e8ea0] mb-10">Hubungi developer atau ikuti kami di sosial media</p>

        <div className="space-y-4">
          <a href="mailto:karls@karltezy.com"
            className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-[#2f2f2f] hover:bg-[#383838] transition-colors group">
            <div className="w-11 h-11 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center group-hover:bg-[#00d4ff]/20 transition-colors">
              <Mail size={20} className="text-[#00d4ff]" />
            </div>
            <div>
              <p className="font-semibold text-[#ececec]">Email</p>
              <p className="text-sm text-[#8e8ea0]">karls@karltezy.com</p>
            </div>
          </a>

          <a href="https://github.com/korosp" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-[#2f2f2f] hover:bg-[#383838] transition-colors group">
            <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <Github size={20} className="text-[#ececec]" />
            </div>
            <div>
              <p className="font-semibold text-[#ececec]">GitHub</p>
              <p className="text-sm text-[#8e8ea0]">github.com/korosp</p>
            </div>
          </a>

          <a href="https://www.instagram.com/kkarlzy_?igsh=MTB1bG5mMzh6NzFyZw==" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-[#2f2f2f] hover:bg-[#383838] transition-colors group">
            <div className="w-11 h-11 rounded-xl bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
              <Instagram size={20} className="text-pink-400" />
            </div>
            <div>
              <p className="font-semibold text-[#ececec]">Instagram</p>
              <p className="text-sm text-[#8e8ea0]">@kkarlzy_</p>
            </div>
          </a>

          <a href="https://tiktok.com/karlzyy9" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-[#2f2f2f] hover:bg-[#383838] transition-colors group">
            <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <IconTiktok />
            </div>
            <div>
              <p className="font-semibold text-[#ececec]">TikTok</p>
              <p className="text-sm text-[#8e8ea0]">@karlzyy9</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
