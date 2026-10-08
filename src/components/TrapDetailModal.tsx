import React from 'react';
import { InspectorTrap } from '../types';
import { AlertTriangle, ShieldCheck, Snowflake, Compass, X, Award } from 'lucide-react';

interface TrapDetailModalProps {
  trap: InspectorTrap | null;
  onClose: () => void;
  onStartQuizAtTrap?: (trap: InspectorTrap) => void;
}

export const TrapDetailModal: React.FC<TrapDetailModalProps> = ({
  trap,
  onClose,
  onStartQuizAtTrap
}) => {
  if (!trap) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="relative bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/40 p-5 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Ловушка инспектора
                </span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Штраф: {trap.penaltyPoints} баллов (НЕ СДАНО)
                </span>
              </div>
              <h2 className="text-xl font-bold text-white leading-snug">
                {trap.title}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <Compass className="w-3.5 h-3.5 text-rose-400" />
                {trap.street}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-200 divide-y divide-slate-800/80">
          {/* Inspector Command */}
          <div className="pt-1">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span>🎙️</span> Что скомандует инспектор:
            </h3>
            <div className="bg-slate-950/70 border border-amber-500/30 rounded-xl p-3.5 text-amber-100 font-medium italic text-base">
              {trap.inspectorQuote}
            </div>
          </div>

          {/* Fatal Mistake */}
          <div className="pt-4">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> На чем срезаются 90% курсантов:
            </h3>
            <div className="bg-rose-950/30 border border-rose-900/60 rounded-xl p-3.5 text-rose-200">
              <p className="mb-2 leading-relaxed">{trap.fatalMistake}</p>
              <div className="text-xs text-rose-300/80 font-mono bg-rose-950/60 p-2 rounded border border-rose-800/50">
                ⚖️ <strong>Нарушение:</strong> {trap.pddRule}
              </div>
            </div>
          </div>

          {/* Perfect Action */}
          <div className="pt-4">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Как выполнить маневр безупречно:
            </h3>
            <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-3.5 text-emerald-100 leading-relaxed">
              {trap.correctAction}
            </div>
          </div>

          {/* Secret Instructor Tip */}
          <div className="pt-4">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" /> Лайфхак от ноябрьского автоинструктора:
            </h3>
            <div className="bg-purple-950/30 border border-purple-900/50 rounded-xl p-3.5 text-purple-200 italic leading-relaxed">
              «{trap.instructorSecretTip}»
            </div>
          </div>

          {/* Winter yamal notice */}
          {trap.winterSpecificNotice && (
            <div className="pt-4">
              <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Snowflake className="w-4 h-4 text-sky-400" /> Зимняя специфика Ноябрьска (ЯНАО):
              </h3>
              <div className="bg-sky-950/30 border border-sky-900/50 rounded-xl p-3.5 text-sky-200 leading-relaxed">
                {trap.winterSpecificNotice}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Отработайте этот маневр мысленно перед экзаменом
          </div>
          <div className="flex items-center gap-2">
            {onStartQuizAtTrap && (
              <button
                onClick={() => {
                  onClose();
                  onStartQuizAtTrap(trap);
                }}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🎯</span> Пройти тест по этой ловушке
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
