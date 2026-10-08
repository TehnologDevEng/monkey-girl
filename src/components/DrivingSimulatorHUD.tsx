import React from 'react';
import { DrivingSimulationPoint } from '../types';
import { GostSignIcon } from './GostSignIcon';
import { 
  Navigation, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  AlertTriangle, 
  X, 
  Car,
  Compass,
  MapPin,
  Volume2
} from 'lucide-react';

interface DrivingSimulatorHUDProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: DrivingSimulationPoint;
  currentStepIndex: number;
  totalSteps: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
}

export const DrivingSimulatorHUD: React.FC<DrivingSimulatorHUDProps> = ({
  isOpen,
  onClose,
  currentStep,
  currentStepIndex,
  totalSteps,
  onNextStep,
  onPrevStep,
  onReset
}) => {
  if (!isOpen) return null;

  const speedSignType = currentStep.speedLimit === 20 
    ? '3.24_20' 
    : currentStep.speedLimit === 40 
    ? '3.24_40' 
    : '3.24_60';

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-30 select-none animate-in slide-in-from-top-4 duration-200">
      <div className="bg-slate-900/95 border-2 border-indigo-500/60 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden text-slate-100">
        {/* Top Control Bar */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Car className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Симулятор маршрута (пр. Мира, 83)</span>
                <span className="text-[10px] text-indigo-300 font-normal">
                  (Шаг {currentStepIndex + 1} из {totalSteps})
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onPrevStep}
              disabled={currentStepIndex === 0}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-200 transition-colors cursor-pointer"
              title="Предыдущая точка"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNextStep}
              disabled={currentStepIndex === totalSteps - 1}
              className="p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg text-white font-semibold transition-colors cursor-pointer flex items-center gap-1 px-2.5 text-xs"
              title="Следующая точка"
            >
              <span>Вперед</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onReset}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Вернуться к автошколе"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live HUD Dashboard */}
        <div className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Street & Speed Limit Indicator */}
          <div className="flex items-center gap-3">
            {/* Speed Limit Sign Badge */}
            <div className="relative group shrink-0">
              <GostSignIcon signType={speedSignType} size={54} />
              <div className="absolute -bottom-1 -right-1 bg-slate-900 text-[9px] px-1 rounded font-bold border border-slate-700 text-slate-300">
                Лимит
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                <span>Текущий участок дороги:</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                {currentStep.streetName}
              </h4>
              <div className="text-xs text-amber-300 font-semibold mt-0.5">
                Скоростной режим: до {currentStep.speedLimit} км/ч
              </div>
            </div>
          </div>

          {/* Active Signs at this road segment */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider hidden md:inline">
              Знаки здесь:
            </span>
            <div className="flex items-center gap-1.5 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800">
              {currentStep.activeSigns.map((sign, idx) => (
                <GostSignIcon key={idx} signType={sign} size={28} />
              ))}
            </div>
          </div>
        </div>

        {/* Inspector Command & Advice */}
        <div className="bg-slate-950/90 px-4 py-2.5 border-t border-slate-800/80 space-y-1.5 text-xs">
          {currentStep.inspectorCommand && (
            <div className="flex items-start gap-2 text-amber-200">
              <Volume2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="italic font-medium">
                {currentStep.inspectorCommand}
              </div>
            </div>
          )}

          <div className="text-slate-300 flex items-start gap-2 pt-0.5">
            <span className="text-emerald-400 font-bold shrink-0">💡 Совет:</span>
            <span>{currentStep.drivingAdvice}</span>
          </div>

          {currentStep.dangerAlert && (
            <div className="bg-rose-950/40 border border-rose-900/60 p-2 rounded-lg text-rose-300 flex items-center gap-2 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span><strong>Внимание:</strong> {currentStep.dangerAlert}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
