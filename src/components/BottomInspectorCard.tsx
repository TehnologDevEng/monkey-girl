import React from 'react';
import { TurnAlertItem } from '../data/turnsData';
import { RoadSignItem, InspectorTrap } from '../types';
import { GostSignIcon } from './GostSignIcon';
import { 
  X, 
  AlertTriangle, 
  CornerDownRight, 
  ShieldCheck, 
  MapPin,
  ArrowRight,
  Gauge
} from 'lucide-react';

interface BottomInspectorCardProps {
  selectedTurn: TurnAlertItem | null;
  selectedSign: RoadSignItem | null;
  selectedTrap: InspectorTrap | null;
  onClose: () => void;
  onDeleteSign?: (id: string) => void;
}

export const BottomInspectorCard: React.FC<BottomInspectorCardProps> = ({
  selectedTurn,
  selectedSign,
  selectedTrap,
  onClose,
  onDeleteSign
}) => {
  if (!selectedTurn && !selectedSign && !selectedTrap) return null;

  // 1. If a Turn Alert is selected
  if (selectedTurn) {
    const speedBadge = selectedTurn.speedLimitAfterTurn === 20 
      ? '3.24_20' 
      : selectedTurn.speedLimitAfterTurn === 40 
      ? '3.24_40' 
      : '3.24_60';

    return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-40 select-none animate-in slide-in-from-bottom-4 duration-200">
        <div className="bg-slate-900/98 border-2 border-indigo-500/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden text-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
                <CornerDownRight className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                  Инструкция на перекрестке / повороте:
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                  {selectedTurn.name}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main body */}
          <div className="p-3.5 space-y-3 text-xs">
            {/* Visual comparison of Signs BEFORE vs AFTER turn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* BEFORE turn */}
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Знак перед поворотом:
                  </div>
                  <div className="text-[11px] text-slate-200 font-medium mt-0.5 line-clamp-1">
                    {selectedTurn.fromStreet}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {selectedTurn.signsBeforeTurn && selectedTurn.signsBeforeTurn.length > 0 ? (
                    selectedTurn.signsBeforeTurn.map((s, idx) => (
                      <GostSignIcon key={idx} signType={s} size={32} />
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-500">По разметке</span>
                  )}
                </div>
              </div>

              {/* AFTER turn */}
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-indigo-400" />
                    Знак сразу за углом:
                  </div>
                  <div className="text-[11px] text-slate-200 font-medium mt-0.5 line-clamp-1">
                    {selectedTurn.toStreet}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <GostSignIcon signType={speedBadge} size={32} />
                  {selectedTurn.signsImmediatelyAfterTurn.filter(s => !s.startsWith('3.24')).map((s, idx) => (
                    <GostSignIcon key={idx} signType={s} size={32} />
                  ))}
                </div>
              </div>
            </div>

            {/* Speed Badge Row */}
            <div className="bg-indigo-950/40 border border-indigo-800/40 p-2 rounded-xl flex items-center justify-between px-3">
              <span className="text-xs text-indigo-200 flex items-center gap-1.5 font-medium">
                <Gauge className="w-4 h-4 text-amber-400" />
                Скоростной режим на этом участке:
              </span>
              <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                не выше {selectedTurn.speedLimitAfterTurn} км/ч
              </span>
            </div>

            {/* Warning what to look out for */}
            <div className="bg-rose-950/30 border border-rose-900/60 p-3 rounded-xl text-rose-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-rose-300 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>На что обратить внимание:</span>
              </div>
              <p className="leading-relaxed text-[11px] text-slate-200">
                {selectedTurn.turnWarning}
              </p>
              <p className="text-[10px] text-rose-400/90 pt-0.5">
                <strong>На чем часто валят:</strong> {selectedTurn.whatCatchesDrivers}
              </p>
            </div>

            {/* Simple Golden Rule */}
            <div className="bg-emerald-950/30 border border-emerald-900/60 p-2.5 rounded-xl text-emerald-200 flex items-start gap-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-300">Как правильно ехать: </span>
                <span className="leading-snug text-slate-200">{selectedTurn.simpleRule}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. If a Sign is selected
  if (selectedSign) {
    return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-lg z-40 select-none animate-in slide-in-from-bottom-4 duration-200">
        <div className="bg-slate-900/98 border-2 border-amber-500/70 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden text-slate-100">
          <div className="p-3.5 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <GostSignIcon signType={selectedSign.signType} size={48} />
              <div>
                <h3 className="text-sm font-bold text-white">
                  {selectedSign.name}
                </h3>
                <p className="text-xs text-amber-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {selectedSign.street}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-3.5 pb-3.5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2.5">
            <p>{selectedSign.description}</p>
            {selectedSign.actionZone && (
              <div className="mt-2 bg-amber-950/40 p-2 rounded-lg border border-amber-800/50 text-amber-200 text-[11px]">
                📍 <strong>Зона действия:</strong> {selectedSign.actionZone.description}
              </div>
            )}
            {onDeleteSign && (
              <div className="mt-3 pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => {
                    onDeleteSign(selectedSign.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>🗑️</span>
                  <span>Удалить этот знак (если его сняли в реальности)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. If a Trap is selected
  if (selectedTrap) {
    return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-xl z-40 select-none animate-in slide-in-from-bottom-4 duration-200">
        <div className="bg-slate-900/98 border-2 border-rose-500/70 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden text-slate-100">
          <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">⚠️</span>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                {selectedTrap.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 space-y-2.5 text-xs">
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-amber-200 italic">
              🎙️ <strong>Команда инспектора:</strong> {selectedTrap.inspectorQuote}
            </div>

            <div className="text-slate-300 leading-relaxed">
              <p className="mb-1"><strong className="text-rose-400">Ошибка:</strong> {selectedTrap.fatalMistake}</p>
              <p><strong className="text-emerald-400">Как правильно:</strong> {selectedTrap.correctAction}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
