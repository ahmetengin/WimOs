export interface BerthData {
  id: string; // e.g., "A-01", "B-14"
  pontoon: string;
  number: number;
  maxLoa: number; // in meters (up to 95m)
  draft: number; // 3.5m to 7.0m
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  electricityMeterId: string;
  currentBoat?: {
    id: string;
    name: string;
    loa: number;
    beam: number;
    draft: number;
    flag: string;
    grossTonnage: number;
    ownerName: string;
    ownerVkn: string;
    contractRef: string;
    insuranceExpiry: string;
  };
  lat: number;
  lng: number;
}

export interface RackSlotData {
  id: string; // "A-1" to "H-4"
  row: string; // A through H (8 rows)
  level: number; // 1 to 4 (4 levels) -> 8 * 12 = 96 capacity (or 8 rows x 3 columns x 4 levels)
  bay: number; // 1 to 3
  isOccupied: boolean;
  boat?: {
    name: string;
    model: string;
    loa: number; // strictly < 7.0m
    owner: string;
    phoneMasked: string;
  };
}

export interface LiftOperation {
  id: string;
  liftType: '700T' | '75T';
  boatName: string;
  loa: number;
  weightTons: number;
  operationType: 'Haul-out' | 'Launch' | 'Survey';
  scheduledTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled_weather';
  bayAssigned: string;
  windSpeedAtBooking: number;
  notes?: string;
}

export interface BilginHangarData {
  id: number;
  name: string;
  dimensions: string;
  currentProject: string;
  stage: string;
  accessLevel: 'RESTRICTED_BIO' | 'HIGH_SECURITY';
  securityLogs: Array<{
    id: string;
    timestamp: string;
    personnel: string;
    badgeId: string;
    bioMatch: boolean;
    action: string;
  }>;
}

export interface RestaurantTenant {
  id: string;
  name: string;
  cuisine: string;
  zone: string;
  tables: number;
  monthlyLeaseEur: number;
  leaseStatus: 'paid' | 'pending' | 'overdue';
  reservationsToday: Array<{
    id: string;
    guestName: string;
    pax: number;
    time: string;
    linkedBoat?: string;
  }>;
}

export interface ContractData {
  id: string;
  refCode: string;
  contractType: 'mooring' | 'lift_haul' | 'commercial_lease' | 'sub_contractor';
  customerName: string;
  customerVkn: string;
  boatName?: string;
  relatedAssetId: string;
  startDate: string;
  endDate: string;
  amountEur: number;
  amountTry: number;
  currency: 'EUR' | 'TRY';
  status: 'draft' | 'sent_for_signature' | 'active' | 'expiring_soon' | 'terminated';
  signedDate?: string;
  termsVersion: string;
  parasutInvoiceId?: string;
  complianceScore: number;
}

export interface ParasutInvoiceData {
  id: string;
  invoiceNo: string;
  contactName: string;
  taxNumber: string;
  description: string;
  currency: 'TRY' | 'EUR';
  amountTry: number;
  vatRate: number;
  vatAmountTry: number;
  totalWithVatTry: number;
  issueDate: string;
  dueDate: string;
  type: 'e-Fatura' | 'e-Arşiv';
  status: 'issued' | 'paid' | 'pending';
  pdfUrl?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  action: string;
  targetSubject: string;
  justification: string;
  ipAddress: string;
  status: 'APPROVED' | 'DENIED';
}

export interface CustomsEntryLog {
  id: string;
  boatName: string;
  flagState: string;
  captainName: string;
  entryDate: string;
  lastPort: string;
  nextPort: string;
  transitLogNo: string;
  status: 'CLEARED' | 'INSPECTION_PENDING' | 'DEPARTED';
  officerSign: string;
}

export interface WimRule {
  id: string;
  category: 'NAVIGATION' | 'SAFETY' | 'LEGAL' | 'ENVIRONMENT' | 'TECHNICAL';
  article: string;
  title: string;
  description: string;
  penalty: string;
  source: string;
}

