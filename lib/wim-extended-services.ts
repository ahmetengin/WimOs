export interface FuelStationState {
  id: string;
  pumpName: string;
  fuelType: 'Eurodiesel' | 'Transit_DutyFree_Diesel' | 'Super_95_Benzin';
  pricePerLiterTry: number;
  pricePerLiterEur: number;
  availableLiters: number;
  status: 'available' | 'fueling' | 'maintenance';
  flowRateLitersPerMin: number;
  lastInspectionDate: string;
}

export interface DiverServiceTicket {
  id: string;
  boatName: string;
  berthId: string;
  diverName: string;
  serviceType: 'Pervane_Kontrolü' | 'Zehirli_Boya_Sualtı_Sörvey' | 'Tutya_Değişimi' | 'Çapa_Halat_Kurtarma';
  depthMeters: number;
  status: 'assigned' | 'underwater' | 'completed';
  reportUrl?: string;
  findings: string;
  scheduledTime: string;
}

export interface MarpolWasteLog {
  id: string;
  boatName: string;
  maviKartNo: string;
  wasteType: 'Sintine_Suyu' | 'Pis_Su_Siyah' | 'Gri_Su' | 'Atık_Madeni_Yağ' | 'Katı_Çöp';
  amountLiters: number;
  operatorName: string;
  timestamp: string;
  edevletStatus: 'SENT_TO_MINISTRY' | 'CONFIRMED';
  certificateRef: string;
}

export interface HelipadBooking {
  id: string;
  flightNo: string;
  callSign: string;
  helicopterModel: string; // e.g. "AgustaWestland AW139", "Bell 429"
  guestName: string;
  destination: 'Istanbul_Havalimanı_IST' | 'Sabiha_Gökçen_SAW' | 'Bodrum_Yalıkavak' | 'Kalamış';
  arrivalTime: string;
  departureTime: string;
  status: 'PERMIT_GRANTED' | 'LANDED' | 'DEPARTED';
  customsOfficerRequired: boolean;
}

export interface YachtProvisioningOrder {
  id: string;
  boatName: string;
  berthId: string;
  supplier: 'Macrocenter_Marine' | 'WIM_Chandlery_DutyFree' | 'Gourmet_Butcher';
  itemsSummary: string;
  totalTry: number;
  deliveryStatus: 'preparing' | 'in_delivery' | 'delivered_to_berth';
  deliveryTime: string;
}

export interface SportsCourtBooking {
  id: string;
  courtType: 'Tenis_Kortu_1' | 'Tenis_Kortu_2' | 'Futbol_Sahası' | 'Plaj_Voleybolu' | 'Yarı_Olimpik_Havuz' | 'Padel_Kortu' | 'Spa_Masaj';
  guestName: string;
  boatLinked?: string;
  timeSlot: string;
  status: 'confirmed' | 'in_use' | 'completed';
}

export interface EvChargerSpot {
  id: string;
  spotNumber: string;
  powerKw: number; // 180kW DC Fast or 22kW AC
  connectorType: 'CCS2' | 'Type2';
  status: 'available' | 'charging' | 'reserved';
  currentVehiclePlate?: string;
  energyDeliveredKwh?: number;
}

// 1. Palamar Botu & Mooring Refakat
export interface MooringBoatState {
  id: string;
  boatName: string; // e.g. "Palamar-1 (Northstar 8.5m)"
  captainName: string;
  vhfChannel: number;
  enginePowerHp: number;
  status: 'STANDBY' | 'DISPATCHED' | 'TOWING' | 'MAINTENANCE';
  currentTask?: string;
  assignedVessel?: string;
  targetBerth?: string;
}

// 2. Akıllı Elektrik & Su Pedestal (Smart Pedestal)
export interface SmartPedestalState {
  id: string;
  pedestalCode: string; // e.g. "PED-A-01"
  pontoon: string;
  berthId: string;
  connectedBoat?: string;
  breakerStatus: 'ON' | 'OFF' | 'TRIPPED';
  currentAmps: number; // e.g. 63A or 125A
  voltageV: number; // 230V or 400V
  powerActiveKw: number;
  totalKwh: number;
  waterFlowLpm: number;
  totalWaterM3: number;
  leakageProtectionOk: boolean;
  lastReading: string;
}

