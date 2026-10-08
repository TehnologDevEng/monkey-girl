import React, { useState } from 'react';
import { 
  HelpCircle, 
  X, 
  MapPin, 
  Car, 
  AlertTriangle, 
  Layers, 
  PlusCircle, 
  BookOpen, 
  CheckCircle2, 
  Sparkles,
  Navigation,
  Compass,
  ArrowRight
} from 'lucide-react';

interface InstructionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDrive: () => void;
}

export const InstructionGuideModal: React.FC<InstructionGuideModalProps> = ({
  isOpen,
  onClose,
  onStartDrive
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'map' | 'drive' | 'traps' | 'layers'>('quick');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 flex items-center justify-center text-white shadow-md">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                Как пользоваться тренажером
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-semibold">
                  Ноябрьск • Экзамен ГИБДД
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Краткое руководство для уверенной сдачи практического экзамена
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('quick')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quick'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Главное за 1 минуту</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Карта и знаки</span>
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'drive'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Симулятор поездки</span>
          </button>

          <button
            onClick={() => setActiveTab('traps')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'traps'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Ловушки ГИБДД</span>
          </button>

          <button
            onClick={() => setActiveTab('layers')}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'layers'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Слои и добавление</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 text-sm space-y-4">
          {activeTab === 'quick' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      Старт от Автошколы на пр. Мира, 83
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Нажмите зеленую кнопку <span className="text-emerald-400 font-semibold">«Поехать от Мира, 83»</span> вверху. Приложение шаг за шагом проведет вас по реальному экзаменационному пути с командами инспектора и правилами.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      Кликайте на любой знак или перекресток
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      При нажатии на знак (⛔) или перекресток (⚠️) внизу экрана всплывает карточка с детальным разбором: зона действия, штрафные баллы по регламенту ГИБДД и советы инструктора.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      Быстрое изучение маневров через ленту поворотов
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      В верхней горизонтальной панели выберите нужный поворот (например, <span className="text-indigo-300 font-semibold">Мира ➔ Ленина</span>). Карта моментально приблизит перекресток и покажет скоростной лимит после поворота!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="space-y-3">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-indigo-400">
                  <Navigation className="w-3.5 h-3.5" />
                  Все знаки проверены и привязаны к реальным дорогам
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Все знаки соответствуют реальной дислокации в Ноябрьске: на проспекте Мира, улицах Ленина, Советской, 60 лет СССР, Холмогорской, Дзержинского, Высоцкого, Цоя, Изыскателей, Киевской, Муравленко и Привокзальной. Никаких знаков в воде или за пределами дорог!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-center font-bold">⛔</span>
                    <h4 className="font-semibold text-white text-xs">Знаки по ГОСТу</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Ограничения скорости (20, 40, 60), запрет остановки 3.27, главная дорога 2.1, пешеходные переходы 5.19 и направления движения по полосам 5.15.
                  </p>
                </div>

                <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center font-bold">📍</span>
                    <h4 className="font-semibold text-white text-xs">Дом Мира, 83</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Кнопка «К дому Мира, 83» на панели фильтров быстро возвращает камеру к учебной базе и точке старта.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'drive' && (
            <div className="space-y-3">
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 space-y-2">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
                  <Car className="w-3.5 h-3.5" />
                  Пошаговая симуляция реального экзамена
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  В режиме симуляции внизу экрана появляется навигационный виджет (HUD). На каждом этапе вы видите:
                </p>
                <ul className="text-xs text-slate-300 space-y-1.5 pl-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Команду инспектора:</strong> точная фраза, которую вы услышите от экзаменатора.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Скоростной режим:</strong> актуальная допустимая скорость (20, 40 или 60 км/ч).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Предупреждение об опасности:</strong> где чаще всего допускают критическую ошибку (5 штрафных баллов).</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onStartDrive();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Запустить симулятор прямо сейчас</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'traps' && (
            <div className="space-y-3">
              <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3.5 space-y-2">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Самые опасные экзаменационные ловушки Ноябрьска
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Желтые значки ⚠️ на карте отмечают коварные места, где инспекторы чаще всего ставят несдачу:
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold shrink-0">1</span>
                  <div>
                    <strong className="text-white">Ложный перекресток на Советской (у ТЦ «Русь»):</strong>
                    <p className="text-slate-400 mt-0.5">Широкий асфальтированный выезд — это прилегающая территория, а не перекресток! Знак 40 км/ч здесь НЕ отменяется.</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold shrink-0">2</span>
                  <div>
                    <strong className="text-white">Срезание угла при левом повороте (Мира ➔ Ленина):</strong>
                    <p className="text-slate-400 mt-0.5">Выезжайте до центра перекрестка на прямых колесах. Наезд колесом на воображаемую сплошную полосу = 5 баллов (НЕ СДАНО).</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold shrink-0">3</span>
                  <div>
                    <strong className="text-white">Провокация на остановку у знака 3.27:</strong>
                    <p className="text-slate-400 mt-0.5">Инспектор говорит: «Найдите место и остановитесь». Не поддавайтесь — проедьте до ближайшего перекрестка или кармана без запрета!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'layers' && (
            <div className="space-y-3">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-cyan-400">
                  <Layers className="w-3.5 h-3.5" />
                  Управление слоями карты
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Используйте кнопки под панелью поворотов, чтобы включать или отключать нужные данные:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-amber-300 font-semibold">⚡ Скоростной режим:</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">Включает подсветку зон действия знаков скорости 20, 40 и 60 км/ч вдоль улиц.</p>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-blue-300 font-semibold">🧭 Маршрут движения:</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">Показывает нить маршрута по учебным улицам Ноябрьска.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
                  <PlusCircle className="w-3.5 h-3.5" />
                  Добавление своего знака на карту
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Заметили новый знак на улицах города? Нажмите кнопку <span className="text-amber-300 font-semibold">+ Добавить знак</span> в правом верхнем углу, кликните по карте в нужном месте дороги и выберите тип знака по ГОСТу. Знак мгновенно сохранится!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Инструкция всегда доступна по кнопке «Инструкция» вверху</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Понятно, к карте!
          </button>
        </div>
      </div>
    </div>
  );
};
