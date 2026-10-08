import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { RoadSignItem, ExamRoute, InstructorNote, LayerFilters, DrivingSimulationPoint, SignType, InspectorTrap } from '../types';
import { TurnAlertItem } from '../data/turnsData';
import { AUTOSHKOLA_LOCATION } from '../data/signsData';
import { getGostSignSvgHtml } from './GostSignIcon';
import { Layers, MapPin, Compass, Car, Navigation } from 'lucide-react';

interface MapComponentProps {
  signs: RoadSignItem[];
  routes: ExamRoute[];
  turnAlerts: TurnAlertItem[];
  traps?: InspectorTrap[];
  notes: InstructorNote[];
  filters: LayerFilters;
  selectedRouteId: string | null;
  selectedTurnId: string | null;
  selectedSignId: string | null;
  selectedTrapId?: string | null;
  onSelectSign: (sign: RoadSignItem) => void;
  onSelectTurn: (turn: TurnAlertItem) => void;
  onSelectTrap?: (trap: InspectorTrap) => void;
  onSelectRoute: (route: ExamRoute) => void;
  onAddNoteAtCoords?: (coords: [number, number]) => void;
  onSelectNote?: (note: InstructorNote) => void;
  isAddingSignMode?: boolean;
  onMapClickForSign?: (coords: [number, number]) => void;
  focusCoords: [number, number] | null;
  simulationStep?: DrivingSimulationPoint | null;
  onStartSimulation?: () => void;
}

type TileProvider = 'osm_de' | 'esri_street' | 'osm_standard' | 'satellite';

const TILE_SERVERS: Record<TileProvider, { name: string; url: string; subdomains: string; maxZoom: number; attribution: string }> = {
  osm_de: {
    name: 'Карта Ноябрьска (OSM)',
    url: 'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
    subdomains: '',
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  },
  esri_street: {
    name: 'Городские улицы (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    subdomains: '',
    maxZoom: 18,
    attribution: '&copy; Esri World Street Map'
  },
  osm_standard: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: 'abc',
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  },
  satellite: {
    name: 'Спутниковый вид',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    subdomains: '',
    maxZoom: 18,
    attribution: '&copy; Esri World Imagery'
  }
};

