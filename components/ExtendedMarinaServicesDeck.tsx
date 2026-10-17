'use client';

import React, { useState } from 'react';
import { 
  Fuel, 
  Waves, 
  Trash2, 
  Plane, 
  ShoppingBag, 
  Activity, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Plus, 
  FileText, 
  Calendar, 
  ShieldAlert,
  ArrowUpRight,
  Anchor,
  Sparkles,
  Droplet,
  LifeBuoy,
  Wrench,
  ShieldCheck,
  Flame,
  Utensils,
  Award,
  Car,
  Video,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Compass,
  Thermometer,
  Radio,
  Search
} from 'lucide-react';
import { 
  INITIAL_FUEL_PUMPS, 
  INITIAL_DIVER_TASKS, 
  INITIAL_MARPOL_LOGS, 
  INITIAL_HELIPAD_FLIGHTS, 
  INITIAL_PROVISIONING, 
  INITIAL_SPORTS_BOOKINGS, 
  INITIAL_EV_CHARGERS,
  INITIAL_MOORING_BOATS,
  INITIAL_PEDESTALS,
  INITIAL_FIRE_STATUS,
  INITIAL_BLUE_FLAG_REPORTS,
  INITIAL_WORKSHOP_TASKS,
  INITIAL_CONCIERGE_TICKETS,
  INITIAL_RESTAURANTS,
  INITIAL_SECURITY_ZONES,
  FuelStationState,
  DiverServiceTicket,
  MarpolWasteLog,
  HelipadBooking,
  YachtProvisioningOrder,
  SportsCourtBooking,
  EvChargerSpot,
  MooringBoatState,
  SmartPedestalState,
  FireEmergencyStatus,
  BlueFlagQualityReport,
  RefitWorkshopTask,
  ConciergeServiceTicket,
  RestaurantTenant,
  SecurityCctvZone
} from '@/lib/wim-extended-services';

type ServiceTabKey = 
  | 'mooring'
  | 'pedestals'
  | 'fuel'
  | 'diver'
  | 'marpol'
  | 'fire_safety'
  | 'blue_flag'
  | 'workshops'
  | 'concierge'
  | 'helipad'
  | 'provisioning'
  | 'sports'
  | 'restaurants'
  | 'ev_parking'
  | 'security';

