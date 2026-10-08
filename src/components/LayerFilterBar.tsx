import React from 'react';
import { LayerFilters } from '../types';
import { 
  AlertTriangle, 
  MapPin, 
  Compass, 
  Gauge, 
  BookOpen, 
  Snowflake, 
  PlusCircle,
  Eye,
  Check
} from 'lucide-react';

interface LayerFilterBarProps {
  filters: LayerFilters;
  onToggleFilter: (key: keyof LayerFilters) => void;
  isAddingNoteMode: boolean;
  onToggleAddNoteMode: () => void;
  trapsCount: number;
}

export const LayerFilterBar: React.FC<LayerFilterBarProps> = ({
  filters,
  onToggleFilter,
  isAddingNoteMode,
  onToggleAddNoteMode,
  trapsCount
}) => {
  return (
    <div className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar z-20 text-xs">
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
          Слои карты:
        </span>

        {/* Traps Filter */}
        <button
          onClick={() => onToggleFilter('traps')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
            filters.traps
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>Ловушки ГИБДД ({trapsCount})</span>
        </button>

        {/* GOST Signs */}
        <button
          onClick={() => onToggleFilter('signs')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
            filters.signs
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60'
          }`}
        >
          <span>⛔</span>
          <span>Знаки ГОСТ</span>
        </button>

        {/* Routes */}
        <button
          onClick={() => onToggleFilter('routes')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
            filters.routes
              ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span>Маршруты ГИБДД</span>
        </button>

        {/* Speed Zones 20 / 40 */}
        <button
          onClick={() => onToggleFilter('speedZones')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
            filters.speedZones
              ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60'
          }`}
        >
          <Gauge className="w-3.5 h-3.5 text-yellow-400" />
          <span>Зоны 40 / 20</span>
        </button>

        {/* User Notes */}
        <button
          onClick={() => onToggleFilter('notes')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
            filters.notes
              ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span>Мои заметки</span>
        </button>

        {/* Winter Mode */}
        <button
          onClick={() => onToggleFilter('winterMode')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
            filters.winterMode
              ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60'
          }`}
        >
          <Snowflake className="w-3.5 h-3.5 text-sky-400" />
          <span>Зимний Ноябрьск</span>
        </button>
      </div>

      {/* Put a Pin on Map Mode Button */}
      <div className="shrink-0">
        <button
          onClick={onToggleAddNoteMode}
          className={`px-3 py-1 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border shadow-sm ${
            isAddingNoteMode
              ? 'bg-purple-600 text-white border-purple-400 animate-pulse'
              : 'bg-slate-900 hover:bg-slate-800 text-purple-300 border-purple-800/80'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{isAddingNoteMode ? 'Отменить выбор точки' : '+ Точка от инструктора'}</span>
        </button>
      </div>
    </div>
  );
};
