import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { makerWorkflow } from '@/lib/maker-workflow';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript, currentWindKnots, boatName, boatLoa, boatGrossTonnage, callerIdentity } = body;

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    // Run local deterministic MAKER + SEAL + TabPFN + Vault pipeline first
    const workflowResult = makerWorkflow.evaluateAndExecute({
      transcript,
      boatName,
      boatLoa,
      boatGrossTonnage,
      currentWindKnots,
      callerIdentity
    });

    // Check if a real, validly formatted GEMINI_API_KEY is available
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    let finalVoiceResponse = workflowResult.voiceResponse;
    let geminiEnhanced = false;

    // Real Google Gemini API keys start with 'AIza' and are at least 35 characters long
    const isLikelyValidKey = Boolean(
      apiKey &&
      apiKey.startsWith('AIza') &&
      apiKey.length >= 35 &&
      !apiKey.includes('MY_GEMINI_API_KEY') &&
      !apiKey.includes('YOUR_API_KEY')
    );

    if (isLikelyValidKey && apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const prompt = `
You are the authoritative "General Manager AI" for West Istanbul Marina (WIM) on VHF Channel 72 / 16.
Context:
- Marina: 155,000 m² in Beylikdüzü / Istanbul.
- 700-Ton Travel Lift: Turkey's largest (strictly max 15 knot wind limit).
- Pilotage: Mandatory licensed pilot for vessels > 1000 GT.
- Anchoring: STRICTLY PROHIBITED in the basin (tonoz / mooring line only).
- KVKK/GDPR: Strictly protect personal data. Never disclose private phone numbers or locations of clients (e.g. Ahmet Engin) to third parties without consent. Internal staff like Ahmet Kaya (Tech Operations Manager, Ext 1104) can be reached.
- Real-time weather: Wind speed is ${currentWindKnots || 12} knots.

MAKER Engine Decision: ${workflowResult.decision}
MAKER Internal Voice Script: "${workflowResult.voiceResponse}"
Cited Rules: ${workflowResult.citedArticles.join(', ')}

Incoming VHF Radio Call from Captain: "${transcript}"

Task: Provide the final VHF radio transmission response in authentic Turkish maritime style (e.g. "M/Y Tatiana, burası West Istanbul Marina... Tamam / Over"). Respect the MAKER engine's safety decisions and citations. Keep it professional, crisp, and direct.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (response.text) {
          finalVoiceResponse = response.text.trim();
          geminiEnhanced = true;
        }
      } catch {
        // Graceful fallback to deterministic MAKER & SEAL response
        finalVoiceResponse = workflowResult.voiceResponse;
      }
    }

    return NextResponse.json({
      success: true,
      decision: workflowResult.decision,
      voiceResponse: finalVoiceResponse,
      citedArticles: workflowResult.citedArticles,
      workflowSteps: workflowResult.workflowSteps,
      tabpfnRiskScore: workflowResult.tabpfnRiskScore,
      tabpfnRiskLevel: workflowResult.tabpfnRiskLevel,
      actionsTaken: workflowResult.actionsTaken,
      geminiEnhanced,
    });
  } catch (error: any) {
    console.error('Error processing VHF command:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error processing VHF command' },
      { status: 500 }
    );
  }
}