// REAL WIM CONSTITUTION RULES (Based on official WIM Terms & Conditions PDF)
export const WIM_RULES: WimRule[] = [
  {
    id: 'RULE-ANCHOR',
    category: 'NAVIGATION',
    article: 'Madde 17 / Art. 17',
    title: 'Demirleme Yasağı (Strict Anchoring Prohibition)',
    description: 'Marina havzası içinde çıpa/demir atmak kesinlikle yasaktır. Tüm bağlama manevraları palamar botu eşliğinde tonoz (mooring line) sistemi ile yapılır.',
    penalty: '500 EUR ceza + Tonoz tamir masrafları + Derhal tahliye',
    source: 'WIM General Terms & Conditions v2025.1'
  },
  {
    id: 'RULE-PILOT',
    category: 'SAFETY',
    article: 'Madde 12 / Art. 12',
    title: 'Kılavuz Kaptan (Mandatory Pilotage for >1000 GT)',
    description: '1000 Gross Ton (GT) üzerindeki tüm süperyatlar ve ticari tescilli tekneler marinaya giriş ve çıkışta lisanslı Kılavuz Kaptan (Pilot) ve palamar botu almak mecburiyetindedir.',
    penalty: 'Liman Başkanlığı ihbarı + Giriş yasağı + Yasal seyrüsefer cezası',
    source: 'Safety Regulations & Marmara Port Entry Manual'
  },
  {
    id: 'RULE-INSURANCE',
    category: 'LEGAL',
    article: 'Madde 7 / Art. 7',
    title: 'Üçüncü Şahıs Sigortası (Third-Party Liability - TPL)',
    description: 'Marinaya giriş yapan her deniz aracı en az 1.500.000 EUR teminatlı P&I veya 3. Şahıs Mali Mesuliyet Sigortası poliçesini ibraz etmek zorundadır.',
    penalty: 'Giriş reddi / Bağlama sözleşmesi feshi',
    source: 'WIM Mooring Agreement Section 4'
  },
  {
    id: 'RULE-REFUND',
    category: 'LEGAL',
    article: 'Madde 91 / Art. 91',
    title: 'Erken Ayrılış ve İade Yasağı (No Refund Policy)',
    description: 'Sözleşme süresi dolmadan marinadan ayrılan teknelere hiçbir koşulda nakit ücret iadesi yapılmaz. Kalan bakiye devredilemez, yalnızca cari takvim yılı içinde kredi olarak saklanabilir.',
    penalty: 'Talep reddi (Kesin hüküm)',
    source: 'WIM Mooring Contract Financial Bylaws'
  },
  {
    id: 'RULE-WIND-LIFT',
    category: 'TECHNICAL',
    article: 'Madde 45 / Art. 45',
    title: '700 Ton Travel Lift Rüzgar Limiti (15 Knot Max Limit)',
    description: 'Türkiye\'nin en büyük 700T Travel Liftinde güvenlik gereği rüzgar hızı 15 knot (Bofor 4) üzerine çıktığında tüm karaya alma ve denize indirme operasyonları derhal durdurulur.',
    penalty: 'Otomatik vinç kilitlenmesi + Operasyon erteleme',
    source: 'Technical Yard Machinery Safety Directive'
  },
  {
    id: 'RULE-COMMERCIAL',
    category: 'LEGAL',
    article: 'Madde 28 / Art. 28',
    title: 'Ticari Faaliyet ve Alt Kiralama Yasağı',
    description: 'Marina yönetimi yazılı izni olmadan tekne üzerinden ticari gezi, charter, alt kiralama veya ticari reklam faaliyetleri yapılamaz.',
    penalty: 'Sözleşmenin tek taraflı feshi + 2.500 EUR cezai şart',
    source: 'WIM Commercial By-laws'
  },
  {
    id: 'RULE-WASTE',
    category: 'ENVIRONMENT',
    article: 'Madde 33 / Art. 33',
    title: 'Sintine ve Kirli Su Tahliyesi (MARPOL Prohibitions)',
    description: 'Marina sularına sintine, siyah/gri su, kimyasal veya çöp tahliyesi kesinlikle yasaktır. Mavi Kart atık alım istasyonu 24 saat ücretsiz hizmet vermektedir.',
    penalty: 'Sahil Güvenlik ihbarı (Çevre Kanunu cezası: 250.000 TL+)',
    source: 'Blue Flag & Environmental Protection Code'
  }
];

