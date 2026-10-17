'use client';

import React, { useState } from 'react';
import { 
  Ship, 
  Layers, 
  Lock, 
  Wind, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Fingerprint, 
  Maximize2,
  Filter,
  UserCheck
} from 'lucide-react';
import { 
  INITIAL_RACK_SLOTS, 
  INITIAL_LIFT_SCHEDULE, 
  BILGIN_HANGARS, 
  RackSlotData, 
  LiftOperation, 
  BilginHangarData 
} from '@/lib/wim-data';

interface TechnicalYardDeckProps {
  windSpeed: number;
}

export const TechnicalYardDeck: React.FC<TechnicalYardDeckProps> = ({ windSpeed }) => {
  const [activeTab, setActiveTab] = useState<'lift700' | 'racks96' | 'bilgin' | 'hardstanding'>('lift700');
  const [rackSlots, setRackSlots] = useState<RackSlotData[]>(INITIAL_RACK_SLOTS);
  const [selectedSlot, setSelectedSlot] = useState<RackSlotData | null>(INITIAL_RACK_SLOTS[0]);
  const [liftSchedule, setLiftSchedule] = useState<LiftOperation[]>(INITIAL_LIFT_SCHEDULE);
  const [selectedHangar, setSelectedHangar] = useState<BilginHangarData>(BILGIN_HANGARS[0]);
  const [rackFilter, setRackFilter] = useState<'all' | 'occupied' | 'available'>('all');

  const isWindOverLimit = windSpeed > 15;

  const filteredRacks = rackSlots.filter(s => {
    if (rackFilter === 'occupied') return s.isOccupied;
    if (rackFilter === 'available') return !s.isOccupied;
    return true;
  });

  const occupiedCount = rackSlots.filter(s => s.isOccupied).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Deck Sub-tabs */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center">
            <Ship className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">ZONE B: TEKNİK &amp; ÇEKEK SAHASI</h3>
            <p className="text-xs text-slate-400">700T Travel Lift • 96 Kapasite Raf Sistemi • Bilgin Yachts HQ</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('lift700')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center ${
              activeTab === 'lift700' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ship className="w-3.5 h-3.5 mr-1.5" />
            700T &amp; 75T Lift
          </button>
          <button
            onClick={() => setActiveTab('racks96')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center ${
              activeTab === 'racks96' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 mr-1.5" />
            96-Slot Raf Sistemi
          </button>
          <button
            onClick={() => setActiveTab('bilgin')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center ${
              activeTab === 'bilgin' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5 mr-1.5" />
            Bilgin Yachts HQ
          </button>
          <button
            onClick={() => setActiveTab('hardstanding')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center ${
              activeTab === 'hardstanding' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>300 Kara Park</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: 700-TON & 75-TON TRAVEL LIFT OPERATIONS */}
        {activeTab === 'lift700' && (
          <div className="space-y-6">
            {/* Safety Interlock Banner */}
            <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              isWindOverLimit 
                ? 'bg-rose-950/60 border-rose-600 text-rose-200 animate-pulse' 
                : 'bg-indigo-950/40 border-indigo-800 text-indigo-200'
            }`}>
              <div className="flex items-center space-x-3">
                <Wind className={`w-8 h-8 ${isWindOverLimit ? 'text-rose-400' : 'text-indigo-400'}`} />
                <div>
                  <h4 className="font-bold text-sm">
                    {isWindOverLimit 
                      ? '⚠️ 700 TON TRAVEL LIFT EMNİYET KİLİDİ DEVREDE' 
                      : '✅ 700 TON & 75 TON LİFT OPERASYONA HAZIR'}
                  </h4>
                  <p className="text-xs opacity-90">
                    Mevcut Rüzgar: <strong>{windSpeed} Knot</strong> • Azami Emniyet Limiti: <strong>15 Knot</strong> (WIM Madde 45)
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800">
                <span>Vinç Durumu: </span>
                <strong className={isWindOverLimit ? 'text-rose-400' : 'text-emerald-400'}>
                  {isWindOverLimit ? 'OTOMATİK ASKIYA ALINDI' : 'NORMAL ÇALIŞMA MODU'}
                </strong>
              </div>
            </div>

            {/* Travel Lift Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500">Kapasite</span>
                <p className="text-lg font-bold text-white">700 TON</p>
                <p className="text-slate-400 text-[11px]">Türkiye&apos;nin en büyük travel lifti (95m LOA)</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500">İkincil Lift</span>
                <p className="text-lg font-bold text-white">75 TON</p>
                <p className="text-slate-400 text-[11px]">Hızlı karaya alma ve sörvey işlemleri için</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500">Planlanmış Operasyon</span>
                <p className="text-lg font-bold text-sky-400">{liftSchedule.length} Adet</p>
                <p className="text-slate-400 text-[11px]">En yakın operasyon: M/Y Tatiana</p>
              </div>
            </div>

            {/* Schedule Table */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h4 className="font-bold text-sm text-white flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
                  Operasyon Takvimi &amp; Çekek Sırası
                </h4>
                <span className="text-xs text-slate-400 font-mono">Real-time Scheduler</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900/80 text-slate-400 font-mono text-[11px]">
                    <tr>
                      <th className="p-3">KOD</th>
                      <th className="p-3">LİFT TİPİ</th>
                      <th className="p-3">TEKNE ADI</th>
                      <th className="p-3">BOY / AĞIRLIK</th>
                      <th className="p-3">İŞLEM</th>
                      <th className="p-3">ZAMANLAMA</th>
                      <th className="p-3">DURUM</th>
                      <th className="p-3">ATANAN ALAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {liftSchedule.map((op) => (
                      <tr key={op.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono font-bold text-sky-400">{op.id}</td>
                        <td className="p-3 font-mono">
                          <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold">
                            {op.liftType}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-white">{op.boatName}</td>
                        <td className="p-3 font-mono">{op.loa}m • {op.weightTons}T</td>
                        <td className="p-3">{op.operationType}</td>
                        <td className="p-3 font-mono text-slate-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-slate-500" /> {op.scheduledTime}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            op.status === 'in_progress'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {op.status === 'in_progress' ? 'DEVAM EDİYOR' : 'PLANLANDI'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 font-mono text-[11px]">{op.bayAssigned}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXACTLY 96 CAPACITY RACK SYSTEM (A-1 TO H-4 3D MATRIX) */}
        {activeTab === 'racks96' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center">
                  <Layers className="w-4 h-4 mr-2 text-amber-400" />
                  96 Kapasiteli Kuru Depolama Raf Sistemi (Dry Stack Matrix)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Katı Kural: Yalnızca <strong>&lt; 7.0 Metre</strong> sürat motorları ve botlar kabul edilir. 3D Koordinat: Sıra A-H • Kat 1-4.
                </p>
              </div>

              {/* Occupancy Counter */}
              <div className="flex items-center space-x-3 text-xs font-mono">
                <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                  <span>Doluluk: </span>
                  <strong className="text-amber-400 text-sm">{occupiedCount} / 96</strong>
                  <span className="text-slate-500 ml-1">(%{Math.round((occupiedCount / 96) * 100)})</span>
                </div>

                <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setRackFilter('all')}
                    className={`px-2 py-0.5 rounded ${rackFilter === 'all' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
                  >
                    Tümü
                  </button>
                  <button
                    onClick={() => setRackFilter('occupied')}
                    className={`px-2 py-0.5 rounded ${rackFilter === 'occupied' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
                  >
                    Dolu
                  </button>
                  <button
                    onClick={() => setRackFilter('available')}
                    className={`px-2 py-0.5 rounded ${rackFilter === 'available' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                  >
                    Boş
                  </button>
                </div>
              </div>
            </div>

            {/* 3D Visual Matrix of Rows A to H */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((rowLetter) => {
                const rowSlots = rackSlots.filter(s => s.row === rowLetter);
                return (
                  <div key={rowLetter} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 pb-2 border-b border-slate-800">
                      <span>SIRA {rowLetter}</span>
                      <span className="text-[10px] text-amber-400">12 Slot</span>
                    </div>

                    {/* 4 Levels */}
                    <div className="space-y-1.5 mt-2">
                      {[4, 3, 2, 1].map((levelNum) => {
                        const levelSlots = rowSlots.filter(s => s.level === levelNum);
                        return (
                          <div key={levelNum} className="space-y-1">
                            <div className="text-[9px] font-mono text-slate-500">KAT {levelNum}</div>
                            <div className="grid grid-cols-3 gap-1">
                              {levelSlots.map((slot) => {
                                const isSelected = selectedSlot?.id === slot.id;
                                return (
                                  <button
                                    key={slot.id}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`h-7 rounded text-[9px] font-mono font-bold transition-all flex items-center justify-center ${
                                      isSelected
                                        ? 'bg-sky-500 text-white ring-2 ring-sky-300 scale-105'
                                        : slot.isOccupied
                                        ? 'bg-rose-950/70 border border-rose-800 text-rose-300 hover:bg-rose-900'
                                        : 'bg-emerald-950/60 border border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                                    }`}
                                    title={`Slot ${slot.id}: ${slot.isOccupied ? slot.boat?.name : 'Boş'}`}
                                  >
                                    {slot.bay}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Rack Slot Detail Panel */}
            {selectedSlot && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-base text-white">Slot {selectedSlot.id}</span>
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      selectedSlot.isOccupied ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {selectedSlot.isOccupied ? 'DOLU' : 'BOŞ'}
                    </span>
                    <span className="text-slate-400 font-mono">Sıra {selectedSlot.row} • Kat {selectedSlot.level} • Bölme {selectedSlot.bay}</span>
                  </div>

                  {selectedSlot.isOccupied && selectedSlot.boat ? (
                    <div className="text-slate-300 space-y-0.5 pt-1">
                      <p>Tekne: <strong className="text-white">{selectedSlot.boat.name}</strong> ({selectedSlot.boat.model})</p>
                      <p>Boy: <strong className="text-sky-300">{selectedSlot.boat.loa}m</strong> (&lt;7.0m kuralına uygun)</p>
                      <p className="text-slate-400">Sahip: {selectedSlot.boat.owner} • Tel: <span className="font-mono">{selectedSlot.boat.phoneMasked}</span></p>
                    </div>
                  ) : (
                    <p className="text-emerald-400 pt-1">Bu raf slotu boştur. 7 metre altı sürat motoru bağlanabilir.</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {selectedSlot.isOccupied ? (
                    <button
                      onClick={() => {
                        setRackSlots(prev => prev.map(s => s.id === selectedSlot.id ? { ...s, isOccupied: false, boat: undefined } : s));
                        setSelectedSlot({ ...selectedSlot, isOccupied: false, boat: undefined });
                      }}
                      className="px-3 py-1.5 bg-rose-900/80 hover:bg-rose-800 text-rose-100 rounded-lg text-xs font-medium transition-colors"
                    >
                      Tekneyi Denize İndir (Slotu Boşalt)
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const newBoat = {
                          name: `Speedboat ${selectedSlot.id}`,
                          model: 'Yamaha 212X',
                          loa: 6.4,
                          owner: 'Misafir Kaptan',
                          phoneMasked: '533 **** 21'
                        };
                        setRackSlots(prev => prev.map(s => s.id === selectedSlot.id ? { ...s, isOccupied: true, boat: newBoat } : s));
                        setSelectedSlot({ ...selectedSlot, isOccupied: true, boat: newBoat });
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition-colors flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Yeni Tekne Koy (&lt;7m)
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BILGIN YACHTS HQ (HIGH-SECURITY NEW BUILD HANGARS) */}
        {activeTab === 'bilgin' && (
          <div className="space-y-6">
            <div className="bg-red-950/30 border border-red-800/60 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Lock className="w-6 h-6 text-red-400" />
                <div>
                  <h4 className="font-bold text-red-200 text-sm">
                    BİLGİN YACHTS TERSANE MERKEZİ (HIGH-SECURITY ZONE)
                  </h4>
                  <p className="text-xs text-red-300/80">
                    4 Adet Mega Hangarda Yeni İnşa (New Build) &amp; Özel Refit Projeleri. Biyometrik kart &amp; retina taraması zorunludur.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-red-900/80 text-red-200 font-mono text-xs font-bold rounded-lg border border-red-700">
                RESTRICTED BIOMETRIC ACCESS
              </span>
            </div>

            {/* 4 Mega Sheds Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BILGIN_HANGARS.map((hangar) => {
                const isSelected = selectedHangar.id === hangar.id;
                return (
                  <div
                    key={hangar.id}
                    onClick={() => setSelectedHangar(hangar)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-slate-900 border-red-500 shadow-xl shadow-red-950/40 ring-1 ring-red-500' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-white text-sm">{hangar.name}</h5>
                      <span className="text-[10px] font-mono text-red-400 bg-red-950 border border-red-900 px-2 py-0.5 rounded">
                        {hangar.dimensions}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs">
                      <p className="text-slate-400">
                        Aktif Proje: <strong className="text-sky-300 font-mono">{hangar.currentProject}</strong>
                      </p>
                      <p className="text-slate-400">
                        İnşa Aşaması: <span className="text-slate-200">{hangar.stage}</span>
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span className="flex items-center text-emerald-400">
                        <Fingerprint className="w-3.5 h-3.5 mr-1" /> Biyometrik Tarayıcı Aktif
                      </span>
                      <span>Son Giriş: {hangar.securityLogs[0]?.timestamp || 'Bugün'}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Biometric Access Logs for Selected Hangar */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-sm text-white flex items-center">
                  <UserCheck className="w-4 h-4 mr-2 text-red-400" />
                  {selectedHangar.name} - Son Biyometrik Giriş Logları
                </h5>
                <span className="text-xs font-mono text-slate-400">Canlı Sensör Akışı</span>
              </div>

              <div className="space-y-2">
                {selectedHangar.securityLogs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="font-mono font-bold text-sky-400">{log.badgeId}</span>
                      <span className="text-slate-300">{log.personnel}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
                      <span>{log.action}</span>
                      <span>{log.timestamp}</span>
                      <span className="text-emerald-400 font-bold">MATCH OK</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 300 HARDSTANDING DRY DOCK */}
        {activeTab === 'hardstanding' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-white text-sm">300 Kapasiteli Çekek ve Kışlama Sahası (Hardstanding Yard)</h4>
                <p className="text-slate-400 mt-0.5">65 metreye kadar olan mega yatların kışlama, mekanik bakım, ozmoz tedavisi ve zehirli boya alanı.</p>
              </div>
              <span className="px-3 py-1 rounded bg-sky-950 border border-sky-800 text-sky-300 font-mono font-bold">
                198/300 Dolu (%66)
              </span>
            </div>

            <div className="p-6 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 text-center space-y-2">
              <Ship className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-300 font-semibold">Ağır Hizmet Kışlama Beşikleri (Heavy Duty Cradles)</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Her beşik alanı 380V/220V marina şebeke elektriği, arıtılmış tatlı su ve basınçlı yıkama altyapısına sahiptir.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