// 3. Yangın Şebekesi & Çevre Acil Müdahale
export interface FireEmergencyStatus {
  seaWaterHydrantPressureBar: number;
  targetPressureBar: number;
  boosterPumpStatus: 'ACTIVE_STANDBY' | 'PUMPING' | 'FAULT';
  fireBoatStatus: 'READY' | 'DEPLOYED' | 'TESTING';
  fireBoatName: string; // "WIM Fire-1 (Water Cannon 3000 L/min)"
  foamStockLiters: number;
  oilSpillBarrierMeters: number;
  barrierDeployed: boolean;
  skimmerUnitReady: boolean;
  emergencySirensTestedDate: string;
}

// 4. Mavi Bayrak & Deniz Suyu Kalitesi
export interface BlueFlagQualityReport {
  id: string;
  date: string;
  locationName: string;
  waterTemperatureC: number;
  ph: number;
  dissolvedOxygenMgL: number;
  turbidityNtu: number;
  salinityPsu: number;
  escherichiaColiCfu: number; // limit < 250 cfu/100ml
  intestinalEnterococciCfu: number; // limit < 100 cfu/100ml
  complianceStatus: 'EXCELLENT' | 'GOOD' | 'WARNING';
  blueFlagCriteriaMetCount: number; // out of 33
  auditorOrg: string;
}

// 5. Tersane Teknik Atölyeleri (Refit & Workshops)
export interface RefitWorkshopTask {
  id: string;
  workshopType: 'Marangozluk_Tik' | 'Krom_Torna_Kaynak' | 'Marine_Elektronik_NMEA' | 'Boya_Gelcoat_Kumlama' | 'Motor_Mekanik_CAT_MAN';
  vesselName: string;
  technicianLead: string;
  description: string;
  hoursSpent: number;
  estimatedHours: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'QUALITY_CHECK' | 'COMPLETED';
  partsReplaced: string[];
}

// 6. Yat Temizlik, Çamaşırhane & Concierge
export interface ConciergeServiceTicket {
  id: string;
  vesselName: string;
  berthId: string;
  serviceCategory: 'Gövde_Osmoz_Yıkama' | 'Yatçı_Çamaşırhanesi' | 'VIP_Buggy_Servisi' | 'Havalimanı_VIP_Transfer';
  details: string;
  scheduledTime: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedStaff: string;
}

// 7. Marina Çarşı & Restoranlar (West Life & Çarşı)
export interface RestaurantTenant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  totalTables: number;
  reservedTables: number;
  phoneExtension: string;
  leaseStatus: 'CURRENT' | 'RENEWAL_DUE';
  monthlyRentEur: number;
  turnoverSharePct: number;
  marinaDiscountPct: number;
}

// 8. Güvenlik, CCTV & Sınır Koruma
export interface SecurityCctvZone {
  id: string;
  zoneName: string;
  cameraCount: number;
  thermalNightVision: boolean;
  ptzTrackingActive: boolean;
  accessGateStatus: 'LOCKED' | 'BADGE_ACCESS' | 'OPEN';
  incidentAlerts: number;
  lastPatrolTimestamp: string;
}

