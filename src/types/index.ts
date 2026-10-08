export type TrapCategory = 
  | 'courtyard_exit'      // Широкий выезд со двора (не перекресток)
  | 'left_turn_corner'    // Срезание угла при левом повороте (п. 8.6)
  | 'winter_crosswalk'    // Зимний переход (разметку замело, граница по знакам)
  | 'stop_provocation'    // Команда "остановитесь" в зоне запрета 3.27
  | 'speed_ladder'        // Ступенчатое ограничение 40 -> 20 + неровность
  | 'u_turn_limited'      // Разворот в ограниченном пространстве / с прилегающей
  | 'roundabout_lane';    // Перестроение и рядность

export interface InspectorTrap {
  id: string;
  title: string;
  street: string;
  category: TrapCategory;
  coordinates: [number, number]; // [lat, lng]
  inspectorQuote: string;        // Что говорит инспектор: "Выберите место и остановитесь"
  fatalMistake: string;          // На чем сыпятся: "Останавливаются под 3.27..."
  pddRule: string;               // Пункт ПДД (например, "п. 8.6 ПДД РФ", "п. 12.4 ПДД РФ")
  penaltyPoints: number;         // 5 или 7 штрафных баллов (грубое нарушение)
  correctAction: string;         // Как сделать идеально
  instructorSecretTip: string;   // Лайфхак от местного инструктора
  winterSpecificNotice?: string; // Зимняя специфика Ноябрьска (сугробы, колея, снег)
  importance: 'high' | 'critical';
}

export type SignType = 
  | '3.27'   // Остановка запрещена
  | '3.28'   // Стоянка запрещена
  | '3.24_60'// Ограничение 60
  | '3.24_40'// Ограничение 40
  | '3.24_20'// Ограничение 20
  | '2.1'    // Главная дорога
  | '2.4'    // Уступи дорогу
  | '2.5'    // STOP Движение без остановки запрещено
  | '5.19.1' // Пешеходный переход
  | '1.17'   // Искусственная неровность (лежачий полицейский)
  | '1.23'   // Дети
  | '4.1.1'  // Движение прямо
  | '4.1.2'  // Движение направо
  | '4.1.4'  // Движение прямо или направо
  | '3.18.1' // Поворот направо запрещен
  | '3.18.2' // Поворот налево запрещен
  | '5.15'   // Направления движения по полосам
  | '5.16'   // Место остановки автобуса (15м зона)
  | '5.5'    // Одностороннее движение
  | '3.1';   // Въезд запрещен ("кирпич")

export interface DrivingSimulationPoint {
  id: string;
  stepNumber: number;
  streetName: string;
  speedLimit: 20 | 40 | 60;
  coordinates: [number, number];
  activeSigns: SignType[];
  inspectorCommand?: string;
  drivingAdvice: string;
  dangerAlert?: string;
}

export interface RoadSignItem {
  id: string;
  signType: SignType;
  name: string;
  street: string;
  coordinates: [number, number];
  description: string;
  actionZone?: {
    endCoordinates: [number, number];
    cancelledBy: 'nearest_intersection' | 'end_sign' | 'city_end';
    description: string;
  };
}

export interface RouteCheckpoint {
  id: string;
  name: string;
  instruction: string;
  dangerNote?: string;
  coordinates: [number, number];
}

export interface ExamRoute {
  id: string;
  number: number;
  name: string;
  description: string;
  distanceKm: number;
  difficulty: 'Средняя' | 'Повышенная' | 'Высокая';
  color: string;
  waypoints: [number, number][];
  checkpoints: RouteCheckpoint[];
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  penaltyPoints: number; // 0, 1, 3, 5
  explanation: string;
}

export interface QuizScenario {
  id: string;
  title: string;
  street: string;
  coordinates: [number, number];
  inspectorCommand: string;
  situationContext: string;
  winterContext?: string;
  options: QuizOption[];
  correctRuleReference: string;
  proTip: string;
}

export interface InstructorNote {
  id: string;
  title: string;
  text: string;
  instructorName?: string;
  coordinates: [number, number];
  category: 'warning' | 'advice' | 'sign' | 'parking' | 'u_turn';
  createdAt: string;
}

export interface LayerFilters {
  traps: boolean;
  signs: boolean;
  routes: boolean;
  speedZones: boolean;
  notes: boolean;
  winterMode: boolean;
}