// INITIAL SEEDED BERTHS (Sample representative set of the 600 berths across Pontoons A to L)
export const INITIAL_BERTHS: BerthData[] = [
  {
    id: 'A-01',
    pontoon: 'A (Superyacht Quay)',
    number: 1,
    maxLoa: 95,
    draft: 7.0,
    status: 'occupied',
    electricityMeterId: 'MTR-A01-441',
    lat: 40.9620,
    lng: 28.6655,
    currentBoat: {
      id: 'BOAT-TATIANA',
      name: 'M/Y Tatiana',
      loa: 80.0,
      beam: 12.5,
      draft: 4.8,
      flag: 'Cayman Islands',
      grossTonnage: 1200,
      ownerName: 'Tatiana Maritime Ltd',
      ownerVkn: '8291039182',
      contractRef: 'CN-TAT-2025-01',
      insuranceExpiry: '2026-11-30'
    }
  },
  {
    id: 'A-02',
    pontoon: 'A (Superyacht Quay)',
    number: 2,
    maxLoa: 90,
    draft: 6.8,
    status: 'available',
    electricityMeterId: 'MTR-A02-442',
    lat: 40.9622,
    lng: 28.6658
  },
  {
    id: 'A-03',
    pontoon: 'A (Superyacht Quay)',
    number: 3,
    maxLoa: 85,
    draft: 6.5,
    status: 'occupied',
    electricityMeterId: 'MTR-A03-443',
    lat: 40.9624,
    lng: 28.6661,
    currentBoat: {
      id: 'BOAT-BLUEHORIZON',
      name: 'M/Y Blue Horizon',
      loa: 50.0,
      beam: 9.2,
      draft: 3.8,
      flag: 'Malta',
      grossTonnage: 450,
      ownerName: 'Horizon Blue Marine Ltd',
      ownerVkn: '9921049281',
      contractRef: 'CN-BLU-2025-02',
      insuranceExpiry: '2026-08-15'
    }
  },
  {
    id: 'B-01',
    pontoon: 'B (Megayacht Dock)',
    number: 1,
    maxLoa: 60,
    draft: 5.5,
    status: 'occupied',
    electricityMeterId: 'MTR-B01-301',
    lat: 40.9615,
    lng: 28.6645,
    currentBoat: {
      id: 'BOAT-AEGEA',
      name: 'S/Y Aegea',
      loa: 42.0,
      beam: 8.5,
      draft: 4.2,
      flag: 'Turkey',
      grossTonnage: 280,
      ownerName: 'Aegean Navigation A.Ş.',
      ownerVkn: '1029384756',
      contractRef: 'CN-AEG-2025-09',
      insuranceExpiry: '2027-01-10'
    }
  },
  {
    id: 'B-02',
    pontoon: 'B (Megayacht Dock)',
    number: 2,
    maxLoa: 55,
    draft: 5.2,
    status: 'available',
    electricityMeterId: 'MTR-B02-302',
    lat: 40.9617,
    lng: 28.6648
  },
  {
    id: 'C-01',
    pontoon: 'C (Cruiser Marina)',
    number: 1,
    maxLoa: 35,
    draft: 4.5,
    status: 'occupied',
    electricityMeterId: 'MTR-C01-201',
    lat: 40.9608,
    lng: 28.6635,
    currentBoat: {
      id: 'BOAT-ZEPHYR',
      name: 'M/Y Zephyr Istanbul',
      loa: 28.5,
      beam: 6.4,
      draft: 2.9,
      flag: 'Turkey',
      grossTonnage: 140,
      ownerName: 'Kaptan Cengiz Denizcilik',
      ownerVkn: '5566778899',
      contractRef: 'CN-ZEP-2025-04',
      insuranceExpiry: '2026-12-01'
    }
  },
  {
    id: 'C-02',
    pontoon: 'C (Cruiser Marina)',
    number: 2,
    maxLoa: 30,
    draft: 4.0,
    status: 'available',
    electricityMeterId: 'MTR-C02-202',
    lat: 40.9610,
    lng: 28.6638
  },
  {
    id: 'D-01',
    pontoon: 'D (Sport & Sail)',
    number: 1,
    maxLoa: 24,
    draft: 3.8,
    status: 'occupied',
    electricityMeterId: 'MTR-D01-101',
    lat: 40.9600,
    lng: 28.6625,
    currentBoat: {
      id: 'BOAT-BREEZE',
      name: 'Marmara Pearl',
      loa: 18.0,
      beam: 4.8,
      draft: 2.1,
      flag: 'USA (Delaware)',
      grossTonnage: 45,
      ownerName: 'Dr. Selim Yılmaz',
      ownerVkn: '2398471928',
      contractRef: 'CN-MAR-2025-11',
      insuranceExpiry: '2026-09-20'
    }
  },
  {
    id: 'CUSTOMS-01',
    pontoon: 'Port of Entry Pier',
    number: 99,
    maxLoa: 75,
    draft: 6.5,
    status: 'reserved',
    electricityMeterId: 'MTR-CST-001',
    lat: 40.9592,
    lng: 28.6610
  }
];

