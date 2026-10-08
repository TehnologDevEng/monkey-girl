import React from 'react';
import { SignType } from '../types';

interface GostSignIconProps {
  signType: SignType;
  size?: number;
  className?: string;
  showLabel?: boolean;
}

export const GostSignIcon: React.FC<GostSignIconProps> = ({
  signType,
  size = 36,
  className = '',
  showLabel = false
}) => {
  const renderSignSvg = () => {
    switch (signType) {
      // Знак 3.27 - Остановка запрещена
      case '3.27':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#1e40af" stroke="#dc2626" strokeWidth="12" />
            <line x1="20" y1="20" x2="80" y2="80" stroke="#dc2626" strokeWidth="11" strokeLinecap="round" />
            <line x1="80" y1="20" x2="20" y2="80" stroke="#dc2626" strokeWidth="11" strokeLinecap="round" />
          </svg>
        );

      // Знак 3.28 - Стоянка запрещена
      case '3.28':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#1e40af" stroke="#dc2626" strokeWidth="12" />
            <line x1="80" y1="20" x2="20" y2="80" stroke="#dc2626" strokeWidth="11" strokeLinecap="round" />
          </svg>
        );

      // Знак 3.24 - Ограничение скорости 60
      case '3.24_60':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#dc2626" strokeWidth="12" />
            <text x="50" y="62" textAnchor="middle" fontSize="38" fontWeight="900" fontFamily="sans-serif" fill="#0f172a">
              60
            </text>
          </svg>
        );

      // Знак 3.24 - Ограничение скорости 40
      case '3.24_40':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#dc2626" strokeWidth="12" />
            <text x="50" y="62" textAnchor="middle" fontSize="38" fontWeight="900" fontFamily="sans-serif" fill="#0f172a">
              40
            </text>
          </svg>
        );

      // Знак 3.24 - Ограничение скорости 20
      case '3.24_20':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#dc2626" strokeWidth="12" />
            <text x="50" y="62" textAnchor="middle" fontSize="38" fontWeight="900" fontFamily="sans-serif" fill="#0f172a">
              20
            </text>
          </svg>
        );

      // Знак 2.5 - Движение без остановки запрещено (STOP)
      case '2.5':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <polygon points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" fill="#dc2626" stroke="#ffffff" strokeWidth="4" />
            <text x="50" y="58" textAnchor="middle" fontSize="22" fontWeight="900" fontFamily="sans-serif" fill="#ffffff">
              STOP
            </text>
          </svg>
        );

      // Знак 5.16 - Место остановки автобуса
      case '5.16':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <rect x="15" y="10" width="70" height="80" rx="6" fill="#2563eb" stroke="#ffffff" strokeWidth="3" />
            <rect x="25" y="20" width="50" height="35" rx="4" fill="#ffffff" />
            <rect x="30" y="26" width="40" height="18" rx="2" fill="#2563eb" />
            <circle cx="36" cy="50" r="3.5" fill="#0f172a" />
            <circle cx="64" cy="50" r="3.5" fill="#0f172a" />
            <text x="50" y="78" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ffffff">15м</text>
          </svg>
        );

      // Знак 5.5 - Дорога с односторонним движением
      case '5.5':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <rect x="10" y="10" width="80" height="80" rx="8" fill="#2563eb" stroke="#ffffff" strokeWidth="4" />
            <line x1="50" y1="76" x2="50" y2="28" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
            <polyline points="32,44 50,22 68,44" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      // Знак 2.1 - Главная дорога
      case '2.1':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <rect x="25" y="25" width="50" height="50" fill="#facc15" stroke="#ffffff" strokeWidth="12" transform="rotate(45 50 50)" />
            <rect x="26" y="26" width="48" height="48" fill="none" stroke="#0f172a" strokeWidth="2" transform="rotate(45 50 50)" />
          </svg>
        );

      // Знак 2.4 - Уступите дорогу
      case '2.4':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <polygon points="50,88 12,18 88,18" fill="#ffffff" stroke="#dc2626" strokeWidth="10" strokeLinejoin="round" />
          </svg>
        );

      // Знак 5.19.1 - Пешеходный переход
      case '5.19.1':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <rect x="8" y="8" width="84" height="84" rx="8" fill="#2563eb" />
            <polygon points="50,16 16,80 84,80" fill="#ffffff" />
            {/* Силуэт человека и полосы перехода */}
            <circle cx="50" cy="34" r="5" fill="#0f172a" />
            <path d="M47 41 L53 41 L55 53 L58 64 M47 50 L42 64 M45 44 L39 52" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            <line x1="28" y1="73" x2="72" y2="73" stroke="#2563eb" strokeWidth="4" />
            <line x1="33" y1="67" x2="67" y2="67" stroke="#2563eb" strokeWidth="4" />
          </svg>
        );

      // Знак 1.23 - Дети
      case '1.23':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <polygon points="50,14 10,84 90,84" fill="#ffffff" stroke="#dc2626" strokeWidth="9" strokeLinejoin="round" />
            <circle cx="45" cy="45" r="4" fill="#0f172a" />
            <circle cx="58" cy="40" r="3.5" fill="#0f172a" />
            <path d="M43 51 L46 64 M58 45 L58 60 M46 54 L56 50" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      // Знак 5.15 - Направления движения по полосам
      case '5.15':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <rect x="8" y="15" width="84" height="70" rx="8" fill="#2563eb" stroke="#ffffff" strokeWidth="3" />
            <path d="M30 65 L30 35 L24 42 M30 35 L36 42" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            <path d="M70 65 L70 45 Q70 35 60 35 L54 35 M58 30 L52 35 L58 40" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="22" x2="50" y2="78" stroke="#ffffff" strokeWidth="2" strokeDasharray="4,4" />
          </svg>
        );

      // Знак 1.17 - Искусственная неровность (Лежачий полицейский)
      case '1.17':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <polygon points="50,14 10,84 90,84" fill="#ffffff" stroke="#dc2626" strokeWidth="9" strokeLinejoin="round" />
            <path d="M26 68 Q 38 68 44 56 Q 50 48 56 56 Q 62 68 74 68" fill="none" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );

      // Знак 4.1.1 - Движение прямо
      case '4.1.1':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#2563eb" stroke="#ffffff" strokeWidth="4" />
            <line x1="50" y1="72" x2="50" y2="30" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
            <polyline points="34,44 50,24 66,44" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      // Знак 4.1.2 - Движение направо
      case '4.1.2':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#2563eb" stroke="#ffffff" strokeWidth="4" />
            <path d="M36 68 L36 48 Q36 34 50 34 L68 34 M56 22 L72 34 L56 46" fill="none" stroke="#ffffff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      // Знак 4.1.4 - Движение прямо или направо
      case '4.1.4':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#2563eb" stroke="#ffffff" strokeWidth="4" />
            <line x1="42" y1="72" x2="42" y2="30" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
            <polyline points="30,42 42,26 54,42" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M42 54 Q42 42 56 42 L70 42 M60 32 L72 42 L60 52" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      // Знак 3.18.1 - Поворот направо запрещен
      case '3.18.1':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#dc2626" strokeWidth="10" />
            <path d="M38 66 L38 50 Q38 40 50 40 L64 40 M54 32 L66 40 L54 48" fill="none" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="22" y1="22" x2="78" y2="78" stroke="#dc2626" strokeWidth="10" strokeLinecap="round" />
          </svg>
        );

      // Знак 3.18.2 - Поворот налево запрещен
      case '3.18.2':
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#dc2626" strokeWidth="10" />
            <path d="M62 66 L62 50 Q62 40 50 40 L36 40 M46 32 L34 40 L46 48" fill="none" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="78" y1="22" x2="22" y2="78" stroke="#dc2626" strokeWidth="10" strokeLinecap="round" />
          </svg>
        );

      // Знак 3.1 - Въезд запрещен ("Кирпич")
      case '3.1':
      default:
        return (
          <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
            <circle cx="50" cy="50" r="46" fill="#dc2626" stroke="#ffffff" strokeWidth="4" />
            <rect x="24" y="42" width="52" height="16" rx="2" fill="#ffffff" />
          </svg>
        );
    }
  };

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {renderSignSvg()}
      {showLabel && (
        <span className="text-[10px] font-semibold text-slate-300 mt-1 whitespace-nowrap">
          {signType.replace('_', ' ')}
        </span>
      )}
    </div>
  );
};

