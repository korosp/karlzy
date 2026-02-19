'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronLeft, Zap } from 'lucide-react';

const faqs = [
  { q: 'Apakah KarlX AI gratis?', a: 'Ya! KarlX AI sepenuhnya gratis untuk digunakan. Tidak ada batasan pesan atau fitur berbayar.' },
  { q: 'Model AI apa yang dipakai?', a: 'KarlX AI menggunakan model dari Groq — Llama 3.3 70B, Llama 3.1 8B, Mixtral 8x7B, dan Gemma2 9B. Semua model tersedia gratis.' },
  { q: 'Apakah history chat tersimpan?', a: 'Ya, history chat tersimpan di browser kamu (localStorage). Data tidak dikirim ke server kami, sepenuhnya privat.' },
  { q: 'Apakah KarlX AI bisa analisis gambar?', a: 'Ya! Kamu bisa upload gambar dan KarlX AI akan menganalisis isinya secara detail.' },
  { q: 'Apakah data saya aman?', a: 'Pesan dikirim ke Groq API untuk diproses. History chat hanya tersimpan di browser kamu dan tidak kami simpan di server.' },
  { q: 'Bagaimana cara menghapus history chat?', a: 'Klik icon trash di samping chat di sidebar untuk menghapus chat tertentu.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);
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

        <h1 className="text-3xl font-bold text-white mb-2">FAQ</h1>
        <p className="text-[#8e8ea0] mb-8">Pertanyaan yang sering ditanyakan</p>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 rounded-xl overflow-hidden bg-[#2f2f2f]">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}>
                <span className="font-semibold text-sm text-[#ececec] pr-4">{faq.q}</span>
                <ChevronDown size={16} className={`flex-shrink-0 text-[#8e8ea0] transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-sm text-[#8e8ea0] leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
  href="/chat"
  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl 
  bg-[#f8fafc] text-black font-semibold text-sm 
  border border-white/10 
  hover:bg-[#f1f5f9] 
  hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]
  transition-all"
>
            <Zap size={16} /> Mulai Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
