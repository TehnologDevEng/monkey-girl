import React from 'react';
import { 
  Compass, 
  Sparkles, 
  HelpCircle, 
  Navigation, 
  CheckSquare, 
  BookOpen, 
  Heart,
  Car
} from 'lucide-react';

interface HeaderProps {
  onOpenQuiz: () => void;
  onOpenTactics: () => void;
  onOpenChecklist: () => void;
  onOpenNotes: () => void;
  notesCount: number;
  driverName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuiz,
  onOpenTactics,
  onOpenChecklist,
  onOpenNotes,
  notesCount,
  driverName = 'Любимая'
}) => {
  return (
    <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 z-30 select-none">
      {/* Brand & City badge */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-950/40">
          <Car className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1.5">
              <span>Ноябрьск</span>
              <span className="text-rose-400 font-extrabold">•</span>
              <span className="bg-gradient-to-r from-rose-400 to-amber-300 bg-clip-text text-transparent">ГИБДД Тренажер</span>
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] px-2 py-0.5 rounded-full font-semibold">
              <Heart className="w-2.5 h-2.5 fill-rose-400 text-rose-400" />
              Для {driverName}: сдай с 1-го раза!
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Карта коварных мест, ловушек экзаменатора и официальных маршрутов
          </p>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenQuiz}
          className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Экзаменатор-Квиз</span>
          <span className="sm:hidden">Квиз</span>
        </button>

        <button
          onClick={onOpenTactics}
          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Схемы перекрестков</span>
          <span className="md:hidden">Схемы</span>
        </button>

        <button
          onClick={onOpenChecklist}
          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Чек-лист</span>
        </button>

        <button
          onClick={onOpenNotes}
          className="relative px-2.5 py-1.5 bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 text-xs font-semibold rounded-xl border border-purple-800/80 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Блокнот инструктора</span>
          {notesCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-purple-500 text-white text-[9px] font-bold flex items-center justify-center">
              {notesCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