// Initial Live Bunkering Pumps
export const INITIAL_FUEL_PUMPS: FuelStationState[] = [
  {
    id: 'PUMP-01',
    pumpName: 'Transit / Duty-Free Mega Dispenser #1',
    fuelType: 'Transit_DutyFree_Diesel',
    pricePerLiterEur: 0.98,
    pricePerLiterTry: 35.77,
    availableLiters: 180000,
    status: 'available',
    flowRateLitersPerMin: 450,
    lastInspectionDate: '2026-10-01'
  },
  {
    id: 'PUMP-02',
    pumpName: 'Transit / Duty-Free Mega Dispenser #2',
    fuelType: 'Transit_DutyFree_Diesel',
    pricePerLiterEur: 0.98,
    pricePerLiterTry: 35.77,
    availableLiters: 165000,
    status: 'available',
    flowRateLitersPerMin: 450,
    lastInspectionDate: '2026-10-01'
  },
  {
    id: 'PUMP-03',
    pumpName: 'Kıyı Dağıtıcı (Eurodiesel Sahil)',
    fuelType: 'Eurodiesel',
    pricePerLiterEur: 1.25,
    pricePerLiterTry: 45.60,
    availableLiters: 95000,
    status: 'available',
    flowRateLitersPerMin: 120,
    lastInspectionDate: '2026-10-05'
  },
  {
    id: 'PUMP-04',
    pumpName: 'Sürat Motoru Benzin (Super 95)',
    fuelType: 'Super_95_Benzin',
    pricePerLiterEur: 1.30,
    pricePerLiterTry: 47.45,
    availableLiters: 40000,
    status: 'available',
    flowRateLitersPerMin: 80,
    lastInspectionDate: '2026-10-05'
  }
];

// Initial Diver Tasks
export const INITIAL_DIVER_TASKS: DiverServiceTicket[] = [
  {
    id: 'DIV-801',
    boatName: 'M/Y Tatiana',
    berthId: 'A-01',
    diverName: 'Serdar Yaman (Ticari Dalgıç Balıkadam No: 4128)',
    serviceType: 'Pervane_Kontrolü',
    depthMeters: 5.8,
    status: 'completed',
    findings: 'Pervanede herhangi bir yabancı halat veya ağ dolanması tespit edilmedi. Şaft tutyaları %80 kondisyonda.',
    scheduledTime: 'Bugün 14:00'
  },
  {
    id: 'DIV-802',
    boatName: 'S/Y Aegea',
    berthId: 'B-01',
    diverName: 'Ali Can (Balıkadam)',
    serviceType: 'Tutya_Değişimi',
    depthMeters: 4.5,
    status: 'underwater',
    findings: 'Salma ve dümen palası çinko tutya değişimi yapılıyor.',
    scheduledTime: 'Şu An Su Altında'
  }
];

// Initial MARPOL Waste Logs
export const INITIAL_MARPOL_LOGS: MarpolWasteLog[] = [
  {
    id: 'WASTE-2025-401',
    boatName: 'M/Y Tatiana',
    maviKartNo: 'TR-MK-9912048',
    wasteType: 'Pis_Su_Siyah',
    amountLiters: 3200,
    operatorName: 'WIM Çevre Atık Ekibi (Palamar-4)',
    timestamp: '2026-10-15 11:20',
    edevletStatus: 'CONFIRMED',
    certificateRef: 'MARPOL-CSB-882910'
  },
  {
    id: 'WASTE-2025-402',
    boatName: 'M/Y Blue Horizon',
    maviKartNo: 'TR-MK-8821039',
    wasteType: 'Sintine_Suyu',
    amountLiters: 1100,
    operatorName: 'WIM Çevre Atık Ekibi (Palamar-2)',
    timestamp: '2026-10-14 17:05',
    edevletStatus: 'CONFIRMED',
    certificateRef: 'MARPOL-CSB-882911'
  }
];

// Initial Helipad Flights
export const INITIAL_HELIPAD_FLIGHTS: HelipadBooking[] = [
  {
    id: 'HELI-101',
    flightNo: 'TC-HMR (Airbus ACH130)',
    callSign: 'YILDIZ-AIR-01',
    helicopterModel: 'Airbus ACH130 Luxury',
    guestName: 'Kaptan & Armatör Heyeti (M/Y Tatiana)',
    destination: 'Istanbul_Havalimanı_IST',
    arrivalTime: 'Yarın 11:15',
    departureTime: 'Yarın 11:45',
    status: 'PERMIT_GRANTED',
    customsOfficerRequired: false
  },
  {
    id: 'HELI-102',
    flightNo: 'TC-BIL (Bell 429)',
    callSign: 'BILGIN-CORP-1',
    helicopterModel: 'Bell 429 Twin Turbine',
    guestName: 'Bilgin Yachts Yönetim Kurulu',
    destination: 'Bodrum_Yalıkavak',
    arrivalTime: 'Cuma 15:00',
    departureTime: 'Cuma 15:30',
    status: 'PERMIT_GRANTED',
    customsOfficerRequired: false
  }
];

