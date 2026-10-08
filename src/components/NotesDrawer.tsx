import React, { useState } from 'react';
import { InstructorNote } from '../types';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  BookOpen, 
  Download, 
  Upload, 
  Compass, 
  MapPin, 
  Check, 
  Sparkles 
} from 'lucide-react';

interface NotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notes: InstructorNote[];
  onAddNote: (note: Omit<InstructorNote, 'id' | 'createdAt'>) => void;
  onUpdateNote: (note: InstructorNote) => void;
  onDeleteNote: (id: string) => void;
  pendingCoords: [number, number] | null;
  onClearPendingCoords: () => void;
  onFocusCoordinates: (coords: [number, number]) => void;
}

export const NotesDrawer: React.FC<NotesDrawerProps> = ({
  isOpen,
  onClose,
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  pendingCoords,
  onClearPendingCoords,
  onFocusCoordinates
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [category, setCategory] = useState<InstructorNote['category']>('advice');
  const [formCoords, setFormCoords] = useState<[number, number]>(pendingCoords || [63.1975, 75.4540]);

  // If pendingCoords change (e.g. user clicked map), open creation form
  React.useEffect(() => {
    if (pendingCoords) {
      setFormCoords(pendingCoords);
      setIsEditing(true);
      setEditingId(null);
      setTitle('');
      setText('');
      setInstructorName('');
      setCategory('advice');
    }
  }, [pendingCoords]);

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setIsEditing(true);
    setEditingId(null);
    setTitle('');
    setText('');
    setInstructorName('');
    setCategory('advice');
    setFormCoords([63.1975, 75.4540]);
  };

  const handleStartEdit = (note: InstructorNote) => {
    setIsEditing(true);
    setEditingId(note.id);
    setTitle(note.title);
    setText(note.text);
    setInstructorName(note.instructorName || '');
    setCategory(note.category);
    setFormCoords(note.coordinates);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;

    if (editingId) {
      const existing = notes.find(n => n.id === editingId);
      if (existing) {
        onUpdateNote({
          ...existing,
          title: title.trim(),
          text: text.trim(),
          instructorName: instructorName.trim() || undefined,
          category,
          coordinates: formCoords
        });
      }
    } else {
      onAddNote({
        title: title.trim(),
        text: text.trim(),
        instructorName: instructorName.trim() || undefined,
        category,
        coordinates: formCoords
      });
    }

    setIsEditing(false);
    setEditingId(null);
    onClearPendingCoords();
  };

  const handleApplyTemplate = (tplTitle: string, tplText: string, tplCategory: InstructorNote['category']) => {
    setTitle(tplTitle);
    setText(tplText);
    setCategory(tplCategory);
  };

  // Export / Import
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `noyabrsk_notes_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          imported.forEach((item: any) => {
            if (item.title && item.text && item.coordinates) {
              onAddNote({
                title: item.title,
                text: item.text,
                instructorName: item.instructorName,
                category: item.category || 'advice',
                coordinates: item.coordinates
              });
            }
          });
        }
      } catch (err) {
        console.error('Import error', err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              Личный блокнот автоинструктора
            </h2>
            <p className="text-[11px] text-slate-400">
              Советы, точки и ориентиры твоей автошколы
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              onClick={handleStartCreate}
              className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Заметка</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {isEditing ? (
          /* Form for Add/Edit */
          <form onSubmit={handleSubmit} className="space-y-3.5 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">
                {editingId ? 'Редактировать заметку' : 'Новая заметка от инструктора'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  onClearPendingCoords();
                }}
                className="text-slate-400 hover:text-slate-200 text-xs"
              >
                Отмена
              </button>
            </div>

            {/* Quick Templates */}
            <div>
              <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-purple-400" /> Быстрые шаблоны частых ошибок:
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('Осторожно: знак 3.27!', 'Инструктор предупредил: инспекторы на этом отрезке просят прижаться к краю. Ни в коем случае не останавливаться!', 'warning')}
                  className="bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/60 px-2 py-1 rounded text-[10px] cursor-pointer"
                >
                  🚫 Знак 3.27
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('Левый поворот: не срезай угол!', 'Держать колеса прямо до центра перекрестка, руль закручивать строго под прямым углом (п. 8.6 ПДД).', 'warning')}
                  className="bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/60 px-2 py-1 rounded text-[10px] cursor-pointer"
                >
                  📐 Не срезай угол
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('Зимняя колея: раннее торможение', 'Перед пешеходным переходом и неровностью накат льда. Начинать торможение за 35 метров двигателем!', 'advice')}
                  className="bg-sky-950/40 hover:bg-sky-900/50 text-sky-300 border border-sky-800/60 px-2 py-1 rounded text-[10px] cursor-pointer"
                >
                  ❄️ Зимняя колея
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('Удобное место для разворота', 'Использовать прилегающий карман справа: заезд задним ходом под углом 90 градусов.', 'u_turn')}
                  className="bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-800/60 px-2 py-1 rounded text-[10px] cursor-pointer"
                >
                  🔄 Разворот справа
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Название точки / ориентир:
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Например: Перекресток Мира и Ленина — совет инструктора"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Категория метки:
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="warning">⚠️ Опасное место / Ловушка</option>
                <option value="advice">💡 Совет и лайфхак инструктора</option>
                <option value="parking">🅿️ Безопасное место для остановки</option>
                <option value="u_turn">🔄 Точка для удобного разворота</option>
                <option value="sign">⛔ Специфический знак</option>
              </select>
            </div>

            {/* Instructor Name */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Имя инструктора (опционально):
              </label>
              <input
                type="text"
                value={instructorName}
                onChange={e => setInstructorName(e.target.value)}
                placeholder="Например: Иван Сергеевич (Автошкола «Норд»)"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Note text */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Что именно сказал инструктор:
              </label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={3}
                placeholder="Запиши точные слова, передачи, ориентиры по столбам или сугробам..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            {/* Coordinates info */}
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-purple-400" />
              <span>Координаты на карте: {formCoords[0].toFixed(4)}, {formCoords[1].toFixed(4)}</span>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  onClearPendingCoords();
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{editingId ? 'Сохранить изменения' : 'Добавить метку'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Notes List */
          <div className="space-y-3">
            {notes.length === 0 ? (
              <div className="text-center py-10 px-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-900/30 text-purple-400 border border-purple-800 flex items-center justify-center mx-auto text-xl">
                  📝
                </div>
                <h4 className="font-bold text-white text-sm">Блокнот пока пуст</h4>
                <p className="text-slate-400 text-xs max-w-xs mx-auto">
                  Кликни в любое место на карте Ноябрьска или нажми «Заметка», чтобы зафиксировать совет реального автоинструктора!
                </p>
                <button
                  onClick={handleStartCreate}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Добавить первую заметку
                </button>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 rounded-xl p-3.5 space-y-2 transition-all shadow-md group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {note.category === 'warning' ? '⚠️' : note.category === 'parking' ? '🅿️' : note.category === 'u_turn' ? '🔄' : '💡'}
                      </span>
                      <h4 className="font-bold text-white text-xs leading-snug">
                        {note.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => {
                          onFocusCoordinates(note.coordinates);
                          onClose();
                        }}
                        title="Показать на карте"
                        className="p-1 text-slate-400 hover:text-indigo-400 rounded cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleStartEdit(note)}
                        title="Редактировать"
                        className="p-1 text-slate-400 hover:text-purple-400 rounded cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        title="Удалить"
                        className="p-1 text-slate-400 hover:text-rose-400 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    «{note.text}»
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    {note.instructorName && (
                      <span className="text-purple-300/80 font-medium">
                        От: {note.instructorName}
                      </span>
                    )}
                    <span>{new Date(note.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer Tools: Export & Import */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="text-[11px]">Всего заметок: {notes.length}</span>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center gap-1">
            <Upload className="w-3 h-3" /> Импорт
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>
          <button
            onClick={handleExportJson}
            disabled={notes.length === 0}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3 h-3" /> Экспорт
          </button>
        </div>
      </div>
    </div>
  );
};