export const MapComponent: React.FC<MapComponentProps> = ({
  signs,
  routes,
  turnAlerts,
  traps = [],
  notes,
  filters,
  selectedRouteId,
  selectedTurnId,
  selectedSignId,
  selectedTrapId,
  onSelectSign,
  onSelectTurn,
  onSelectTrap,
  onSelectRoute,
  onAddNoteAtCoords,
  onSelectNote,
  isAddingSignMode,
  onMapClickForSign,
  focusCoords,
  simulationStep,
  onStartSimulation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [currentTileProvider, setCurrentTileProvider] = useState<TileProvider>('osm_de');
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // Layer groups refs
  const signsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const turnsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const trapsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const speedZonesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const notesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const autoshkolaLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const simulationCarMarkerRef = useRef<L.Marker | null>(null);

  // Switch Tile Provider
  const switchTileProvider = useCallback((provider: TileProvider) => {
    setCurrentTileProvider(provider);
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const cfg = TILE_SERVERS[provider];
    tileLayerRef.current = L.tileLayer(cfg.url, {
      subdomains: cfg.subdomains,
      maxZoom: cfg.maxZoom,
      attribution: cfg.attribution
    }).addTo(mapInstanceRef.current);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Noyabrsk center at Autoshkola (пр. Мира, 83): [63.2014, 75.4383]
      const map = L.map(mapContainerRef.current, {
        center: [63.20140, 75.43826],
        zoom: 15.5,
        minZoom: 11,
        maxZoom: 18,
        zoomControl: false
      });

      // Default Clean OpenStreetMap (NO WATERMARK!)
      const cfg = TILE_SERVERS.osm_de;
      tileLayerRef.current = L.tileLayer(cfg.url, {
        subdomains: cfg.subdomains,
        maxZoom: cfg.maxZoom,
        attribution: cfg.attribution
      }).addTo(map);

      // Custom zoom control
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Layer groups
      signsLayerGroupRef.current = L.layerGroup().addTo(map);
      turnsLayerGroupRef.current = L.layerGroup().addTo(map);
      trapsLayerGroupRef.current = L.layerGroup().addTo(map);
      routesLayerGroupRef.current = L.layerGroup().addTo(map);
      speedZonesLayerGroupRef.current = L.layerGroup().addTo(map);
      notesLayerGroupRef.current = L.layerGroup().addTo(map);
      autoshkolaLayerGroupRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;

      // Invalidate size on mount to solve flexbox 0-height Leaflet issue
      const timer1 = setTimeout(() => map.invalidateSize(), 150);
      const timer2 = setTimeout(() => map.invalidateSize(), 500);
      const timer3 = setTimeout(() => map.invalidateSize(), 1200);

      // Observe size changes
      const observer = new ResizeObserver(() => {
        map.invalidateSize();
      });
      observer.observe(mapContainerRef.current);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        observer.disconnect();
        map.remove();
        mapInstanceRef.current = null;
      };
    }
  }, []);

  // Fly to Autoshkola Base (Мира 83)
  const handleFlyToAutoshkola = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(AUTOSHKOLA_LOCATION.coordinates, 16.5, { duration: 1 });
    }
  };

  // Center on Noyabrsk
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([63.1975, 75.4540], 14.5, { duration: 1 });
    }
  };

  // Map Click Listener
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      if (isAddingSignMode && onMapClickForSign) {
        onMapClickForSign(coords);
      } else if (onAddNoteAtCoords) {
        onAddNoteAtCoords(coords);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isAddingSignMode, onMapClickForSign, onAddNoteAtCoords]);

  // Handle focus coordinates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !focusCoords) return;

    map.flyTo(focusCoords, 16.5, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }, [focusCoords]);

  // Render Starting Base: Автошкола (проспект Мира, 83)
  useEffect(() => {
    const group = autoshkolaLayerGroupRef.current;
    if (!group) return;
    group.clearLayers();

    const autoshkolaHtml = `
      <div class="relative flex flex-col items-center cursor-pointer group z-40">
        <div class="absolute -inset-2 rounded-full bg-emerald-500/40 animate-ping"></div>
        <div class="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 border-2 border-white shadow-2xl flex items-center justify-center text-white text-xl font-black transform group-hover:scale-110 transition-transform">
          🚗
        </div>
        <div class="mt-1 whitespace-nowrap bg-emerald-950/95 text-emerald-200 border border-emerald-500/50 text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-lg pointer-events-none">
          СТАРТ: Автошкола (пр. Мира, 83)
        </div>
      </div>
    `;

    const icon = L.divIcon({
      html: autoshkolaHtml,
      className: 'custom-autoshkola-marker',
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    const marker = L.marker(AUTOSHKOLA_LOCATION.coordinates, { icon });
    marker.bindPopup(`
      <div class="p-2 text-xs text-slate-100 max-w-xs">
        <h4 class="font-bold text-emerald-400 text-sm mb-1">
          🚗 Старт: Автошкола (пр. Мира, 83)
        </h4>
        <p class="text-slate-300 mb-2">
          Базовая точка старта учебных выездов и экзаменационных заездов по Ноябрьску!
        </p>
        <div class="bg-emerald-950/80 p-2 rounded border border-emerald-800 text-[11px] text-emerald-200 font-medium">
          💡 Выезд из двора дома 83 с правым поворотом на проспект Мира по знаку 2.4 «Уступите дорогу».
        </div>
      </div>
    `);

    marker.addTo(group);
  }, []);

  // Render Simulation Car Position when simulator is active
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!simulationStep) {
      if (simulationCarMarkerRef.current) {
        simulationCarMarkerRef.current.remove();
        simulationCarMarkerRef.current = null;
      }
      return;
    }

    const carHtml = `
      <div class="relative flex items-center justify-center cursor-pointer z-50">
        <div class="absolute -inset-2 rounded-full bg-indigo-500/50 animate-ping"></div>
        <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-rose-500 border-2 border-white shadow-2xl flex items-center justify-center text-white text-base">
          🚘
        </div>
        <div class="absolute -top-7 whitespace-nowrap bg-indigo-950/95 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg border border-indigo-400">
          Учебный авто • ${simulationStep.speedLimit} км/ч
        </div>
      </div>
    `;

    const carIcon = L.divIcon({
      html: carHtml,
      className: 'custom-sim-car-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    if (simulationCarMarkerRef.current) {
      simulationCarMarkerRef.current.setLatLng(simulationStep.coordinates);
    } else {
      simulationCarMarkerRef.current = L.marker(simulationStep.coordinates, { icon: carIcon }).addTo(map);
    }

    // Pan map to simulation car
    map.flyTo(simulationStep.coordinates, 16.5, { duration: 0.8 });
  }, [simulationStep]);

  // Render Turn Alerts ("Что ждет за поворотом") Layer
  useEffect(() => {
    const group = turnsLayerGroupRef.current;
    if (!group) return;
    group.clearLayers();

    turnAlerts.forEach((turn) => {
      const isSelected = turn.id === selectedTurnId;
      const turnSymbol = turn.turnDirection === 'right' ? '↪' : turn.turnDirection === 'left' ? '↩' : '⬆';

      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125 ${isSelected ? 'scale-125 z-50' : 'z-30'}">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
            ${turnSymbol}
          </div>
          <div class="absolute -bottom-5 whitespace-nowrap bg-indigo-950/95 text-[10px] text-indigo-200 border border-indigo-400/60 px-1.5 py-0.5 rounded shadow-md pointer-events-none font-semibold">
            Поворот: ${turn.speedLimitAfterTurn} км/ч
          </div>
        </div>
      `;

      const turnIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-turn-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(turn.coordinates, { icon: turnIcon });
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectTurn(turn);
      });

      marker.addTo(group);
    });
  }, [turnAlerts, selectedTurnId, onSelectTurn]);

  // Render Signs Layer & Speed Limits
  useEffect(() => {
    const signsGroup = signsLayerGroupRef.current;
    const speedGroup = speedZonesLayerGroupRef.current;
    if (!signsGroup || !speedGroup) return;

    signsGroup.clearLayers();
    speedGroup.clearLayers();

    if (!filters.signs && !filters.speedZones) return;

    signs.forEach((sign) => {
      const isSelected = sign.id === selectedSignId;

      if (filters.signs) {
        const svgMarkup = getGostSignSvgHtml(sign.signType, 30);
        const signIconHtml = `
          <div class="relative group cursor-pointer transition-transform duration-150 ${isSelected ? 'scale-125 z-40' : 'hover:scale-125 z-25'}">
            <div class="filter drop-shadow-md">
              ${svgMarkup}
            </div>
            <div class="hidden group-hover:block absolute bottom-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-2xl whitespace-nowrap z-50 border border-slate-700">
              <p class="font-bold text-amber-400">${sign.name}</p>
              <p class="text-slate-300 text-[10px] max-w-[200px]">${sign.street}</p>
              <p class="text-slate-400 text-[9px] mt-0.5">${sign.description}</p>
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: signIconHtml,
          className: 'custom-sign-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker(sign.coordinates, { icon });
        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          onSelectSign(sign);
        });
        marker.addTo(signsGroup);
      }

      // Speed & 3.27 Zones (отображаются только при явном включении фильтра зон скорости)
      if (sign.actionZone && filters.speedZones) {
        const is327 = sign.signType === '3.27';
        const zoneColor = is327 ? '#ef4444' : sign.signType === '3.24_20' ? '#f97316' : '#eab308';
        const line = L.polyline([sign.coordinates, sign.actionZone.endCoordinates], {
          color: zoneColor,
          weight: 4,
          opacity: 0.85,
          dashArray: is327 ? '6, 6' : undefined
        });

        line.bindTooltip(`
          <div class="text-xs p-1">
            <strong style="color: ${zoneColor}">${is327 ? 'Зона 3.27 «Остановка запрещена»' : 'Зона ограничения скорости'}</strong>
            <div class="text-[11px] text-slate-800">${sign.actionZone.description}</div>
          </div>
        `, { sticky: true });

        line.addTo(speedGroup);
      }
    });
  }, [signs, filters.signs, filters.speedZones, selectedSignId, onSelectSign]);

  // Render Inspector Traps Layer ("Подставы / ловушки ГИБДД")
  useEffect(() => {
    const group = trapsLayerGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!filters.traps || !traps || traps.length === 0) return;

    traps.forEach((trap) => {
      const isSelected = trap.id === selectedTrapId;
      const trapIconHtml = `
        <div class="relative group cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-130 z-50' : 'hover:scale-125 z-35'}">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-black animate-pulse">
            ⚠️
          </div>
          <div class="hidden group-hover:block absolute bottom-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-2xl whitespace-nowrap z-50 border border-rose-500/60">
            <p class="font-bold text-rose-400">🚨 Ловушка ГИБДД: ${trap.title}</p>
            <p class="text-slate-300 text-[10px] max-w-[220px]">${trap.street}</p>
            <p class="text-amber-300 text-[9px] mt-0.5">"${trap.inspectorQuote}"</p>
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html: trapIconHtml,
        className: 'custom-trap-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(trap.coordinates, { icon });
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        if (onSelectTrap) {
          onSelectTrap(trap);
        }
      });

      marker.addTo(group);
    });
  }, [traps, filters.traps, selectedTrapId, onSelectTrap]);

  // Render Routes Layer (Strict road centerline geometry)
  useEffect(() => {
    const group = routesLayerGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!filters.routes) return;

    routes.forEach((route) => {
      const isSelected = route.id === selectedRouteId;

      const polyline = L.polyline(route.waypoints, {
        color: route.color,
        weight: isSelected ? 6 : 4,
        opacity: isSelected ? 0.95 : 0.65,
        lineCap: 'round',
        lineJoin: 'round'
      });

      polyline.on('click', () => {
        onSelectRoute(route);
      });

      polyline.addTo(group);
    });
  }, [routes, filters.routes, selectedRouteId, onSelectRoute]);

  // Render User Notes Layer
  useEffect(() => {
    const group = notesLayerGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!filters.notes || !onSelectNote) return;

    notes.forEach((note) => {
      const noteIconHtml = `
        <div class="group relative cursor-pointer hover:scale-125 transition-transform">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold">
            📝
          </div>
          <div class="hidden group-hover:block absolute bottom-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-2xl whitespace-nowrap z-50 border border-purple-500/50">
            <p class="font-bold text-purple-300">${note.title}</p>
            <p class="text-slate-300 text-[10px] max-w-[200px] line-clamp-2">${note.text}</p>
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html: noteIconHtml,
        className: 'custom-note-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(note.coordinates, { icon });
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectNote(note);
      });

      marker.addTo(group);
    });
  }, [notes, filters.notes, onSelectNote]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-slate-950">
      {/* Map DOM container */}
      <div 
        ref={mapContainerRef} 
        className={`w-full h-full ${isAddingSignMode ? 'cursor-crosshair' : 'cursor-grab'}`}
      />

      {/* Floating Map Toolbar (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Fly to Autoshkola button */}
        <button
          onClick={handleFlyToAutoshkola}
          className="bg-emerald-950/90 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/60 px-3 py-2 rounded-xl shadow-xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          title="Перейти к Автошколе (проспект Мира, 83)"
        >
          <Car className="w-4 h-4 text-emerald-400" />
          <span>Старт: Мира, 83</span>
        </button>

        {/* Start Simulation Trip button */}
        {onStartSimulation && (
          <button
            onClick={onStartSimulation}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl shadow-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Запустить пошаговый маршрут от Мира 83"
          >
            <Navigation className="w-4 h-4" />
            <span className="hidden sm:inline">Поехать по маршруту</span>
          </button>
        )}

        {/* Recenter Button */}
        <button
          onClick={handleRecenter}
          className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 p-2 rounded-xl shadow-lg border border-slate-700/80 backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          title="Центр Ноябрьска"
        >
          <Compass className="w-4 h-4 text-rose-400" />
          <span className="hidden md:inline">Центр</span>
        </button>

        {/* Tile Layers Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 p-2 rounded-xl shadow-lg border border-slate-700/80 backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Сменить тип карты"
          >
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="hidden lg:inline">{TILE_SERVERS[currentTileProvider].name}</span>
          </button>

          {isLayerMenuOpen && (
            <div className="absolute right-0 top-10 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 space-y-1 text-xs z-50 animate-in fade-in">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Подложка карты:
              </div>
              {(Object.keys(TILE_SERVERS) as TileProvider[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    switchTileProvider(key);
                    setIsLayerMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    currentTileProvider === key
                      ? 'bg-sky-500/20 text-sky-300 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{TILE_SERVERS[key].name}</span>
                  {currentTileProvider === key && <span className="text-sky-400">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Adding sign helper banner */}
      {isAddingSignMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-900/95 text-amber-100 border-2 border-amber-400 text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce backdrop-blur-md z-30 font-bold">
          <span>📍</span>
          <span>Кликните на дорогу или перекресток, чтобы поставить реальный знак</span>
        </div>
      )}
    </div>
  );
};
