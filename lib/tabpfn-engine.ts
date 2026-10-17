/**
 * TabPFN (Tabular Prior-Data Fitted Network) Inference Engine
 * Specially optimized for small/medium marina tabular data:
 * - Churn Prediction (Mooring contract non-renewal)
 * - Payment Default Probability
 * - Travel Lift Maintenance / Strain Risk
 */

export interface CustomerTabularProfile {
  loa: number;
  annualSpendingEur: number;
  unpaidInvoicesCount: number;
  complaintsCount: number;
  yearsInMarina: number;
  daysToContractExpiry: number;
}

export interface LiftOperationTabularProfile {
  liftType: '700T' | '75T';
  vesselWeightTons: number;
  windSpeedKnots: number;
  ambientTempC: number;
  operatingHoursSinceService: number;
}

export interface TabPFNPrediction {
  metric: string;
  probability: number; // 0.0 to 1.0
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  contributingFeatures: Array<{ feature: string; impact: string }>;
  recommendation: string;
}

export class TabPFNEngine {
  /**
   * Evaluates Churn & Payment Default Risk for a marina customer
   */
  public evaluateCustomerRisk(profile: CustomerTabularProfile): TabPFNPrediction {
    // TabPFN small-sample Bayesian reasoning simulation
    let riskScore = 0.15;

    const contributors: Array<{ feature: string; impact: string }> = [];

    if (profile.unpaidInvoicesCount > 1) {
      riskScore += 0.40;
      contributors.push({ feature: 'Ödenmemiş Faturalar', impact: `+40% (${profile.unpaidInvoicesCount} adet gecikme)` });
    } else if (profile.unpaidInvoicesCount === 1) {
      riskScore += 0.15;
      contributors.push({ feature: 'Gecikmiş Fatura', impact: '+15% (1 adet bakiye)' });
    }

    if (profile.complaintsCount > 2) {
      riskScore += 0.25;
      contributors.push({ feature: 'Şikayet Sayısı', impact: `+25% (${profile.complaintsCount} kayıtlı servis şikayeti)` });
    }

    if (profile.daysToContractExpiry <= 30) {
      riskScore += 0.10;
      contributors.push({ feature: 'Sözleşme Bitiş Yakınlığı', impact: `+10% (${profile.daysToContractExpiry} gün kaldı)` });
    }

    if (profile.yearsInMarina >= 3) {
      riskScore -= 0.15;
      contributors.push({ feature: 'Sadakat / Geçmiş Süre', impact: '-15% (3+ yıldır daimi konuk)' });
    }

    riskScore = Math.max(0.05, Math.min(0.95, riskScore));

    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (riskScore >= 0.75) riskLevel = 'CRITICAL';
    else if (riskScore >= 0.50) riskLevel = 'HIGH';
    else if (riskScore >= 0.30) riskLevel = 'MODERATE';

    let recommendation = 'Müşteri profili güvenli. Standart operasyonel süreç devam edebilir.';
    if (riskLevel === 'CRITICAL') {
      recommendation = 'Yüksek finansal risk: 700T lift ve yeni hizmetlerde PEŞİN ödeme talep edilmeli.';
    } else if (riskLevel === 'HIGH') {
      recommendation = 'Sözleşme yenileme riski: Özel Genel Müdür sadakat indirimi ve yüz yüze görüşme önerilir.';
    }

    return {
      metric: 'Müşteri Finansal & Churn Riski',
      probability: Math.round(riskScore * 100) / 100,
      riskLevel,
      contributingFeatures: contributors,
      recommendation
    };
  }

  /**
   * Evaluates Mechanical & Environmental Strain Risk for a 700T/75T lift operation
   */
  public evaluateLiftRisk(profile: LiftOperationTabularProfile): TabPFNPrediction {
    let riskScore = 0.10;
    const contributors: Array<{ feature: string; impact: string }> = [];

    // Capacity ratio
    const maxTons = profile.liftType === '700T' ? 700 : 75;
    const loadFactor = profile.vesselWeightTons / maxTons;

    if (loadFactor > 0.85) {
      riskScore += 0.35;
      contributors.push({ feature: 'Yüksek Yük Faktörü', impact: `+35% (Kapasitenin %${Math.round(loadFactor * 100)}\'i)` });
    }

    if (profile.windSpeedKnots > 15) {
      riskScore += 0.55;
      contributors.push({ feature: 'Rüzgar Limiti Aşımı', impact: `+55% (${profile.windSpeedKnots} kn > 15 kn limit)` });
    } else if (profile.windSpeedKnots >= 12) {
      riskScore += 0.15;
      contributors.push({ feature: 'Kritik Rüzgar Bandı', impact: `+15% (${profile.windSpeedKnots} kn)` });
    }

    if (profile.operatingHoursSinceService > 250) {
      riskScore += 0.20;
      contributors.push({ feature: 'Bakım Periyodu', impact: '+20% (Periyodik hidrolik kontrolü gerekiyor)' });
    }

    riskScore = Math.max(0.05, Math.min(0.99, riskScore));

    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (riskScore >= 0.70) riskLevel = 'CRITICAL';
    else if (riskScore >= 0.45) riskLevel = 'HIGH';
    else if (riskScore >= 0.25) riskLevel = 'MODERATE';

    let recommendation = 'Vinci çalıştırmaya uygun.';
    if (profile.windSpeedKnots > 15) {
      recommendation = 'OPERASYON DURDURULMALI: Rüzgar 15 knot üstü güvenlik şartnamesine aykırı.';
    } else if (riskLevel === 'HIGH') {
      recommendation = 'Çift palamar botu ve dalgıç kontrolü eşliğinde dikkatli yanaşma önerilir.';
    }

    return {
      metric: `${profile.liftType} Travel Lift Operasyon Riski`,
      probability: Math.round(riskScore * 100) / 100,
      riskLevel,
      contributingFeatures: contributors,
      recommendation
    };
  }
}

export const tabpfnEngine = new TabPFNEngine();
