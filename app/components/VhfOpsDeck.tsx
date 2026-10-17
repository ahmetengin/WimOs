'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Radio, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  Sparkles, 
  Square, 
  AlertTriangle, 
  PhoneCall, 
  DollarSign, 
  Utensils, 
  Wind, 
  Wifi, 
  RefreshCw, 
  Activity, 
  CheckCircle2,
  Clock,
  Waves
} from 'lucide-react';
import { WorkflowStep } from '@/lib/maker-workflow';

export interface VhfOpsDeckProps {
  windSpeed: number;
  onRefreshData?: () => void;
}

export interface MessageHistoryItem {
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

export const VhfOpsDeck: React.FC<VhfOpsDeckProps> = ({ windSpeed, onRefreshData }) => {
  const [activeChannel, setActiveChannel] = useState<number>(72);
  const [inputText, setInputText] = useState('');
  const [selectedVessel, setSelectedVessel] = useState('M/Y Tatiana');
  const [isListening, setIsListening] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Canlı');
  const [pollCount, setPollCount] = useState<number>(0);

  // Transmissions log initialized with active roleplay baseline
  const [history, setHistory] = useState<MessageHistoryItem[]>([
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
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message on transmission
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Real-time polling mechanism: Fetches VHF transmission logs every 2 seconds (2000ms)
  // Ensures state stays synchronized with backend data and replaces stale status display with fresh content
  useEffect(() => {
    let isSubscribed = true;

    const fetchVhfLogs = async () => {
      try {
        const response = await fetch(`/api/agent/transmissions?channel=${activeChannel}`, {
          cache: 'no-store',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok && isSubscribed) {
          const data = await response.json();
          if (data.transmissions && Array.isArray(data.transmissions)) {
            setHistory(prev => {
              const existingMap = new Map(prev.map(item => [item.id, item]));
              let hasChanges = false;

              // Insert or update any new transmissions from backend
              for (const remoteItem of data.transmissions) {
                if (!existingMap.has(remoteItem.id)) {
                  existingMap.set(remoteItem.id, remoteItem);
                  hasChanges = true;
                }
              }

              if (hasChanges) {
                return Array.from(existingMap.values());
              }
              return prev;
            });

            setIsLiveConnected(true);
            setLastSyncTime(data.serverTimestamp || new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            setPollCount(c => c + 1);
          }
        }
      } catch {
        if (isSubscribed) {
          setIsLiveConnected(false);
        }
      }
    };

    // Initial fetch delayed by 50ms to prevent synchronous setState during effect setup
    const initialTimer = setTimeout(fetchVhfLogs, 50);

    // Poll strictly every 2 seconds (2000ms)
    const intervalTimer = setInterval(fetchVhfLogs, 2000);

    return () => {
      isSubscribed = false;
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [activeChannel]);

  // Audio synthesis: Authentic maritime Roger beep & squelch generator via Web Audio API
  const playMaritimeRadioBeep = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.14);
    } catch {
      // AudioContext may be restricted before user interaction
    }
  };

  // Text to Speech playback
  const speakText = (text: string) => {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    playMaritimeRadioBeep();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      playMaritimeRadioBeep();
    };
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Web Speech API for Push-to-Talk Mic
  const toggleListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Tarayıcınız Web Speech ses tanıma özelliğini desteklemiyor. Lütfen metin kutusunu kullanın.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        playMaritimeRadioBeep();
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleTransmit(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Real-time VHF Transmission handler: sends to transmissions API and triggers instant refresh
  const handleTransmit = async (commandText?: string) => {
    const text = (commandText || inputText).trim();
    if (!text || isTransmitting) return;

    setInputText('');
    setIsTransmitting(true);
    playMaritimeRadioBeep();

    const tempCaptainId = `TX-${Date.now().toString().slice(-6)}`;
    const nowTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Optimistically update UI so captain sees their transmission instantly
    const optimisticCaptainMsg: MessageHistoryItem = {
      id: tempCaptainId,
      sender: 'CAPTAIN',
      vesselName: selectedVessel,
      text,
      timestamp: nowTime,
      channel: activeChannel
    };

    setHistory(prev => [...prev, optimisticCaptainMsg]);

    try {
      // 1. Post to shared real-time transmission buffer
      const res = await fetch('/api/agent/transmissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: text,
          channel: activeChannel,
          vesselName: selectedVessel,
          currentWindKnots: windSpeed,
          boatLoa: selectedVessel === 'M/Y Tatiana' ? 80 : 50,
          boatGrossTonnage: selectedVessel === 'M/Y Titan' ? 1200 : selectedVessel === 'M/Y Tatiana' ? 1200 : 450
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.aiTx) {
          setHistory(prev => {
            const filtered = prev.filter(m => m.id !== tempCaptainId);
            return [...filtered, data.captainTx || optimisticCaptainMsg, data.aiTx];
          });

          if (soundEnabled && data.aiTx.text) {
            speakText(data.aiTx.text);
          }
        }
      } else {
        // Fallback to /api/agent/command if transmissions buffer has issue
        const fallbackRes = await fetch('/api/agent/command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript: text,
            currentWindKnots: windSpeed,
            boatName: selectedVessel,
            boatLoa: 80,
            boatGrossTonnage: 1200
          })
        });

        const fallbackData = await fallbackRes.json();
        if (fallbackRes.ok && fallbackData.voiceResponse) {
          const aiMsg: MessageHistoryItem = {
            id: `TX-${(Date.now() + 1).toString().slice(-6)}`,
            sender: 'WIM_OS',
            text: fallbackData.voiceResponse,
            timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            channel: activeChannel,
            decision: fallbackData.decision,
            citedArticles: fallbackData.citedArticles,
            workflowSteps: fallbackData.workflowSteps,
            tabpfnRiskScore: fallbackData.tabpfnRiskScore,
            tabpfnRiskLevel: fallbackData.tabpfnRiskLevel,
            actionsTaken: fallbackData.actionsTaken
          };

          setHistory(prev => [...prev, aiMsg]);
          if (soundEnabled) {
            speakText(fallbackData.voiceResponse);
          }
        }
      }

      if (onRefreshData) {
        onRefreshData();
      }
    } catch {
      const errItem: MessageHistoryItem = {
        id: `TX-ERR-${Date.now().toString().slice(-4)}`,
        sender: 'WIM_OS',
        text: 'Telsiz uyarısı: Bağlantı kesintisi yaşandı. Yerel WIM-OS acil durum modunda devam ediliyor.',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        channel: activeChannel,
        decision: 'REJECTED'
      };
      setHistory(prev => [...prev, errItem]);
    } finally {
      setIsTransmitting(false);
    }
  };

  const testScenario = (prompt: string, vessel = 'M/Y Tatiana') => {
    setSelectedVessel(vessel);
    setInputText(prompt);
    handleTransmit(prompt);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Cols: VHF Channel Console & Live Transmission Deck */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[740px] overflow-hidden shadow-2xl">
        {/* VHF Radio Header & Real-Time Sync Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800/80 flex items-center justify-center relative">
                <Radio className="w-5 h-5 text-sky-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 ring-2 ring-slate-950 animate-ping"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center">
                  WIM MARINE VHF CONSOLE
                  <span className="ml-2 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[10px] font-mono text-emerald-300 flex items-center">
                    <Wifi className="w-3 h-3 mr-1 text-emerald-400" />
                    CH. {activeChannel} • 2s REAL-TIME POLLING
                  </span>
                </h3>
                <p className="text-xs text-slate-400 flex items-center space-x-1.5 mt-0.5">
                  <Clock className="w-3 h-3 text-sky-400" />
                  <span>Son Senkronizasyon:</span>
                  <span className="font-mono text-sky-400 font-bold">{lastSyncTime}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-500 font-mono text-[10px]">({pollCount} döngü)</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Channel Selector */}
              <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 font-mono text-xs">
                <button
                  onClick={() => setActiveChannel(72)}
                  className={`px-3 py-1 rounded font-bold transition-all ${
                    activeChannel === 72 ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CH. 72 (WIM)
                </button>
                <button
                  onClick={() => setActiveChannel(16)}
                  className={`px-3 py-1 rounded font-bold transition-all ${
                    activeChannel === 16 ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CH. 16 (EMERGENCY)
                </button>
              </div>

              {/* Audio Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg border transition-colors ${
                  soundEnabled 
                    ? 'bg-sky-950/60 border-sky-800 text-sky-400 hover:bg-sky-900' 
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
                title={soundEnabled ? 'Telsiz Sesini Kapat' : 'Telsiz Sesini Aç'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs flex items-center font-mono"
                >
                  <Square className="w-3 h-3 mr-1 fill-current" /> Durdur
                </button>
              )}
            </div>
          </div>

          {/* Real-time Status Strip: Replaces stale status display with fresh content */}
          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono gap-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="text-slate-500">Telsiz İstasyonu:</span>
              <span className="text-sky-400 font-bold">West Istanbul Marina Kontrol</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-500">Rüzgar / 700T Durumu:</span>
              <span className={`px-2 py-0.5 rounded font-bold ${
                windSpeed > 15 ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {windSpeed} kn • {windSpeed > 15 ? '700T LIFT ASKIYA ALINDI' : 'LİFT OPERASYONA HAZIR'}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-slate-300">
              <span className="text-slate-500">Kılavuz Şartı:</span>
              <span className="text-amber-400 font-semibold">&gt;1000 GT Kılavuz Kaptan Şart</span>
            </div>
          </div>
        </div>

        {/* Transmission Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-950 to-slate-900/90 font-sans">
          {history.map((msg) => {
            const isCaptain = msg.sender === 'CAPTAIN';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isCaptain ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono mb-1">
                  <span>{isCaptain ? `⚓ KAPTAN (${msg.vesselName || 'VHF GUEST'})` : '🤖 WIM GENERAL MANAGER AI'}</span>
                  <span>•</span>
                  <span>CH. {msg.channel}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                  {!isCaptain && soundEnabled && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="text-sky-400 hover:text-sky-300 ml-1 p-0.5 rounded"
                      title="Anonsu Tekrar Oynat"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-lg ${
                    isCaptain
                      ? 'bg-sky-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line font-medium text-[13px]">{msg.text}</p>

                  {/* Operational Decision Badges & Actions */}
                  {!isCaptain && msg.decision && (
                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                          msg.decision === 'APPROVED' 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                            : msg.decision === 'REJECTED'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          KARAR: {msg.decision}
                        </span>

                        {msg.citedArticles?.map((art, idx) => (
                          <span key={idx} className="bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded">
                            {art}
                          </span>
                        ))}

                        {msg.tabpfnRiskScore !== undefined && (
                          <span className="bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded flex items-center">
                            <Cpu className="w-3 h-3 mr-1" />
                            TabPFN: %{Math.round(msg.tabpfnRiskScore * 100)} ({msg.tabpfnRiskLevel})
                          </span>
                        )}
                      </div>

                      {/* Executed Steps Accordion */}
                      {msg.workflowSteps && msg.workflowSteps.length > 0 && (
                        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px] font-mono">
                          <p className="text-slate-400 font-semibold text-[10px] uppercase">MAKER Karar Protokolü Adımları:</p>
                          {msg.workflowSteps.map((st, i) => (
                            <div key={i} className="flex items-start justify-between text-slate-300">
                              <span className="flex items-center text-slate-400">
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  st.status === 'PASSED' || st.status === 'EXECUTED' ? 'bg-emerald-400' : 'bg-rose-400'
                                }`}></span>
                                [{st.subsystem}] {st.description}
                              </span>
                              <span className="text-[10px] text-slate-500 max-w-[45%] truncate text-right">
                                {st.detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTransmitting && (
            <div className="flex items-center space-x-2 text-xs text-sky-400 font-mono py-2 bg-slate-950/60 p-3 rounded-xl border border-sky-900/40 w-fit">
              <Sparkles className="w-4 h-4 animate-spin text-sky-400" />
              <span>Telsiz dalgası iletiliyor ve MAKER Engine analiz ediyor...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input & Push-To-Talk (PTT) Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2">
          {/* Active Vessel Selector */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
            <span className="flex items-center">
              Anons Yapan Tekne:
              <select
                value={selectedVessel}
                onChange={(e) => setSelectedVessel(e.target.value)}
                className="ml-2 bg-slate-900 text-sky-300 border border-slate-800 rounded px-2 py-0.5 text-xs font-semibold focus:outline-none"
              >
                <option value="M/Y Tatiana">M/Y Tatiana (80m / 1200 GT)</option>
                <option value="M/Y Titan">M/Y Titan (88m / 1200 GT - Süperyat)</option>
                <option value="M/Y Blue Horizon">M/Y Blue Horizon (50m / 450 GT)</option>
                <option value="S/Y Aegea">S/Y Aegea (42m / 280 GT)</option>
              </select>
            </span>
            <span className="text-emerald-400 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
              {isLiveConnected ? '2s Polling Aktif' : 'Çevrimdışı'}
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTransmit();
            }}
            className="flex items-center space-x-2"
          >
            {/* PTT (Push to talk) Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-xl font-mono text-xs flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
              title="Push-to-Talk Telsiz Mikrofonu"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-sky-400" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Telsiz anonsu yapın (örn: 'Ahmet beye bağlayın beni')..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              disabled={isTransmitting}
            />

            <button
              type="submit"
              disabled={isTransmitting || !inputText.trim()}
              className="px-5 py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-sky-600/30 transition-all flex items-center"
            >
              <Send className="w-4 h-4 mr-1.5" />
              <span>Anons Geç</span>
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Scenario Simulator & Real-time Live Controls */}
      <div className="space-y-4">
        {/* Quick Scenario Preset Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="font-bold text-sm text-white flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-sky-400" />
              Hazır Telsiz Senaryoları
            </h4>
            <span className="text-[10px] font-mono bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">
              1-CLICK TEST
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-2">
            WIM-OS&apos;un kural denetimi, KVKK kalkanı ve lift emniyet sistemini anında test edin:
          </p>

          <div className="space-y-2 mt-4">
            <button
              onClick={() => testScenario('Ahmet beye bağlayın beni')}
              className="w-full text-left p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-sky-500 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-sky-300 flex items-center">
                  <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                  &ldquo;Ahmet beye bağlayın beni&rdquo;
                </span>
                <span className="text-[10px] text-slate-500 font-mono">PBX &amp; KVKK</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Santral tespiti: Teknik Müdür (Dahili 1104) vs Müşteri gizlilik koruması.
              </p>
            </button>

            <button
              onClick={() => testScenario('M/Y Tatiana için 700 Ton lifti yarın 10:00a ayırtın, akşam da Calistoda 4 kişilik masa rezerve edin.')}
              className="w-full text-left p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-300 flex items-center">
                  <Utensils className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                  700T Lift + Calisto Masa Rezervasyon
                </span>
                <span className="text-[10px] text-emerald-500 font-mono">MULTI-TOOL</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                700T randevusu açar, Paraşüt faturası keser ve Çarşı restoranında masa ayırtır.
              </p>
            </button>

            <button
              onClick={() => testScenario('Demir atarak marina ağzında beklemek istiyorum.')}
              className="w-full text-left p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-rose-500 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-300 flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
                  &ldquo;Demir atarak beklemek istiyorum&rdquo;
                </span>
                <span className="text-[10px] text-rose-500 font-mono">MADDE 17</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                SEAL Anayasa Kontrolü: Havzada demirlemek yasak, derhal tonoz zorunluluğu bildirir.
              </p>
            </button>

            <button
              onClick={() => testScenario('1200 Gross Ton M/Y Titan yaklaşıyor, kılavuz kaptan almadan kendimiz gireceğiz.', 'M/Y Titan')}
              className="w-full text-left p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-amber-500 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-300 flex items-center">
                  <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                  1200 GT Titan - Kılavuzsuz Giriş İsteği
                </span>
                <span className="text-[10px] text-amber-500 font-mono">MADDE 12</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                1000 GT üzeri için yasal pilot alma zorunluluğunu devreye sokar.
              </p>
            </button>

            <button
              onClick={() => testScenario('Rüzgar şiddetliyken 700T lift ile teknemi karaya alın.')}
              className="w-full text-left p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-purple-500 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-300 flex items-center">
                  <Wind className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                  Rüzgarda Lift Talebi ({windSpeed} kn)
                </span>
                <span className="text-[10px] text-purple-400 font-mono">MADDE 45</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {windSpeed > 15 ? 'Rüzgar 15 kn üzeri olduğu için operasyonu kilitler.' : 'Rüzgar 15 kn altındaysa onaylar.'}
              </p>
            </button>

            <button
              onClick={() => testScenario('Sözleşmemizi 1 yıl uzatın ve faturasını Paraşüt üzerinden Tatiana Maritime adına kesin.')}
              className="w-full text-left p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-blue-500 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-300 flex items-center">
                  <DollarSign className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                  Sözleşme Yenile + Paraşüt e-Fatura
                </span>
                <span className="text-[10px] text-blue-400 font-mono">FINANCE &amp; LEGAL</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Bağlama sözleşmesi oluşturur ve resmi e-Fatura üretir.
              </p>
            </button>
          </div>
        </div>

        {/* Live VHF Channel Rules Quick Reference */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-xs space-y-3">
          <h4 className="font-bold text-white flex items-center">
            <Radio className="w-4 h-4 mr-2 text-sky-400" />
            WIM VHF Telsiz Protokolü (Madde 6)
          </h4>
          <p className="text-slate-400 leading-relaxed">
            Marmara Liman Giriş Prosedürü uyarınca, West Istanbul Marina mendireğine <strong>2 deniz mili</strong> mesafede Kanal 72 üzerinden çağrı yapılması zorunludur.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-sky-300 space-y-1">
            <p>• Çağrı Kodu: <strong>&ldquo;West Istanbul Marina&rdquo;</strong></p>
            <p>• Çalışma Frekansı: <strong>Ch. 72 (156.625 MHz)</strong></p>
            <p>• Acil / İmdat: <strong>Ch. 16 (156.800 MHz)</strong></p>
            <p>• Palamar Botu Çağrısı: 7/24 Kesintisiz Aktif</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VhfOpsDeck;
