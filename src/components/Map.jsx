import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const ICONS = {
  road: 'M18.1 2H5.9L4 22h16l-1.9-20zM11 4h2v4h-2V4zm0 6h2v4h-2v-4zm0 6h2v4h-2v-4z',
  bus: 'M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z',
  bag: 'M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z',
  cart: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z',
  school: 'M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z',
  park: 'M17 12h2L12 2 4.05 12h2l-3 7h6v5h3v-5h6l-3-7z',
  pets: 'M12 2C9.24 2 7 4.24 7 7c0 1.34.52 2.56 1.37 3.46l.01.01c-.13.57-.22 1.17-.22 1.8 0 3.86 3.14 7 7 7s7-3.14 7-7c0-.63-.09-1.23-.22-1.8l.01-.01C22.48 9.56 23 8.34 23 7c0-2.76-2.24-5-5-5-1.55 0-2.95.72-3.88 1.85C13.2 2.73 12.63 2 12 2z'
};

const POIs = [
  // LUAR (Centro del mapa)
  {
    name: 'Proyecto Luar', type: 'proyecto',
    lng: -74.0633, lat: 4.7355, // Ajustado drásticamente hacia el Este y Sur para centrarse entre los dos edificios del modelo
    color: '#dc2626', icon: '',
    image: '/Logo-Luar.webp',
    description: 'Nuestro más reciente proyecto de vivienda integral en La Colina. Cuenta con una arquitectura moderna y funcional, ideal para todos los momentos de la vida.',
    rating: '5.0', time: '0 min', audience: 'Familiar / Inversionistas', schedule: '09:00 AM - 05:00 PM'
  },

  // VÍAS PRINCIPALES
  { name: 'Calle 152 / Carrera 58', type: 'transporte', lng: -74.0610, lat: 4.7350, color: '#4b5563', icon: ICONS.road, description: 'Vías locales e internas de La Colina que permiten un flujo vehicular tranquilo y residencial.', rating: '4.5', time: '1 min', audience: 'General', schedule: '24 Horas' },

  // CENTROS COMERCIALES
  { name: 'Parque La Colina', type: 'compras', lng: -74.0620, lat: 4.7310, color: '#8b5cf6', icon: ICONS.bag, description: 'El centro comercial más moderno y exclusivo del sector, con cines, restaurantes y tiendas premium.', rating: '4.8', time: '8 min caminando', audience: 'Familiar', schedule: '10:00 AM - 09:00 PM' },
  { name: 'XMALL Colina Campestre', type: 'compras', lng: -74.0680, lat: 4.7340, color: '#8b5cf6', icon: ICONS.bag, description: 'Mall de conveniencia pet-friendly ideal para compras rápidas y el día a día.', rating: '4.4', time: '5 min caminando', audience: 'Todo público', schedule: '08:00 AM - 08:00 PM' },
  { name: 'CC Multi Drive', type: 'compras', lng: -74.0620, lat: 4.7370, color: '#8b5cf6', icon: ICONS.bag, description: 'Práctico centro comercial con bancos y servicios esenciales.', rating: '4.2', time: '6 min caminando', audience: 'General', schedule: '07:00 AM - 07:00 PM' },

  // SUPERMERCADOS Y TIENDAS
  { name: 'Carulla Rincón de la Colina', type: 'compras', lng: -74.0600, lat: 4.7370, color: '#10b981', icon: ICONS.cart, description: 'Supermercado premium ideal para mercar con comodidad y variedad de productos.', rating: '4.7', time: '7 min caminando', audience: 'Hogar', schedule: '07:00 AM - 10:00 PM' },
  { name: 'Supermercado Fruvar Express', type: 'compras', lng: -74.0600, lat: 4.7340, color: '#10b981', icon: ICONS.cart, description: 'La mejor opción para encontrar frutas, verduras y productos frescos de calidad.', rating: '4.5', time: '4 min caminando', audience: 'Hogar', schedule: '06:00 AM - 08:00 PM' },
  { name: 'Tienda Margareth', type: 'compras', lng: -74.0600, lat: 4.7350, color: '#10b981', icon: ICONS.cart, description: 'Tienda de barrio tradicional, perfecta para las compras del día a día.', rating: '4.6', time: '3 min caminando', audience: 'Local', schedule: '07:00 AM - 09:00 PM' },
  { name: 'Éxito WOW Colina', type: 'compras', lng: -74.0640, lat: 4.7300, color: '#10b981', icon: ICONS.cart, description: 'Hipermercado 24 horas con absolutamente todo lo que necesitas a cualquier hora.', rating: '4.7', time: '10 min caminando', audience: 'Familiar', schedule: '24 Horas' },
  { name: 'D1 / Ara', type: 'compras', lng: -74.0610, lat: 4.7375, color: '#10b981', icon: ICONS.cart, description: 'Sedes de supermercados de descuento duro (Hard Discount) sobre la Cll 153.', rating: '4.3', time: '8 min caminando', audience: 'Hogar', schedule: '08:00 AM - 09:00 PM' },

  // PARQUES (Verde Hoja)
  { name: 'Parque San Lorenzo', type: 'parques', lng: -74.067, lat: 4.733, color: '#84cc16', icon: ICONS.park, description: 'Amplio espacio verde para caminar y disfrutar al aire libre.', rating: '4.6', time: '6 min caminando', audience: 'Deportistas / Familias', schedule: 'Abierto al público' },
  { name: 'Parque Público La Sirena', type: 'parques', lng: -74.063, lat: 4.738, color: '#84cc16', icon: ICONS.park, description: 'Zona verde ideal para mascotas y actividades recreativas.', rating: '4.5', time: '4 min caminando', audience: 'Mascotas', schedule: 'Abierto al público' },
  { name: 'Parque Colina Campestre', type: 'parques', lng: -74.061, lat: 4.735, color: '#84cc16', icon: ICONS.park, description: 'Parque vecinal tranquilo y rodeado de naturaleza.', rating: '4.7', time: '3 min caminando', audience: 'Familias', schedule: 'Abierto al público' },
  { name: 'Parque Público Santa Helena', type: 'parques', lng: -74.061, lat: 4.731, color: '#84cc16', icon: ICONS.park, description: 'Espacio ideal para la recreación infantil y familiar.', rating: '4.4', time: '9 min caminando', audience: 'Niños', schedule: 'Abierto al público' },

  // MASCOTAS Y COLEGIOS
  { name: 'Parque de Mascotas Colina', type: 'mascotas', lng: -74.065, lat: 4.736, color: '#f59e0b', icon: ICONS.pets, description: 'Zona cerrada y segura diseñada especialmente para el esparcimiento de perros.', rating: '4.9', time: '3 min caminando', audience: 'Mascotas', schedule: '06:00 AM - 06:00 PM' },
  { name: 'Colegio Cristo Rey', type: 'colegios', lng: -74.064, lat: 4.732, color: '#0ea5e9', icon: ICONS.school, description: 'Institución educativa de alta calidad a pocos minutos del proyecto.', rating: '4.8', time: '7 min caminando', audience: 'Estudiantes', schedule: '07:00 AM - 03:00 PM' },
  { name: 'Gimnasio Iragua', type: 'colegios', lng: -74.066, lat: 4.737, color: '#0ea5e9', icon: ICONS.school, description: 'Colegio reconocido por su excelente nivel académico y formativo.', rating: '4.7', time: '6 min caminando', audience: 'Estudiantes', schedule: '07:00 AM - 04:00 PM' },
];

