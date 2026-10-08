import React, { useState, useEffect } from 'react';
import { QuizScenario, QuizOption } from '../types';
import { QUIZ_SCENARIOS } from '../data/quizData';
import confetti from 'canvas-confetti';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Clock, 
  Compass, 
  ShieldAlert, 
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFocusCoordinates: (coords: [number, number]) => void;
  initialScenarioId?: string;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  onFocusCoordinates,
  initialScenarioId
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [totalPenaltyPoints, setTotalPenaltyPoints] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Set initial scenario if passed
  useEffect(() => {
    if (initialScenarioId) {
      const idx = QUIZ_SCENARIOS.findIndex(s => s.id === initialScenarioId);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [initialScenarioId]);

  // Current scenario
  const scenario = QUIZ_SCENARIOS[currentIndex];

  // Pan map camera to scenario intersection
  useEffect(() => {
    if (isOpen && scenario) {
      onFocusCoordinates(scenario.coordinates);
    }
  }, [isOpen, scenario, onFocusCoordinates]);

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(40);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsTimerActive(true);
  }, [currentIndex]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || !isTimerActive || isAnswered || isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time expired -> count as timeout
          handleOptionSelect({
            id: 'timeout',
            text: 'Время на принятие решения истекло!',
            isCorrect: false,
            penaltyPoints: 5,
            explanation: 'В реальном экзамене замешательство более 30 секунд при движении в потоке расценивается как неуверенное управление и создание помехи (5 баллов).'
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isTimerActive, isAnswered, isCompleted]);

  // Celebrate with confetti if passed (<7 penalty points)
  useEffect(() => {
    if (isCompleted && totalPenaltyPoints < 7) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [isCompleted, totalPenaltyPoints]);

  if (!isOpen || !scenario) return null;

  const handleOptionSelect = (option: QuizOption) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    setIsTimerActive(false);
    setTotalPenaltyPoints(prev => prev + option.penaltyPoints);
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_SCENARIOS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setTotalPenaltyPoints(0);
    setIsCompleted(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(40);
    setIsTimerActive(true);
  };

  const isFailed = totalPenaltyPoints >= 7;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header bar */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Экзаменатор ГИБДД: Тренажер ситуаций
              </h2>
              <p className="text-[11px] text-slate-400">
                Город Ноябрьск • Ситуация {currentIndex + 1} из {QUIZ_SCENARIOS.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Penalty meter */}
            <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${
              totalPenaltyPoints === 0 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : totalPenaltyPoints < 7 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Штраф: {totalPenaltyPoints} б.</span>
            </div>

            {/* Timer */}
            {!isCompleted && !isAnswered && (
              <div className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${
                timeLeft <= 10 ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}c</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1.5">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-300"
            style={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / QUIZ_SCENARIOS.length) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-200">
          {!isCompleted ? (
            <>
              {/* Street & Situation info */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold mb-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{scenario.street}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {scenario.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {scenario.situationContext}
                </p>
                {scenario.winterContext && (
                  <div className="mt-2 text-xs text-sky-300 bg-sky-950/40 border border-sky-800/40 rounded-lg p-2 flex items-start gap-1.5">
                    <span className="shrink-0 text-sm">❄️</span>
                    <span><strong>Зимний фактор:</strong> {scenario.winterContext}</span>
                  </div>
                )}
              </div>

              {/* Inspector Voice Command */}
              <div className="bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/20 border border-amber-500/40 rounded-xl p-4 shadow-inner">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                  <span className="animate-pulse">🎙️</span> Команда экзаменатора ГИБДД:
                </div>
                <div className="text-base font-semibold text-amber-100 italic">
                  {scenario.inspectorCommand}
                </div>
              </div>

              {/* Choices */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Ваши действия:
                </div>
                {scenario.options.map((option, idx) => {
                  let optionClass = 'bg-slate-800/80 hover:bg-slate-750 border-slate-700 text-slate-200';
                  
                  if (isAnswered) {
                    if (option.isCorrect) {
                      optionClass = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                    } else if (selectedOption?.id === option.id) {
                      optionClass = 'bg-rose-950/60 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                    } else {
                      optionClass = 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${optionClass}`}
                    >
                      <div className="w-6 h-6 rounded-lg bg-slate-900/60 border border-slate-700/80 flex items-center justify-center shrink-0 text-xs font-bold text-slate-300">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="flex-1 leading-snug">{option.text}</span>
                      {isAnswered && option.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && selectedOption?.id === option.id && !option.isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback after answer */}
              {isAnswered && selectedOption && (
                <div className={`p-4 rounded-xl border animate-in slide-in-from-bottom-2 text-xs space-y-2 ${
                  selectedOption.isCorrect 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {selectedOption.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Правильно! 0 штрафных баллов</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Ошибка! +{selectedOption.penaltyPoints} штрафных баллов</span>
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed text-slate-200">{selectedOption.explanation}</p>
                  <div className="pt-1 text-[11px] text-slate-300/80 font-mono">
                    📖 <strong>Пункт ПДД:</strong> {scenario.correctRuleReference}
                  </div>
                  <div className="pt-1 text-[11px] text-purple-300 italic">
                    💡 <strong>Совет инструктора:</strong> {scenario.proTip}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Completed Screen */
            <div className="py-6 text-center space-y-5">
              <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center border-4 shadow-2xl">
                {!isFailed ? (
                  <div className="w-full h-full rounded-full bg-emerald-500/20 border-emerald-500 flex items-center justify-center text-emerald-400 text-3xl">
                    🎉
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-rose-500/20 border-rose-500 flex items-center justify-center text-rose-400 text-3xl">
                    🛑
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {!isFailed ? 'ЭКЗАМЕН СДАН! 🥳' : 'ЭКЗАМЕН НЕ СДАН 😔'}
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  {!isFailed 
                    ? `Ты набрала всего ${totalPenaltyPoints} штрафных баллов (лимит 7). В Ноябрьске ты будешь чувствовать себя максимально уверенно!`
                    : `Набрано ${totalPenaltyPoints} штрафных баллов (при лимите 7). Главное не расстраиваться — разбери ловушки на карте и попробуй еще раз!`}
                </p>
              </div>

              <div className="inline-flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <div className="text-slate-400">Штрафные баллы</div>
                  <div className={`text-xl font-bold ${!isFailed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {totalPenaltyPoints} / 7
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <div className="text-slate-400">Пройдено ситуаций</div>
                  <div className="text-xl font-bold text-indigo-400">
                    {QUIZ_SCENARIOS.length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-5 py-4 border-t border-slate-800 flex items-center justify-between">
          {!isCompleted ? (
            <>
              <div className="text-xs text-slate-400">
                {isAnswered ? 'Ознакомьтесь с комментарием' : 'Выберите наиболее безопасное действие'}
              </div>
              {isAnswered && (
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>{currentIndex < QUIZ_SCENARIOS.length - 1 ? 'Следующая ситуация' : 'Завершить экзамен'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Пройти заново</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Вернуться к карте
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
