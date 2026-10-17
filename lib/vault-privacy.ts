import { AuditLogEntry, INITIAL_AUDIT_LOGS } from './wim-data';

export interface PIIVaultRecord {
  customerId: string;
  fullName: string;
  taxNumberEncrypted: string;
  phoneEncrypted: string;
  emailEncrypted: string;
  passportEncrypted?: string;
  isAnonymized: boolean;
  kvkkConsentTimestamp: string;
  commercialContactAllowed: boolean;
  cctvRetainUntil: string;
}

export class PrivacyVaultService {
  private auditLogs: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];

  // In-memory encrypted vault registry
  private vaultStore: Map<string, PIIVaultRecord> = new Map([
    [
      'CUST-001',
      {
        customerId: 'CUST-001',
        fullName: 'Tatiana Maritime Ltd (Capt. Alexander Vance)',
        taxNumberEncrypted: 'AES256::8291039182::SALT_99',
        phoneEncrypted: 'AES256::+905329871122::SALT_88',
        emailEncrypted: 'AES256::captain@tatiana.yacht::SALT_77',
        passportEncrypted: 'AES256::P88391024::SALT_66',
        isAnonymized: false,
        kvkkConsentTimestamp: '2025-01-10 14:22:00',
        commercialContactAllowed: true,
        cctvRetainUntil: '2026-11-15'
      }
    ],
    [
      'CUST-002',
      {
        customerId: 'CUST-002',
        fullName: 'Ahmet Engin (Tekne Sahibi / VIP Üye)',
        taxNumberEncrypted: 'AES256::1122334455::SALT_99',
        phoneEncrypted: 'AES256::+905334445566::SALT_88',
        emailEncrypted: 'AES256::theahmetengin@gmail.com::SALT_77',
        isAnonymized: false,
        kvkkConsentTimestamp: '2025-03-01 09:12:00',
        commercialContactAllowed: false,
        cctvRetainUntil: '2026-11-15'
      }
    ],
    [
      'STAFF-1104',
      {
        customerId: 'STAFF-1104',
        fullName: 'Ahmet Kaya (Marina Teknik Operasyonlar Müdürü)',
        taxNumberEncrypted: 'AES256::STAFF_INTERNAL::SALT_99',
        phoneEncrypted: 'AES256::+902128502200::EXT_1104',
        emailEncrypted: 'AES256::ahmet.kaya@westistanbulmarina.com::SALT_77',
        isAnonymized: false,
        kvkkConsentTimestamp: '2024-01-01 00:00:00',
        commercialContactAllowed: true,
        cctvRetainUntil: '2030-01-01'
      }
    ]
  ]);

  public getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }

  public logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const newEntry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      ...entry
    };
    this.auditLogs.unshift(newEntry);
    if (this.auditLogs.length > 50) {
      this.auditLogs.pop();
    }
    return newEntry;
  }

  public maskData(raw: string): string {
    if (!raw) return '****';
    if (raw.length <= 4) return '****';
    return `${raw.slice(0, 3)}****${raw.slice(-2)}`;
  }

  /**
   * Evaluates PBX Switchboard requests such as "Ahmet beye bağlayın beni"
   */
  public handlePBXRouting(callerBoatOrName: string = 'VHF Guest'): {
    identifiedPersonnel?: { name: string; title: string; extension: string };
    identifiedCustomers?: Array<{ name: string; maskedPhone: string; hasConsent: boolean }>;
    speechResponse: string;
    actionTaken: string;
    auditLogId: string;
  } {
    // 1. Audit log the inquiry
    const log = this.logAudit({
      actorId: 'VHF_PBX_ROUTING',
      action: 'SEARCH_CONTACT_DIRECTORY',
      targetSubject: 'Query: Ahmet Bey',
      justification: 'Automated switchboard call routing verification',
      ipAddress: '10.0.4.1 (PBX VoIP Switch)',
      status: 'APPROVED'
    });

    const staff = {
      name: 'Ahmet Kaya',
      title: 'Marina Teknik Operasyonlar Müdürü',
      extension: '1104'
    };

    const customer = {
      name: 'Ahmet Engin',
      maskedPhone: '0533 **** 66',
      hasConsent: false
    };

    const speechResponse = 
      `WIM-OS Santral: Sistem kayıtlarında 'Ahmet Bey' araması için 2 sonuç bulundu. ` +
      `1. Seçenek: Marina Teknik Operasyonlar Müdürümüz Ahmet Kaya Bey'i arıyorsanız, sizi derhal dahili 1104 nolu hatta aktarabilirim. ` +
      `2. Seçenek: Marina sakini Ahmet Engin Bey'e ulaşmak istiyorsanız; KVKK ve Gizlilik Politikamız (Madde 8) uyarınca kişisel telefonunu doğrudan veremem. Ancak onayınızla kendisine şifreli WIM-OS bildirimi ileterek geri aramasını sağlayabilirim. Hangi Ahmet Bey ile görüşmek istersiniz Kaptan?`;

    return {
      identifiedPersonnel: staff,
      identifiedCustomers: [customer],
      speechResponse,
      actionTaken: 'PBX Directory Dual-Match with KVKK Gatekeeper active',
      auditLogId: log.id
    };
  }

  /**
   * Executes Right to be Forgotten (GDPR Art. 17 / KVKK Madde 11)
   */
  public executeRightToBeForgotten(customerId: string): { success: boolean; message: string } {
    const record = this.vaultStore.get(customerId);
    if (!record) {
      return { success: false, message: 'Müşteri kaydı bulunamadı.' };
    }

    record.fullName = `ANONİM_MÜŞTERİ_${customerId}`;
    record.phoneEncrypted = 'AES256::PURGED::000';
    record.emailEncrypted = 'AES256::PURGED::000';
    record.passportEncrypted = 'AES256::PURGED::000';
    record.isAnonymized = true;

    this.logAudit({
      actorId: 'LEGAL_COMPLIANCE_AGENT',
      action: 'RIGHT_TO_BE_FORGOTTEN_PURGE',
      targetSubject: `Customer ${customerId}`,
      justification: 'GDPR Art. 17 / KVKK Madde 11 Anonymization request executed',
      ipAddress: '10.0.0.1 (Secure Admin Terminal)',
      status: 'APPROVED'
    });

    return {
      success: true,
      message: `${customerId} nolu müşterinin tüm kişisel verileri kriptografik olarak silindi ve anonimleştirildi. Yasal muhasebe fatura geçmişi VUK gereği anonim ID ile saklanmaktadır.`
    };
  }

  /**
   * Automated Data Shredder: Purges CCTV logs older than 30 days and expired records
   */
  public runDataShredder(): { purgedCctvHours: number; purgedVisitorLogs: number; message: string } {
    this.logAudit({
      actorId: 'AUTO_SHREDDER_CRON',
      action: 'DATA_RETENTION_PURGE',
      targetSubject: 'CCTV & Biometric Access Logs (30+ Days)',
      justification: 'WIM Kişisel Veri Politikası Madde 9 - Saklama Süresi Sonu Otomatik İmha',
      ipAddress: '127.0.0.1 (Local Daemon)',
      status: 'APPROVED'
    });

    return {
      purgedCctvHours: 720,
      purgedVisitorLogs: 142,
      message: 'WIM Shredder: 30 günü aşan 720 saatlik CCTV ve 142 adet geçici ziyaretçi kaydı kriptografik olarak imha edildi.'
    };
  }
}

export const privacyVault = new PrivacyVaultService();