// Función para crear un círculo GeoJSON o una máscara invertida en kilómetros
const createGeoJSONCircle = function (center, radiusInKm, points = 64, isMask = false) {
  const coords = { latitude: center[1], longitude: center[0] };
  const km = radiusInKm;
  const ret = [];
  const distanceX = km / (111.320 * Math.cos((coords.latitude * Math.PI) / 180));
  const distanceY = km / 110.574;

  let theta, x, y;
  for (let i = 0; i < points; i++) {
    theta = (i / points) * (2 * Math.PI);
    x = distanceX * Math.cos(theta);
    y = distanceY * Math.sin(theta);
    ret.push([coords.longitude + x, coords.latitude + y]);
  }
  ret.push(ret[0]); // cerrar el polígono

  let coordinates;
  if (isMask) {
    // Un cuadrado gigante que cubre la ciudad (counter-clockwise)
    const outerRing = [
      [-75.0, 3.0],
      [-73.0, 3.0],
      [-73.0, 5.0],
      [-75.0, 5.0],
      [-75.0, 3.0]
    ];
    // El agujero es nuestro círculo (clockwise)
    coordinates = [outerRing, ret.reverse()];
  } else {
    coordinates = [ret];
  }

  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: coordinates }
    }]
  };
};

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});
  const [activeLight, setActiveLight] = useState('day');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [isTouring, setIsTouring] = useState(false);
  const isTouringRef = useRef(false);
  const animationRef = useRef(null);
  const tourIntervalRef = useRef(null);
  const tourStateRef = useRef({
    phase: 0,
    currentBearing: 0,
    totalRotation: 0,
    currentZoom: 18.2,
    targetZoom: 16.2,
    luarPopupOpened: false,
    poiIndex: 1,
    isPaused: false
  });

  const stopTour = () => {
    isTouringRef.current = false;
    setIsTouring(false);
    if (tourStateRef.current.phase > 0) {
      tourStateRef.current.isPaused = true;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (tourIntervalRef.current) {
      clearInterval(tourIntervalRef.current);
      tourIntervalRef.current = null;
    }
  };

  const startAnimationLoop = () => {
    const state = tourStateRef.current;
    
    // Si reanudamos en fase 4 (esperando en el timeout) pasamos directo a fase 5 para no quedarnos atascados
    if (state.phase === 4 && state.luarPopupOpened) {
      const luarMarker = markersRef.current['Proyecto Luar'];
      if (luarMarker) luarMarker.getPopup().remove();
      state.phase = 5;
    }

    // Si entramos o reanudamos en fase 5, asegurar que el intervalo de popups esté corriendo
    if (state.phase === 5 && !tourIntervalRef.current) {
      const showNextPopup = () => {
        if (!isTouringRef.current) return;
        let nextPoi = POIs[state.poiIndex];
        if (nextPoi.name.includes('Luar')) {
          state.poiIndex = (state.poiIndex + 1) % POIs.length;
          nextPoi = POIs[state.poiIndex];
        }
        Object.values(markersRef.current).forEach(m => {
          if (m && m.getPopup() && m.getPopup().isOpen()) m.getPopup().remove();
        });
        const marker = markersRef.current[nextPoi.name];
        if (marker) marker.getPopup().addTo(map.current);

        state.poiIndex = (state.poiIndex + 1) % POIs.length;
      };
      showNextPopup();
      tourIntervalRef.current = setInterval(showNextPopup, 4500);
    }

    const rotateCamera = () => {
      if (!isTouringRef.current) return;
      
      const rotSpeed = 0.25; // Velocidad suave
      
      if (state.phase === 2) {
        state.currentBearing += rotSpeed;
        state.totalRotation += rotSpeed;
        if (state.totalRotation >= 360) {
          state.phase = 3;
        }
        map.current.jumpTo({ bearing: state.currentBearing % 360, zoom: 18.2 });
      }
      else if (state.phase === 3) {
        state.currentBearing += rotSpeed;
        state.currentZoom -= 0.01;
        if (state.currentZoom <= state.targetZoom) {
          state.currentZoom = state.targetZoom;
          state.phase = 4;
        }
        map.current.jumpTo({ bearing: state.currentBearing % 360, zoom: state.currentZoom });
      }
      else if (state.phase === 4) {
        if (!state.luarPopupOpened) {
          state.luarPopupOpened = true;
          const luarMarker = markersRef.current['Proyecto Luar'];
          if (luarMarker) luarMarker.getPopup().addTo(map.current);
          
          setTimeout(() => {
            if (!isTouringRef.current || state.phase !== 4) return;
            if (luarMarker) luarMarker.getPopup().remove();
            state.phase = 5;
            startAnimationLoop(); // Recursivo para inicializar fase 5
          }, 4000);
        }
        map.current.jumpTo({ bearing: state.currentBearing % 360, zoom: state.currentZoom });
      }
      else if (state.phase === 5) {
        state.currentBearing += rotSpeed;
        map.current.jumpTo({ bearing: state.currentBearing % 360, zoom: state.currentZoom });
      }

      animationRef.current = requestAnimationFrame(rotateCamera);
    };

    animationRef.current = requestAnimationFrame(rotateCamera);
  };

  const startTour = () => {
    isTouringRef.current = true;
    setIsTouring(true);

    const state = tourStateRef.current;

    if (!state.isPaused || state.phase === 0) {
      // Inicio desde cero
      Object.values(markersRef.current).forEach(m => {
        if (m && m.getPopup() && m.getPopup().isOpen()) m.getPopup().remove();
      });

      state.phase = 1;
      state.currentBearing = map.current.getBearing();
      state.totalRotation = 0;
      state.currentZoom = 18.2;
      state.luarPopupOpened = false;
      state.poiIndex = 1;
      state.isPaused = false;

      map.current.flyTo({
        center: [-74.0630, 4.73540],
        zoom: 18.2,
        pitch: 65,
        bearing: map.current.getBearing(),
        essential: true,
        duration: 2500
      });

      setTimeout(() => {
        if (!isTouringRef.current) return;
        state.phase = 2;
        state.currentBearing = map.current.getBearing();
        startAnimationLoop();
      }, 2500);
    } else {
      // Reanudar desde donde se pausó
      state.isPaused = false;
      if (state.phase === 1) {
        // Pausado en el acercamiento, reiniciar
        state.phase = 0;
        startTour();
      } else {
        startAnimationLoop();
      }
    }
  };

  const flyToPOI = (poi) => {
    if (map.current) {
      map.current.flyTo({
        center: [poi.lng, poi.lat],
        zoom: 16.5,
        pitch: 45,
        bearing: 0,
        essential: true,
        duration: 1500
      });
      const marker = markersRef.current[poi.name];
      if (marker) {
        Object.values(markersRef.current).forEach(m => {
          if (m && m.getPopup() && m.getPopup().isOpen()) m.getPopup().remove();
        });
        marker.getPopup().addTo(map.current);
      }
    }
  };

  const changeLighting = (preset) => {
    setActiveLight(preset);
    if (map.current && map.current.isStyleLoaded()) {
      map.current.setConfigProperty('basemap', 'lightPreset', preset);
    }
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [-74.0630, 4.73540], // Centrado exactamente en el Proyecto Luar
      zoom: 15.5,
      pitch: 60,
      bearing: -20,
      antialias: true,
      dragRotate: false,        // Previene girar el mapa manualmente (mantiene el eje bloqueado)
      touchZoomRotate: false,   // Mantiene la estabilidad en móviles
      maxPitch: 65,             // Limita la inclinación para no perderse en el cielo
      minPitch: 30,             // Evita la vista totalmente plana
      maxBounds: [
        [-74.15, 4.65], // Suroeste
        [-74.00, 4.80]  // Noreste
      ]
    });

    // Agregar botones de zoom (+ / -) al mapa
    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    map.current.on('load', () => {
      // Mapbox Standard has 3D buildings enabled by default!
      // We can also configure the light preset if desired (e.g. 'dusk', 'dawn', 'night', 'day')
      map.current.setConfigProperty('basemap', 'lightPreset', 'day');
      // Re-enable POI labels if the user wants them
      map.current.setConfigProperty('basemap', 'showPointOfInterestLabels', true);

      // Añadir la máscara (oscurece todo afuera)
      map.current.addSource('zona-mascara', {
        type: 'geojson',
        data: createGeoJSONCircle([-74.0630, 4.73540], 0.8, 64, true) // isMask = true
      });

      map.current.addLayer({
        id: 'zona-mascara-fill',
        type: 'fill',
        source: 'zona-mascara',
        paint: {
          'fill-color': '#000000',
          'fill-opacity': 0.35 // Grado de oscuridad del exterior
        }
      });

      // Añadir zona de influencia (círculo interior alrededor del proyecto)
      map.current.addSource('zona-influencia', {
        type: 'geojson',
        data: createGeoJSONCircle([-74.0630, 4.73540], 0.8) // 800 metros de radio
      });

      // Capa de relleno para la zona
      map.current.addLayer({
        id: 'zona-influencia-fill',
        type: 'fill',
        source: 'zona-influencia',
        paint: {
          'fill-color': '#dc2626', // Rojo corporativo
          'fill-opacity': 0.1
        }
      });

      // Borde del círculo punteado
      map.current.addLayer({
        id: 'zona-influencia-line',
        type: 'line',
        source: 'zona-influencia',
        paint: {
          'line-color': '#dc2626',
          'line-width': 2,
          'line-dasharray': [2, 2],
          'line-opacity': 0.6
        }
      });

      // Etiqueta de texto sobre el borde del círculo
      map.current.addLayer({
        id: 'zona-influencia-label',
        type: 'symbol',
        source: 'zona-influencia',
        layout: {
          'symbol-placement': 'line',
          'text-field': 'Zona de influencia: 10 min caminando (800m)',
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 13,
          'text-letter-spacing': 0.1,
          'text-offset': [0, -0.8]
        },
        paint: {
          'text-color': '#dc2626',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2
        }
      });

      // Cargar el modelo 3D real (.glb)
      map.current.addModel('modelo-borneo', '/borneo-model.glb');

      map.current.addLayer({
        id: 'borneo-3d-model',
        type: 'model',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [-74.0630, 4.73540] }, // Coordenadas más cerca a la carretera
            properties: {
              modelRotation: [90, 0, 195], // Si lo ves acostado, cambia el 90 a 0
              modelScale: [0.01, 0.01, 0.01] // El modelo está en centímetros (5170cm = 51m). Escala a metros.
            }
          }
        },
        layout: {
          'model-id': 'modelo-borneo'
        },
        paint: {
          'model-rotation': ['get', 'modelRotation'],
          'model-scale': ['get', 'modelScale'],
          'model-translation': [-15.5, -1.5, 0] // Centrado exacto basado en las coordenadas originales del archivo 3D
        }
      });

      // Render POIs
      POIs.forEach(poi => {
        const imageHtml = poi.image 
           ? `<div style="height: 140px; width: 100%; overflow: hidden;"><img src="${poi.image}" alt="${poi.name}" style="width: 100%; height: 100%; object-fit: cover;" /></div>`
           : '';
        const ratingHtml = poi.rating 
           ? `<div style="display: flex; align-items: center; gap: 4px; color: #fbbf24; margin-top: 4px; font-weight: bold; font-size: 13px;">⭐ ${poi.rating}</div>`
           : '';
        const gridHtml = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; font-size: 12px; color: #4b5563;">
            ${poi.time ? `<div><strong style="color: #9ca3af; font-size: 10px; text-transform: uppercase;">Distancia</strong><br/>${poi.time}</div>` : ''}
            ${poi.schedule ? `<div><strong style="color: #9ca3af; font-size: 10px; text-transform: uppercase;">Horario</strong><br/>${poi.schedule}</div>` : ''}
            ${poi.audience ? `<div style="grid-column: span 2;"><strong style="color: #9ca3af; font-size: 10px; text-transform: uppercase;">Público</strong><br/>${poi.audience}</div>` : ''}
          </div>
        `;
        const popupContent = `
          <div style="width: 280px; font-family: 'Inter', system-ui, sans-serif;">
            ${imageHtml}
            <div style="padding: 16px;">
              <h3 style="margin: 0; font-size: 18px; color: ${poi.color}; font-weight: 800;">${poi.name}</h3>
              ${ratingHtml}
              <p style="margin-top: 8px; font-size: 13px; line-height: 1.5; color: #6b7280; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">${poi.description || ''}</p>
              ${gridHtml}
            </div>
          </div>
        `;
        const popup = new mapboxgl.Popup({
          anchor: 'left', // Forza el popup a aparecer al lado derecho del marcador
          offset: 15, // Ajuste para separar del icono
          closeButton: false,
          closeOnClick: true,
          maxWidth: '300px',
          className: 'bubble-popup'
        }).setHTML(popupContent);

        if (poi.name.includes('Luar')) {
          const container = document.createElement('div');
          container.className = 'custom-borneo-marker-container';

          const el = document.createElement('div');
          el.className = 'custom-borneo-marker';

          const inner = document.createElement('div');
          inner.className = 'custom-borneo-inner';
          inner.innerHTML = '<img src="/logo-Punto.png" alt="Luar" style="width: 100%; height: 100%; object-fit: cover;" />';

          const pulse = document.createElement('div');
          pulse.className = 'custom-borneo-pulse';

          el.appendChild(pulse);
          el.appendChild(inner);
          container.appendChild(el);

          const marker = new mapboxgl.Marker({ element: container, anchor: 'bottom' })
            .setLngLat([poi.lng, poi.lat])
            .setPopup(popup)
            .addTo(map.current);

          markersRef.current[poi.name] = marker;
        } else {
          const container = document.createElement('div');
          container.className = 'promo-marker-container';

          const circle = document.createElement('div');
          circle.className = 'promo-marker';
          circle.style.backgroundColor = poi.color;
          circle.innerHTML = `<svg viewBox="0 0 24 24"><path d="${poi.icon}"></path></svg>`;

          const label = document.createElement('div');
          label.className = 'promo-label';
          label.style.color = poi.color;
          label.innerText = poi.name;

          container.appendChild(circle);
          container.appendChild(label);

          const marker = new mapboxgl.Marker({ element: container })
            .setLngLat([poi.lng, poi.lat])
            .setPopup(popup)
            .addTo(map.current);

          markersRef.current[poi.name] = marker;
        }
      });

      // Detener recorrido si el usuario interactúa
      map.current.on('mousedown', stopTour);
      map.current.on('touchstart', stopTour);
      map.current.on('wheel', stopTour);
    });

    return () => {
      stopTour();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#1a1a1a] overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Controles de Iluminación y Recorrido */}
      <div className="absolute bottom-5 left-6 z-10 flex flex-wrap items-center gap-4">
        <div className="flex gap-2 bg-white/90 p-1.5 rounded-full shadow-md backdrop-blur-sm border border-gray-100">
          <button
            onClick={() => changeLighting('dawn')}
            className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer ${activeLight === 'dawn'
              ? 'bg-[#ff0000] text-white shadow-sm'
              : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }`}
          >
            Mañana
          </button>
          <button
            onClick={() => changeLighting('day')}
            className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer ${activeLight === 'day'
              ? 'bg-[#ff0000] text-white shadow-sm'
              : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }`}
          >
            Día
          </button>
          <button
            onClick={() => changeLighting('dusk')}
            className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer ${activeLight === 'dusk'
              ? 'bg-[#ff0000] text-white shadow-sm'
              : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }`}
          >
            Noche
          </button>
        </div>

        <button
          onClick={isTouring ? stopTour : startTour}
          className={`px-5 py-3 rounded-full font-bold shadow-lg transition-all cursor-pointer flex items-center gap-2 ${isTouring
            ? 'bg-red-600 text-white animate-pulse shadow-red-500/50'
            : 'bg-white text-gray-800 hover:bg-gray-100 hover:scale-105 border border-gray-200'
            }`}
        >
          {isTouring ? '⏹️' : '▶️'}
        </button>
      </div>

      {/* Sidebar de POIs */}
      <div
        className={`absolute top-0 right-0 h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out z-20 flex ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: '320px' }}
      >
        {/* Botón para abrir/cerrar */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -left-10 top-1/2 -translate-y-1/2 bg-white p-2 rounded-l-lg shadow-[-4px_0_10px_rgba(0,0,0,0.1)] hover:bg-gray-50 flex items-center justify-center w-10 h-16 cursor-pointer"
          title="Ver Puntos de Interés"
        >
          <svg className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Contenido del Sidebar */}
        <div className="w-full h-full flex flex-col">
          <div className="p-5 bg-[#ff0000] text-white shadow-md">
            <h2 className="text-xl font-bold">Puntos de Interés</h2>
            <p className="text-red-100 text-sm mt-1">Explora los alrededores</p>
          </div>

          <div className="p-3 border-b border-gray-200 flex flex-wrap gap-2 bg-gray-50">
            {['todos', 'compras', 'parques', 'colegios', 'mascotas'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize transition-colors border ${activeFilter === f ? 'bg-[#ff0000] text-white border-[#ff0000]' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
              >
                {f === 'todos' ? 'Todos' : f}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {POIs.filter(p => activeFilter === 'todos' || p.type === activeFilter || p.type === 'proyecto').map((poi, idx) => (
              <div
                key={idx}
                onClick={() => flyToPOI(poi)}
                className="p-3 mb-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-all flex items-start space-x-3 group"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: poi.color }}
                >
                  {poi.icon ? (
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d={poi.icon} />
                    </svg>
                  ) : (
                    <span className="text-white font-bold">L</span>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm group-hover:text-red-600 transition-colors">{poi.name}</h4>
                  {poi.description && (
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{poi.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* El SidePanel ha sido removido, ahora usamos popups nativos */}

    </div>
  );
};

export default Map;