// 96 CAPACITY RACK SYSTEM (EXACTLY 96 SLOTS: Rows A to H, 12 slots each across 4 levels and 3 bays)
export const INITIAL_RACK_SLOTS: RackSlotData[] = [];
const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']; // 8 rows
// Generate exactly 96 slots: 8 rows x 12 slots (Levels 1 to 4 x Bays 1 to 3)
for (const r of rows) {
  for (let lvl = 1; lvl <= 4; lvl++) {
    for (let bay = 1; bay <= 3; bay++) {
      const slotIndex = (lvl - 1) * 3 + bay; // 1 to 12
      const slotId = `${r}-${lvl}-${bay}`;
      // Seed ~48 slots (50% filled)
      const isOccupied = (r === 'A' || r === 'B' || (r === 'C' && lvl <= 2));
      INITIAL_RACK_SLOTS.push({
        id: slotId,
        row: r,
        level: lvl,
        bay: bay,
        isOccupied: isOccupied,
        boat: isOccupied ? {
          name: `Speedboat ${r}-${slotIndex}`,
          model: 'Sea Ray 230 / Regal 21 OBX',
          loa: 6.2,
          owner: `Müşteri ${r}${slotIndex}`,
          phoneMasked: '532 **** 89'
        } : undefined
      });
    }
  }
}

