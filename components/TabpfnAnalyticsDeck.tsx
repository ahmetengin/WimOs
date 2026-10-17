'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Ship, 
  DollarSign, 
  Zap, 
  BarChart3,
  Sliders
} from 'lucide-react';
import { tabpfnEngine } from '@/lib/tabpfn-engine';

export const TabpfnAnalyticsDeck: React.FC = () => {
  // Interactive Tabular Profile state
  const [loa, setLoa] = useState(50);
  const [spending, setSpending] = useState(65000);
  const [unpaidInvoices, setUnpaidInvoices] = useState(0);
  const [complaints, setComplaints] = useState(0);
  const [years, setYears] = useState(2);
  const [daysToExpiry, setDaysToExpiry] = useState(45);

  // Lift Profile state
  const [liftWind, setLiftWind] = useState(12);
  const [vesselWeight, setVesselWeight] = useState(450);

  const customerRisk = tabpfnEngine.evaluateCustomerRisk({
    loa,
    annualSpendingEur: spending,
    unpaidInvoicesCount: unpaidInvoices,
    complaintsCount: complaints,
    yearsInMarina: years,
    daysToContractExpiry: daysToExpiry
  });

  const liftRisk = tabpfnEngine.evaluateLiftRisk({
    liftType: '700T',
    vesselWeightTons: vesselWeight,
    windSpeedKnots: liftWind,
    ambientTempC: 18,
    operatingHoursSinceService: 120
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-800 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">TabPFN BİLİŞSEL RİSK ANALİTİĞİ (THE ORACLE)</h3>
            <p className="text-xs text-slate-400">
              Küçük/Orta Ölçekli Marina Tabüler Verileri için Prior-Data Fitted Network Çıkarımı
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1 bg-purple-950 text-purple-300 border border-purple-800 rounded-lg">
          TabPFN-v2 In-Memory Inference
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model 1: Customer Churn & Default Prediction */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-sky-400" />
                Müşteri Kaybı (Churn) &amp; Bakiye Temerrüt Riski
              </h4>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                customerRisk.riskLevel === 'LOW' 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                  : customerRisk.riskLevel === 'MODERATE'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                {customerRisk.riskLevel}
              </span>
            </div>

            {/* Risk Probability Gauge */}
            <div className="my-4 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Hesaplanan Risk Olasılığı:</span>
                <p className="text-2xl font-bold font-mono text-white">
                  %{Math.round(customerRisk.probability * 100)}
                </p>
              </div>

              <div className="w-32 bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    customerRisk.probability > 0.5 ? 'bg-rose-500' : customerRisk.probability > 0.25 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${customerRisk.probability * 100}%` }}
                />
              </div>
            </div>

            {/* Interactive Simulation Controls */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Gecikmiş Fatura Sayısı: <strong className="text-white font-mono">{unpaidInvoices}</strong></span>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={unpaidInvoices}
                  onChange={(e) => setUnpaidInvoices(Number(e.target.value))}
                  className="w-28 accent-sky-400"
                />
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Kayıtlı Servis Şikayeti: <strong className="text-white font-mono">{complaints}</strong></span>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={complaints}
                  onChange={(e) => setComplaints(Number(e.target.value))}
                  className="w-28 accent-sky-400"
                />
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Sözleşme Bitişine Kalan Gün: <strong className="text-white font-mono">{daysToExpiry} gün</strong></span>
                <input
                  type="range"
                  min="5"
                  max="180"
                  value={daysToExpiry}
                  onChange={(e) => setDaysToExpiry(Number(e.target.value))}
                  className="w-28 accent-sky-400"
                />
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Marinadaki Yıl Sayısı: <strong className="text-white font-mono">{years} yıl</strong></span>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-28 accent-sky-400"
                />
              </div>
            </div>
          </div>

          {/* TabPFN Recommendation */}
          <div className="mt-4 p-3 rounded-lg bg-purple-950/40 border border-purple-800 text-xs text-purple-200">
            <strong>TabPFN Tavsiyesi:</strong> {customerRisk.recommendation}
          </div>
        </div>

        {/* Model 2: 700T Travel Lift Mechanical Strain & Weather Risk */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center">
                <Ship className="w-4 h-4 mr-2 text-indigo-400" />
                700T Travel Lift Operasyonel Stres Modeli
              </h4>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                liftRisk.riskLevel === 'LOW' 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                  : liftRisk.riskLevel === 'MODERATE'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                {liftRisk.riskLevel}
              </span>
            </div>

            {/* Risk Probability Gauge */}
            <div className="my-4 p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Mekanik / Çevresel Risk:</span>
                <p className="text-2xl font-bold font-mono text-white">
                  %{Math.round(liftRisk.probability * 100)}
                </p>
              </div>

              <div className="w-32 bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    liftRisk.probability > 0.5 ? 'bg-rose-500' : liftRisk.probability > 0.25 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${liftRisk.probability * 100}%` }}
                />
              </div>
            </div>

            {/* Lift Sliders */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Rüzgar Hızı (Knot): <strong className="text-white font-mono">{liftWind} kn</strong></span>
                <input
                  type="range"
                  min="4"
                  max="25"
                  value={liftWind}
                  onChange={(e) => setLiftWind(Number(e.target.value))}
                  className="w-28 accent-indigo-400"
                />
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Tekne Ağırlığı: <strong className="text-white font-mono">{vesselWeight} Ton</strong></span>
                <input
                  type="range"
                  min="50"
                  max="680"
                  value={vesselWeight}
                  onChange={(e) => setVesselWeight(Number(e.target.value))}
                  className="w-28 accent-indigo-400"
                />
              </div>
            </div>

            {/* Contributing features */}
            <div className="mt-4 space-y-1.5 text-[11px] font-mono">
              <span className="text-slate-400">Etki Eden Değişkenler:</span>
              {liftRisk.contributingFeatures.map((f, i) => (
                <div key={i} className="flex justify-between text-slate-300 bg-slate-900 p-1.5 rounded">
                  <span>{f.feature}</span>
                  <span className="text-amber-400">{f.impact}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-indigo-950/40 border border-indigo-800 text-xs text-indigo-200">
            <strong>Emniyet Direktifi:</strong> {liftRisk.recommendation}
          </div>
        </div>
      </div>
    </div>
  );
};
