/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { MapComponent } from './components/MapComponent';
import { BottomInspectorCard } from './components/BottomInspectorCard';
import { DrivingSimulatorHUD } from './components/DrivingSimulatorHUD';
import { AddSignModal } from './components/AddSignModal';
import { NotesDrawer } from './components/NotesDrawer';
import { InstructionGuideModal } from './components/InstructionGuideModal';
import { QuizModal } from './components/QuizModal';
import { IntersectionTacticsModal } from './components/IntersectionTacticsModal';
import { ChecklistModal } from './components/ChecklistModal';

import { GOST_SIGNS, AUTOSHKOLA_LOCATION, DRIVING_SIMULATION_STEPS } from './data/signsData';
import { EXAM_ROUTES } from './data/routesData';
import { NOYABRSK_TURN_ALERTS, TurnAlertItem } from './data/turnsData';
import { INSPECTOR_TRAPS } from './data/trapsData';
import { ExamRoute, InstructorNote, LayerFilters, RoadSignItem, InspectorTrap } from './types';
import { 
  Compass, 
  Car, 
  CornerDownRight, 
  Gauge, 
  MapPin,
  Heart,
  Plus,
  RotateCcw,
  BookOpen,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Navigation,
  CheckSquare
} from 'lucide-react';

const INITIAL_INSTRUCTOR_NOTES: InstructorNote[] = [
  {
    id: 'note-init-1',
    title: 'Выезд с Цоя на Холмогорскую: глухой сугроб',
    text: 'Зимой сугроб слева закрывает обзор на Холмогорскую. Выдвигайся на перекресток буквально по 15 сантиметров, пока не увидишь фары!',
    instructorName: 'Инструктор автошколы',
    category: 'warning',
    coordinates: [63.19050, 75.46450],
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  // Layer Filters: по умолчанию только чистая карта со знаками и ловушками ГИБДД (без диагональных полос)
  const [filters, setFilters] = useState<LayerFilters>({
    traps: true, // Ловушки ГИБДД
    signs: true, // Реальные знаки на перекрестках
    routes: false, // Отключены по умолчанию (линии маршрутов)
    speedZones: false, // Отключены по умолчанию (полосы зон скорости)
    notes: false,
    winterMode: false
  });

  // Persistent Real Signs state (auto-upgrades to latest verified coordinates dataset)
  const [signs, setSigns] = useState<RoadSignItem[]>(() => {
    try {
      // Clear legacy storage keys with obsolete coordinates
      localStorage.removeItem('noyabrsk_real_signs_v5');
      localStorage.removeItem('noyabrsk_real_signs_v4');
      localStorage.removeItem('noyabrsk_real_signs_v3');
      localStorage.removeItem('noyabrsk_real_signs_v2');

      const saved = localStorage.getItem('noyabrsk_real_signs_v6_verified');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const customSigns = parsed.filter(s => s.id.startsWith('custom-'));
          return [...GOST_SIGNS, ...customSigns];
        }
      }
      return GOST_SIGNS;
    } catch {
      return GOST_SIGNS;
    }
  });

  useEffect(() => {
    localStorage.setItem('noyabrsk_real_signs_v6_verified', JSON.stringify(signs));
  }, [signs]);

  // Notes state
  const [notes, setNotes] = useState<InstructorNote[]>(() => {
    try {
      const saved = localStorage.getItem('noyabrsk_instructor_notes');
      return saved ? JSON.parse(saved) : INITIAL_INSTRUCTOR_NOTES;
    } catch {
      return INITIAL_INSTRUCTOR_NOTES;
    }
  });

  useEffect(() => {
    localStorage.setItem('noyabrsk_instructor_notes', JSON.stringify(notes));
  }, [notes]);

  // Selections & Camera
  const [selectedSign, setSelectedSign] = useState<RoadSignItem | null>(null);
  const [selectedTurn, setSelectedTurn] = useState<TurnAlertItem | null>(NOYABRSK_TURN_ALERTS[0]);
  const [selectedTrap, setSelectedTrap] = useState<InspectorTrap | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<ExamRoute | null>(EXAM_ROUTES[0]);
  const [focusCoords, setFocusCoords] = useState<[number, number] | null>(AUTOSHKOLA_LOCATION.coordinates);

  // Modals & Tools
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isTacticsOpen, setIsTacticsOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState(false);
  const [isDrivingSimOpen, setIsDrivingSimOpen] = useState(false);
  const [simStepIndex, setSimStepIndex] = useState(0);

  // Check if first time user, auto-show guide once
  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem('noyabrsk_guide_seen');
      if (!hasSeen) {
        setIsInstructionOpen(true);
        localStorage.setItem('noyabrsk_guide_seen', 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  // Sign placement mode
  const [isAddingSignMode, setIsAddingSignMode] = useState(false);
  const [pendingSignCoords, setPendingSignCoords] = useState<[number, number] | null>(null);

  // Filter toggle
  const handleToggleFilter = (key: keyof LayerFilters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Select Turn Alert
  const handleSelectTurn = useCallback((turn: TurnAlertItem) => {
    setSelectedTurn(turn);
    setSelectedSign(null);
    setSelectedTrap(null);
    setFocusCoords(turn.coordinates);
  }, []);

  // Select Road Sign
  const handleSelectSign = useCallback((sign: RoadSignItem) => {
    setSelectedSign(sign);
    setSelectedTurn(null);
    setSelectedTrap(null);
    setFocusCoords(sign.coordinates);
  }, []);

  // Select Inspector Trap
  const handleSelectTrap = useCallback((trap: InspectorTrap) => {
    setSelectedTrap(trap);
    setSelectedTurn(null);
    setSelectedSign(null);
    setFocusCoords(trap.coordinates);
  }, []);

  // Map Click for Sign Placement
  const handleMapClickForSign = useCallback((coords: [number, number]) => {
    setPendingSignCoords(coords);
    setIsAddingSignMode(false);
  }, []);

  // Add Real Sign
  const handleAddSign = (newSign: RoadSignItem) => {
    setSigns(prev => [newSign, ...prev]);
    setSelectedSign(newSign);
    setSelectedTurn(null);
    setFocusCoords(newSign.coordinates);
  };

  // Delete Sign
  const handleDeleteSign = (id: string) => {
    setSigns(prev => prev.filter(s => s.id !== id));
    if (selectedSign?.id === id) {
      setSelectedSign(null);
    }
  };

  // Reset to original verified signs
  const handleResetSigns = () => {
    if (window.confirm('Сбросить все знаки к проверенным координатам дорог Ноябрьска по умолчанию?')) {
      setSigns(GOST_SIGNS);
      localStorage.setItem('noyabrsk_real_signs_v6_verified', JSON.stringify(GOST_SIGNS));
    }
  };

  // Simulation Controls
  const handleStartDrivingSimulation = () => {
    setSimStepIndex(0);
    setIsDrivingSimOpen(true);
    setSelectedTurn(null);
    setSelectedSign(null);
    setFocusCoords(DRIVING_SIMULATION_STEPS[0].coordinates);
  };

  const handleNextSimStep = () => {
    if (simStepIndex < DRIVING_SIMULATION_STEPS.length - 1) {
      const nextIdx = simStepIndex + 1;
      setSimStepIndex(nextIdx);
      setFocusCoords(DRIVING_SIMULATION_STEPS[nextIdx].coordinates);
    }
  };

  const handlePrevSimStep = () => {
    if (simStepIndex > 0) {
      const prevIdx = simStepIndex - 1;
      setSimStepIndex(prevIdx);
      setFocusCoords(DRIVING_SIMULATION_STEPS[prevIdx].coordinates);
    }
  };

  const handleCloseInspectorCard = () => {
    setSelectedTurn(null);
    setSelectedSign(null);
    setSelectedTrap(null);
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* Top Header */}
      <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>Ноябрьск: Карта реальных дорожных знаков</span>
              <span className="hidden md:inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-semibold ml-1">
                <Heart className="w-2.5 h-2.5 fill-rose-400 text-rose-400" /> Экзамен ГИБДД
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Старт от Автошколы на пр. Мира, 83 • Реальные знаки и разбор ловушек инспектора
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* User Guide / Instructions Button */}
          <button
            onClick={() => setIsInstructionOpen(true)}
            className="px-2.5 py-1.5 bg-indigo-950/70 hover:bg-indigo-900/70 text-indigo-300 hover:text-white text-xs font-bold rounded-xl border border-indigo-700/60 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            title="Инструкция: как пользоваться приложением"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Инструкция</span>
          </button>

          {/* Start Driving Simulation */}
          <button
            onClick={handleStartDrivingSimulation}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Car className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Поехать от Мира, 83</span>
            <span className="sm:hidden">Поехать</span>
          </button>

          {/* Quiz */}
          <button
            onClick={() => setIsQuizOpen(true)}
            className="hidden lg:flex px-2.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold rounded-xl border border-indigo-500/40 transition-colors items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Квиз</span>
          </button>

          {/* Tactics */}
          <button
            onClick={() => setIsTacticsOpen(true)}
            className="hidden xl:flex px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors items-center gap-1.5 cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>Схемы</span>
          </button>

          {/* Checklist */}
          <button
            onClick={() => setIsChecklistOpen(true)}
            className="hidden xl:flex px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors items-center gap-1.5 cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Чек-лист</span>
          </button>

          {/* Add Real Sign button */}
          <button
            onClick={() => setIsAddingSignMode(prev => !prev)}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              isAddingSignMode
                ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-lg animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/50'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAddingSignMode ? 'Кликните на карте' : '+ Добавить знак'}</span>
            <span className="sm:hidden">+ Знак</span>
          </button>

          {/* Instructor Notes */}
          <button
            onClick={() => setIsNotesDrawerOpen(true)}
            className="px-2.5 py-1.5 bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 text-xs font-semibold rounded-xl border border-purple-800/60 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Блокнот</span>
          </button>
        </div>
      </header>

      {/* Street Turn Assistant Bar (Horizontal scrollable selector) */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar z-25 text-xs">
        <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <CornerDownRight className="w-3.5 h-3.5" />
          <span>Повороты с улицы на улицу:</span>
        </span>

        {NOYABRSK_TURN_ALERTS.map((turn) => {
          const isSelected = selectedTurn?.id === turn.id;
          return (
            <button
              key={turn.id}
              onClick={() => handleSelectTurn(turn)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                  : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <span>{turn.name.split('➔')[0].trim()}</span>
              <span className="text-indigo-400">➔</span>
              <span>{turn.name.split('➔')[1]?.trim() || ''}</span>
              <span className="ml-1 px-1 py-0.2 bg-slate-900 text-amber-300 text-[9px] rounded font-bold">
                {turn.speedLimitAfterTurn} км/ч
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Chips Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar z-20 text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Слои:
          </span>

          {/* Speed Zones */}
          <button
            onClick={() => handleToggleFilter('speedZones')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
              filters.speedZones
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60'
            }`}
          >
            <Gauge className="w-3 h-3 text-amber-400" />
            <span>Скоростной режим (20 / 40 / 60)</span>
          </button>

          {/* All Signs */}
          <button
            onClick={() => handleToggleFilter('signs')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
              filters.signs
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60'
            }`}
          >
            <span>⛔</span>
            <span>Реальные знаки ({signs.length})</span>
          </button>

          {/* Route centerline */}
          <button
            onClick={() => handleToggleFilter('routes')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
              filters.routes
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60'
            }`}
          >
            <Compass className="w-3 h-3 text-blue-400" />
            <span>Маршрут движения</span>
          </button>

          {/* Reset signs */}
          <button
            onClick={handleResetSigns}
            className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded border border-slate-800 hover:border-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
            title="Восстановить исходные знаки"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Сбросить знаки</span>
          </button>

          {/* GIBDD Inspector Traps */}
          <button
            onClick={() => handleToggleFilter('traps')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
              filters.traps
                ? 'bg-amber-600/25 border-amber-500/70 text-amber-200 shadow-sm font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Ловушки ГИБДД ({INSPECTOR_TRAPS.length})</span>
          </button>
        </div>

        {/* Quick jump to Mira 83 */}
        <button
          onClick={() => setFocusCoords(AUTOSHKOLA_LOCATION.coordinates)}
          className="text-[11px] font-bold text-emerald-300 hover:text-emerald-200 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80 flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>К дому Мира, 83</span>
        </button>
      </div>

      {/* Main Fullscreen Map */}
      <main className="flex-1 h-full relative overflow-hidden">
        <MapComponent
          signs={signs}
          routes={EXAM_ROUTES}
          turnAlerts={NOYABRSK_TURN_ALERTS}
          traps={INSPECTOR_TRAPS}
          notes={notes}
          filters={filters}
          selectedRouteId={selectedRoute?.id || null}
          selectedTurnId={selectedTurn?.id || null}
          selectedSignId={selectedSign?.id || null}
          selectedTrapId={selectedTrap?.id || null}
          onSelectSign={handleSelectSign}
          onSelectTurn={handleSelectTurn}
          onSelectTrap={handleSelectTrap}
          onSelectRoute={(route) => setSelectedRoute(route)}
          onAddNoteAtCoords={(coords) => {
            setFocusCoords(coords);
            setIsNotesDrawerOpen(true);
          }}
          onSelectNote={(note) => {
            setFocusCoords(note.coordinates);
            setIsNotesDrawerOpen(true);
          }}
          isAddingSignMode={isAddingSignMode}
          onMapClickForSign={handleMapClickForSign}
          focusCoords={focusCoords}
          simulationStep={isDrivingSimOpen ? DRIVING_SIMULATION_STEPS[simStepIndex] : null}
          onStartSimulation={handleStartDrivingSimulation}
        />

        {/* Live Driving Simulation HUD Widget (When Drive mode is active) */}
        <DrivingSimulatorHUD
          isOpen={isDrivingSimOpen}
          onClose={() => setIsDrivingSimOpen(false)}
          currentStep={DRIVING_SIMULATION_STEPS[simStepIndex]}
          currentStepIndex={simStepIndex}
          totalSteps={DRIVING_SIMULATION_STEPS.length}
          onNextStep={handleNextSimStep}
          onPrevStep={handlePrevSimStep}
          onReset={() => {
            setSimStepIndex(0);
            setFocusCoords(AUTOSHKOLA_LOCATION.coordinates);
          }}
        />

        {/* Bottom Inspector Card (Opens on click on any turn or sign) */}
        {!isDrivingSimOpen && (
          <BottomInspectorCard
            selectedTurn={selectedTurn}
            selectedSign={selectedSign}
            selectedTrap={selectedTrap}
            onClose={handleCloseInspectorCard}
            onDeleteSign={handleDeleteSign}
          />
        )}
      </main>

      {/* Add Real Sign Modal */}
      <AddSignModal
        isOpen={Boolean(pendingSignCoords)}
        onClose={() => setPendingSignCoords(null)}
        pendingCoords={pendingSignCoords}
        onAddSign={handleAddSign}
      />

      {/* Instructor Notepad Drawer */}
      <NotesDrawer
        isOpen={isNotesDrawerOpen}
        onClose={() => setIsNotesDrawerOpen(false)}
        notes={notes}
        onAddNote={(newNoteData) => {
          const newNote: InstructorNote = {
            ...newNoteData,
            id: `note-${Date.now()}`,
            createdAt: new Date().toISOString()
          };
          setNotes(prev => [newNote, ...prev]);
        }}
        onUpdateNote={(updated) => {
          setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
        }}
        onDeleteNote={(id) => {
          setNotes(prev => prev.filter(n => n.id !== id));
        }}
        pendingCoords={null}
        onClearPendingCoords={() => {}}
        onFocusCoordinates={(coords) => setFocusCoords(coords)}
      />

      {/* User Guide / Instructions Modal */}
      <InstructionGuideModal
        isOpen={isInstructionOpen}
        onClose={() => setIsInstructionOpen(false)}
        onStartDrive={handleStartDrivingSimulation}
      />

      {/* GIBDD Inspector Quiz Modal */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onFocusCoordinates={(coords) => setFocusCoords(coords)}
      />

      {/* Intersection Tactics Modal */}
      <IntersectionTacticsModal
        isOpen={isTacticsOpen}
        onClose={() => setIsTacticsOpen(false)}
      />

      {/* Exam Readiness Checklist Modal */}
      <ChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
      />
    </div>
  );
}