// Initial Provisioning Orders
export const INITIAL_PROVISIONING: YachtProvisioningOrder[] = [
  {
    id: 'PRV-301',
    boatName: 'M/Y Tatiana',
    berthId: 'A-01',
    supplier: 'Macrocenter_Marine',
    itemsSummary: 'Organik Ege Zeytinyağı, İtalyan Trüf Yağı, Taze Deniz Ürünleri, Şampanya (12 Şişe)',
    totalTry: 84500,
    deliveryStatus: 'delivered_to_berth',
    deliveryTime: 'Bugün 15:30'
  },
  {
    id: 'PRV-302',
    boatName: 'M/Y Blue Horizon',
    berthId: 'A-03',
    supplier: 'WIM_Chandlery_DutyFree',
    itemsSummary: 'Paslanmaz Çelik Şackle Takımı, 24mm Liros Palamar Halatı (100m), Zehirli Boya İnceltici',
    totalTry: 42100,
    deliveryStatus: 'in_delivery',
    deliveryTime: 'Bugün 19:00'
  }
];

// Initial Sports Court Bookings
export const INITIAL_SPORTS_BOOKINGS: SportsCourtBooking[] = [
  {
    id: 'SPT-201',
    courtType: 'Tenis_Kortu_1',
    guestName: 'Kaptan Vance (M/Y Tatiana)',
    boatLinked: 'M/Y Tatiana',
    timeSlot: 'Bugün 19:00 - 20:30',
    status: 'confirmed'
  },
  {
    id: 'SPT-202',
    courtType: 'Yarı_Olimpik_Havuz',
    guestName: 'Ahmet Engin (VIP Üye)',
    timeSlot: 'Yarın 09:00 - 10:00',
    status: 'confirmed'
  },
  {
    id: 'SPT-203',
    courtType: 'Padel_Kortu',
    guestName: 'S/Y Aegea Mürettebatı',
    timeSlot: 'Bugün 20:30 - 21:30',
    status: 'confirmed'
  }
];

// Initial EV Chargers
export const INITIAL_EV_CHARGERS: EvChargerSpot[] = [
  { id: 'EV-01', spotNumber: 'İSPARK VIP DC-1', powerKw: 180, connectorType: 'CCS2', status: 'charging', currentVehiclePlate: '34 YK 9902', energyDeliveredKwh: 48.5 },
  { id: 'EV-02', spotNumber: 'İSPARK VIP DC-2', powerKw: 180, connectorType: 'CCS2', status: 'available' },
  { id: 'EV-03', spotNumber: 'West Life AC-1', powerKw: 22, connectorType: 'Type2', status: 'available' },
  { id: 'EV-04', spotNumber: 'Çarşı AC-2', powerKw: 22, connectorType: 'Type2', status: 'charging', currentVehiclePlate: '34 TAT 80', energyDeliveredKwh: 14.2 }
];

// Initial Mooring Boats Fleet
export const INITIAL_MOORING_BOATS: MooringBoatState[] = [
  {
    id: 'MB-01',
    boatName: 'WIM Palamar-1 (Northstar 8.5m Rigid Inflatable)',
    captainName: 'Hasan Reis',
    vhfChannel: 72,
    enginePowerHp: 300,
    status: 'STANDBY',
    currentTask: 'Marina Ana Mendirek Giriş Nöbeti',
    assignedVessel: 'Hazırda Bekliyor',
    targetBerth: 'Marmara Ağzı'
  },
  {
    id: 'MB-02',
    boatName: 'WIM Palamar-2 (Cheetah Catamaran Mooring Rib)',
    captainName: 'Kenan Usta',
    vhfChannel: 72,
    enginePowerHp: 250,
    status: 'DISPATCHED',
    currentTask: 'Yanaşma Refakati & Koltuk Halatı Verme',
    assignedVessel: 'M/Y Tatiana (80m)',
    targetBerth: 'A-01 Megayat Rıhtımı'
  },
  {
    id: 'MB-03',
    boatName: 'WIM Palamar-3 (Heavy Duty Workboat)',
    captainName: 'İsmail Kaptan',
    vhfChannel: 72,
    enginePowerHp: 350,
    status: 'STANDBY',
    currentTask: 'Çekek Sahası İskele İntikali',
    assignedVessel: 'Yedekleme Beklemede',
    targetBerth: 'Travel Lift Havuzu'
  }
];

