'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Trash2, 
  Eye, 
  EyeOff, 
  UserX, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Search,
  KeyRound,
  FileCheck2
} from 'lucide-react';
import { privacyVault } from '@/lib/vault-privacy';
import { AuditLogEntry } from '@/lib/wim-data';

export const PrivacyVaultDeck: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(privacyVault.getAuditLogs());
  const [decryptedFields, setDecryptedFields] = useState<Record<string, boolean>>({});
  const [justificationInput, setJustificationInput] = useState('');
  const [selectedCustId, setSelectedCustId] = useState('CUST-001');
  const [shredderMessage, setShredderMessage] = useState<string | null>(null);
  const [anonymizeMessage, setAnonymizeMessage] = useState<string | null>(null);

  // Sample PII Customer Records
  const [customers, setCustomers] = useState([
    {
      id: 'CUST-001',
      name: 'Tatiana Maritime Ltd',
      captain: 'Capt. Alexander Vance',
      taxEnc: 'AES256::8291039182::SALT_99',
      taxPlain: '8291039182',
      phoneEnc: 'AES256::+905329871122::SALT_88',
      phonePlain: '+90 532 987 11 22',
      emailEnc: 'AES256::captain@tatiana.yacht::SALT_77',
      emailPlain: 'captain@tatiana.yacht',
      kvkkConsent: true,
      consentDate: '2025-01-10 14:22:00',
      isAnonymized: false
    },
    {
      id: 'CUST-002',
      name: 'Ahmet Engin (VIP Tekne Sahibi)',
      captain: 'Bizzat Sahibi',
      taxEnc: 'AES256::1122334455::SALT_99',
      taxPlain: '1122334455',
      phoneEnc: 'AES256::+905334445566::SALT_88',
      phonePlain: '+90 533 444 55 66',
      emailEnc: 'AES256::theahmetengin@gmail.com::SALT_77',
      emailPlain: 'theahmetengin@gmail.com',
      kvkkConsent: true,
      consentDate: '2025-03-01 09:12:00',
      isAnonymized: false
    }
  ]);

  const handleToggleDecrypt = (custId: string) => {
    if (!justificationInput.trim()) {
      alert('KVKK Emniyet Protokolü: Kişisel veriyi (PII) görüntülemek için yasal bir gerekçe (justification) girmelisiniz!');
      return;
    }

    // Log the decryption access
    const newLog = privacyVault.logAudit({
      actorId: 'AUTHORIZED_OFFICER',
      action: 'DECRYPT_CUSTOMER_PII',
      targetSubject: `Customer ${custId}`,
      justification: justificationInput,
      ipAddress: '10.0.0.24 (Marina Admin Terminal)',
      status: 'APPROVED'
    });

    setAuditLogs([...privacyVault.getAuditLogs()]);
    setDecryptedFields(prev => ({ ...prev, [custId]: !prev[custId] }));
    setJustificationInput('');
  };

  const handleRunShredder = () => {
    const res = privacyVault.runDataShredder();
    setAuditLogs([...privacyVault.getAuditLogs()]);
    setShredderMessage(res.message);
    setTimeout(() => setShredderMessage(null), 5000);
  };

  const handleRightToBeForgotten = (custId: string) => {
    const confirmed = confirm(`${custId} nolu müşterinin tüm kişisel verilerini anonimleştirmek istediğinize emin misiniz? Bu işlem geri alınamaz.`);
    if (!confirmed) return;

    const res = privacyVault.executeRightToBeForgotten(custId);
    setAuditLogs([...privacyVault.getAuditLogs()]);
    
    setCustomers(prev => prev.map(c => c.id === custId ? {
      ...c,
      name: `ANONİM_MÜŞTERİ_${custId}`,
      captain: 'BİLGİ SİLİNDİ',
      phoneEnc: 'PURGED',
      phonePlain: 'PURGED',
      emailEnc: 'PURGED',
      emailPlain: 'PURGED',
      isAnonymized: true
    } : c));

    setAnonymizeMessage(res.message);
    setTimeout(() => setAnonymizeMessage(null), 5000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">ada.privacy • KVKK &amp; GDPR VAULT</h3>
            <p className="text-xs text-slate-400">AES-256 Şifreli Veri Kasası • Otomatik İmha (Shredder) • Denetim Logları</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunShredder}
            className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 rounded-lg text-xs font-mono font-bold transition-colors flex items-center"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
            WIM Shredder Çalıştır (30 Gün CCTV İmha)
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Banner Alert for Feedback */}
        {shredderMessage && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-200 rounded-xl text-xs flex items-center animate-pulse">
            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
            <span>{shredderMessage}</span>
          </div>
        )}

        {anonymizeMessage && (
          <div className="p-3 bg-sky-950/80 border border-sky-700 text-sky-200 rounded-xl text-xs flex items-center">
            <UserX className="w-4 h-4 mr-2 text-sky-400" />
            <span>{anonymizeMessage}</span>
          </div>
        )}

        {/* Top PII Cryptographic Vault Table */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm text-white flex items-center">
                <Lock className="w-4 h-4 mr-2 text-emerald-400" />
                Müşteri Kişisel Veri Kasası (PII Encryption Table)
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Veritabanında asla açık metin tutulmaz. Görüntüleme için denetim gerekçesi şarttır.
              </p>
            </div>

            {/* Justification input */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Görüntüleme gerekçesi girin (Örn: Fatura teyidi)..."
                value={justificationInput}
                onChange={(e) => setJustificationInput(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 text-slate-400 font-mono text-[11px]">
                <tr>
                  <th className="p-3">MÜŞTERİ KODU</th>
                  <th className="p-3">ÜNVAN / İSİM</th>
                  <th className="p-3">VKN / TCKN</th>
                  <th className="p-3">TELEFON</th>
                  <th className="p-3">E-POSTA</th>
                  <th className="p-3">KVKK RIZASI</th>
                  <th className="p-3 text-right">GİZLİLİK EYLEMİ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {customers.map((c) => {
                  const isDecrypted = decryptedFields[c.id];
                  return (
                    <tr key={c.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-mono font-bold text-sky-400">{c.id}</td>
                      <td className="p-3 font-semibold text-white">
                        {c.name}
                        <span className="block text-[10px] text-slate-400 font-normal">Kaptan: {c.captain}</span>
                      </td>
                      <td className="p-3 font-mono">
                        {isDecrypted ? (
                          <span className="text-emerald-400 font-bold">{c.taxPlain}</span>
                        ) : (
                          <span className="text-slate-500">{privacyVault.maskData(c.taxPlain)}</span>
                        )}
                      </td>
                      <td className="p-3 font-mono">
                        {isDecrypted ? (
                          <span className="text-emerald-400 font-bold">{c.phonePlain}</span>
                        ) : (
                          <span className="text-slate-500">{privacyVault.maskData(c.phonePlain)}</span>
                        )}
                      </td>
                      <td className="p-3 font-mono">
                        {isDecrypted ? (
                          <span className="text-emerald-400 font-bold">{c.emailPlain}</span>
                        ) : (
                          <span className="text-slate-500">{privacyVault.maskData(c.emailPlain)}</span>
                        )}
                      </td>
                      <td className="p-3">
                        {c.isAnonymized ? (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                            ANONİMLEŞTİRİLDİ
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono flex items-center w-fit">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> ONAYLANDI
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {!c.isAnonymized && (
                          <>
                            <button
                              onClick={() => handleToggleDecrypt(c.id)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono transition-colors inline-flex items-center"
                              title="Gerekçe girerek veriyi aç veya kapat"
                            >
                              {isDecrypted ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1 text-emerald-400" />}
                              {isDecrypted ? 'Gizle' : 'Çöz (AES)'}
                            </button>

                            <button
                              onClick={() => handleRightToBeForgotten(c.id)}
                              className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded text-xs font-mono transition-colors inline-flex items-center border border-rose-900"
                              title="Unutulma Hakkını Uygula (GDPR Art. 17 / KVKK Madde 11)"
                            >
                              <UserX className="w-3.5 h-3.5 mr-1" />
                              Unutulma Hakkı
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Immutable Audit Log Viewer */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-white flex items-center">
              <Activity className="w-4 h-4 mr-2 text-sky-400" />
              KVKK Denetim ve Erişim Logları (Immutable Audit Trail)
            </h4>
            <span className="text-xs font-mono text-slate-400">{auditLogs.length} Kayıtlı Log</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-400 text-[11px]">{log.timestamp}</span>
                  <span className="text-sky-400 font-bold">[{log.actorId}]</span>
                  <span className="text-white">{log.action}</span>
                </div>

                <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
                  <span>Hedef: <strong className="text-slate-300">{log.targetSubject}</strong></span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-400 italic">&ldquo;{log.justification}&rdquo;</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