export const ExtendedMarinaServicesDeck: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ServiceTabKey>('mooring');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for all 15 operational sectors
  const [mooringBoats, setMooringBoats] = useState<MooringBoatState[]>(INITIAL_MOORING_BOATS);
  const [pedestals, setPedestals] = useState<SmartPedestalState[]>(INITIAL_PEDESTALS);
  const [fuelPumps, setFuelPumps] = useState<FuelStationState[]>(INITIAL_FUEL_PUMPS);
  const [diverTasks, setDiverTasks] = useState<DiverServiceTicket[]>(INITIAL_DIVER_TASKS);
  const [marpolLogs, setMarpolLogs] = useState<MarpolWasteLog[]>(INITIAL_MARPOL_LOGS);
  const [fireStatus, setFireStatus] = useState<FireEmergencyStatus>(INITIAL_FIRE_STATUS);
  const [blueFlagReports, setBlueFlagReports] = useState<BlueFlagQualityReport[]>(INITIAL_BLUE_FLAG_REPORTS);
  const [workshopTasks, setWorkshopTasks] = useState<RefitWorkshopTask[]>(INITIAL_WORKSHOP_TASKS);
  const [conciergeTickets, setConciergeTickets] = useState<ConciergeServiceTicket[]>(INITIAL_CONCIERGE_TICKETS);
  const [helipadFlights, setHelipadFlights] = useState<HelipadBooking[]>(INITIAL_HELIPAD_FLIGHTS);
  const [provisioningOrders, setProvisioningOrders] = useState<YachtProvisioningOrder[]>(INITIAL_PROVISIONING);
  const [sportsBookings, setSportsBookings] = useState<SportsCourtBooking[]>(INITIAL_SPORTS_BOOKINGS);
  const [restaurants, setRestaurants] = useState<RestaurantTenant[]>(INITIAL_RESTAURANTS);
  const [evChargers, setEvChargers] = useState<EvChargerSpot[]>(INITIAL_EV_CHARGERS);
  const [securityZones, setSecurityZones] = useState<SecurityCctvZone[]>(INITIAL_SECURITY_ZONES);

  const [notification, setNotification] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  // Mooring Boat Dispatch Handler
  const handleDispatchMooring = (boatId: string) => {
    setMooringBoats(prev => prev.map(b => {
      if (b.id === boatId) {
        const nextStatus = b.status === 'STANDBY' ? 'DISPATCHED' : 'STANDBY';
        return {
          ...b,
          status: nextStatus,
          currentTask: nextStatus === 'DISPATCHED' ? 'Mendirek Girişi Yanaşma Refakati' : 'Nöbet Standby',
          assignedVessel: nextStatus === 'DISPATCHED' ? 'S/Y Aegea' : 'Hazırda Bekliyor'
        };
      }
      return b;
    }));
    showFeedback(`Palamar Botu Görevlendirildi: ${boatId} mendirek girişine sevk edildi.`);
  };

  // Smart Pedestal Breaker Toggle
  const handleToggleBreaker = (pedId: string) => {
    setPedestals(prev => prev.map(p => {
      if (p.id === pedId) {
        const newStatus = p.breakerStatus === 'ON' ? 'OFF' : 'ON';
        return {
          ...p,
          breakerStatus: newStatus,
          powerActiveKw: newStatus === 'ON' ? 24.5 : 0,
          currentAmps: newStatus === 'ON' ? 35 : 0,
          lastReading: 'Şimdi güncellendi'
        };
      }
      return p;
    }));
    showFeedback(`Akıllı Pano Değişikliği: ${pedId} sigorta şalteri uzaktan tetiklendi.`);
  };

  // Fuel Bunkering Dispatch
  const handleDispatchFuel = (pumpId: string) => {
    setFuelPumps(prev => prev.map(p => p.id === pumpId ? { ...p, status: 'fueling' } : p));
    showFeedback(`Yakıt İkmali Başlatıldı: ${pumpId} nolu pompadan M/Y Tatiana için 5.000 Litre dolum başladı.`);
  };

  // Diver Request
  const handleRequestDiver = () => {
    const newTicket: DiverServiceTicket = {
      id: `DIV-${Date.now().toString().slice(-3)}`,
      boatName: 'M/Y Tatiana',
      berthId: 'A-01',
      diverName: 'Murat Arslan (1. Sınıf Dalgıç)',
      serviceType: 'Pervane_Kontrolü',
      depthMeters: 6.2,
      status: 'underwater',
      findings: 'Sualtı kamera kaydı açık. Gövde temizliği ve pervane denetimi başlatıldı.',
      scheduledTime: 'Şu An Aktif'
    };
    setDiverTasks(prev => [newTicket, ...prev]);
    showFeedback('Dalgıç Görevlendirildi: Balıkadam ekibi A-01 rıhtımına intikal etti.');
  };

  // MARPOL Waste Pumpout
  const handlePumpoutWaste = () => {
    const newLog: MarpolWasteLog = {
      id: `WASTE-2026-${Date.now().toString().slice(-3)}`,
      boatName: 'M/Y Tatiana',
      maviKartNo: 'TR-MK-9912048',
      wasteType: 'Pis_Su_Siyah',
      amountLiters: 2800,
      operatorName: 'WIM Çevre Atık Ekibi (Palamar-1)',
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      edevletStatus: 'CONFIRMED',
      certificateRef: `MARPOL-CSB-${Date.now().toString().slice(-6)}`
    };
    setMarpolLogs(prev => [newLog, ...prev]);
    showFeedback('Mavi Kart Onayı: 2.800 Litre atık başarıyla çekildi ve Çevre Bakanlığı sistemine işlendi.');
  };

  // Fire Hydrant Boost Test
  const handleTestFirePump = () => {
    setFireStatus(prev => ({
      ...prev,
      boosterPumpStatus: 'PUMPING',
      seaWaterHydrantPressureBar: 9.4,
      emergencySirensTestedDate: 'Bugün Test Edildi (OK)'
    }));
    showFeedback('Yangın Pompası Testi: 8.5 Bar deniz suyu hidrant basıncı 9.4 Bar seviyesine yükseltildi, hazır.');
  };

  // Oil Barrier Deployment Toggle
  const handleToggleBarrier = () => {
    setFireStatus(prev => {
      const nextDeployed = !prev.barrierDeployed;
      return {
        ...prev,
        barrierDeployed: nextDeployed
      };
    });
    showFeedback(`Çevre Emniyet Bariyeri: 400 metrelik petrol/yakıt tutucu bariyer ${fireStatus.barrierDeployed ? 'toplandı' : 'açıldı'}.`);
  };

  // New Seawater Analysis Sample
  const handleRunSeawaterSample = () => {
    const newSample: BlueFlagQualityReport = {
      id: `BF-2026-${Date.now().toString().slice(-2)}`,
      date: new Date().toISOString().split('T')[0],
      locationName: 'WIM Ponton İçi Örnek Noktası',
      waterTemperatureC: 18.5,
      ph: 8.18,
      dissolvedOxygenMgL: 7.9,
      turbidityNtu: 0.8,
      salinityPsu: 22.3,
      escherichiaColiCfu: 8,
      intestinalEnterococciCfu: 2,
      complianceStatus: 'EXCELLENT',
      blueFlagCriteriaMetCount: 33,
      auditorOrg: 'TÜRÇEV Akredite Deniz Laboratuvarı'
    };
    setBlueFlagReports(prev => [newSample, ...prev]);
    showFeedback('Mavi Bayrak Analizi: Deniz suyu numunesi başarıyla alındı. 33/33 Kriter Uygun.');
  };

  // Restaurant Reservation
  const handleReserveTable = (restId: string) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === restId && r.reservedTables < r.totalTables) {
        return { ...r, reservedTables: r.reservedTables + 1 };
      }
      return r;
    }));
    showFeedback('Masa Rezervasyonu: Marina sakini VIP indirimi tanımlanarak masa rezerve edildi.');
  };

  const tabsConfig: Array<{ id: ServiceTabKey; label: string; icon: any; count?: number; badge?: string }> = [
    { id: 'mooring', label: 'Palamar Botu', icon: Anchor, badge: `${mooringBoats.length} Bot` },
    { id: 'pedestals', label: 'Akıllı Pano & Sayaç', icon: Zap, badge: `${pedestals.length} Pano` },
    { id: 'fuel', label: 'Yakıt / Bunkering', icon: Fuel, badge: '450 L/dk' },
    { id: 'diver', label: 'Dalgıç & Sualtı', icon: Waves, badge: `${diverTasks.length} Görev` },
    { id: 'marpol', label: 'Mavi Kart & Atık', icon: Trash2, badge: 'e-Devlet' },
    { id: 'fire_safety', label: 'Yangın & Emniyet', icon: Flame, badge: '8.5 Bar' },
    { id: 'blue_flag', label: 'Mavi Bayrak', icon: Award, badge: '33 Kriter' },
    { id: 'workshops', label: 'Tersane Atölyeleri', icon: Wrench, badge: `${workshopTasks.length} İş Emri` },
    { id: 'concierge', label: 'Temizlik & VIP', icon: Sparkles, badge: `${conciergeTickets.length} Talep` },
    { id: 'helipad', label: 'VIP Helipad', icon: Plane, badge: 'LTWI' },
    { id: 'provisioning', label: 'Kumanya / Chandlery', icon: ShoppingBag, badge: 'DutyFree' },
    { id: 'sports', label: 'West Life Spor', icon: Activity, badge: 'Kort & Havuz' },
    { id: 'restaurants', label: 'Çarşı & 30+ Restoran', icon: Utensils, badge: 'Rezervasyon' },
    { id: 'ev_parking', label: 'İSPARK & EV Şarj', icon: Car, badge: '500 Araç' },
    { id: 'security', label: '24/7 Emniyet & CCTV', icon: Video, badge: '120 Kamera' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-4">
      {/* Top Banner */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-700 border border-sky-400/40 flex items-center justify-center shadow-md">
            <Anchor className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base text-white">WIM TÜM MARİNA HİZMETLERİ &amp; OPERASYONLARI</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                15 DEPARTMAN AKTİF
              </span>
            </div>
            <p className="text-xs text-slate-400">
              155,000m² Dijital İkiz: Palamar, Akıllı Panolar, MARPOL Mavi Kart, Yangın Şebekesi, Tersane Atölyeleri, Helipad ve West Life
            </p>
          </div>
        </div>

        {/* Global Live Indicator */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="flex items-center px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-sky-300">
            <Radio className="w-3.5 h-3.5 mr-1.5 text-sky-400 animate-pulse" />
            VHF Ch. 72 Entegre
          </span>
          <span className="flex items-center px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            ISO 14001 &amp; Mavi Bayrak
          </span>
        </div>
      </div>

      {/* Tabs Horizontal Ribbon */}
      <div className="px-4 overflow-x-auto pb-1 scrollbar-thin">
        <div className="flex items-center space-x-1.5 min-w-max p-1 bg-slate-950/70 rounded-xl border border-slate-800/80">
          {tabsConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-sky-700 text-sky-100' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Alert Notification */}
      {notification && (
        <div className="mx-4 p-3 bg-emerald-950 border border-emerald-700 text-emerald-200 rounded-xl text-xs flex items-center shadow-lg animate-pulse">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Tab Panels Container */}
      <div className="p-4 pt-0">
        
        {/* TAB 1: PALAMAR BOTU & SEAMANSHIP MOORING ASSISTANCE */}
        {activeTab === 'mooring' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center">
                  <Anchor className="w-4 h-4 mr-2 text-sky-400" />
                  WIM Palamar Botları &amp; Yanaşma Refakati (Pilot Boat Fleet)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Marina mendirek ağzında karşılama, koltuk halatı verme, tonoz halatı yakalama ve acil rüzgar refakat botları.
                </p>
              </div>
              <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-sky-950/80 border border-sky-800 text-sky-300">
                Telsiz: VHF Kanal 72 • 24/7 Nöbetçi Ekip
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mooringBoats.map((boat) => (
                <div key={boat.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-sky-400 font-bold">{boat.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        boat.status === 'DISPATCHED'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {boat.status === 'DISPATCHED' ? 'GÖREVDE' : 'STANDBY (HAZIR)'}
                      </span>
                    </div>
                    <h5 className="font-bold text-white text-sm mt-1">{boat.boatName}</h5>
                    <p className="text-xs text-slate-400 mt-1">Kaptan: <strong className="text-slate-200">{boat.captainName}</strong></p>

                    <div className="mt-3 p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                      <div className="text-slate-400">Motor: <span className="text-white">{boat.enginePowerHp} HP Yamaha</span></div>
                      <div className="text-slate-400">Mevcut Görev: <span className="text-sky-300">{boat.currentTask}</span></div>
                      <div className="text-slate-400">Atanan Tekne: <span className="text-amber-300">{boat.assignedVessel}</span></div>
                      <div className="text-slate-400">Hedef Rıhtım: <span className="text-slate-200">{boat.targetBerth}</span></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDispatchMooring(boat.id)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center ${
                      boat.status === 'DISPATCHED'
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        : 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30'
                    }`}
                  >
                    <Anchor className="w-3.5 h-3.5 mr-1.5" />
                    {boat.status === 'DISPATCHED' ? 'Görevi Tamamla (Standby)' : 'Mendireğe Sevk Et'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SMART PEDESTAL & UTILITIES (AKILLI PANO & SAYAÇLAR) */}
        {activeTab === 'pedestals' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-amber-400" />
                  Akıllı Elektrik &amp; Osmoz Su Pedestal Yönetimi
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  600 Bağlama yeri için uzaktan sayaç okuma, uzaktan sigorta açma/kapama ve kaçak akım izolasyon güvenliği.
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-amber-300 rounded-lg">
                  Elektrik: ₺4.85 / kWh
                </span>
                <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-sky-300 rounded-lg">
                  Osmoz Su: ₺45 / m³
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pedestals.map((ped) => (
                <div key={ped.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-sky-400 font-bold">{ped.pedestalCode}</span>
                      <h5 className="font-bold text-white text-sm">{ped.pontoon} • Bağlama: {ped.berthId}</h5>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      ped.breakerStatus === 'ON'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      ŞALTER: {ped.breakerStatus}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400">
                    Bağlı Tekne: <strong className="text-amber-300">{ped.connectedBoat || 'Boş'}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-400">Akım / Voltaj:</span>
                      <p className="text-white font-bold">{ped.currentAmps}A • {ped.voltageV}V</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Anlık Güç:</span>
                      <p className="text-amber-400 font-bold">{ped.powerActiveKw} kW</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Toplam Elektrik:</span>
                      <p className="text-emerald-400 font-bold">{ped.totalKwh.toLocaleString()} kWh</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Toplam Osmoz Su:</span>
                      <p className="text-sky-400 font-bold">{ped.totalWaterM3.toLocaleString()} m³</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Kaçak Akım Rölesi: <strong className="text-emerald-400">GÜVENLİ (30mA OK)</strong>
                    </span>
                    <button
                      onClick={() => handleToggleBreaker(ped.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center ${
                        ped.breakerStatus === 'ON'
                          ? 'bg-rose-600 hover:bg-rose-500 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {ped.breakerStatus === 'ON' ? (
                        <>
                          <ToggleRight className="w-4 h-4 mr-1 text-white" />
                          Gücü Kes
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 mr-1 text-white" />
                          Gücü Aç
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FUEL & BUNKERING */}
        {activeTab === 'fuel' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center">
                  <Fuel className="w-4 h-4 mr-2 text-amber-400" />
                  WIM Bunkering &amp; Akaryakıt İstasyonu (Yakıt Rıhtımı)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Transit / Gümrüksüz (Duty-Free) Eurodiesel &amp; Sahil Pompaları. Doğrudan boru hattından 450 L/dk mega yat ikmali.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-300">
                  Transit Dizel: <strong>€0.98 / Litre</strong> (₺35.77)
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sky-300">
                  Kıyı Eurodiesel: <strong>₺45.60 / Litre</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fuelPumps.map((pump) => (
                <div key={pump.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-white text-sm">{pump.pumpName}</h5>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        pump.status === 'fueling' 
                          ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse' 
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {pump.status === 'fueling' ? 'İKMAL YAPILIYOR' : 'MÜSAİT'}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                      <div>Tip: <span className="text-amber-400 font-bold">{pump.fuelType}</span></div>
                      <div>Akış: <span className="text-white">{pump.flowRateLitersPerMin} Litre/dk</span></div>
                      <div>Fiyat: <span className="text-white">€{pump.pricePerLiterEur} / Litre</span></div>
                      <div>Stok: <span className="text-sky-300">{pump.availableLiters.toLocaleString()} L</span></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">Son Kalibrasyon: {pump.lastInspectionDate}</span>
                    <button
                      onClick={() => handleDispatchFuel(pump.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-bold transition-colors flex items-center"
                    >
                      <Droplet className="w-3.5 h-3.5 mr-1" />
                      İkmal Başlat (5.000 L)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DIVER & UNDERWATER INSPECTION */}
        {activeTab === 'diver' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center">
                  <Waves className="w-4 h-4 mr-2 text-cyan-400" />
                  Sualtı Dalgıçlık ve Karina/Pervane Sörvey Hizmetleri
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Profesyonel ticari dalgıç ekibi: Pervane halat kurtarma, tutya değişimi, sualtı video/fotoğraf ekspertizi.
                </p>
              </div>

              <button
                onClick={handleRequestDiver}
                className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center shadow-lg shadow-cyan-600/30"
              >
                <Plus className="w-4 h-4 mr-1" />
                Acil Dalgıç Görevlendir
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diverTasks.map((ticket) => (
                <div key={ticket.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-400 font-bold">{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      ticket.status === 'underwater'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {ticket.status === 'underwater' ? 'ŞU AN SU ALTINDA' : 'TAMAMLANDI'}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-bold text-white text-sm">{ticket.boatName} • Rıhtım {ticket.berthId}</h5>
                    <p className="text-xs text-slate-400 mt-1">Dalgıç: <strong className="text-slate-200">{ticket.diverName}</strong></p>
                    <p className="text-xs text-cyan-300 font-mono mt-0.5">Hizmet: {ticket.serviceType} (Derinlik: {ticket.depthMeters}m)</p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300">
                    <span className="font-semibold text-slate-400 block mb-1">Ekspertiz Raporu &amp; Bulgular:</span>
                    {ticket.findings}
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
                    <span>Planlanan Zaman: {ticket.scheduledTime}</span>
                    <span className="text-emerald-400 flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> HD Sualtı Video Kaydı Mevcut
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MARPOL & BLUE CARD (MAVİ KART) */}
        {activeTab === 'marpol' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center">
                  <Trash2 className="w-4 h-4 mr-2 text-emerald-400" />
                  Mavi Kart &amp; MARPOL 73/78 Atık Kabul İstasyonu
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Çevre, Şehircilik ve İklim Değişikliği Bakanlığı e-Devlet Mavi Kart entegrasyonu. Sintine, pis su ve atık yağ boşaltımı.
                </p>
              </div>

              <button
                onClick={handlePumpoutWaste}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center shadow-lg shadow-emerald-600/30"
              >
                <Plus className="w-4 h-4 mr-1" />
                Mavi Kart Atık Çekimi Yap
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="p-3">Kayıt No</th>
                    <th className="p-3">Tekne / Yat</th>
                    <th className="p-3">Mavi Kart No</th>
                    <th className="p-3">Atık Türü</th>
                    <th className="p-3">Miktar</th>
                    <th className="p-3">Operatör</th>
                    <th className="p-3">e-Devlet Durumu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                  {marpolLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-sky-400">{log.id}</td>
                      <td className="p-3 font-semibold text-white">{log.boatName}</td>
                      <td className="p-3 text-slate-300">{log.maviKartNo}</td>
                      <td className="p-3 text-emerald-300 font-bold">{log.wasteType}</td>
                      <td className="p-3 text-amber-300">{log.amountLiters.toLocaleString()} Litre</td>
                      <td className="p-3 text-slate-400">{log.operatorName}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-bold">
                          BAKANLIK ONAYLI ({log.certificateRef})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: FIRE & ENVIRONMENTAL SAFETY (YANGIN & EMNİYET) */}
        {activeTab === 'fire_safety' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center">
                  <Flame className="w-4 h-4 mr-2 text-rose-400" />
                  Marina Yangın Şebekesi &amp; Petrol Kirliliği Acil Müdahale
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Deniz suyu hidrant hattı, yangın söndürme botu WIM Fire-1, 400m petrol sızıntısı bariyeri ve köpük istasyonları.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTestFirePump}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center"
                >
                  <Flame className="w-3.5 h-3.5 mr-1" />
                  Hidrant Basınç Testi Yap
                </button>
                <button
                  onClick={handleToggleBarrier}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-bold transition-colors flex items-center"
                >
                  <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                  {fireStatus.barrierDeployed ? 'Bariyeri Topla' : 'Petrol Bariyerini Aç'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px]">Hidrant Basıncı</span>
                <p className="text-2xl font-bold text-rose-400 mt-1">{fireStatus.seaWaterHydrantPressureBar} Bar</p>
                <span className="text-[10px] text-emerald-400">Hedef: {fireStatus.targetPressureBar} Bar (Hazır)</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px]">Yangın Söndürme Botu</span>
                <p className="text-base font-bold text-white mt-1">WIM Fire-1</p>
                <span className="text-[10px] text-emerald-400">3.000 L/dk Su-Köpük Monitörü</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px]">Köpük Konsantresi Stoku</span>
                <p className="text-2xl font-bold text-amber-400 mt-1">{fireStatus.foamStockLiters.toLocaleString()} L</p>
                <span className="text-[10px] text-slate-400">AFFF %3 Deniz Suyu Uyumlu</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px]">Petrol Bariyeri Durumu</span>
                <p className={`text-base font-bold mt-1 ${fireStatus.barrierDeployed ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {fireStatus.barrierDeployed ? 'DENİZDE AÇIK (400m)' : 'STANDBY (KORUMALI)'}
                </p>
                <span className="text-[10px] text-slate-400">Skimmer Ünitesi Hazır</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: BLUE FLAG & SEAWATER QUALITY (MAVİ BAYRAK) */}
        {activeTab === 'blue_flag' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center">
                  <Award className="w-4 h-4 mr-2 text-sky-400" />
                  Mavi Bayrak &amp; Deniz Suyu Mikrobiyolojik Laboratuvarı
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  FEE &amp; TÜRÇEV 33 Kriter Denetimi. 15 günde bir akredite laboratuvar deniz suyu analizi.
                </p>
              </div>

              <button
                onClick={handleRunSeawaterSample}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center shadow-lg shadow-sky-600/30"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Yeni Numune Analizi Kaydet
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blueFlagReports.map((report) => (
                <div key={report.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-sky-400 font-bold">{report.id}</span>
                      <h5 className="font-bold text-white text-sm">{report.locationName}</h5>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
                      {report.complianceStatus} (33/33 Kriter)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-400">Sıcaklık:</span>
                      <p className="text-white font-bold">{report.waterTemperatureC}°C</p>
                    </div>
                    <div>
                      <span className="text-slate-400">pH Seviyesi:</span>
                      <p className="text-cyan-400 font-bold">{report.ph}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Çözünmüş O2:</span>
                      <p className="text-emerald-400 font-bold">{report.dissolvedOxygenMgL} mg/L</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Tuzluluk:</span>
                      <p className="text-amber-400 font-bold">%{report.salinityPsu}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">E. Coli:</span>
                      <p className="text-emerald-400 font-bold">{report.escherichiaColiCfu} cfu/100ml</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Enterokok:</span>
                      <p className="text-emerald-400 font-bold">{report.intestinalEnterococciCfu} cfu/100ml</p>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
                    <span>Numune Tarihi: {report.date}</span>
                    <span className="text-slate-400">Denetçi: {report.auditorOrg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: SHIPYARD WORKSHOPS & REFIT (TERSANE ATÖLYELERİ) */}
        {activeTab === 'workshops' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center">
                  <Wrench className="w-4 h-4 mr-2 text-indigo-400" />
                  WIM Tersane &amp; Refit Atölyeleri
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Marangozluk &amp; Tik, Paslanmaz Torna/Krom, Simrad/Garmin NMEA Radar Elektronik, Boya Kabini ve Yetkili CAT/MAN Motor Servisleri.
                </p>
              </div>

              <div className="text-xs font-mono px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-lg">
                Kapalı Alan Atölyeleri • 700T Lift Destekli
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workshopTasks.map((task) => (
                <div key={task.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-indigo-400 font-bold">{task.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      task.status === 'COMPLETED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-bold text-white text-sm">{task.vesselName} • Atölye: {task.workshopType}</h5>
                    <p className="text-xs text-slate-400 mt-1">Sorumlu Usta: <strong className="text-slate-200">{task.technicianLead}</strong></p>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    {task.description}
                  </p>

                  <div className="text-xs font-mono text-slate-400">
                    Değişen / Kullanılan Parçalar:
                    <div className="flex flex-wrap gap-1 mt-1">
                      {task.partsReplaced.map((part, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300 text-[11px]">
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Çalışma Süresi: {task.hoursSpent} / {task.estimatedHours} Saat</span>
                    <span className="text-sky-400">İş Emri Açık</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: CONCIERGE & CLEANING (TEMİZLİK & VALE) */}
        {activeTab === 'concierge' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
                  VIP Concierge, Tekne Yıkama &amp; Yatçı Çamaşırhanesi
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Osmoz saf suyla dış cephe detailing, pasta cila, mürettebat çamaşırhanesi, marina içi buggy ring ve VIP transfer.
                </p>
              </div>

              <div className="text-xs font-mono px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-lg">
                24/7 VIP Concierge Desk
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {conciergeTickets.map((t) => (
                <div key={t.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-amber-400 font-bold">{t.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-slate-300 border border-slate-800">
                        {t.status}
                      </span>
                    </div>

                    <h5 className="font-bold text-white text-sm mt-1">{t.vesselName} (Rıhtım {t.berthId})</h5>
                    <p className="text-xs text-amber-300 font-mono mt-0.5">{t.serviceCategory}</p>
                    <p className="text-xs text-slate-300 mt-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      {t.details}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Saat: {t.scheduledTime}</span>
                    <span className="text-slate-300">{t.assignedStaff}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: HELIPAD (VIP HELİPORT LTWI) */}
        {activeTab === 'helipad' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center">
                  <Plane className="w-4 h-4 mr-2 text-sky-400" />
                  WIM VIP Helipad (ICAO: LTWI - West Istanbul Heliport)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mega yat armatörleri ve konukları için hava taksi iniş/kalkış koordinasyonu. SHGM uçuş planı entegrasyonu.
                </p>
              </div>

              <div className="text-xs font-mono px-3 py-1 bg-sky-950 text-sky-300 border border-sky-800 rounded-lg">
                FOD ve Yangın Nöbeti Aktif
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {helipadFlights.map((flight) => (
                <div key={flight.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-sky-400 font-bold">{flight.flightNo}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {flight.status}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-bold text-white text-sm">{flight.helicopterModel} • Çağrı: {flight.callSign}</h5>
                    <p className="text-xs text-slate-400 mt-1">Yolcu / Heyet: <strong className="text-slate-200">{flight.guestName}</strong></p>
                    <p className="text-xs text-sky-300 font-mono mt-0.5">Rota: {flight.destination.replace(/_/g, ' ')}</p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">İniş Saati</span>
                      <strong className="text-white">{flight.arrivalTime}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Kalkış Saati</span>
                      <strong className="text-amber-300">{flight.departureTime}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Gümrük Memuru</span>
                      <strong className={flight.customsOfficerRequired ? 'text-rose-400' : 'text-emerald-400'}>
                        {flight.customsOfficerRequired ? 'Gerekli' : 'Gerekmiyor'}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: PROVISIONING & CHANDLERY (KUMANYA & GEMİCİLİK MARKETİ) */}
        {activeTab === 'provisioning' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-2 text-emerald-400" />
                  Yat Kumanyası (Provisioning) &amp; Chandlery Gemicilik Malzemeleri
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Macrocenter Marine gurme gıda siparişleri, Liros palamar halatları, Wichard kilitler ve Duty-Free ikmal.
                </p>
              </div>

              <div className="text-xs font-mono px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg">
                Doğrudan Pontoona &amp; Rıhtıma Teslimat
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {provisioningOrders.map((order) => (
                <div key={order.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 font-bold">{order.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-slate-300 border border-slate-800">
                      {order.deliveryStatus}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-bold text-white text-sm">{order.boatName} • Rıhtım {order.berthId}</h5>
                    <p className="text-xs text-slate-400 mt-1">Tedarikçi: <strong className="text-slate-200">{order.supplier}</strong></p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-300">
                    <span className="font-semibold text-slate-400 block mb-1">Sipariş İçeriği:</span>
                    {order.itemsSummary}
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Teslimat Saati: {order.deliveryTime}</span>
                    <strong className="text-emerald-400 font-bold">₺{order.totalTry.toLocaleString()}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 12: WEST LIFE SPORTS & SPA */}
        {activeTab === 'sports' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-rose-400" />
                  West Life Club: Tenis, Padel, Yarı Olimpik Havuz &amp; Spa
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Marina yatçıları ve kulüp üyelerine özel spor kortu, fitness, sauna ve masaj rezervasyonları.
                </p>
              </div>

              <div className="text-xs font-mono px-3 py-1 bg-rose-950 text-rose-300 border border-rose-800 rounded-lg">
                Yat Mürettebatı İndirimi %20
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sportsBookings.map((booking) => (
                <div key={booking.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-rose-400 font-bold">{booking.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {booking.status}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-bold text-white text-sm">{booking.courtType.replace(/_/g, ' ')}</h5>
                    <p className="text-xs text-slate-400 mt-1">Misafir: <strong className="text-slate-200">{booking.guestName}</strong></p>
                    {booking.boatLinked && (
                      <p className="text-xs text-sky-400 font-mono mt-0.5">Bağlı Tekne: {booking.boatLinked}</p>
                    )}
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono text-amber-300">
                    Rezervasyon Saati: {booking.timeSlot}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 13: MARINA ÇARŞI & RESTAURANTS */}
        {activeTab === 'restaurants' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center">
                  <Utensils className="w-4 h-4 mr-2 text-amber-400" />
                  Marina Çarşı &amp; 30+ Restoran Yönetimi (Kira &amp; Rezervasyon)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calisto, BigChefs, Fersah ve diğer kiracılar. Masa doluluk oranları, marina sakinlerine özel %10-15 indirimler.
                </p>
              </div>

              <div className="text-xs font-mono px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-lg">
                Toplam 30+ Kiracı • Günlük 2.500+ Misafir
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurants.map((rest) => (
                <div key={rest.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-amber-400 font-bold">{rest.id}</span>
                      <h5 className="font-bold text-white text-base">{rest.name}</h5>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-amber-300 border border-slate-800">
                      %{rest.marinaDiscountPct} Yatçı İndirimi
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">{rest.cuisine} • <span className="text-slate-300">{rest.location}</span></p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-400">Masa Doluluk:</span>
                      <p className="text-white font-bold">{rest.reservedTables} / {rest.totalTables} Masa Rezerve</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Dahili Santral:</span>
                      <p className="text-sky-400 font-bold">Ext: {rest.phoneExtension}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Aylık Kira Bedeli:</span>
                      <p className="text-emerald-400 font-bold">€{rest.monthlyRentEur.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Ciro Payı Oranı:</span>
                      <p className="text-amber-400 font-bold">%{rest.turnoverSharePct}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500 font-mono">Sözleşme: GÜNCEL (Aktif)</span>
                    <button
                      onClick={() => handleReserveTable(rest.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-bold transition-colors flex items-center"
                    >
                      <Utensils className="w-3.5 h-3.5 mr-1" />
                      Masa Rezerve Et
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 14: ISPARK & EV CHARGERS */}
        {activeTab === 'ev_parking' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center">
                  <Car className="w-4 h-4 mr-2 text-indigo-400" />
                  İSPARK 500 Araçlık Otopark &amp; 180 kW DC Hızlı Şarj İstasyonları
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Plaka tanıma sistemi (PTS) entegrasyonu, tekne sahiplerine ücretsiz tanımlı kartlar ve elektrikli araç şarjı.
                </p>
              </div>

              <div className="text-xs font-mono px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-lg">
                Doluluk: 382 / 500 Araç
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {evChargers.map((spot) => (
                <div key={spot.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-indigo-400 font-bold">{spot.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      spot.status === 'charging'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {spot.status === 'charging' ? 'ŞARJ EDİLİYOR' : 'MÜSAİT'}
                    </span>
                  </div>

                  <h5 className="font-bold text-white text-sm">{spot.spotNumber}</h5>

                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                    <div className="text-slate-400">Güç: <span className="text-white font-bold">{spot.powerKw} kW ({spot.connectorType})</span></div>
                    {spot.currentVehiclePlate && (
                      <div className="text-slate-400">Plaka: <span className="text-amber-300 font-bold">{spot.currentVehiclePlate}</span></div>
                    )}
                    {spot.energyDeliveredKwh && (
                      <div className="text-slate-400">Aktarılan: <span className="text-emerald-400 font-bold">{spot.energyDeliveredKwh} kWh</span></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 15: 24/7 SECURITY & CCTV (GÜVENLİK & CCTV) */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center">
                  <Video className="w-4 h-4 mr-2 text-rose-400" />
                  24/7 Güvenlik Komuta Merkezi, Termal CCTV &amp; Turnikeler
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  120+ Gece görüşlü termal kamera, otomatik plaka tanıma, biyometrik turnikeler ve palamar deniz devriyesi.
                </p>
              </div>

              <div className="text-xs font-mono px-3 py-1 bg-rose-950 text-rose-300 border border-rose-800 rounded-lg">
                ISPS Code Güvenlik Seviyesi: LEVEL 1 (Normal)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {securityZones.map((zone) => (
                <div key={zone.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-rose-400 font-bold">{zone.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      GÜVENLİ (İHLAL YOK)
                    </span>
                  </div>

                  <h5 className="font-bold text-white text-sm">{zone.zoneName}</h5>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-400">Kamera Sayısı:</span>
                      <p className="text-white font-bold">{zone.cameraCount} Termal / PTZ</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Turnike / Kapı:</span>
                      <p className="text-emerald-400 font-bold">{zone.accessGateStatus}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">PTZ Otomatik Takip:</span>
                      <p className="text-cyan-400 font-bold">{zone.ptzTrackingActive ? 'AKTİF' : 'PASİF'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Son Devriye:</span>
                      <p className="text-amber-300 font-bold">{zone.lastPatrolTimestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