// Initial Smart Pedestals
export const INITIAL_PEDESTALS: SmartPedestalState[] = [
  {
    id: 'PED-01',
    pedestalCode: 'PED-A-01',
    pontoon: 'Ponton A (Megayat)',
    berthId: 'A-01',
    connectedBoat: 'M/Y Tatiana (80m)',
    breakerStatus: 'ON',
    currentAmps: 250,
    voltageV: 400,
    powerActiveKw: 114.5,
    totalKwh: 14820,
    waterFlowLpm: 18.2,
    totalWaterM3: 342.8,
    leakageProtectionOk: true,
    lastReading: '1 Dakika Önce'
  },
  {
    id: 'PED-02',
    pedestalCode: 'PED-A-02',
    pontoon: 'Ponton A (Megayat)',
    berthId: 'A-02',
    connectedBoat: 'S/Y Aegea (48m)',
    breakerStatus: 'ON',
    currentAmps: 63,
    voltageV: 400,
    powerActiveKw: 28.4,
    totalKwh: 6410,
    waterFlowLpm: 0,
    totalWaterM3: 118.5,
    leakageProtectionOk: true,
    lastReading: 'Şimdi'
  },
  {
    id: 'PED-03',
    pedestalCode: 'PED-B-14',
    pontoon: 'Ponton B',
    berthId: 'B-14',
    connectedBoat: 'M/Y Ege Rüzgarı',
    breakerStatus: 'ON',
    currentAmps: 32,
    voltageV: 230,
    powerActiveKw: 4.8,
    totalKwh: 1240,
    waterFlowLpm: 4.5,
    totalWaterM3: 42.1,
    leakageProtectionOk: true,
    lastReading: '3 Dakika Önce'
  },
  {
    id: 'PED-04',
    pedestalCode: 'PED-C-08',
    pontoon: 'Ponton C',
    berthId: 'C-08',
    breakerStatus: 'OFF',
    currentAmps: 0,
    voltageV: 230,
    powerActiveKw: 0,
    totalKwh: 890,
    waterFlowLpm: 0,
    totalWaterM3: 19.4,
    leakageProtectionOk: true,
    lastReading: 'Standby'
  }
];

// Initial Fire & Environmental Emergency System
export const INITIAL_FIRE_STATUS: FireEmergencyStatus = {
  seaWaterHydrantPressureBar: 8.6,
  targetPressureBar: 8.5,
  boosterPumpStatus: 'ACTIVE_STANDBY',
  fireBoatStatus: 'READY',
  fireBoatName: 'WIM Fire-1 (3000 L/dk Denizden Su-Köpük Monitörü)',
  foamStockLiters: 4500,
  oilSpillBarrierMeters: 400,
  barrierDeployed: false,
  skimmerUnitReady: true,
  emergencySirensTestedDate: '2026-10-10'
};

// Initial Blue Flag Quality Report
export const INITIAL_BLUE_FLAG_REPORTS: BlueFlagQualityReport[] = [
  {
    id: 'BF-2026-10',
    date: '2026-10-12',
    locationName: 'WIM İç Liman & Mendirek Ağzı İstasyon-1',
    waterTemperatureC: 18.2,
    ph: 8.15,
    dissolvedOxygenMgL: 7.8,
    turbidityNtu: 0.9,
    salinityPsu: 22.4,
    escherichiaColiCfu: 12,
    intestinalEnterococciCfu: 4,
    complianceStatus: 'EXCELLENT',
    blueFlagCriteriaMetCount: 33,
    auditorOrg: 'TÜRÇEV & Çevre, Şehircilik ve İklim Değişikliği Bakanlığı'
  },
  {
    id: 'BF-2026-09',
    date: '2026-09-28',
    locationName: 'WIM Akaryakıt İskelesi & Çekek Havuzu İstasyon-2',
    waterTemperatureC: 20.4,
    ph: 8.22,
    dissolvedOxygenMgL: 7.5,
    turbidityNtu: 1.2,
    salinityPsu: 22.1,
    escherichiaColiCfu: 24,
    intestinalEnterococciCfu: 8,
    complianceStatus: 'EXCELLENT',
    blueFlagCriteriaMetCount: 33,
    auditorOrg: 'TÜRÇEV Akredite Deniz Laboratuvarı'
  }
];

