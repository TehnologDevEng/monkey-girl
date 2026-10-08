import React, { useState } from 'react';
import { SignType, RoadSignItem } from '../types';
import { GostSignIcon } from './GostSignIcon';
import { X, Plus, MapPin } from 'lucide-react';

interface AddSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingCoords: [number, number] | null;
  onAddSign: (sign: RoadSignItem) => void;
}

const AVAILABLE_SIGNS: { type: SignType; label: string }[] = [
  { type: '3.24_20', label: 'Ограничение 20 км/ч' },
  { type: '3.24_40', label: 'Ограничение 40 км/ч' },
  { type: '3.24_60', label: 'Ограничение 60 км/ч' },
  { type: '2.1', label: 'Главная дорога' },
  { type: '2.4', label: 'Уступите дорогу' },
  { type: '3.27', label: 'Остановка запрещена' },
  { type: '3.28', label: 'Стоянка запрещена' },
  { type: '5.19.1', label: 'Пешеходный переход' },
  { type: '1.17', label: 'Искусственная неровность' },
  { type: '4.1.1', label: 'Движение только прямо' },
  { type: '4.1.2', label: 'Движение направо' },
  { type: '4.1.4', label: 'Движение прямо или направо' },
  { type: '5.15', label: 'Полосы движения' },
  { type: '3.1', label: 'Въезд запрещен (Кирпич)' },
  { type: '2.5', label: 'STOP (Без остановки запрещено)' }
];

export const AddSignModal: React.FC<AddSignModalProps> = ({
  isOpen,
  onClose,
  pendingCoords,
  onAddSign
}) => {
  const [selectedType, setSelectedType] = useState<SignType>('3.24_40');
  const [street, setStreet] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen || !pendingCoords) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const signMeta = AVAILABLE_SIGNS.find(s => s.type === selectedType);

    const newSign: RoadSignItem = {
      id: `custom-sign-${Date.now()}`,
      signType: selectedType,
      name: signMeta ? `${selectedType} «${signMeta.label}»` : selectedType,
      street: street.trim() || 'Улица Ноябрьска',
      coordinates: pendingCoords,
      description: description.trim() || `Реальный знак, установленный на перекрестке.`
    };

    onAddSign(newSign);
    setStreet('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 select-none">
      <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Добавить реальный дорожный знак
              </h3>
              <p className="text-[11px] text-emerald-300 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Координаты: {pendingCoords[0].toFixed(5)}, {pendingCoords[1].toFixed(5)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {/* Sign picker */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 text-[11px]">
              Выберите знак по ГОСТ:
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {AVAILABLE_SIGNS.map(s => {
                const isSelected = selectedType === s.type;
                return (
                  <button
                    key={s.type}
                    type="button"
                    onClick={() => setSelectedType(s.type)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-md ring-1 ring-emerald-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <GostSignIcon signType={s.type} size={30} />
                    <span className="text-[9px] font-bold text-center line-clamp-1 leading-tight">
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Street name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-[11px]">
              Улица / Перекресток:
            </label>
            <input
              type="text"
              required
              placeholder="Например: Перекресток пр. Мира и ул. Ленина"
              value={street}
              onChange={e => setStreet(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-[11px]">
              Описание или ориентир (на какой полосе стоит, куда действует):
            </label>
            <textarea
              rows={2}
              placeholder="Например: Установлен на правой стороне перед перекрестком, действует до светофора."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-600 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-xs cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Поставить на карту</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
