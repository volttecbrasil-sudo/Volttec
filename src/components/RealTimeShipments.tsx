import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Package, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Activity, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface Shipment {
  id: string;
  trackingCode: string;
  customerName: string;
  location: string;
  productName: string;
  timestamp: string;
  status: 'processing' | 'packing' | 'dispatched' | 'intransit';
  progress: number;
}

const PRODUCTS_SAMPLE = [
  'Projetor CineLuxe 4K UHD',
  'Smartwatch VoltRun Ultra',
  'Teclado Mecânico VoltType RGB',
  'Fone de Ouvido VoltSound Noise-Canceling',
  'Base Carregador p/ Indução WoodCare x3',
  'Cabo Ultra Conector VoltFiber HDMI 2.1',
  'Caixa de Som Portátil SoundForce Bluetooth'
];

const LOCATIONS_SAMPLE = [
  'São Paulo - SP', 'Rio de Janeiro - RJ', 'Belo Horizonte - MG',
  'Curitiba - PR', 'Porto Alegre - RS', 'Brasília - DF',
  'Salvador - BA', 'Fortaleza - CE', 'Recife - PE',
  'Goiânia - GO', 'Campinas - SP', 'Vitória - ES',
  'Florianópolis - SC', 'Joinville - SC', 'Ribeirão Preto - SP'
];

const NAMES_SAMPLE = [
  'Carlos S.', 'Mariana L.', 'Guilherme M.', 'Ana Paula R.',
  'Rodrigo F.', 'Juliana C.', 'Thiago B.', 'Amanda S.',
  'Felipe K.', 'Lucas O.', 'Beatriz G.', 'Daniel A.',
  'Marcelo T.', 'Renata P.', 'Gustavo N.'
];

