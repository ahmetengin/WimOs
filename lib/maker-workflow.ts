import { sealEngine } from './seal-engine';
import { tabpfnEngine } from './tabpfn-engine';
import { parasutService } from './parasut-service';
import { privacyVault } from './vault-privacy';

export interface WorkflowEvaluationInput {
  transcript: string;
  boatName?: string;
  boatLoa?: number;
  boatGrossTonnage?: number;
  currentWindKnots?: number;
  requestedAction?: string;
  callerIdentity?: string;
}

export interface WorkflowStep {
  order: number;
  subsystem: 'SEAL' | 'TabPFN' | 'MAKER' | 'VAULT' | 'PARASUT' | 'VHF';
  description: string;
  status: 'PASSED' | 'WARNING' | 'REJECTED' | 'EXECUTED';
  detail: string;
}

export interface WorkflowEvaluationResult {
  decision: 'APPROVED' | 'REJECTED' | 'WARNING_OVERRIDE' | 'ROUTING_INFO';
  voiceResponse: string;
  citedArticles: string[];
  workflowSteps: WorkflowStep[];
  tabpfnRiskScore: number;
  tabpfnRiskLevel: string;
  actionsTaken: Array<{ type: string; payload: any }>;
}

export class MakerWorkflowEngine {
  public evaluateAndExecute(input: WorkflowEvaluationInput): WorkflowEvaluationResult {
    const steps: WorkflowStep[] = [];
    const actionsTaken: Array<{ type: string; payload: any }> = [];
    const citedArticles: string[] = [];
    const text = input.transcript.toLowerCase();
    const wind = input.currentWindKnots !== undefined ? input.currentWindKnots : 12;
    const boatName = input.boatName || 'M/Y Tatiana';
    const gt = input.boatGrossTonnage || (text.includes('1200') || text.includes('titan') || text.includes('tatiana') ? 1200 : 450);
    const loa = input.boatLoa || (text.includes('80') || text.includes('tatiana') ? 80 : 50);

    // 1. Check for PBX routing command e.g. "Ahmet beye bağlayın beni"
    if (text.includes('ahmet') || text.includes('bağlayın') || text.includes('santral') || text.includes('dahili')) {
      steps.push({
        order: 1,
        subsystem: 'VAULT',
        description: 'KVKK & PBX Switchboard Directory Scan',
        status: 'PASSED',
        detail: 'Arama Sorgusu: "Ahmet Bey". Personel ve müşteri veritabanı tarandı.'
      });

      const pbxResult = privacyVault.handlePBXRouting(input.callerIdentity || 'VHF Caller');

      steps.push({
        order: 2,
        subsystem: 'MAKER',
        description: 'Privacy-by-Design Gatekeeper Decision',
        status: 'PASSED',
        detail: 'Personel (Teknik Md. Ext 1104) için doğrudan aktarım açık; Müşteri (Ahmet Engin) için doğrudan bilgi paylaşımı KVKK Madde 8 gereği bloklandı.'
      });

      return {
        decision: 'ROUTING_INFO',
        voiceResponse: pbxResult.speechResponse,
        citedArticles: ['KVKK Madde 8 (Veri Aktarımı Sınırları)', 'WIM Kişisel Veri Politikası'],
        workflowSteps: steps,
        tabpfnRiskScore: 0.12,
        tabpfnRiskLevel: 'LOW',
        actionsTaken: [{ type: 'PBX_QUERY', payload: pbxResult }]
      };
    }

    // 2. Step 1: SEAL Rules Verification
    const sealResults = sealEngine.queryBylaws(text);
    let ruleViolated = false;
    let ruleWarning = false;

    sealResults.forEach((sr, idx) => {
      citedArticles.push(sr.rule.article);
      if (sr.enforcementAction === 'BLOCK') {
        ruleViolated = true;
        steps.push({
          order: steps.length + 1,
          subsystem: 'SEAL',
          description: `Kural Denetimi: ${sr.rule.title}`,
          status: 'REJECTED',
          detail: `${sr.rule.article} - ${sr.reason} (Ceza: ${sr.rule.penalty})`
        });
      } else if (sr.enforcementAction === 'WARN') {
        ruleWarning = true;
        steps.push({
          order: steps.length + 1,
          subsystem: 'SEAL',
          description: `Güvenlik Şartnamesi: ${sr.rule.title}`,
          status: 'WARNING',
          detail: `${sr.rule.article} - ${sr.reason}`
        });
      }
    });

    // Special Check: Anchoring prohibition
    if (text.includes('demir') || text.includes('çapa') || text.includes('anchor')) {
      const response = `Negatif Kaptan. West Istanbul Marina Bağlama Yönetmeliği Madde 17 uyarınca marina havzası içinde çıpa/demir atmak KESİNLİKLE YASAKTIR. ` +
        `Tüm bağlamalar tonoz sistemiyle yapılır. Palamar botumuz derhal yanınıza intikal ediyor, lütfen motorlarınızı rölantiye alın.`;

      return {
        decision: 'REJECTED',
        voiceResponse: response,
        citedArticles: ['Madde 17 (Demirleme Yasağı)', 'Tonoz Emniyet Protokolü'],
        workflowSteps: steps,
        tabpfnRiskScore: 0.88,
        tabpfnRiskLevel: 'HIGH',
        actionsTaken: [{ type: 'VIOLATION_LOG', payload: { article: 'Madde 17', penalty: '500 EUR' } }]
      };
    }

    // Special Check: Pilotage for > 1000 GT without pilot
    if ((gt > 1000 || text.includes('titan')) && (text.includes('kılavuzsuz') || text.includes('pilotsuz') || text.includes('kendimiz'))) {
      const response = `${boatName}, bu talep WIM Emniyet Yönetmeliği Madde 12'ye aykırıdır. ` +
        `Tekneniz ${gt} Gross Ton ile 1000 GT limitinin üzerindedir ve limana girişinizde lisanslı Kılavuz Kaptan (Pilot) almanız kanunen zorunludur. ` +
        `Pilot botu Kanal 72 üzerinden size doğru hareket etmiştir. Kılavuzsuz yanaşma teşebbüsleri Liman Başkanlığı cezası gerektirir.`;

      return {
        decision: 'REJECTED',
        voiceResponse: response,
        citedArticles: ['Madde 12 (1000 GT Üstü Zorunlu Kılavuz Kaptan)', 'Marmara Port of Entry Directive'],
        workflowSteps: steps,
        tabpfnRiskScore: 0.92,
        tabpfnRiskLevel: 'CRITICAL',
        actionsTaken: [{ type: 'DISPATCH_PILOT_BOAT', payload: { boat: boatName, gt, channel: 72 } }]
      };
    }

    // Special Check: Travel lift under severe wind (> 15 knots)
    if ((text.includes('700t') || text.includes('lift') || text.includes('karaya') || text.includes('vinç')) && wind > 15) {
      steps.push({
        order: steps.length + 1,
        subsystem: 'MAKER',
        description: 'Anemometre & Emniyet Kilidi Kontrolü',
        status: 'REJECTED',
        detail: `Anlık rüzgar ${wind} knot. Madde 45 gereği 15 knot üzeri 700T Travel Lift operasyonları durdurulur.`
      });

      const response = `Negatif Kaptan. 700 Ton Travel Lift operasyonumuz güvenlik şartnamesi (Madde 45) gereğince durdurulmuştur. ` +
        `Mevcut rüzgar ${wind} knot olup, azami limit olan 15 knot aşılmıştır. Rüzgar düşünceye kadar teknenizi bekleme rıhtımına (Waiting Quay C-02) yönlendiriyoruz.`;

      return {
        decision: 'REJECTED',
        voiceResponse: response,
        citedArticles: ['Madde 45 (15 Knot Rüzgar Limiti)', 'Teknik Saha İş Güvenliği'],
        workflowSteps: steps,
        tabpfnRiskScore: 0.89,
        tabpfnRiskLevel: 'CRITICAL',
        actionsTaken: [{ type: 'LIFT_HOLD_WEATHER', payload: { wind, limit: 15 } }]
      };
    }

    // 3. Step 2: TabPFN Machine Learning Risk Assessment
    const tabpfnCustomerRisk = tabpfnEngine.evaluateCustomerRisk({
      loa,
      annualSpendingEur: 65000,
      unpaidInvoicesCount: 0,
      complaintsCount: 0,
      yearsInMarina: 2,
      daysToContractExpiry: 45
    });

    const tabpfnLiftRisk = tabpfnEngine.evaluateLiftRisk({
      liftType: '700T',
      vesselWeightTons: Math.round(loa * 7.5),
      windSpeedKnots: wind,
      ambientTempC: 18,
      operatingHoursSinceService: 120
    });

    steps.push({
      order: steps.length + 1,
      subsystem: 'TabPFN',
      description: 'Tabüler Temelli Risk & Churn Analizi',
      status: tabpfnCustomerRisk.riskLevel === 'LOW' ? 'PASSED' : 'WARNING',
      detail: `Müşteri Riski: %${Math.round(tabpfnCustomerRisk.probability * 100)} (${tabpfnCustomerRisk.riskLevel}) | Lift Stres Skoru: %${Math.round(tabpfnLiftRisk.probability * 100)}`
    });

    // 4. Step 3: MAKER Action Dispatch for all Marina Services
    let has700T = text.includes('700') || text.includes('lift') || text.includes('çekek') || text.includes('karaya');
    let hasRestaurant = text.includes('calisto') || text.includes('restoran') || text.includes('bigchefs') || text.includes('yemek');
    let hasContractRenewal = text.includes('sözleşme') || text.includes('kontrat') || text.includes('yenile') || text.includes('fatura');

    // Extended Marina Services
    let hasFuel = text.includes('yakıt') || text.includes('bunker') || text.includes('diesel') || text.includes('benzin') || text.includes('akaryakıt');
    let hasDiver = text.includes('dalgıç') || text.includes('pervane') || text.includes('sualtı') || text.includes('su altı') || text.includes('tutya');
    let hasWaste = text.includes('atık') || text.includes('pis su') || text.includes('sintine') || text.includes('mavi kart') || text.includes('marpol') || text.includes('tahliye');
    let hasHelipad = text.includes('helikopter') || text.includes('helipad') || text.includes('uçuş') || text.includes('heli');
    let hasProvisioning = text.includes('kumanya') || text.includes('market') || text.includes('macrocenter') || text.includes('chandlery') || text.includes('sipariş');
    let hasSports = text.includes('tenis') || text.includes('kort') || text.includes('havuz') || text.includes('fitness') || text.includes('spor');

    let invoiceCreated: any = null;
    if (has700T || hasContractRenewal || hasFuel) {
      let invAmountEur = 15000;
      let invDesc = `${boatName} (${loa}m) - 700T Travel Lift Haul-Out & Hardstanding Yard`;

      if (hasFuel) {
        invAmountEur = 4900; // e.g. 5,000 Liters Transit Diesel @ ~0.98 EUR
        invDesc = `${boatName} - 5.000 Litre Transit Duty-Free Eurodiesel İkmali (Dispenser #1)`;
      } else if (hasContractRenewal) {
        invAmountEur = 45000;
        invDesc = `${boatName} - 1 Yıllık Bağlama Sözleşmesi`;
      }

      const inv = parasutService.createInvoice({
        contactName: boatName === 'M/Y Tatiana' ? 'Tatiana Maritime Ltd' : `${boatName} Operations`,
        taxNumber: '8291039182',
        description: invDesc,
        amountEur: invAmountEur,
        currency: 'TRY',
        type: 'e-Fatura'
      });
      invoiceCreated = inv;
      actionsTaken.push({ type: 'PARASUT_INVOICE_ISSUED', payload: inv });
      steps.push({
        order: steps.length + 1,
        subsystem: 'PARASUT',
        description: 'Paraşüt API v4 e-Fatura Entegrasyonu',
        status: 'EXECUTED',
        detail: `Fatura ${inv.invoiceNo} oluşturuldu. Tutar: ₺${inv.totalWithVatTry.toLocaleString('tr-TR')} (KDV Dahil %20).`
      });
    }

    if (hasFuel) {
      actionsTaken.push({
        type: 'BUNKERING_DISPATCH',
        payload: { pump: 'Transit Mega Dispenser #1', flow: '450 L/min', vessel: boatName }
      });
      steps.push({
        order: steps.length + 1,
        subsystem: 'MAKER',
        description: 'WIM Yakıt İstasyonu (Bunkering Station)',
        status: 'EXECUTED',
        detail: 'Transit Duty-Free Akaryakıt pompası rezerve edildi, yakıt personeli rıhtıma yönlendirildi.'
      });
    }

    if (hasDiver) {
      actionsTaken.push({
        type: 'DIVER_DISPATCH',
        payload: { diver: 'Serdar Yaman', vessel: boatName, task: 'Pervane & Sualtı Gövde Sörveyi' }
      });
      steps.push({
        order: steps.length + 1,
        subsystem: 'MAKER',
        description: 'WIM Dalgıç & Sualtı Hizmetleri',
        status: 'EXECUTED',
        detail: 'Lisanslı ticari dalgıç ve sualtı kamera ekibi tekne altına yönlendirildi.'
      });
    }

    if (hasWaste) {
      actionsTaken.push({
        type: 'MARPOL_WASTE_PUMPOUT',
        payload: { operator: 'WIM Çevre Atık Ekibi', vessel: boatName, waste: 'Pis Su & Sintine' }
      });
      steps.push({
        order: steps.length + 1,
        subsystem: 'MAKER',
        description: 'Mavi Kart & MARPOL Atık Alım',
        status: 'EXECUTED',
        detail: 'Vakumlu atık alım botu yönlendirildi, Çevre Bakanlığı Mavi Kart kaydı açıldı.'
      });
    }

    if (hasHelipad) {
      actionsTaken.push({
        type: 'HELIPAD_PERMIT',
        payload: { helipad: 'WIM Helipad (H1)', destination: 'Istanbul Havalimanı (IST)', vessel: boatName }
      });
      steps.push({
        order: steps.length + 1,
        subsystem: 'MAKER',
        description: 'WIM Helikopter Pisti (Helipad)',
        status: 'EXECUTED',
        detail: 'İniş/kalkış emniyet izni onaylandı. VIP heli-transfer ekibi bilgilendirildi.'
      });
    }

    if (hasProvisioning) {
      actionsTaken.push({
        type: 'PROVISIONING_ORDER',
        payload: { supplier: 'Macrocenter Marine', berth: 'A-01', vessel: boatName }
      });
      steps.push({
        order: steps.length + 1,
        subsystem: 'MAKER',
        description: 'Yat Kumanya & Chandlery Tedariki',
        status: 'EXECUTED',
        detail: 'Gourmet market ve yat malzeme siparişi rıhtıma teslim edilmek üzere hazırlandı.'
      });
    }

    if (hasSports) {
      actionsTaken.push({
        type: 'SPORTS_BOOKING',
        payload: { facility: 'West Life Tenis Kortu 1', slot: '19:00 - 20:30', vessel: boatName }
      });
      steps.push({
        order: steps.length + 1,
        subsystem: 'MAKER',
        description: 'West Life Spor & Sağlık Kulübü',
        status: 'EXECUTED',
        detail: 'Tenis kortu ve VIP spa girişi rezerve edildi.'
      });
    }

    if (hasRestaurant) {
      actionsTaken.push({
        type: 'RESTAURANT_RESERVATION',
        payload: { venue: 'Calisto Mediterranean Fish & Lounge', pax: 4, time: 'Tonight 20:30', boat: boatName }
      });
      steps.push({
        order: steps.length + 1,
        subsystem: 'MAKER',
        description: 'West Life & Çarşı Rezervasyon Modülü',
        status: 'EXECUTED',
        detail: `Calisto Restoranı için 4 kişilik masa ayırtıldı.`
      });
    }

    // Final speech synthesis
    let voiceText = '';
    if (gt >= 1000) {
      voiceText += `${boatName}, burası West Istanbul Marina. Hoş geldiniz Kaptan. ` +
        `1200 Gross Ton olduğunuz için WIM Emniyet Yönetmeliği Madde 12 gereği lisanslı Kılavuz Kaptan (Pilot) eşliğinde giriş zorunludur. Pilot botu yönlendirilmiştir. `;
    } else {
      voiceText += `${boatName}, burası West Istanbul Marina. Çağrınız alındı Kaptan. `;
    }

    if (hasFuel) {
      voiceText += `Transit Duty-Free yakıt ikmali için akaryakıt rıhtımı (Dispenser #1) hazırlandı. `;
    }
    if (hasDiver) {
      voiceText += `Lisanslı dalgıç ekibimiz sualtı pervane ve karina kontrolü için rıhtımınıza intikal ediyor. `;
    }
    if (hasWaste) {
      voiceText += `Mavi Kart atık alım botumuz pis su ve sintine tahliyesi için rıhtımınıza yanaşıyor. `;
    }
    if (hasHelipad) {
      voiceText += `WIM Helipad iniş onayınız verildi, VIP heli-transfer görevlileri bilgilendirildi. `;
    }
    if (hasProvisioning) {
      voiceText += `Macrocenter yat kumanya siparişiniz hazırlanıyor ve doğrudan teknenize teslim edilecek. `;
    }
    if (hasSports) {
      voiceText += `West Life Club tenis kortu randevunuz onaylandı. `;
    }
    if (has700T) {
      voiceText += `Mevcut rüzgar ${wind} knot ile 15 knot limitinin altındadır; 700 Ton Travel Lift için randevunuz planlandı. `;
    }
    if (hasRestaurant) {
      voiceText += `Çarşı bölgesindeki Calisto Restoranında akşam 20:30 için 4 kişilik masanız rezerve edildi. `;
    }
    if (invoiceCreated) {
      voiceText += `Hizmet bedeli e-faturanız Paraşüt sistemi üzerinden şirketinize iletilmiştir. `;
    }

    voiceText += `Kanal 72'de dinlemedeyiz, iyi seyirler dileriz.`;

    steps.push({
      order: steps.length + 1,
      subsystem: 'VHF',
      description: 'Kanal 72 Telsiz & Ses Sentezi',
      status: 'EXECUTED',
      detail: 'Deniz telsizi Roger-beep ve squelch efektli ses sentezi hazırlandı.'
    });

    return {
      decision: 'APPROVED',
      voiceResponse: voiceText,
      citedArticles: citedArticles.length ? citedArticles : ['Madde 12 (Kılavuz)', 'Madde 45 (Rüzgar)'],
      workflowSteps: steps,
      tabpfnRiskScore: tabpfnCustomerRisk.probability,
      tabpfnRiskLevel: tabpfnCustomerRisk.riskLevel,
      actionsTaken
    };
  }
}

export const makerWorkflow = new MakerWorkflowEngine();
