import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#00d4ff] mb-8 transition-colors">
            <ArrowLeft size={14} /> Kembali
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-white/30 text-sm mb-10">Terakhir diperbarui: Februari 2025</p>

          <div className="space-y-8 text-white/60 leading-relaxed">
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">1. Data yang Kami Kumpulkan</h2>
              <p>Kami hanya mengumpulkan data yang diperlukan untuk memberikan layanan terbaik, termasuk pesan chat, preferensi pengguna, dan data penggunaan anonim untuk meningkatkan performa.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">2. Penggunaan Data</h2>
              <p>Data kamu digunakan semata-mata untuk memproses permintaan AI dan meningkatkan kualitas layanan. Kami tidak menjual atau membagikan data pribadi kamu ke pihak ketiga manapun.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">3. Keamanan Data</h2>
              <p>Semua komunikasi dienkripsi menggunakan standar industri. Server kami menggunakan protokol keamanan terkini untuk melindungi data kamu dari akses tidak sah.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">4. Retensi Data</h2>
              <p>Riwayat chat disimpan selama akun kamu aktif. Kamu bisa menghapus riwayat chat kapan saja dari pengaturan akun. Data akan dihapus permanen dalam 30 hari setelah permintaan penghapusan.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">5. Hak Kamu</h2>
              <p>Kamu berhak mengakses, memperbaiki, atau menghapus data pribadi kamu kapan saja. Hubungi kami untuk menggunakan hak-hak ini.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">6. Kontak</h2>
              <p>Pertanyaan seputar privasi? Hubungi kami di <span className="text-[#00d4ff]">privacy@karlxai.com</span></p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
