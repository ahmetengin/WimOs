import { WIM_RULES, WimRule } from './wim-data';

export interface RuleSearchResult {
  rule: WimRule;
  matchConfidence: number;
  enforcementAction: 'BLOCK' | 'WARN' | 'INFO';
  reason: string;
}

export class SEALKnowledgeEngine {
  private rules: WimRule[] = WIM_RULES;

  /**
   * Searches the corporate memory / PDF constitution for relevant marina bylaws
   */
  public queryBylaws(query: string): RuleSearchResult[] {
    const q = query.toLowerCase();
    const results: RuleSearchResult[] = [];

    // Check anchoring
    if (q.includes('demir') || q.includes('çapa') || q.includes('anchor') || q.includes('anchoring')) {
      const rule = this.rules.find(r => r.id === 'RULE-ANCHOR')!;
      results.push({
        rule,
        matchConfidence: 0.98,
        enforcementAction: 'BLOCK',
        reason: 'Marina havzası içinde çıpa/demir atmak kesinlikle yasaktır. Tonoz (mooring line) zorunludur.'
      });
    }

    // Check pilotage >1000 GT
    if (q.includes('pilot') || q.includes('kılavuz') || q.includes('1000') || q.includes('1200') || q.includes('gross') || q.includes('gt')) {
      const rule = this.rules.find(r => r.id === 'RULE-PILOT')!;
      results.push({
        rule,
        matchConfidence: 0.95,
        enforcementAction: 'BLOCK',
        reason: '1000 Gross Ton üzerindeki tekneler için lisanslı pilot ve palamar botu zorunludur.'
      });
    }

    // Check wind & lift
    if (q.includes('rüzgar') || q.includes('wind') || q.includes('lift') || q.includes('vinç') || q.includes('700t') || q.includes('700 ton')) {
      const rule = this.rules.find(r => r.id === 'RULE-WIND-LIFT')!;
      results.push({
        rule,
        matchConfidence: 0.92,
        enforcementAction: 'WARN',
        reason: '700 Ton Travel Lift için rüzgar hızı üst sınırı 15 knot\'tır.'
      });
    }

    // Check refund / cancellation
    if (q.includes('iade') || q.includes('refund') || q.includes('iptal') || q.includes('erken ayrıl')) {
      const rule = this.rules.find(r => r.id === 'RULE-REFUND')!;
      results.push({
        rule,
        matchConfidence: 0.96,
        enforcementAction: 'BLOCK',
        reason: 'Madde 91 uyarınca erken ayrılışlarda nakit iade yapılmaz (No Refund Policy).'
      });
    }

    // Check insurance
    if (q.includes('sigorta') || q.includes('insurance') || q.includes('poliçe') || q.includes('p&i')) {
      const rule = this.rules.find(r => r.id === 'RULE-INSURANCE')!;
      results.push({
        rule,
        matchConfidence: 0.94,
        enforcementAction: 'BLOCK',
        reason: 'Geçerli P&I ve 3. Şahıs Mali Mesuliyet Sigortası olmadan giriş ve işlem yapılamaz.'
      });
    }

    // If nothing specifically triggered, provide general guidance
    if (results.length === 0) {
      results.push({
        rule: this.rules[0],
        matchConfidence: 0.70,
        enforcementAction: 'INFO',
        reason: 'Standart WIM İşletme ve Seyrüsefer Yönetmeliği kuralları geçerlidir.'
      });
    }

    return results;
  }
}

export const sealEngine = new SEALKnowledgeEngine();
