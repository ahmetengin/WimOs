'use client';

import React from 'react';
import { 
  Anchor, 
  Wind, 
  Compass, 
  ShieldCheck, 
  Radio, 
  Activity, 
  Database, 
  Cpu, 
  Layers,
  Thermometer,
  Waves,
  Sparkles
} from 'lucide-react';

interface MarinaHeaderProps {
  windSpeed: number;
  onWindChange: (speed: number) => void;
  activeZoneTab: string;
  onTabChange: (tab: string) => void;
}

export const MarinaHeader: React.FC<MarinaHeaderProps> = ({
  windSpeed,
  onWindChange,
  activeZoneTab,
  onTabChange
}) => {
  const isWindOverLimit = windSpeed > 15;

  return (
    <header className="bg-slate-950/95 border-b border-sky-900/40 sticky top-0 z-50 backdrop-blur-md">
      {/* Top Telemetry Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between text-xs gap-3 border-b border-slate-900">
        <div className="flex items-center space-x-3 text-slate-400">
          <span className="flex items-center text-sky-400 font-mono font-semibold">
            <Compass className="w-3.5 h-3.5 mr-1 animate-spin-slow text-sky-400" />
            40°57&apos;46&quot; N • 28°39&apos;49&quot; E
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Beylikdüzü / Istanbul</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1.5 inline-block"></span>
            155,000 m² Digital Twin Live
          </span>
        </div>

        {/* Live Weather & Safety Gauge */}
        <div className="flex items-center space-x-4">
          <div className={`flex items-center px-2.5 py-1 rounded border font-mono transition-colors ${
            isWindOverLimit 
              ? 'bg-rose-950/70 border-rose-600 text-rose-300 animate-pulse' 
              : 'bg-sky-950/60 border-sky-800/80 text-sky-300'
          }`}>
            <Wind className={`w-3.5 h-3.5 mr-1.5 ${isWindOverLimit ? 'text-rose-400' : 'text-sky-400'}`} />
            <span>Rüzgar: <strong className="text-white text-sm">{windSpeed}</strong> kn</span>
            {isWindOverLimit ? (
              <span className="ml-2 text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold">
                700T LIFT DURDURULDU (&gt;15kn)
              </span>
            ) : (
              <span className="ml-2 text-[10px] bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded">
                LİFT GÜVENLİ
              </span>
            )}
            <input 
              type="range" 
              min="4" 
              max="28" 
              value={windSpeed}
              onChange={(e) => onWindChange(Number(e.target.value))}
              className="ml-3 w-16 h-1 bg-slate-700 rounded cursor-pointer accent-sky-400"
              title="Rüzgar Hızını Test İçin Değiştir (Limit 15 kn)"
            />
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-slate-400 font-mono">
            <span className="flex items-center">
              <Thermometer className="w-3.5 h-3.5 mr-1 text-amber-400" /> 18°C Su
            </span>
            <span className="flex items-center">
              <Waves className="w-3.5 h-3.5 mr-1 text-cyan-400" /> 0.4m Dalga
            </span>
          </div>

          {/* Subsystem Health Status */}
          <div className="hidden md:flex items-center space-x-2 text-[11px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center" title="Qdrant SEAL Memory">
              <Database className="w-3 h-3 mr-1 text-purple-400" /> SEAL
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center" title="TabPFN Tabular AI">
              <Cpu className="w-3 h-3 mr-1 text-amber-400" /> TabPFN
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center" title="AES-256 Vault">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" /> KVKK Vault
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center" title="Paraşüt e-Fatura v4">
              <Activity className="w-3 h-3 mr-1 text-blue-400" /> Paraşüt v4
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav & Identity */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-sky-500/20 border border-sky-400/30">
            <Anchor className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center font-sans">
                WIM-OS <span className="text-sky-400 ml-1.5 text-xs font-mono font-medium px-2 py-0.5 rounded bg-sky-950 border border-sky-800">v6.0 MASTER REFRESH</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              West Istanbul Marina Operating System • General Manager AI & Digital Twin
            </p>
          </div>
        </div>

        {/* Operational View Tabs */}
        <nav className="flex items-center flex-wrap gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          {[
            { id: 'map', label: '155k m² Harita', icon: Layers },
            { id: 'vhf', label: 'VHF Ch.72 & AI', icon: Radio, highlight: true },
            { id: 'services', label: 'Tüm Hizmetler', icon: Sparkles },
            { id: 'technical', label: 'Teknik Saha & 700T', icon: Activity },
            { id: 'legal_finance', label: 'ada.legal & Paraşüt', icon: ShieldCheck },
            { id: 'privacy', label: 'KVKK & Vault', icon: ShieldCheck },
            { id: 'tabpfn', label: 'TabPFN Analitik', icon: Cpu },
            { id: 'customs', label: 'Gümrük Limanı', icon: Anchor },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeZoneTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : tab.highlight
                    ? 'text-sky-400 hover:text-white hover:bg-slate-800/80'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.highlight ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