// Initial Refit Workshops
export const INITIAL_WORKSHOP_TASKS: RefitWorkshopTask[] = [
  {
    id: 'WRK-501',
    workshopType: 'Marangozluk_Tik',
    vesselName: 'M/Y Tatiana',
    technicianLead: 'Usta Selim (WIM Teak Works)',
    description: 'Yüzme platformu ve flybridge Burma tik kaplama zımpara ve derz yenileme',
    hoursSpent: 18,
    estimatedHours: 24,
    status: 'IN_PROGRESS',
    partsReplaced: ['Sikaflex 290DC PRO Derz Dolgusu', '12mm Birinci Sınıf Burma Teak']
  },
  {
    id: 'WRK-502',
    workshopType: 'Marine_Elektronik_NMEA',
    vesselName: 'S/Y Aegea',
    technicianLead: 'Mühendis Erdem (Navigasyon Uzmanı)',
    description: 'NMEA 2000 omurga veri ağı, Simrad Halo-6 radar ve rüzgar gülü kalibrasyonu',
    hoursSpent: 8,
    estimatedHours: 10,
    status: 'IN_PROGRESS',
    partsReplaced: ['Simrad Precision-9 Pusula', 'Micro-C NMEA2000 Kablolama']
  },
  {
    id: 'WRK-503',
    workshopType: 'Motor_Mekanik_CAT_MAN',
    vesselName: 'M/Y Blue Horizon',
    technicianLead: 'Başmühendis Tarık (Caterpillar Marine)',
    description: 'Twin CAT C32 Acert 1000 saatlik ağır periyodik servis ve turboşarj denetimi',
    hoursSpent: 32,
    estimatedHours: 36,
    status: 'QUALITY_CHECK',
    partsReplaced: ['CAT Orijinal Yağ ve Yakıt Filtreleri', 'İmpeller Takımı', 'Külbütör Contaları']
  },
  {
    id: 'WRK-504',
    workshopType: 'Boya_Gelcoat_Kumlama',
    vesselName: 'M/Y Dolce Vita',
    technicianLead: 'Boya Şefi Orhan',
    description: 'Kapalı kabinde International Micron 350 zehirli boya ve epoksi astar uygulaması',
    hoursSpent: 40,
    estimatedHours: 40,
    status: 'COMPLETED',
    partsReplaced: ['International Primocon', 'Micron 350 Siyah (40 Litre)']
  }
];

// Initial Concierge & Cleaning
export const INITIAL_CONCIERGE_TICKETS: ConciergeServiceTicket[] = [
  {
    id: 'CNC-701',
    vesselName: 'M/Y Tatiana',
    berthId: 'A-01',
    serviceCategory: 'Gövde_Osmoz_Yıkama',
    details: 'Osmoz demineralize saf su ile süperyat dış cephe, camlar ve krom parlatma',
    scheduledTime: 'Bugün 16:30',
    status: 'IN_PROGRESS',
    assignedStaff: 'WIM Detailing Ekip 3 (4 Kişi)'
  },
  {
    id: 'CNC-702',
    vesselName: 'S/Y Aegea',
    berthId: 'B-01',
    serviceCategory: 'Yatçı_Çamaşırhanesi',
    details: '14 takım mürettebat üniforması ve master kabin Mısır pamuğu nevresim yıkama & ütü',
    scheduledTime: 'Yarın 09:00',
    status: 'PENDING',
    assignedStaff: 'WIM Laundry Servis'
  },
  {
    id: 'CNC-703',
    vesselName: 'M/Y Tatiana',
    berthId: 'A-01',
    serviceCategory: 'Havalimanı_VIP_Transfer',
    details: 'İstanbul Havalimanı (IST) VIP Terminalden 4 yolcu karşılama (Mercedes Maybach VIP)',
    scheduledTime: 'Yarın 14:00',
    status: 'PENDING',
    assignedStaff: 'WIM VIP Chauffeur'
  }
];

