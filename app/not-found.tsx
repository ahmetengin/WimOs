import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-sky-950 border border-sky-800 flex items-center justify-center mb-4">
        <span className="text-2xl font-bold text-sky-400">404</span>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Sayfa Bulunamadı • WIM-OS</h2>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        Aradığınız marina operasyon sayfası veya rıhtım kaydı mevcut değil. Ana kontrol merkezine dönebilirsiniz.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold font-mono transition-colors shadow-lg shadow-sky-600/30"
      >
        WIM-OS Ana Panele Dön
      </Link>
    </div>
  );
}
