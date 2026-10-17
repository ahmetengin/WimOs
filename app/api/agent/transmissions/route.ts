import { NextRequest, NextResponse } from 'next/server';
import { makerWorkflow, WorkflowStep } from '@/lib/maker-workflow';

export interface VhfTransmissionRecord {
  id: string;
  sender: 'CAPTAIN' | 'WIM_OS' | 'SYSTEM' | 'PORT_AUTHORITY';
  text: string;
  timestamp: string;
  channel: number;
  vesselName?: string;
  decision?: 'APPROVED' | 'REJECTED' | 'WARNING_OVERRIDE' | 'ROUTING_INFO';
  citedArticles?: string[];
  workflowSteps?: WorkflowStep[];
  tabpfnRiskScore?: number;
  tabpfnRiskLevel?: string;
  actionsTaken?: Array<{ type: string; payload: any }>;
}

// Global server-side in-memory real-time transmission log
let globalTransmissions: VhfTransmissionRecord[] = [
  {
    id: 'TX-1001',
    sender: 'CAPTAIN',
    vesselName: 'M/Y Tatiana',
    text: 'Ahmet beye bağlayın beni',
    timestamp: '18:08:40',
    channel: 72
  },
  {
    id: 'TX-1002',
    sender: 'WIM_OS',
    text: 'WIM-OS Santral: Sistem kayıtlarında "Ahmet Bey" araması için 2 durum tespit edildi. 1. Durum: Teknik Operasyonlar Müdürümüz Ahmet Kaya Bey\'i arıyorsanız, sizi derhal 1104 nolu dahili hatta bağlıyorum. 2. Durum: Tekne sahibi müşteri Ahmet Engin Bey\'e ulaşmak istiyorsanız; KVKK ve Gizlilik Politikamız gereği doğrudan kişisel numarasını paylaşamam. Kendisine şifreli bildirim göndermemi ister misiniz? Hangi Ahmet Bey ile görüşmek istiyorsunuz Kaptan?',
    timestamp: '18:08:45',
    channel: 72,
    decision: 'ROUTING_INFO',
    citedArticles: ['KVKK Madde 8', 'WIM Kişisel Veri Politikası'],
    workflowSteps: [
      { order: 1, subsystem: 'VAULT', description: 'PBX Dizin Taraması', status: 'PASSED', detail: '2 adet kayıt bulundu (1 Personel, 1 Müşteri)' },
      { order: 2, subsystem: 'MAKER', description: 'KVKK Privacy Shield', status: 'PASSED', detail: 'Müşteri telefon paylaşımı Madde 8 gereği kilitlendi' }
    ],
    tabpfnRiskScore: 0.12,
    tabpfnRiskLevel: 'LOW'
  }
];

let lastSyncVersion = Date.now();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channelParam = searchParams.get('channel');
  const sinceParam = searchParams.get('since');

  let list = globalTransmissions;

  if (channelParam && channelParam !== 'all') {
    const ch = parseInt(channelParam, 10);
    if (!isNaN(ch)) {
      list = list.filter(t => t.channel === ch);
    }
  }

  if (sinceParam) {
    const sinceTime = parseInt(sinceParam, 10);
    if (!isNaN(sinceTime)) {
      list = list.filter(t => parseInt(t.id.replace('TX-', ''), 10) > sinceTime);
    }
  }

  return NextResponse.json({
    success: true,
    transmissions: list,
    syncVersion: lastSyncVersion,
    activeChannel: channelParam || '72',
    serverTimestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      transcript, 
      channel = 72, 
      vesselName = 'M/Y Tatiana', 
      currentWindKnots = 12,
      boatLoa = 80,
      boatGrossTonnage = 1200 
    } = body;

    if (!transcript) {
      return NextResponse.json({ error: 'Transmission transcript is required' }, { status: 400 });
    }

    // 1. Record Captain's transmission
    const captainTx: VhfTransmissionRecord = {
      id: `TX-${Date.now().toString().slice(-6)}`,
      sender: 'CAPTAIN',
      vesselName,
      text: transcript,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      channel: Number(channel)
    };

    globalTransmissions.push(captainTx);

    // 2. Process via MAKER engine
    const evaluation = makerWorkflow.evaluateAndExecute({
      transcript,
      boatName: vesselName,
      boatLoa,
      boatGrossTonnage,
      currentWindKnots,
      callerIdentity: `Capt. (${vesselName})`
    });

    // 3. Record AI's response transmission
    const aiTx: VhfTransmissionRecord = {
      id: `TX-${(Date.now() + 1).toString().slice(-6)}`,
      sender: 'WIM_OS',
      text: evaluation.voiceResponse,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      channel: Number(channel),
      decision: evaluation.decision,
      citedArticles: evaluation.citedArticles,
      workflowSteps: evaluation.workflowSteps,
      tabpfnRiskScore: evaluation.tabpfnRiskScore,
      tabpfnRiskLevel: evaluation.tabpfnRiskLevel,
      actionsTaken: evaluation.actionsTaken
    };

    globalTransmissions.push(aiTx);

    // Keep last 100 transmissions in buffer
    if (globalTransmissions.length > 100) {
      globalTransmissions = globalTransmissions.slice(-100);
    }

    lastSyncVersion = Date.now();

    return NextResponse.json({
      success: true,
      captainTx,
      aiTx,
      syncVersion: lastSyncVersion,
      totalTransmissions: globalTransmissions.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to broadcast VHF transmission' },
      { status: 500 }
    );
  }
}