// Initial Commercial Restaurant Tenants
export const INITIAL_RESTAURANTS: RestaurantTenant[] = [
  {
    id: 'REST-01',
    name: 'Calisto Balık & Lounge',
    cuisine: 'Ege & Akdeniz Taze Deniz Mahsulleri',
    location: 'Marina Rıhtım Boyu No: 4',
    totalTables: 45,
    reservedTables: 38,
    phoneExtension: '2101',
    leaseStatus: 'CURRENT',
    monthlyRentEur: 6500,
    turnoverSharePct: 4.5,
    marinaDiscountPct: 15
  },
  {
    id: 'REST-02',
    name: 'BigChefs West Istanbul',
    cuisine: 'Dünya Mutfağı & Kahvaltı & Bar',
    location: 'West Life Meydanı No: 1',
    totalTables: 60,
    reservedTables: 42,
    phoneExtension: '2102',
    leaseStatus: 'CURRENT',
    monthlyRentEur: 8000,
    turnoverSharePct: 5.0,
    marinaDiscountPct: 10
  },
  {
    id: 'REST-03',
    name: 'Fersah Balık Restoranı',
    cuisine: 'Geleneksel Boğaz & Marmara Balıkçısı',
    location: 'Marina İskele Çarşısı No: 8',
    totalTables: 35,
    reservedTables: 28,
    phoneExtension: '2103',
    leaseStatus: 'CURRENT',
    monthlyRentEur: 5200,
    turnoverSharePct: 4.0,
    marinaDiscountPct: 15
  },
  {
    id: 'REST-04',
    name: 'Midpoint Marina Terrace',
    cuisine: 'Modern Bistro & Kokteyl Lounge',
    location: 'Çarşı Meydanı Blok B',
    totalTables: 50,
    reservedTables: 31,
    phoneExtension: '2104',
    leaseStatus: 'CURRENT',
    monthlyRentEur: 7200,
    turnoverSharePct: 4.5,
    marinaDiscountPct: 10
  }
];

// Initial CCTV & Security Zones
export const INITIAL_SECURITY_ZONES: SecurityCctvZone[] = [
  {
    id: 'SEC-01',
    zoneName: 'Marmara Liman Ağzı & Mendirek Güvenlik Noktası',
    cameraCount: 16,
    thermalNightVision: true,
    ptzTrackingActive: true,
    accessGateStatus: 'BADGE_ACCESS',
    incidentAlerts: 0,
    lastPatrolTimestamp: '10 Dakika Önce (Palamar Devriye)'
  },
  {
    id: 'SEC-02',
    zoneName: 'Zone A Megayat Rıhtımı & Ponton Kapıları',
    cameraCount: 24,
    thermalNightVision: true,
    ptzTrackingActive: true,
    accessGateStatus: 'BADGE_ACCESS',
    incidentAlerts: 0,
    lastPatrolTimestamp: '4 Dakika Önce (Güvenlik Ekip 1)'
  },
  {
    id: 'SEC-03',
    zoneName: 'Zone B Bilgin Yachts HQ & 700T Travel Lift Sahası',
    cameraCount: 32,
    thermalNightVision: true,
    ptzTrackingActive: true,
    accessGateStatus: 'LOCKED',
    incidentAlerts: 0,
    lastPatrolTimestamp: 'Devam Ediyor (Biyometrik & CCTV)'
  },
  {
    id: 'SEC-04',
    zoneName: 'West Life Spor, Çarşı & İSPARK 500 Araç Otoparkı',
    cameraCount: 48,
    thermalNightVision: false,
    ptzTrackingActive: true,
    accessGateStatus: 'BADGE_ACCESS',
    incidentAlerts: 0,
    lastPatrolTimestamp: '15 Dakika Önce'
  }
];
