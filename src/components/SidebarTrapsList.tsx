import React, { useState } from 'react';
import { InspectorTrap, ExamRoute } from '../types';
import { 
  AlertTriangle, 
  Compass, 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  Filter, 
  ShieldAlert, 
  Flag,
  Snowflake,
  Sparkles
} from 'lucide-react';

interface SidebarTrapsListProps {
  traps: InspectorTrap[];
  routes: ExamRoute[];
  selectedTrapId: string | null;
  selectedRouteId: string | null;
  onSelectTrap: (trap: InspectorTrap) => void;
  onSelectRoute: (route: ExamRoute) => void;
  onFlyToCoords: (coords: [number, number]) => void;
}

export const SidebarTrapsList: React.FC<SidebarTrapsListProps> = ({
  traps,
  routes,
  selectedTrapId,
  selectedRouteId,
  onSelectTrap,
  onSelectRoute,
  onFlyToCoords
}) => {
  const [activeTab, setActiveTab] = useState<'traps' | 'routes'>('traps');
  const [selectedStreetFilter, setSelectedStreetFilter] = useState<string>('all');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const streets = [
    { id: 'all', name: 'Все улицы' },
    { id: 'Советская', name: 'ул. Советская' },
    { id: 'Мира', name: 'пр. Мира' },
    { id: 'Ленина', name: 'ул. Ленина' },
    { id: 'Холмогорская', name: 'ул. Холмогорская' },
    { id: '60 лет', name: '60 лет СССР' },
    { id: 'Цоя', name: 'ул. Виктора Цоя' },
    { id: 'Изыскателей', name: 'ул. Изыскателей' }
  ];

  const filteredTraps = traps.filter(t => {
    if (selectedStreetFilter === 'all') return true;
    return t.street.toLowerCase().includes(selectedStreetFilter.toLowerCase()) || 
           t.title.toLowerCase().includes(selectedStreetFilter.toLowerCase());
  });

  return (
    <div className={`relative transition-all duration-300 z-10 flex select-none ${
      isCollapsed ? 'w-10' : 'w-80 sm:w-96'
    } bg-slate-950/95 backdrop-blur-md border-r border-slate-800/90 h-full flex-col`}>
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-6 z-20 w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center shadow-lg transition-transform cursor-pointer"
        title={isCollapsed ? 'Развернуть список' : 'Свернуть список'}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {isCollapsed ? (
        /* Collapsed minimal icon column */
        <div className="py-6 flex flex-col items-center gap-4 text-slate-400">
          <button 
            onClick={() => { setIsCollapsed(false); setActiveTab('traps'); }}
            className="p-2 hover:bg-slate-800 rounded-lg text-rose-400 cursor-pointer"
            title="Ловушки инспектора"
          >
            <AlertTriangle className="w-5 h-5" />
          </button>
          <button 
            onClick={() => { setIsCollapsed(false); setActiveTab('routes'); }}
            className="p-2 hover:bg-slate-800 rounded-lg text-blue-400 cursor-pointer"
            title="Маршруты ГИБДД"
          >
            <Compass className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* Expanded Content */
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Switcher Tabs */}
          <div className="p-3 border-b border-slate-800 flex gap-2 bg-slate-900/50">
            <button
              onClick={() => setActiveTab('traps')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                activeTab === 'traps'
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Ловушки ({traps.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                activeTab === 'routes'
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>Маршруты ({routes.length})</span>
            </button>
          </div>

          {activeTab === 'traps' ? (
            <>
              {/* Street filter chips */}
              <div className="p-2.5 border-b border-slate-800 bg-slate-950/80 overflow-x-auto no-scrollbar flex gap-1.5">
                {streets.map(st => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStreetFilter(st.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap font-medium transition-all cursor-pointer border ${
                      selectedStreetFilter === st.id
                        ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>

              {/* Traps List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {filteredTraps.map((trap, idx) => {
                  const isSelected = trap.id === selectedTrapId;
                  return (
                    <div
                      key={trap.id}
                      onClick={() => {
                        onFlyToCoords(trap.coordinates);
                        onSelectTrap(trap);
                      }}
                      className={`p-3 rounded-xl border text-xs transition-all cursor-pointer group ${
                        isSelected 
                          ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500 shadow-lg' 
                          : 'bg-slate-900/70 border-slate-800/80 hover:border-rose-500/40 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="font-bold text-white text-xs leading-snug group-hover:text-rose-300 transition-colors">
                          #{idx + 1}. {trap.title}
                        </span>
                        <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                          {trap.penaltyPoints} б.
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                        <span className="truncate">{trap.street}</span>
                      </div>

                      <div className="bg-slate-950/80 border border-slate-800 p-2 rounded-lg text-[11px] text-amber-200/90 italic leading-snug">
                        🎙️ {trap.inspectorQuote}
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="text-emerald-400 font-medium">Клик для разбора</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Routes Tab */
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {routes.map((route) => {
                const isSelected = route.id === selectedRouteId;
                return (
                  <div
                    key={route.id}
                    onClick={() => {
                      onSelectRoute(route);
                      onFlyToCoords(route.waypoints[0]);
                    }}
                    className={`p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500 shadow-lg'
                        : 'bg-slate-900/70 border-slate-800/80 hover:border-blue-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: route.color }} />
                        <span className="font-bold text-white text-xs">
                          Маршрут №{route.number}
                        </span>
                      </div>
                      <span className="text-[10px] text-blue-300 font-medium bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">
                        {route.distanceKm} км
                      </span>
                    </div>

                    <h4 className="font-semibold text-slate-200 text-xs mb-1.5">
                      {route.name}
                    </h4>

                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                      {route.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Ключевые точки контроля ({route.checkpoints.length}):
                      </div>
                      {route.checkpoints.map((cp, cIdx) => (
                        <div
                          key={cp.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onFlyToCoords(cp.coordinates);
                          }}
                          className="p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-950 text-[11px] flex items-center justify-between text-slate-300 border border-slate-800/50"
                        >
                          <span className="truncate">
                            {cIdx + 1}. {cp.name}
                          </span>
                          <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
