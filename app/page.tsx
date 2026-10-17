'use client';

import React, { useState } from 'react';
import { MarinaHeader } from '@/components/MarinaHeader';
import { DigitalTwinMap } from '@/components/DigitalTwinMap';
import { VhfOpsDeck } from '@/components/VhfOpsDeck';
import { TechnicalYardDeck } from '@/components/TechnicalYardDeck';
import { LegalFinanceDeck } from '@/components/LegalFinanceDeck';
import { PrivacyVaultDeck } from '@/components/PrivacyVaultDeck';
import { TabpfnAnalyticsDeck } from '@/components/TabpfnAnalyticsDeck';
import { CustomsPortDeck } from '@/components/CustomsPortDeck';
import { ExtendedMarinaServicesDeck } from '@/components/ExtendedMarinaServicesDeck';
import { 
  Anchor, 
  Ship, 
  Layers, 
  ShieldCheck, 
  Radio, 
  Wind, 
  Activity, 
  PhoneCall,
  Lock,
  Compass,
  Sparkles,
  Fuel,
  Plane
} from 'lucide-react';
import { BerthData } from '@/lib/wim-data';

export default function HomePage() {
  const [activeZoneTab, setActiveZoneTab] = useState<string>('vhf');
  const [windSpeed, setWindSpeed] = useState<number>(12); // Default 12 knots (safe for 700T lift)
  const [selectedBerth, setSelectedBerth] = useState<BerthData | null>(null);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Telemetry & Main Navigation */}
      <MarinaHeader
        windSpeed={windSpeed}
        onWindChange={setWindSpeed}
        activeZoneTab={activeZoneTab}
        onTabChange={setActiveZoneTab}
      />

      {/* Main Operational Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Quick Hero Status Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div 
            onClick={() => setActiveZoneTab('map')}
            className="p-3 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-xl cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-slate-400 text-[11px]">Zone A: Deniz</span>
              <p className="text-base font-bold text-sky-400">482 / 600 Dolu</p>
            </div>
            <Anchor className="w-5 h-5 text-sky-500/60" />
          </div>

          <div 
            onClick={() => setActiveZoneTab('technical')}
            className="p-3 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-xl cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-slate-400 text-[11px]">700T Travel Lift</span>
              <p className={`text-base font-bold ${windSpeed > 15 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {windSpeed > 15 ? 'DURDURULDU' : 'HAZIR & AKTİF'}
              </p>
            </div>
            <Ship className="w-5 h-5 text-indigo-500/60" />
          </div>

          <div 
            onClick={() => setActiveZoneTab('technical')}
            className="p-3 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-xl cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-slate-400 text-[11px]">96-Kapasite Raf</span>
              <p className="text-base font-bold text-amber-400">48 / 96 Dolu</p>
            </div>
            <Layers className="w-5 h-5 text-amber-500/60" />
          </div>

          <div 
            onClick={() => setActiveZoneTab('vhf')}
            className="p-3 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-xl cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-slate-400 text-[11px]">VHF Telsiz Kanal 72</span>
              <p className="text-base font-bold text-emerald-400 flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5"></span>
                DİNLEMEDE
              </p>
            </div>
            <Radio className="w-5 h-5 text-emerald-500/60" />
          </div>
        </div>

        {/* View Switcher based on active tab */}
        {activeZoneTab === 'map' && (
          <DigitalTwinMap
            windSpeed={windSpeed}
            onSelectBerth={setSelectedBerth}
            onOpenLiftModal={() => setActiveZoneTab('technical')}
            onOpenRackModal={() => setActiveZoneTab('technical')}
            onOpenBilginModal={() => setActiveZoneTab('technical')}
          />
        )}

        {activeZoneTab === 'vhf' && (
          <VhfOpsDeck
            windSpeed={windSpeed}
            onRefreshData={() => {}}
          />
        )}

        {activeZoneTab === 'services' && (
          <ExtendedMarinaServicesDeck />
        )}

        {activeZoneTab === 'technical' && (
          <TechnicalYardDeck
            windSpeed={windSpeed}
          />
        )}

        {activeZoneTab === 'legal_finance' && (
          <LegalFinanceDeck />
        )}

        {activeZoneTab === 'privacy' && (
          <PrivacyVaultDeck />
        )}

        {activeZoneTab === 'tabpfn' && (
          <TabpfnAnalyticsDeck />
        )}

        {activeZoneTab === 'customs' && (
          <CustomsPortDeck />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
        <div className="flex items-center space-x-2">
          <Anchor className="w-4 h-4 text-sky-500" />
          <span className="font-semibold text-slate-400">West Istanbul Marina (WIM-OS)</span>
          <span>• 155,000m² Digital Twin • Beylikdüzü / Istanbul</span>
        </div>
        <div className="flex items-center space-x-4 font-mono text-[11px]">
          <span>SEAL Memory OK</span>
          <span>•</span>
          <span>MAKER Engine OK</span>
          <span>•</span>
          <span>TabPFN Predictive AI OK</span>
          <span>•</span>
          <span>Paraşüt API v4 OK</span>
        </div>
      </footer>
    </div>
  );
}