// BILGIN YACHTS HIGH-SECURITY HANGARS
export const BILGIN_HANGARS: BilginHangarData[] = [
  {
    id: 1,
    name: 'Bilgin Shed #1 (Mega Hall Alpha)',
    dimensions: '105m x 26m (Height: 22m)',
    currentProject: 'Bilgin 163 (Project NB-80)',
    stage: 'Interior Outfitting & Teak Laying (88% Complete)',
    accessLevel: 'RESTRICTED_BIO',
    securityLogs: [
      {
        id: 'SEC-891',
        timestamp: '18:02:11',
        personnel: 'M. Demir (Chief Marine Engineer)',
        badgeId: 'BY-ENG-04',
        bioMatch: true,
        action: 'Main Hall Door Unlocked'
      },
      {
        id: 'SEC-890',
        timestamp: '17:45:00',
        personnel: 'O. Kaya (Naval Architect)',
        badgeId: 'BY-ARC-12',
        bioMatch: true,
        action: 'Hull Inspection Access'
      }
    ]
  },
  {
    id: 2,
    name: 'Bilgin Shed #2 (Mega Hall Beta)',
    dimensions: '105m x 26m (Height: 22m)',
    currentProject: 'Bilgin 263 (Project NB-81 - 80m Sistership)',
    stage: 'Hull Joining & Engine Room Installation',
    accessLevel: 'RESTRICTED_BIO',
    securityLogs: [
      {
        id: 'SEC-889',
        timestamp: '16:30:20',
        personnel: 'E. Bilgin (Production Director)',
        badgeId: 'BY-DIR-01',
        bioMatch: true,
        action: 'Biometric Palm Scanner Cleared'
      }
    ]
  },
  {
    id: 3,
    name: 'Bilgin Shed #3 (Drydock Gamma)',
    dimensions: '85m x 28m (Height: 20m)',
    currentProject: 'Bilgin 220 Explorer (Project NB-82)',
    stage: 'Steel Keel Block & Aluminum Superstructure Assembly',
    accessLevel: 'RESTRICTED_BIO',
    securityLogs: [
      {
        id: 'SEC-888',
        timestamp: '15:15:10',
        personnel: 'A. Yılmaz (Welding Supervisor)',
        badgeId: 'BY-TECH-99',
        bioMatch: true,
        action: 'Zone 3 Gate Cleared'
      }
    ]
  },
  {
    id: 4,
    name: 'Bilgin Shed #4 (Custom Refit Dock)',
    dimensions: '85m x 28m (Height: 20m)',
    currentProject: 'Bilgin 156 Mega Refit (Paint & Systems)',
    stage: 'Final Awlgrip Topcoat Spraying',
    accessLevel: 'RESTRICTED_BIO',
    securityLogs: [
      {
        id: 'SEC-887',
        timestamp: '14:02:55',
        personnel: 'K. Yıldırım (Painting Foreman)',
        badgeId: 'BY-PNT-07',
        bioMatch: true,
        action: 'Negative Pressure Chamber Entry'
      }
    ]
  }
];

// LIFESTYLE RESTAURANTS & TENANTS (West Life & Çarşı)
export const RESTAURANT_TENANTS: RestaurantTenant[] = [
  {
    id: 'TEN-CALISTO',
    name: 'Calisto Mediterranean Fish & Lounge',
    cuisine: 'Fine Dining Seafood & Wine',
    zone: 'Çarşı Pierfront #04',
    tables: 24,
    monthlyLeaseEur: 8500,
    leaseStatus: 'paid',
    reservationsToday: [
      { id: 'RES-01', guestName: 'Kaptan Miller (M/Y Blue Horizon)', pax: 4, time: '20:30', linkedBoat: 'M/Y Blue Horizon' },
      { id: 'RES-02', guestName: 'Ahmet Engin (VIP Member)', pax: 2, time: '21:00' }
    ]
  },
  {
    id: 'TEN-BIGCHEFS',
    name: 'BigChefs West Istanbul Marina',
    cuisine: 'Modern Turkish & World Bistro',
    zone: 'West Life Mall Entrance #01',
    tables: 45,
    monthlyLeaseEur: 12000,
    leaseStatus: 'paid',
    reservationsToday: [
      { id: 'RES-03', guestName: 'M/Y Tatiana Crew', pax: 6, time: '19:45', linkedBoat: 'M/Y Tatiana' }
    ]
  },
  {
    id: 'TEN-FERSAH',
    name: 'Fersah Balık Restoranı',
    cuisine: 'Traditional Aegean & Bosphorus Seafood',
    zone: 'Marina Breakwater Walk #08',
    tables: 30,
    monthlyLeaseEur: 9200,
    leaseStatus: 'paid',
    reservationsToday: []
  },
  {
    id: 'TEN-MIDPOINT',
    name: 'Midpoint Marina Terrace',
    cuisine: 'Casual Dining, Cocktails & Cafe',
    zone: 'West Life Center #12',
    tables: 50,
    monthlyLeaseEur: 11000,
    leaseStatus: 'paid',
    reservationsToday: []
  }
];

