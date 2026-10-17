'use client';

import React, { useState } from 'react';
import { 
  Anchor, 
  ShieldAlert, 
  Info, 
  Maximize2, 
  Zap, 
  Ship, 
  MapPin, 
  Layers, 
  Building2, 
  Car, 
  Utensils, 
  CheckCircle2,
  AlertTriangle,
  Lock,
  Wind,
  Search
} from 'lucide-react';
import { BerthData, INITIAL_BERTHS, BILGIN_HANGARS, RESTAURANT_TENANTS } from '@/lib/wim-data';

interface DigitalTwinMapProps {
  onSelectBerth?: (berth: BerthData) => void;
  onOpenRackModal?: () => void;
  onOpenLiftModal?: () => void;
  onOpenBilginModal?: () => void;
  windSpeed: number;
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({
  onSelectBerth,
  onOpenRackModal,
  onOpenLiftModal,
  onOpenBilginModal,
  windSpeed
}) => {
  const [selectedBerth, setSelectedBerth] = useState<BerthData | null>(INITIAL_BERTHS[0]);
  const [selectedZone, setSelectedZone] = useState<'ALL' | 'A' | 'B' | 'C' | 'D'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'tactical' | 'satellite'>('tactical');

  const filteredBerths = INITIAL_BERTHS.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.id.toLowerCase().includes(q) ||
      b.pontoon.toLowerCase().includes(q) ||
      b.currentBoat?.name.toLowerCase().includes(q) ||
      b.currentBoat?.flag.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Map Control Bar */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tekne, Ponton veya Rıhtım Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-56"
            />
          </div>

          {/* Zone Selector */}
          <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedZone('ALL')}
              className={`px-2.5 py-1 rounded transition-colors ${selectedZone === 'ALL' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Tüm Alan (155k m²)
            </button>
            <button
              onClick={() => setSelectedZone('A')}
              className={`px-2.5 py-1 rounded transition-colors ${selectedZone === 'A' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Zone A (Deniz - 600)
            </button>
            <button
              onClick={() => setSelectedZone('B')}
              className={`px-2.5 py-1 rounded transition-colors ${selectedZone === 'B' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Zone B (Kara & 700T)
            </button>
            <button
              onClick={() => setSelectedZone('C')}
              className={`px-2.5 py-1 rounded transition-colors ${selectedZone === 'C' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Zone C (West Life)
            </button>
            <button
              onClick={() => setSelectedZone('D')}
              className={`px-2.5 py-1 rounded transition-colors ${selectedZone === 'D' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Zone D (İSPARK)
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1"></span> Boş</span>
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1"></span> Dolu</span>
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1"></span> Gümrük/Rezerve</span>
          </div>

          <div className="h-4 w-px bg-slate-800"></div>

          <button
            onClick={() => setViewMode(viewMode === 'tactical' ? 'satellite' : 'tactical')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center"
          >
            <Layers className="w-3.5 h-3.5 mr-1 text-sky-400" />
            {viewMode === 'tactical' ? 'Taktik Radar' : 'Uydu Görünümü'}
          </button>
        </div>
      </div>

      {/* Interactive Map Layout & Detail Flyout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 min-h-[580px]">
        {/* Main Vector / Tactical Radar Canvas */}
        <div className="lg:col-span-3 relative bg-[#070b14] overflow-hidden p-6 flex flex-col justify-between">
          {/* Radar background grid lines */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#0284c7 1px, transparent 1px), linear-gradient(to right, #0369a1 1px, transparent 1px), linear-gradient(to bottom, #0369a1 1px, transparent 1px)',
              backgroundSize: '40px 40px, 80px 80px, 80px 80px'
            }}
          />

          {/* Compass Rose overlay */}
          <div className="absolute top-4 right-4 pointer-events-none opacity-40 flex flex-col items-center text-[10px] text-sky-400 font-mono">
            <span>▲ N (KUZEY)</span>
            <div className="w-10 h-10 border border-sky-500/50 rounded-full flex items-center justify-center my-1">
              <div className="w-px h-8 bg-sky-400"></div>
              <div className="w-8 h-px bg-sky-400 absolute"></div>
            </div>
            <span>WIM BEYLİKDÜZÜ</span>
          </div>

          {/* Top Zone Banners */}
          <div className="relative z-10 flex flex-wrap gap-2 text-xs">
            <div className="bg-sky-950/80 border border-sky-800/80 rounded-lg px-3 py-1.5 text-sky-200 backdrop-blur-md flex items-center shadow-lg">
              <Ship className="w-4 h-4 mr-1.5 text-sky-400" />
              <span><strong>Zone A:</strong> Deniz Bağlama (600 Kapasite • 3.5m - 7m Derinlik)</span>
            </div>
            <div className="bg-amber-950/80 border border-amber-800/80 rounded-lg px-3 py-1.5 text-amber-200 backdrop-blur-md flex items-center shadow-lg">
              <Building2 className="w-4 h-4 mr-1.5 text-amber-400" />
              <span><strong>Zone B:</strong> Çekek Alanı (300 Kara • 700T Lift • 96 Rack • Bilgin)</span>
            </div>
            <div className="bg-emerald-950/80 border border-emerald-800/80 rounded-lg px-3 py-1.5 text-emerald-200 backdrop-blur-md flex items-center shadow-lg">
              <Utensils className="w-4 h-4 mr-1.5 text-emerald-400" />
              <span><strong>Zone C:</strong> West Life &amp; Çarşı (30+ Restoran • Spor • Havuz)</span>
            </div>
          </div>

          {/* Master Visual Layout of the 155,000 m² Marina Twin */}
          <div className="relative my-6 w-full max-w-4xl mx-auto h-[440px] border border-sky-900/40 rounded-2xl bg-gradient-to-b from-slate-900/60 to-sky-950/40 p-4 shadow-inner">
            
            {/* Breakwater & Sea Basin (Zone A) */}
            <div className="absolute left-6 top-6 bottom-6 w-[56%] border-2 border-dashed border-sky-600/40 rounded-2xl bg-sky-950/30 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-sky-300 font-mono">
                <span className="flex items-center font-bold">
                  <Anchor className="w-3.5 h-3.5 mr-1 text-sky-400" /> ZONE A - MARMARA HAVZASI
                </span>
                <span className="text-[10px] bg-sky-900/60 px-2 py-0.5 rounded text-sky-300">
                  Derinlik: 3.5m - 7.0m
                </span>
              </div>

              {/* Pontoons A to D with visual berths */}
              <div className="grid grid-cols-2 gap-3 my-2">
                {filteredBerths.map((berth) => {
                  const isSelected = selectedBerth?.id === berth.id;
                  const isOccupied = berth.status === 'occupied';
                  const isReserved = berth.status === 'reserved';

                  return (
                    <div
                      key={berth.id}
                      onClick={() => {
                        setSelectedBerth(berth);
                        if (onSelectBerth) onSelectBerth(berth);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                        isSelected 
                          ? 'border-sky-400 bg-sky-900/50 shadow-lg shadow-sky-500/30 scale-[1.02]' 
                          : isOccupied 
                          ? 'border-rose-800/60 bg-rose-950/20 hover:border-rose-600' 
                          : isReserved
                          ? 'border-amber-800/60 bg-amber-950/20 hover:border-amber-600'
                          : 'border-emerald-800/60 bg-emerald-950/20 hover:border-emerald-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-white flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-1.5 ${
                            isOccupied ? 'bg-rose-500' : isReserved ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}></span>
                          {berth.id}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Max {berth.maxLoa}m
                        </span>
                      </div>

                      {berth.currentBoat ? (
                        <div className="mt-1.5 text-[11px]">
                          <p className="font-semibold text-sky-200 truncate">{berth.currentBoat.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {berth.currentBoat.loa}m • {berth.currentBoat.flag}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-1.5 text-[10px] text-emerald-400 flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Boş Bağlama Yeri
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Port of Entry Pier (Marmara Customs Station) */}
              <div className="bg-amber-950/40 border border-amber-700/60 rounded-xl p-2 flex items-center justify-between text-xs text-amber-200">
                <div className="flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-2 text-amber-400" />
                  <div>
                    <p className="font-bold">Marmara Port Of Entry (Gümrük Rıhtımı)</p>
                    <p className="text-[10px] text-amber-300/80">Yabancı bayrak giriş/çıkış &amp; Transit Log muayenesi</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-900/80 text-[10px] font-mono font-bold text-white">
                  Kanal 72/16 Zorunlu
                </span>
              </div>
            </div>

            {/* Land Assets: Technical & Dry Dock (Zone B) + Lifestyle (Zone C) + ISPARK (Zone D) */}
            <div className="absolute right-6 top-6 bottom-6 w-[38%] flex flex-col justify-between space-y-2">
              {/* Bilgin Yachts HQ (High Security Sheds) */}
              <div 
                onClick={onOpenBilginModal}
                className="p-3 bg-red-950/40 border border-red-700/60 rounded-xl cursor-pointer hover:border-red-500 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-200 flex items-center">
                    <Lock className="w-3.5 h-3.5 mr-1.5 text-red-400" /> Bilgin Yachts HQ (Shed 1-4)
                  </span>
                  <span className="text-[10px] bg-red-900 text-red-200 px-1.5 py-0.5 rounded font-mono">
                    BIO-SECURITY
                  </span>
                </div>
                <p className="text-[11px] text-red-300 mt-1 font-mono">
                  Shed 1: Bilgin 163 (105m Shed) • Shed 2: Bilgin 263
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 group-hover:text-red-300 transition-colors">
                  Tıkla: Biyometrik erişim loglarını görüntüle &rarr;
                </p>
              </div>

              {/* 700-Ton & 75-Ton Travel Lift Bay */}
              <div 
                onClick={onOpenLiftModal}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  windSpeed > 15 
                    ? 'bg-rose-950/50 border-rose-600 shadow-md shadow-rose-900/30' 
                    : 'bg-indigo-950/40 border-indigo-700/60 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-200 flex items-center">
                    <Ship className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> 700-Ton Travel Lift
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    windSpeed > 15 ? 'bg-rose-600 text-white' : 'bg-indigo-800 text-indigo-200'
                  }`}>
                    {windSpeed > 15 ? 'KİLİTLİ (>15kn)' : 'AKTİF'}
                  </span>
                </div>
                <p className="text-[11px] text-indigo-300 mt-1 font-mono">
                  Türkiye&apos;nin En Büyük Lifti • 50m-80m Süperyat Çekek
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Tıkla: Randevu takvimi &amp; operasyon sayacı &rarr;
                </p>
              </div>

              {/* 96-Capacity Rack System */}
              <div 
                onClick={onOpenRackModal}
                className="p-3 bg-amber-950/40 border border-amber-700/60 rounded-xl cursor-pointer hover:border-amber-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-200 flex items-center">
                    <Layers className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Raf Sistemi (Rack System)
                  </span>
                  <span className="text-[10px] bg-amber-900 text-amber-200 px-1.5 py-0.5 rounded font-mono">
                    96 KAPASİTE
                  </span>
                </div>
                <p className="text-[11px] text-amber-300 mt-1 font-mono">
                  A-1 - H-4 3D Izgara • &lt;7m Tekneler için
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Tıkla: 3D Izgara matrisi &amp; yerleşim &rarr;
                </p>
              </div>

              {/* West Life & Tenants + ISPARK Bar */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 bg-emerald-950/30 border border-emerald-800/60 rounded-lg">
                  <p className="font-bold text-emerald-200 flex items-center">
                    <Utensils className="w-3 h-3 mr-1 text-emerald-400" /> West Life
                  </p>
                  <p className="text-slate-400 mt-0.5 truncate">Calisto, BigChefs (30+)</p>
                </div>

                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                  <p className="font-bold text-sky-200 flex items-center">
                    <Car className="w-3 h-3 mr-1 text-sky-400" /> İSPARK 500
                  </p>
                  <p className="text-slate-400 mt-0.5">384/500 Dolu (%76)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Coordinates & Watermark */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>West Istanbul Marina Digital Twin Engine • Scale: 1:1,000 Spatial Geometry</span>
            <span>Marmara Denizi • Yakuplu Koyu</span>
          </div>
        </div>

        {/* Selected Berth / Asset Detail Sidebar */}
        <div className="bg-slate-950/90 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-sm text-white font-mono">{selectedBerth?.id || 'Varlık Seçilmedi'}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-bold ${
                selectedBerth?.status === 'occupied' 
                  ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {selectedBerth?.status === 'occupied' ? 'Dolu' : selectedBerth?.status === 'reserved' ? 'Rezerve' : 'Müsait'}
              </span>
            </div>

            {selectedBerth ? (
              <div className="mt-4 space-y-4 text-xs">
                {/* Pontoon details */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <p className="text-slate-400">Ponton: <strong className="text-white">{selectedBerth.pontoon}</strong></p>
                  <p className="text-slate-400">Maksimum Boy (LOA): <strong className="text-sky-300">{selectedBerth.maxLoa} metre</strong></p>
                  <p className="text-slate-400">Derinlik (Draft): <strong className="text-sky-300">{selectedBerth.draft} metre</strong></p>
                  <p className="text-slate-400 flex items-center">
                    <Zap className="w-3 h-3 text-amber-400 mr-1" />
                    Elektrik Sayacı: <span className="font-mono text-slate-200 ml-1">{selectedBerth.electricityMeterId}</span>
                  </p>
                </div>

                {/* Current Boat if occupied */}
                {selectedBerth.currentBoat ? (
                  <div className="bg-gradient-to-br from-slate-900 to-sky-950/50 p-3.5 rounded-xl border border-sky-900/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm flex items-center">
                        <Ship className="w-4 h-4 mr-1.5 text-sky-400" />
                        {selectedBerth.currentBoat.name}
                      </h4>
                      <span className="text-[10px] text-sky-300 font-mono">{selectedBerth.currentBoat.flag}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                      <div>Boy: <span className="text-white">{selectedBerth.currentBoat.loa}m</span></div>
                      <div>En: <span className="text-white">{selectedBerth.currentBoat.beam}m</span></div>
                      <div>Draft: <span className="text-white">{selectedBerth.currentBoat.draft}m</span></div>
                      <div>Tonaj: <span className="text-white">{selectedBerth.currentBoat.grossTonnage} GT</span></div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                      <p className="text-slate-400">Sahip / İşletici: <span className="text-white font-medium">{selectedBerth.currentBoat.ownerName}</span></p>
                      <p className="text-slate-400">Sözleşme Ref: <span className="font-mono text-sky-400">{selectedBerth.currentBoat.contractRef}</span></p>
                      <p className="text-slate-400">Sigorta Bitiş: <span className="text-emerald-400 font-mono">{selectedBerth.currentBoat.insuranceExpiry}</span></p>
                    </div>

                    {selectedBerth.currentBoat.grossTonnage > 1000 && (
                      <div className="bg-amber-950/70 border border-amber-800 text-amber-200 p-2 rounded-lg text-[10px] flex items-center">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-400 shrink-0" />
                        <span>1000 GT Üstü: Madde 12 uyarınca zorunlu kılavuz kaptanlı seyre tabidir.</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-emerald-950/20 border border-emerald-800/40 p-4 rounded-xl text-center space-y-2">
                    <p className="text-emerald-300 font-medium">Bu bağlama yeri şu an boştur.</p>
                    <p className="text-slate-400 text-[11px]">
                      {selectedBerth.maxLoa} metreye kadar mega yat veya yelkenli kabul edilebilir.
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Quick Operations Button */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button 
              onClick={onOpenLiftModal}
              className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center"
            >
              <Ship className="w-3.5 h-3.5 mr-1.5" />
              700T / 75T Lift Operasyonu Başlat
            </button>
            <button 
              onClick={onOpenRackModal}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-all flex items-center justify-center"
            >
              <Layers className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              96-Kapasiteli Raf Sistemini Aç
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
