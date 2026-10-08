import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Square, Award, Heart, ShieldCheck, Sparkles } from 'lucide-react';

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName?: string;
}

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  penaltyClause: string;
}

const DEFAULT_MANEUVERS: ChecklistItem[] = [
  {
    id: 'm-1',
    category: 'Перекрестки',
    title: 'Левый поворот на регулируемом перекрестке (Мира / Ленина)',
    description: 'Движение до центра на прямых колесах, пропуск встречки, выход в свою полосу без наезда на встречку.',
    penaltyClause: 'п. 8.6 ПДД (5 баллов)'
  },
  {
    id: 'm-2',
    category: 'Перекрестки',
    title: 'Проезд перекрестка неравнозначных дорог (Советская / Ленина)',
    description: 'Четкое определение приоритета по знакам 2.1 «Главная» и 2.4 «Уступите дорогу».',
    penaltyClause: 'п. 13.9 ПДД (5 баллов)'
  },
  {
    id: 'm-3',
    category: 'Скорость',
    title: 'Ступенчатое торможение 40 → 20 км/ч у СОШ №8 (Холмогорская)',
    description: 'Сброс скорости строго до 18 км/ч до пересечения линии знака «20». Отсутствие порога +20 км/ч.',
    penaltyClause: 'п. 10.2 ПДД (5 баллов)'
  },
  {
    id: 'm-4',
    category: 'Скорость',
    title: 'Разгон до максимальной скорости без превышения',
    description: 'Удержание 38-39 км/ч на Советской при выезде со дворов; понимание, что выезд из микрорайона — это не перекресток!',
    penaltyClause: 'п. 10.1 ПДД (5 баллов)'
  },
  {
    id: 'm-5',
    category: 'Остановка',
    title: 'Поиск разрешенного места для остановки (проверка знака 3.27)',
    description: 'Отказ от немедленной остановки под запрещающим знаком, проезд до перекрестка или парковки.',
    penaltyClause: 'п. 12.4 ПДД (5 баллов)'
  },
  {
    id: 'm-6',
    category: 'Остановка',
    title: 'Остановка у автобусной остановки (15 метров)',
    description: 'Отсчет не менее 3.5 длин автомобиля от столба со знаком 5.16 или разметки.',
    penaltyClause: 'п. 12.4 ПДД (5 баллов)'
  },
  {
    id: 'm-7',
    category: 'Развороты',
    title: 'Разворот с прилегающей территории (ул. Цоя / Холмогорская)',
    description: 'Заезд задним ходом в карман СПРАВА с правым поворотником, безопасный выезд передом.',
    penaltyClause: 'п. 8.8 ПДД (5 баллов)'
  },
  {
    id: 'm-8',
    category: 'Пешеходы',
    title: 'Зимний пешеходный переход без разметки',
    description: 'Остановка за 2-3 метра до знака 5.19.1. Пропуск любого пешехода, ступившего на край проезжей части.',
    penaltyClause: 'п. 14.1 ПДД (5 баллов)'
  },
  {
    id: 'm-9',
    category: 'Маневрирование',
    title: 'Опережение попутного транспорта',
    description: 'Своевременное включение левого поворотника, контроль мертвой зоны через плечо, возврат с правым поворотником.',
    penaltyClause: 'п. 8.1 ПДД (3-5 баллов)'
  }
];

const GOLDEN_RULES = [
  'Широкий заезд во двор у ТЦ «Русь» — это НЕ перекресток. Знак 40 действует дальше!',
  'Команда «Выберите место и остановитесь» — это 100% проверка на знак 3.27 или 15 метров до остановки автобуса.',
  'На левом повороте пр. Мира — ул. Ленина не срезай угол! Езжай строго до центра.',
  'Зимой нет разметки: граница пешеходного перехода — строго от правого столба со знаком 5.19.1.',
  'На школьной зоне Холмогорской держи 16-18 км/ч. На экзамене превышение даже на 1 км/ч = несдача.',
  'Проговаривай спорные действия вслух: «Здесь знак 3.27, продолжаю движение до перекрестка». Инспекторы это обожают!'
];

export const ChecklistModal: React.FC<ChecklistModalProps> = ({
  isOpen,
  onClose,
  driverName = 'Любимая'
}) => {
  const [completedItems, setCompletedItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('noyabrsk_checklist_completed');
      return saved ? JSON.parse(saved) : ['m-1', 'm-5'];
    } catch {
      return ['m-1', 'm-5'];
    }
  });

  useEffect(() => {
    localStorage.setItem('noyabrsk_checklist_completed', JSON.stringify(completedItems));
  }, [completedItems]);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    setCompletedItems(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const progressPercent = Math.round((completedItems.length / DEFAULT_MANEUVERS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950/60 via-slate-950 to-indigo-950/40 p-5 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <Heart className="w-6 h-6 fill-rose-500/40 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full font-bold">
                  Для {driverName} • Сдаем с 1-го раза! ❤️
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">
                Чек-лист экзаменационной готовности
              </h2>
              <p className="text-xs text-slate-400">
                Обязательные упражнения регламента МВД РФ для города Ноябрьска
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

        {/* Progress bar */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Освоено маневров:</span>
            <span className="font-bold text-white">{completedItems.length} из {DEFAULT_MANEUVERS.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-rose-500 to-indigo-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-bold text-rose-400">{progressPercent}%</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-200">
          {/* 6 Golden Rules */}
          <div>
            <h3 className="font-bold text-amber-400 text-sm mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> 6 Золотых заповедей экзамена в Ноябрьске:
            </h3>
            <div className="space-y-1.5">
              {GOLDEN_RULES.map((rule, idx) => (
                <div key={idx} className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </div>
                  <span className="text-slate-300 leading-snug">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Maneuvers Checklist */}
          <div>
            <h3 className="font-bold text-white text-sm mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Интерактивный чек-лист упражнений (отмечай галочкой):
            </h3>
            <div className="space-y-2">
              {DEFAULT_MANEUVERS.map((item) => {
                const isDone = completedItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isDone 
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0 text-emerald-400">
                      {isDone ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-bold text-xs ${isDone ? 'line-through text-emerald-300' : 'text-white'}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] text-rose-400 bg-rose-950/40 border border-rose-900/40 px-1.5 py-0.5 rounded font-mono">
                          {item.penaltyClause}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-rose-300/80 italic flex items-center gap-1.5">
            <span>❤️</span> Ты обязательно сдашь с первого раза!
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Закрыть чек-лист
          </button>
        </div>
      </div>
    </div>
  );
};
