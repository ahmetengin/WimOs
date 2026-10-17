'use client';

import React from 'react';
import { 
  Anchor, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  Radio, 
  Globe2, 
  AlertTriangle 
} from 'lucide-react';
import { INITIAL_CUSTOMS_LOGS, CustomsEntryLog } from '@/lib/wim-data';

export const CustomsPortDeck: React.FC = () => {
  const logs: CustomsEntryLog[] = INITIAL_CUSTOMS_LOGS;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center">
            <Anchor className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">MARMARA PORT OF ENTRY (WIM HUDUT KAPISI)</h3>
            <p className="text-xs text-slate-400">
              Yabancı Bayraklı Teknelerin Giriş/Çıkış Gümrük, Pasaport &amp; Transit Log İşlemleri
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-950 border border-amber-800 text-amber-300 font-bold">
          7/24 GÜMRÜK MUHAFAZA &amp; LİMAN BAŞKANLIĞI
        </span>
      </div>

      {/* Arrival Procedure Steps Protocol */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <h4 className="font-bold text-white text-xs flex items-center">
          <FileCheck className="w-4 h-4 mr-1.5 text-sky-400" />
          WIM Resmi Limana Giriş Prosedürü (Arrival Protocol)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-sky-400 font-bold font-mono">ADIM 1: ÖN BİLDİRİM</span>
            <p className="text-slate-300 font-medium">Evrak İbrazı</p>
            <p className="text-[11px] text-slate-400">
              Giriş öncesi tekne tescil belgesi, 3. şahıs sigortası (TPL) ve mürettebat listesi WIM Ön Büroya iletilir.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-sky-400 font-bold font-mono">ADIM 2: VHF ÇAĞRISI</span>
            <p className="text-slate-300 font-medium">Kanal 72 / 16</p>
            <p className="text-[11px] text-slate-400">
              Mendireğe 2 mil kala Kanal 72 üzerinden WIM Kontrol Merkezine çağrı yapılarak bağlama talimatı alınır.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-sky-400 font-bold font-mono">ADIM 3: PALAMAR &amp; PİLOT</span>
            <p className="text-slate-300 font-medium">Yanaşma Manevrası</p>
            <p className="text-[11px] text-slate-400">
              Palamar botu refakat eder. 1000 GT üzeri tekneler için lisanslı kılavuz kaptan (pilot) zorunludur.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-sky-400 font-bold font-mono">ADIM 4: CHECK-IN</span>
            <p className="text-slate-300 font-medium">Pasaport &amp; Gümrük</p>
            <p className="text-[11px] text-slate-400">
              Kaptan pasaportlar ve Transit Log ile Gümrük Rıhtımında WIM Ön Büro işlemlerini tamamlar.
            </p>
          </div>
        </div>
      </div>

      {/* Customs Log Table */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center">
            <Globe2 className="w-4 h-4 mr-2 text-amber-400" />
            Son Giriş &amp; Çıkış Kayıtları (Transit Logbook)
          </h4>
          <span className="text-xs font-mono text-slate-400">Hudut Kapısı Kütüğü</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/80 text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="p-3">LOG ID</th>
                <th className="p-3">TEKNE ADI</th>
                <th className="p-3">BAYRAK DEVLETİ</th>
                <th className="p-3">KAPTAN</th>
                <th className="p-3">GİRİŞ TARİHİ</th>
                <th className="p-3">GELDİĞİ LİMAN</th>
                <th className="p-3">TRANSİT LOG NO</th>
                <th className="p-3">GÜMRÜK DURUMU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-mono font-bold text-sky-400">{log.id}</td>
                  <td className="p-3 font-semibold text-white">{log.boatName}</td>
                  <td className="p-3 font-mono">{log.flagState}</td>
                  <td className="p-3">{log.captainName}</td>
                  <td className="p-3 font-mono text-slate-400">{log.entryDate}</td>
                  <td className="p-3 text-slate-400">{log.lastPort}</td>
                  <td className="p-3 font-mono text-slate-300">{log.transitLogNo}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      log.status === 'CLEARED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                    }`}>
                      {log.status === 'CLEARED' ? 'MUAYENE TAMAM' : 'GİRİŞ İNCELEMESİNDE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
