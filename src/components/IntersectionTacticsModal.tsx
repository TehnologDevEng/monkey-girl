import React, { useState } from 'react';
import { X, Navigation, CheckCircle2, AlertTriangle, Snowflake, Sparkles } from 'lucide-react';

interface IntersectionTacticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntersectionTacticsModal: React.FC<IntersectionTacticsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'left_turn' | 'winter_crosswalk' | 'u_turn'>('left_turn');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Тактический разбор перекрестков и траекторий
              </h2>
              <p className="text-xs text-slate-400">
                Наглядные схемы маневров, на которых курсанты получают 5 штрафных баллов
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('left_turn')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'left_turn'
                ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>📐</span> Левый поворот без среза угла (п. 8.6)
          </button>
          <button
            onClick={() => setActiveTab('winter_crosswalk')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'winter_crosswalk'
                ? 'bg-sky-500/20 border border-sky-500/50 text-sky-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>❄️</span> Зимний переход без «зебры»
          </button>
          <button
            onClick={() => setActiveTab('u_turn')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'u_turn'
                ? 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>🔄</span> Разворот в узком месте
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-200">
          {activeTab === 'left_turn' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                  <span>Перекресток пр. Мира и ул. Ленина</span>
                  <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono">п. 8.6 ПДД РФ</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Поворот должен осуществляться так, чтобы при выезде с пересечения проезжих частей автомобиль не оказался на полосе встречного движения.
                </p>
              </div>

              {/* Tactical Diagram SVG */}
              <div className="relative bg-slate-950 rounded-2xl p-4 border border-slate-800 flex justify-center">
                <svg viewBox="0 0 400 320" className="w-full max-w-md h-auto">
                  {/* Road Asphalt Background */}
                  <rect x="0" y="0" width="400" height="320" fill="#0f172a" />
                  
                  {/* Vertical Street (ул. Ленина) */}
                  <rect x="140" y="0" width="120" height="320" fill="#1e293b" />
                  {/* Horizontal Street (пр. Мира) */}
                  <rect x="0" y="100" width="400" height="120" fill="#1e293b" />

                  {/* Curbs / Sidewalks */}
                  <rect x="0" y="0" width="140" height="100" fill="#334155" rx="12" />
                  <rect x="260" y="0" width="140" height="100" fill="#334155" rx="12" />
                  <rect x="0" y="220" width="140" height="100" fill="#334155" rx="12" />
                  <rect x="260" y="220" width="140" height="100" fill="#334155" rx="12" />

                  {/* Road Center Markings */}
                  {/* Vertical Road Double Solid */}
                  <line x1="200" y1="220" x2="200" y2="320" stroke="#facc15" strokeWidth="3" strokeDasharray="6,4" />
                  <line x1="200" y1="0" x2="200" y2="100" stroke="#facc15" strokeWidth="3" strokeDasharray="6,4" />
                  {/* Horizontal Road Double Solid */}
                  <line x1="0" y1="160" x2="140" y2="160" stroke="#facc15" strokeWidth="3" strokeDasharray="6,4" />
                  <line x1="260" y1="160" x2="400" y2="160" stroke="#facc15" strokeWidth="3" strokeDasharray="6,4" />

                  {/* Intersection Center Point */}
                  <circle cx="200" cy="160" r="4" fill="#94a3b8" />
                  <text x="210" y="155" fill="#94a3b8" fontSize="10">Центр</text>

                  {/* Red Faulty Trajectory (cutting the corner) */}
                  <path d="M 170 300 Q 170 200 60 180" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="5,4" />
                  {/* Red penalty cross */}
                  <circle cx="150" cy="190" r="12" fill="#ef4444" fillOpacity="0.3" stroke="#ef4444" strokeWidth="2" />
                  <text x="145" y="194" fill="#ffffff" fontSize="12" fontWeight="bold">✕</text>
                  <text x="168" y="200" fill="#f87171" fontSize="10" fontWeight="bold">Срезка на встречку (5 баллов!)</text>

                  {/* Green Correct Trajectory (deep into intersection) */}
                  <path d="M 170 300 L 170 160 Q 170 135 60 135" fill="none" stroke="#10b981" strokeWidth="4" />
                  <circle cx="60" cy="135" r="4" fill="#10b981" />
                  {/* Green arrow head */}
                  <polyline points="75,130 60,135 75,140" fill="none" stroke="#10b981" strokeWidth="4" />
                  <text x="60" y="120" fill="#34d399" fontSize="11" fontWeight="bold">✓ Правильная траектория (90°)</text>

                  {/* Stop line & Car */}
                  <rect x="158" y="270" width="24" height="38" rx="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                  <text x="170" y="294" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">УЧ</text>
                </svg>
              </div>

              {/* Rules check */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-rose-950/30 border border-rose-900/60 p-3 rounded-xl space-y-1">
                  <div className="font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Фатальная срезка:
                  </div>
                  <p className="text-slate-300">
                    Начало вращения руля до центра перекрестка приводит к срезанию траектории и пересечению встречной полосы. Автоматическая несдача!
                  </p>
                </div>

                <div className="bg-emerald-950/30 border border-emerald-900/60 p-3 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Золотое правило:
                  </div>
                  <p className="text-slate-300">
                    Едем прямо на прямых колесах до воображаемого центра перекрестка, пропускаем встречку, и поворачиваем под прямым углом в свою полосу.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'winter_crosswalk' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                  <span>Зимний пешеходный переход без разметки</span>
                  <span className="text-xs bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-mono">Знаки 5.19.1 и 5.19.2</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  В Ноябрьске зимой разметку «зебра» не видно 8 месяцев в году. Границы пешеходного перехода определяются строго расстоянием между знаками 5.19.1 (справа) и 5.19.2 (слева)!
                </p>
              </div>

              {/* Diagram */}
              <div className="relative bg-slate-950 rounded-2xl p-4 border border-slate-800 flex justify-center">
                <svg viewBox="0 0 420 240" className="w-full max-w-md h-auto">
                  {/* Road */}
                  <rect x="0" y="40" width="420" height="160" fill="#1e293b" />
                  {/* Snow banks on curbs */}
                  <rect x="0" y="0" width="420" height="40" fill="#cbd5e1" />
                  <rect x="0" y="200" width="420" height="40" fill="#cbd5e1" />
                  <text x="20" y="25" fill="#475569" fontSize="11" fontWeight="bold">❄️ Снежный вал / Сугроб</text>
                  <text x="20" y="225" fill="#475569" fontSize="11" fontWeight="bold">❄️ Снежный вал / Сугроб</text>

                  {/* Crosswalk zone strictly between signs */}
                  <rect x="220" y="40" width="70" height="160" fill="#38bdf8" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,4" />
                  <text x="255" y="125" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Зона перехода</text>

                  {/* Sign 5.19.1 Right (Bottom) */}
                  <rect x="215" y="202" width="14" height="14" fill="#2563eb" rx="2" />
                  <text x="235" y="213" fill="#38bdf8" fontSize="10" fontWeight="bold">Знак 5.19.1 (Ближняя граница)</text>

                  {/* Sign 5.19.2 Left (Top) */}
                  <rect x="280" y="24" width="14" height="14" fill="#2563eb" rx="2" />
                  <text x="20" y="32" fill="#38bdf8" fontSize="10" fontWeight="bold">Знак 5.19.2 ➔</text>

                  {/* Stopping distance */}
                  <line x1="220" y1="40" x2="220" y2="200" stroke="#f43f5e" strokeWidth="3" />
                  <text x="140" y="185" fill="#f43f5e" fontSize="10" fontWeight="bold">Стоп-линия!</text>

                  {/* Car correctly stopped */}
                  <rect x="130" y="115" width="60" height="34" rx="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <text x="160" y="136" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Твоя машина</text>

                  {/* Pedestrian on snow verge */}
                  <circle cx="240" cy="18" r="6" fill="#f59e0b" />
                  <text x="250" y="20" fill="#f59e0b" fontSize="10" fontWeight="bold">Пешеход</text>
                </svg>
              </div>

              <div className="bg-sky-950/30 border border-sky-800/60 p-4 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-sky-300 flex items-center gap-1.5">
                  <Snowflake className="w-4 h-4" /> Главная ловушка на экзамене:
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Если курсант заедет бампером хотя бы на 10 см за линию правого знака 5.19.1 — инспектор засчитывает <strong>«Остановку на пешеходном переходе» (5 штрафных баллов)</strong>! Останавливайся всегда за 2-3 метра до знака.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'u_turn' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                  <span>Разворот с прилегающей территории (ул. Холмогорская, Цоя)</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  На узких заснеженных улицах развернуться в один прием невозможно. Единственный законный способ — использование въезда во двор.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-950/20 border border-emerald-900/50 p-4 rounded-xl space-y-2">
                  <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Единственно верный способ (Двор СПРАВА):
                  </div>
                  <ol className="text-xs text-slate-300 list-decimal list-inside space-y-1.5">
                    <li>Проезжаем чуть дальше двора справа.</li>
                    <li>Включаем правый поворотник, сдаем назад во двор под 90°.</li>
                    <li>Выезжаем из двора ПЕРЕДОМ с левым поворотником! Отличный обзор, нулевой риск.</li>
                  </ol>
                </div>

                <div className="bg-rose-950/20 border border-rose-900/50 p-4 rounded-xl space-y-2">
                  <div className="text-rose-400 font-bold text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Опасная ошибка (Двор СЛЕВА):
                  </div>
                  <p className="text-xs text-slate-300">
                    Заезд передом во двор слева требует последующего выезда ЗАДОМ на проезжую часть через встречную полосу вслепую. На экзамене это почти всегда 5 баллов за опасное маневрирование!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Понятно, закрыть разбор
          </button>
        </div>
      </div>
    </div>
  );
};