// INITIAL LIFT SCHEDULE
export const INITIAL_LIFT_SCHEDULE: LiftOperation[] = [
  {
    id: 'LIFT-001',
    liftType: '700T',
    boatName: 'M/Y Tatiana',
    loa: 80.0,
    weightTons: 620,
    operationType: 'Haul-out',
    scheduledTime: 'Tomorrow 10:00',
    status: 'scheduled',
    bayAssigned: 'Hardstanding Yard HS-01 (Heavy Pad)',
    windSpeedAtBooking: 12,
    notes: 'Approved by MAKER workflow. Slings inspected. Diver guide requested.'
  },
  {
    id: 'LIFT-002',
    liftType: '75T',
    boatName: 'Marmara Pearl',
    loa: 18.0,
    weightTons: 38,
    operationType: 'Survey',
    scheduledTime: 'Today 16:30',
    status: 'in_progress',
    bayAssigned: 'Lift Dock 2',
    windSpeedAtBooking: 11,
    notes: 'Routine bottom scrub and zinc anode replacement.'
  },
  {
    id: 'LIFT-003',
    liftType: '700T',
    boatName: 'S/Y Aegea',
    loa: 42.0,
    weightTons: 260,
    operationType: 'Launch',
    scheduledTime: 'Friday 14:00',
    status: 'scheduled',
    bayAssigned: 'Mega Dock Basin',
    windSpeedAtBooking: 9,
    notes: 'Rigging clearance verified.'
  }
];

// INITIAL AUDIT LOGS (KVKK & Vault)
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '18:04:15',
    actorId: 'AI_CONCIERGE_GM',
    action: 'PBX_ROUTING_INQUIRY',
    targetSubject: 'Ahmet Bey (Directory Lookup)',
    justification: 'Incoming caller request verification for PBX switchboard',
    ipAddress: '10.0.4.1 (Internal PBX Gateway)',
    status: 'APPROVED'
  },
  {
    id: 'AUD-002',
    timestamp: '17:55:00',
    actorId: 'FINANCE_ENGINE',
    action: 'PARASUT_INVOICE_CREATE',
    targetSubject: 'Tatiana Maritime Ltd (VKN: 8291039182)',
    justification: '700T Travel Lift & Mooring fee issuance',
    ipAddress: '10.0.1.5',
    status: 'APPROVED'
  },
  {
    id: 'AUD-003',
    timestamp: '16:20:12',
    actorId: 'ISPARK_GATE_SYNC',
    action: 'VEHICLE_ACCESS_LOG',
    targetSubject: 'Plate: 34 YK 9902 (Boat Owner SELIM YILMAZ)',
    justification: 'Automatic barrier entry validation',
    ipAddress: '192.168.10.44',
    status: 'APPROVED'
  }
];

// INITIAL CUSTOMS LOGS (Marmara Port of Entry)
export const INITIAL_CUSTOMS_LOGS: CustomsEntryLog[] = [
  {
    id: 'CST-2025-091',
    boatName: 'M/Y Tatiana',
    flagState: 'Cayman Islands 🇰🇾',
    captainName: 'Capt. Alexander Vance',
    entryDate: '2025-10-12 11:30',
    lastPort: 'Piraeus, Greece',
    nextPort: 'West Istanbul Marina (Home Berth A-01)',
    transitLogNo: 'TR-MRM-882910',
    status: 'CLEARED',
    officerSign: 'Gümrük Md. E. Karaca'
  },
  {
    id: 'CST-2025-092',
    boatName: 'M/Y Blue Horizon',
    flagState: 'Malta 🇲🇹',
    captainName: 'Capt. Richard Miller',
    entryDate: '2025-10-14 16:15',
    lastPort: 'Rhodes, Greece',
    nextPort: 'West Istanbul Marina (Refit Yard)',
    transitLogNo: 'TR-MRM-883014',
    status: 'CLEARED',
    officerSign: 'Gümrük Md. E. Karaca'
  },
  {
    id: 'CST-2025-093',
    boatName: 'M/Y Titan',
    flagState: 'Marshall Islands 🇲🇭',
    captainName: 'Capt. Marco Rossi',
    entryDate: 'Approaching Channel 72',
    lastPort: 'Kotor, Montenegro',
    nextPort: 'West Istanbul Marina',
    transitLogNo: 'PENDING_ARRIVAL',
    status: 'INSPECTION_PENDING',
    officerSign: 'Awaiting VHF Protocol'
  }
];
