'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Download, 
  Printer, 
  Eye, 
  Calendar, 
  QrCode, 
  ExternalLink,
  CreditCard,
  Building
} from 'lucide-react';
import { parasutService } from '@/lib/parasut-service';
import { ParasutInvoiceData, ContractData } from '@/lib/wim-data';

export const LegalFinanceDeck: React.FC = () => {
  const [subTab, setSubTab] = useState<'legal' | 'finance'>('legal');
  const [invoices, setInvoices] = useState<ParasutInvoiceData[]>(parasutService.getInvoices());
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Initial Legal Contracts (ada.legal.wim)
  const [contracts, setContracts] = useState<ContractData[]>([
    {
      id: 'CN-001',
      refCode: 'M-TAT-2025-01',
      contractType: 'mooring',
      customerName: 'Tatiana Maritime Ltd',
      customerVkn: '8291039182',
      boatName: 'M/Y Tatiana (80m)',
      relatedAssetId: 'A-01 (Superyacht Quay)',
      startDate: '2025-01-01',
      endDate: '2026-01-01',
      amountEur: 96000,
      amountTry: 3504000,
      currency: 'EUR',
      status: 'active',
      signedDate: '2025-01-01 10:15',
      termsVersion: 'v2025.1 (WIM Mooring Bylaws)',
      complianceScore: 100
    },
    {
      id: 'CN-002',
      refCode: 'M-BLU-2025-02',
      contractType: 'mooring',
      customerName: 'Horizon Blue Marine Ltd',
      customerVkn: '9921049281',
      boatName: 'M/Y Blue Horizon (50m)',
      relatedAssetId: 'A-03 (Superyacht Quay)',
      startDate: '2025-02-15',
      endDate: '2025-11-15',
      amountEur: 50000,
      amountTry: 1825000,
      currency: 'EUR',
      status: 'expiring_soon',
      signedDate: '2025-02-15 14:00',
      termsVersion: 'v2025.1',
      complianceScore: 95
    },
    {
      id: 'CN-003',
      refCode: 'CL-CAL-2025-04',
      contractType: 'commercial_lease',
      customerName: 'Calisto Mediterranean Fish & Lounge',
      customerVkn: '2840192831',
      relatedAssetId: 'Çarşı Pierfront #04',
      startDate: '2025-01-01',
      endDate: '2027-01-01',
      amountEur: 102000,
      amountTry: 3723000,
      currency: 'EUR',
      status: 'active',
      signedDate: '2024-12-28',
      termsVersion: 'v2025.1 (Commercial)',
      complianceScore: 100
    }
  ]);

  const handleOpenPdf = (contract: ContractData) => {
    setSelectedContract(contract);
    setShowPdfModal(true);
  };

  const handleCreateNewInvoice = () => {
    const inv = parasutService.createInvoice({
      contactName: 'Aegean Navigation A.Ş.',
      taxNumber: '1029384756',
      description: 'S/Y Aegea (42m) - 1 Yıllık Bağlama ve 700T Lift Ön Rezervasyonu',
      amountEur: 42000,
      currency: 'TRY',
      type: 'e-Fatura'
    });
    setInvoices([...parasutService.getInvoices()]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Sub Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center">
            <FileText className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">ada.legal.wim &amp; ada.finance.wim</h3>
            <p className="text-xs text-slate-400">Resmi WIM Sözleşme Motoru • Paraşüt API v4 e-Fatura / e-Arşiv</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setSubTab('legal')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center ${
              subTab === 'legal' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            ada.legal (Sözleşmeler)
          </button>
          <button
            onClick={() => setSubTab('finance')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center ${
              subTab === 'finance' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 mr-1.5" />
            ada.finance (Paraşüt e-Fatura)
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* SUBTAB 1: ADA.LEGAL.WIM (CONTRACTS) */}
        {subTab === 'legal' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm">Resmi Bağlama ve Çekek Sözleşmeleri (WIM General Terms)</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tüm sözleşmeler Madde 17 (Demirleme yasağı), Madde 12 (Kılavuz &gt;1000GT) ve Madde 91 (İade yok) hükümlerini içerir.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300">
                  {contracts.filter(c => c.status === 'active').length} Aktif Sözleşme
                </span>
                <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-950 border border-amber-800 text-amber-300">
                  {contracts.filter(c => c.status === 'expiring_soon').length} Yenileme Bekleyen
                </span>
              </div>
            </div>

            {/* Contracts Table */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900/80 text-slate-400 font-mono text-[11px]">
                    <tr>
                      <th className="p-3">REF KOD</th>
                      <th className="p-3">TİP</th>
                      <th className="p-3">MÜŞTERİ / ŞİRKET</th>
                      <th className="p-3">TEKNE / VARLIK</th>
                      <th className="p-3">SÜRE (BAŞLANGIÇ - BİTİŞ)</th>
                      <th className="p-3">TUTAR</th>
                      <th className="p-3">DURUM</th>
                      <th className="p-3 text-right">EYLEM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {contracts.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono font-bold text-sky-400">{c.refCode}</td>
                        <td className="p-3 font-mono capitalize">
                          {c.contractType === 'mooring' ? 'Bağlama' : c.contractType === 'commercial_lease' ? 'Ticari Kira' : 'Çekek'}
                        </td>
                        <td className="p-3 font-semibold text-white">
                          {c.customerName}
                          <span className="block text-[10px] text-slate-500 font-mono">VKN: {c.customerVkn}</span>
                        </td>
                        <td className="p-3">{c.boatName || c.relatedAssetId}</td>
                        <td className="p-3 font-mono text-slate-400">
                          {c.startDate} &rarr; {c.endDate}
                        </td>
                        <td className="p-3 font-mono font-bold text-white">
                          €{c.amountEur.toLocaleString()}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            ₺{c.amountTry.toLocaleString()}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            c.status === 'active'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {c.status === 'active' ? 'AKTİF' : 'YENİLEME ZAMANI'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleOpenPdf(c)}
                            className="px-2.5 py-1 bg-sky-900/60 hover:bg-sky-800 text-sky-200 rounded text-xs font-mono transition-colors inline-flex items-center"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            PDF Önizle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: ADA.FINANCE.WIM (PARASUT E-FATURA) */}
        {subTab === 'finance' && (
          <div className="space-y-6">
            {/* Live Financial Metrics Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500">Paraşüt API v4 Durumu</span>
                <p className="text-base font-bold text-emerald-400 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> BAĞLI &amp; SENKRON
                </p>
                <p className="text-[11px] text-slate-400">Token Geçerlilik: 23s 45dk</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500">Döviz Kuru Çevrimi</span>
                <p className="text-base font-bold text-white">1 EUR = 36.50 TRY</p>
                <p className="text-[11px] text-slate-400">TCMB Gösterge Kuru Sabitlendi</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500">Kesilen Toplam Fatura (TRY)</span>
                <p className="text-base font-bold text-sky-400">
                  ₺{parasutService.getTotalRevenueTry().toLocaleString('tr-TR')}
                </p>
                <p className="text-[11px] text-slate-400">KDV Dahil (%20)</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <span className="text-slate-500">Hızlı İşlem</span>
                <button
                  onClick={handleCreateNewInvoice}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow transition-colors flex items-center justify-center font-sans"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Yeni e-Fatura Kes
                </button>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h4 className="font-bold text-sm text-white flex items-center">
                  <CreditCard className="w-4 h-4 mr-2 text-sky-400" />
                  Paraşüt Satış Faturaları (Sales Invoices List)
                </h4>
                <span className="text-xs text-slate-400 font-mono">Real-time Sync</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900/80 text-slate-400 font-mono text-[11px]">
                    <tr>
                      <th className="p-3">FATURA NO</th>
                      <th className="p-3">MÜŞTERİ / ÜNVAN</th>
                      <th className="p-3">AÇIKLAMA</th>
                      <th className="p-3">TUTAR (TRY)</th>
                      <th className="p-3">KDV (%20)</th>
                      <th className="p-3">GENEL TOPLAM</th>
                      <th className="p-3">TİP</th>
                      <th className="p-3">DURUM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono font-bold text-sky-400">{inv.invoiceNo}</td>
                        <td className="p-3 font-semibold text-white">
                          {inv.contactName}
                          <span className="block text-[10px] text-slate-500 font-mono">VKN: {inv.taxNumber}</span>
                        </td>
                        <td className="p-3 text-slate-300 max-w-xs truncate">{inv.description}</td>
                        <td className="p-3 font-mono">₺{inv.amountTry.toLocaleString('tr-TR')}</td>
                        <td className="p-3 font-mono text-slate-400">₺{inv.vatAmountTry.toLocaleString('tr-TR')}</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">
                          ₺{inv.totalWithVatTry.toLocaleString('tr-TR')}
                        </td>
                        <td className="p-3 font-mono">
                          <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px]">
                            {inv.type}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            inv.status === 'paid' 
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {inv.status === 'paid' ? 'ÖDENDİ' : 'TAHSİLAT BEKLİYOR'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic PDF Contract Preview Modal */}
      {showPdfModal && selectedContract && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <span className="font-bold text-white text-sm">Resmi Sözleşme Sureti • {selectedContract.refCode}</span>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded text-sm font-mono"
              >
                ✕ Kapat
              </button>
            </div>

            {/* Document Body (Simulating WIM PDF) */}
            <div className="p-8 bg-white text-slate-900 font-serif space-y-6">
              {/* Header with WIM Seal */}
              <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">WEST ISTANBUL MARINA</h2>
                  <p className="text-xs text-slate-600 font-sans">
                    Marmara Denizi • Yakuplu Mah. Ulus Cad. No:28 Beylikdüzü / ISTANBUL
                  </p>
                  <p className="text-xs text-slate-600 font-sans">
                    Tel: +90 (212) 850 22 00 • VHF Ch. 72 / 16 • www.westistanbulmarina.com
                  </p>
                </div>
                <div className="text-right font-sans">
                  <span className="text-xs font-mono font-bold bg-slate-100 p-2 rounded border border-slate-300 block">
                    REF: {selectedContract.refCode}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">Tarih: {selectedContract.startDate}</span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center py-2">
                <h3 className="text-lg font-bold uppercase tracking-wider text-slate-900 underline">
                  YATLIK VE ÇEKEK YERİ HİZMET SÖZLEŞMESİ
                </h3>
                <p className="text-xs text-slate-500 font-sans italic">
                  (General Terms &amp; Conditions - Standard Maritime Contract v2025.1)
                </p>
              </div>

              {/* Parties Block */}
              <div className="grid grid-cols-2 gap-4 font-sans text-xs bg-slate-50 p-4 rounded border border-slate-200">
                <div>
                  <strong className="block text-slate-700 uppercase">1. İŞLETMECİ (MARINA):</strong>
                  <p>West Istanbul Marina İşletmeleri A.Ş.</p>
                  <p>Beylikdüzü Vergi Dairesi: 9480192831</p>
                  <p>Mersis: 0948019283100014</p>
                </div>
                <div>
                  <strong className="block text-slate-700 uppercase">2. MÜŞTERİ / TEKNE SAHİBİ:</strong>
                  <p className="font-bold">{selectedContract.customerName}</p>
                  <p>VKN / TCKN: {selectedContract.customerVkn}</p>
                  <p>Tekne: {selectedContract.boatName || 'Belirtilmedi'}</p>
                  <p>Bağlama Yeri / Varlık: {selectedContract.relatedAssetId}</p>
                </div>
              </div>

              {/* Core Articles as per official WIM PDF */}
              <div className="space-y-3 text-xs leading-relaxed font-sans text-slate-800">
                <div>
                  <strong className="text-slate-900">MADDE 1 - SÖZLEŞMENİN KONUSU VE SÜRESİ:</strong>
                  <p className="text-justify text-slate-600">
                    İşbu sözleşme, Müşteri&apos;ye ait yukarıda özellikleri belirtilen teknenin WIM marina sahasında bağlama ve teknik çekek hizmetlerinden faydalanma şartlarını düzenler. Süre: {selectedContract.startDate} tarihinden {selectedContract.endDate} tarihine kadardır.
                  </p>
                </div>

                <div>
                  <strong className="text-slate-900">MADDE 7 - SİGORTA ZORUNLULUĞU (TPL / P&amp;I):</strong>
                  <p className="text-justify text-slate-600">
                    Müşteri, teknesinin marina sahasında bulunduğu süre boyunca geçerli en az 1.500.000 EUR teminat limitli Üçüncü Şahıs Mali Mesuliyet ve Yangın/Deniz Kaza Sigortasını eksiksiz ibraz etmekle yükümlüdür.
                  </p>
                </div>

                <div>
                  <strong className="text-slate-900">MADDE 12 - KILAVUZ KAPTAN (PILOTAGE &gt;1000 GT):</strong>
                  <p className="text-justify text-slate-600">
                    1000 Gross Tonaj üzerindeki tüm teknelerin limana giriş ve çıkış manevralarında WIM onaylı Kılavuz Kaptan ve palamar botu refakati zorunludur.
                  </p>
                </div>

                <div>
                  <strong className="text-slate-900">MADDE 17 - MARİNA İÇİNDE DEMİRLEME YASAĞI:</strong>
                  <p className="text-justify text-slate-600 font-semibold text-rose-900">
                    Marina havzası içinde çıpa ve demir atılması kesinlikle yasaktır. Bağlama işlemi yalnızca tonoz ve rıhtım palamar halatları vasıtasıyla icra edilir.
                  </p>
                </div>

                <div>
                  <strong className="text-slate-900">MADDE 91 - ERKEN AYRILIŞ VE İADE YASAĞI (NO REFUND):</strong>
                  <p className="text-justify text-slate-600">
                    Sözleşme süresi dolmadan önce marina sahasından erken ayrılan teknelere hiçbir ad altında nakit ücret iadesi yapılmaz. Kalan bakiye devredilemez.
                  </p>
                </div>

                <div className="bg-slate-100 p-3 rounded font-mono text-xs">
                  <strong>MALİ BEDEL:</strong> Toplam Bedel: €{selectedContract.amountEur.toLocaleString()} + KDV 
                  (₺{selectedContract.amountTry.toLocaleString()} TL). Ödemeler Paraşüt e-Fatura sistemi üzerinden tahsil edilir.
                </div>
              </div>

              {/* Digital Signatures & QR Stamp */}
              <div className="pt-6 border-t-2 border-slate-900 flex items-center justify-between font-sans text-xs">
                <div className="space-y-1">
                  <span className="block font-bold text-slate-700">WEST ISTANBUL MARINA</span>
                  <div className="w-32 h-12 border border-dashed border-slate-400 flex items-center justify-center text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50">
                    [E-İMZALANDI]
                  </div>
                  <span className="text-[10px] text-slate-500">Marina Genel Müdürü</span>
                </div>

                {/* QR Code Validation Stamp */}
                <div className="text-center space-y-1">
                  <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center rounded mx-auto">
                    <QrCode className="w-12 h-12" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-600 block">WIM-LEGAL-BLOCK-VERIFIED</span>
                </div>

                <div className="text-right space-y-1">
                  <span className="block font-bold text-slate-700">MÜŞTERİ / TEKNE SAHİBİ</span>
                  <div className="w-32 h-12 border border-dashed border-slate-400 flex items-center justify-center text-[10px] text-sky-800 font-mono font-bold bg-sky-50">
                    [DİJİTAL ONAY ALINDI]
                  </div>
                  <span className="text-[10px] text-slate-500">{selectedContract.customerName}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">
                WIM-OS Doküman Güvenlik Doğrulaması: %100 Uyumlu
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-mono transition-colors flex items-center"
                >
                  <Printer className="w-3.5 h-3.5 mr-1" /> Yazdır
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-semibold transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