export function RealTimeShipments() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [counter, setCounter] = useState(() => Math.floor(Math.random() * 31) + 45); // Simulated counter for dispatched today between 40 and 100

  // Generate initial shipments
  useEffect(() => {
    const initialShipments: Shipment[] = [
      {
        id: 'ship-1',
        trackingCode: 'VT-48291-BR',
        customerName: 'Guilherme M.',
        location: 'São Paulo - SP',
        productName: 'Projetor CineLuxe 4K UHD',
        timestamp: 'Há 2 minutos',
        status: 'intransit',
        progress: 85
      },
      {
        id: 'ship-2',
        trackingCode: 'VT-48292-BR',
        customerName: 'Renata P.',
        location: 'Belo Horizonte - MG',
        productName: 'Base Carregador p/ Indução WoodCare x3',
        timestamp: 'Há 5 minutos',
        status: 'dispatched',
        progress: 60
      },
      {
        id: 'ship-3',
        trackingCode: 'VT-48293-BR',
        customerName: 'Rodrigo F.',
        location: 'Curitiba - PR',
        productName: 'Teclado Mecânico VoltType RGB',
        timestamp: 'Há 12 minutos',
        status: 'packing',
        progress: 35
      }
    ];
    setShipments(initialShipments);
  }, []);

  // Simulate updates every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // randomly do one of two things:
      // A) Progress an existing shipment's progress
      // B) Add a brand new shipment and push older ones down
      const randType = Math.random() > 0.4 ? 'NEW' : 'PROGRESS';

      if (randType === 'NEW') {
        const newId = `ship-${Date.now()}`;
        const trackingNum = Math.floor(10000 + Math.random() * 90000);
        const randomProduct = PRODUCTS_SAMPLE[Math.floor(Math.random() * PRODUCTS_SAMPLE.length)];
        const randomLoc = LOCATIONS_SAMPLE[Math.floor(Math.random() * LOCATIONS_SAMPLE.length)];
        const randomName = NAMES_SAMPLE[Math.floor(Math.random() * NAMES_SAMPLE.length)];

        const newShipment: Shipment = {
          id: newId,
          trackingCode: `VT-${trackingNum}-BR`,
          customerName: randomName,
          location: randomLoc,
          productName: randomProduct,
          timestamp: 'Agora mesmo',
          status: 'processing',
          progress: 15
        };

        setShipments(prev => {
          if (prev.length === 0) return prev; // Guard: wait for initial shipments to load
          // Keep max 3 elements
          const trimmed = prev.slice(0, 2);
          return [newShipment, ...trimmed];
        });

        // Increment total counts
        setCounter(c => c + 1);

        // Highlight the new addition with a brief glowing border
        setHighlightedId(newId);
        setTimeout(() => {
          setHighlightedId(null);
        }, 3000);

      } else {
        // Upgrade one shipment's progress
        setShipments(prev => {
          if (prev.length === 0) return prev;
          const indexToProgress = Math.floor(Math.random() * prev.length);
          return prev.map((ship, idx) => {
            if (idx === indexToProgress) {
              const nextProgress = Math.min(100, ship.progress + 15);
              let nextStatus = ship.status;
              if (nextProgress >= 80) nextStatus = 'intransit';
              else if (nextProgress >= 50) nextStatus = 'dispatched';
              else if (nextProgress >= 25) nextStatus = 'packing';

              return {
                ...ship,
                progress: nextProgress,
                status: nextStatus as any,
                timestamp: 'Atualizado agora'
              };
            }
            return ship;
          });
        });
      }

    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Update timestamps text over time
  useEffect(() => {
    const timer = setInterval(() => {
      setShipments(prev => 
        prev.map(sh => {
          if (sh.timestamp === 'Agora mesmo' || sh.timestamp === 'Atualizado agora') {
            return { ...sh, timestamp: 'Há 1 min' };
          }
          return sh;
        })
      );
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  const getStatusLabel = (status: Shipment['status']) => {
    switch (status) {
      case 'processing': return 'Aprovado / Triagem';
      case 'packing': return 'Embalando Pacote';
      case 'dispatched': return 'Coletado p/ Despacho';
      case 'intransit': return 'Em Trânsito Rápido';
    }
  };

  const getStatusColor = (status: Shipment['status']) => {
    switch (status) {
      case 'processing': return 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5';
      case 'packing': return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      case 'dispatched': return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
      case 'intransit': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    }
  };

  return (
    <section className="bg-slate-950/80 border-y border-white/5 py-12 px-4 md:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header wrapper matching VoltTec's customized design */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-400 rounded-xl text-black font-black tracking-widest transition-all gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)] mb-2 select-none cursor-default">
              <h2 id="envios-title" className="text-sm md:text-base font-black tracking-widest leading-none">
                ENVIOS EM TEMPO REAL
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Transparência na triagem e envio de pedidos. Acompanhe abaixo o fluxo de saída homologado das encomendas VoltTec.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 border border-white/5 rounded-2xl px-5 py-3 shrink-0 self-start md:self-auto">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">ENVIADOS HOJE</div>
              <div className="text-base font-black text-white font-mono tracking-wide">{counter} ENCOMENDAS</div>
            </div>
          </div>
        </div>

        {/* Dynamic Shipments Progress Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-4xl mx-auto">
          {shipments.map((ship, idx) => {
            const isHighlight = highlightedId === ship.id;
            return (
              <div 
                key={ship.id}
                id={`shipment-card-${ship.id}`}
                className={`bg-slate-900/40 backdrop-blur-md rounded-2xl p-2.5 sm:p-4 border transition-all duration-700 relative overflow-hidden flex flex-col justify-between ${
                  isHighlight 
                    ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] bg-slate-900/80 scale-[1.01]' 
                    : 'border-white/5 hover:border-white/15'
                } ${
                  idx === 2 
                    ? 'col-span-2 md:col-span-2 md:max-w-[410px] md:mx-auto w-full' 
                    : 'col-span-1'
                }`}
              >
                {/* Background active glow for highlight */}
                {isHighlight && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse" />
                )}

                {/* Top tracking row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 mb-2.5 sm:mb-4">
                  <div className="space-y-0.5">
                    <span className="text-[8px] sm:text-[10px] font-mono font-bold text-slate-500 tracking-wider">RASTREIO</span>
                    <h4 className="text-[10px] sm:text-xs font-mono font-black text-white flex items-center gap-1">
                      <span>{ship.trackingCode}</span>
                      <span className="hidden xs:inline text-[8px] sm:text-[9px] px-1 py-0.2 rounded bg-white/5 text-slate-400">VoltCargo</span>
                    </h4>
                  </div>

                  <span className={`text-[8px] sm:text-[10px] px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg border font-bold uppercase tracking-wider font-mono shrink-0 flex items-center gap-1 ${getStatusColor(ship.status)} w-fit`}>
                    <Activity className="h-2 w-2 sm:h-3 sm:w-3 animate-pulse" />
                    <span>{getStatusLabel(ship.status)}</span>
                  </span>
                </div>

                {/* Main Shipment Details */}
                <div className="bg-slate-950/40 rounded-xl p-2 sm:p-3.5 border border-white/5 space-y-1 sm:space-y-2 mb-2.5 sm:mb-4">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white font-medium">
                    <Package className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500 shrink-0" />
                    <span className="truncate">{ship.productName}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[9px] sm:text-[11px] text-slate-400">
                    <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{ship.customerName} &bull; <strong className="text-slate-300 font-semibold">{ship.location}</strong></span>
                  </div>
                </div>

                {/* Progress bar and time */}
                <div className="space-y-1.5 sm:space-y-2 mt-auto">
                  <div className="flex justify-between items-center text-[8px] sm:text-[10px] text-slate-500">
                    <span className="font-mono">{ship.progress}% Concluído</span>
                    <span className="flex items-center gap-0.5 sm:gap-1">
                      <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-500" />
                      <span>{ship.timestamp}</span>
                    </span>
                  </div>

                  {/* Outer bar */}
                  <div className="w-full bg-slate-950 rounded-full h-1 sm:h-1.5 overflow-hidden border border-white/5">
                    {/* Inner progress filled */}
                    <div 
                      className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 h-full rounded-full transition-all duration-1000 animate-pulse" 
                      style={{ width: `${ship.progress}%` }}
                    />
                  </div>

                  {/* Bottom animated status icon trace */}
                  <div className="hidden sm:flex items-center justify-between text-[9px] text-slate-600 pt-1 font-mono uppercase">
                    <span>Preparado</span>
                    <ArrowRight className="h-3 w-3 text-slate-600" />
                    <span>Embalagem</span>
                    <ArrowRight className="h-3 w-3 text-slate-600" />
                    <span>Logística</span>
                    <ArrowRight className="h-3 w-3 text-slate-600" />
                    <span>Trânsito</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Live Status Informative Footer Badges */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/20 border border-white/5 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <Truck className="h-4 w-4 text-amber-500" />
            <span>Coleta Diária Expressa</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-amber-500" />
            <span>Homologação Marítima/Aérea</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Código Rastreio p/ WhatsApp</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <Activity className="h-4 w-4 text-amber-500" />
            <span>Monitoramento 100% Online</span>
          </div>
        </div>

      </div>
    </section>
  );
}