/**
 * Returns raw inline SVG markup for use in Leaflet L.divIcon
 */
export function getGostSignSvgHtml(signType: SignType, size: number = 32): string {
  switch (signType) {
    case '3.27':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><circle cx="50" cy="50" r="46" fill="#1e40af" stroke="#dc2626" stroke-width="12" /><line x1="20" y1="20" x2="80" y2="80" stroke="#dc2626" stroke-width="11" stroke-linecap="round" /><line x1="80" y1="20" x2="20" y2="80" stroke="#dc2626" stroke-width="11" stroke-linecap="round" /></svg>`;
    case '3.28':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><circle cx="50" cy="50" r="46" fill="#1e40af" stroke="#dc2626" stroke-width="12" /><line x1="80" y1="20" x2="20" y2="80" stroke="#dc2626" stroke-width="11" stroke-linecap="round" /></svg>`;
    case '3.24_60':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#dc2626" stroke-width="12" /><text x="50" y="62" text-anchor="middle" font-size="38" font-weight="900" font-family="sans-serif" fill="#0f172a">60</text></svg>`;
    case '3.24_40':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#dc2626" stroke-width="12" /><text x="50" y="62" text-anchor="middle" font-size="38" font-weight="900" font-family="sans-serif" fill="#0f172a">40</text></svg>`;
    case '3.24_20':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#dc2626" stroke-width="12" /><text x="50" y="62" text-anchor="middle" font-size="38" font-weight="900" font-family="sans-serif" fill="#0f172a">20</text></svg>`;
    case '2.1':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><rect x="25" y="25" width="50" height="50" fill="#facc15" stroke="#ffffff" stroke-width="12" transform="rotate(45 50 50)" /><rect x="26" y="26" width="48" height="48" fill="none" stroke="#0f172a" stroke-width="2" transform="rotate(45 50 50)" /></svg>`;
    case '2.4':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><polygon points="50,88 12,18 88,18" fill="#ffffff" stroke="#dc2626" stroke-width="10" stroke-linejoin="round" /></svg>`;
    case '2.5':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><polygon points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" fill="#dc2626" stroke="#ffffff" stroke-width="4" /><text x="50" y="58" text-anchor="middle" font-size="22" font-weight="900" font-family="sans-serif" fill="#ffffff">STOP</text></svg>`;
    case '5.19.1':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><rect x="8" y="8" width="84" height="84" rx="8" fill="#2563eb" stroke="#ffffff" stroke-width="3" /><polygon points="50,16 16,80 84,80" fill="#ffffff" /><circle cx="50" cy="34" r="5" fill="#0f172a" /><path d="M47 41 L53 41 L55 53 L58 64 M47 50 L42 64 M45 44 L39 52" stroke="#0f172a" stroke-width="3" stroke-linecap="round" /><line x1="28" y1="73" x2="72" y2="73" stroke="#2563eb" stroke-width="4" /><line x1="33" y1="67" x2="67" y2="67" stroke="#2563eb" stroke-width="4" /></svg>`;
    case '1.17':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><polygon points="50,14 10,84 90,84" fill="#ffffff" stroke="#dc2626" stroke-width="9" stroke-linejoin="round" /><path d="M26 68 Q 38 68 44 56 Q 50 48 56 56 Q 62 68 74 68" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round" /></svg>`;
    case '1.23':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><polygon points="50,14 10,84 90,84" fill="#ffffff" stroke="#dc2626" stroke-width="9" stroke-linejoin="round" /><circle cx="45" cy="45" r="4" fill="#0f172a" /><circle cx="58" cy="40" r="3.5" fill="#0f172a" /><path d="M43 51 L46 64 M58 45 L58 60 M46 54 L56 50" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" /></svg>`;
    case '4.1.1':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><circle cx="50" cy="50" r="46" fill="#2563eb" stroke="#ffffff" stroke-width="4" /><line x1="50" y1="72" x2="50" y2="30" stroke="#ffffff" stroke-width="10" stroke-linecap="round" /><polyline points="34,44 50,24 66,44" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
    case '4.1.2':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><circle cx="50" cy="50" r="46" fill="#2563eb" stroke="#ffffff" stroke-width="4" /><path d="M36 68 L36 48 Q36 34 50 34 L68 34 M56 22 L72 34 L56 46" fill="none" stroke="#ffffff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
    case '4.1.4':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><circle cx="50" cy="50" r="46" fill="#2563eb" stroke="#ffffff" stroke-width="4" /><line x1="42" y1="72" x2="42" y2="30" stroke="#ffffff" stroke-width="8" stroke-linecap="round" /><polyline points="30,42 42,26 54,42" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" /><path d="M42 54 Q42 42 56 42 L70 42 M60 32 L72 42 L60 52" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
    case '5.15':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><rect x="8" y="15" width="84" height="70" rx="8" fill="#2563eb" stroke="#ffffff" stroke-width="3" /><path d="M30 65 L30 35 L24 42 M30 35 L36 42" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" /><path d="M70 65 L70 45 Q70 35 60 35 L54 35 M58 30 L52 35 L58 40" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" /><line x1="50" y1="22" x2="50" y2="78" stroke="#ffffff" stroke-width="2" stroke-dasharray="4,4" /></svg>`;
    case '5.16':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><rect x="15" y="10" width="70" height="80" rx="6" fill="#2563eb" stroke="#ffffff" stroke-width="3" /><rect x="25" y="20" width="50" height="35" rx="4" fill="#ffffff" /><rect x="30" y="26" width="40" height="18" rx="2" fill="#2563eb" /><circle cx="36" cy="50" r="3.5" fill="#0f172a" /><circle cx="64" cy="50" r="3.5" fill="#0f172a" /><text x="50" y="78" text-anchor="middle" font-size="14" font-weight="bold" fill="#ffffff">15м</text></svg>`;
    case '5.5':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><rect x="10" y="10" width="80" height="80" rx="8" fill="#2563eb" stroke="#ffffff" stroke-width="4" /><line x1="50" y1="76" x2="50" y2="28" stroke="#ffffff" stroke-width="12" stroke-linecap="round" /><polyline points="32,44 50,22 68,44" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
    case '3.18.1':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#dc2626" stroke-width="10" /><path d="M38 66 L38 50 Q38 40 50 40 L64 40 M54 32 L66 40 L54 48" fill="none" stroke="#0f172a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" /><line x1="22" y1="22" x2="78" y2="78" stroke="#dc2626" stroke-width="10" stroke-linecap="round" /></svg>`;
    case '3.18.2':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#dc2626" stroke-width="10" /><path d="M62 66 L62 50 Q62 40 50 40 L36 40 M46 32 L34 40 L46 48" fill="none" stroke="#0f172a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" /><line x1="78" y1="22" x2="22" y2="78" stroke="#dc2626" stroke-width="10" stroke-linecap="round" /></svg>`;
    case '3.1':
    default:
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" class="drop-shadow-lg"><circle cx="50" cy="50" r="46" fill="#dc2626" stroke="#ffffff" stroke-width="4" /><rect x="24" y="42" width="52" height="16" rx="2" fill="#ffffff" /></svg>`;
  }
}
