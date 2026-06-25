import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const ICONS = {
  road: 'M18.1 2H5.9L4 22h16l-1.9-20zM11 4h2v4h-2V4zm0 6h2v4h-2v-4zm0 6h2v4h-2v-4z',
  bus: 'M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z',
  bag: 'M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z',
  cart: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z',
  school: 'M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z',
};

const POIs = [
  // LUAR
  {
    name: 'Proyecto Luar',
    lng: -74.0630,
    lat: 4.73540,
    color: '#dc2626',
    icon: '',
    image: '/Logo-Luar.webp',
    description: 'Nuestro más reciente proyecto de vivienda integral en La Colina. Cuenta con una arquitectura moderna y funcional, ideal para todos los momentos de la vida.'
  },

  // VÍAS PRINCIPALES (Gris oscuro)
  { name: 'Av. Suba (Cll 147)', lng: -74.068, lat: 4.736, color: '#4b5563', icon: ICONS.road, description: 'Vía inmediata al proyecto, garantizando un acceso rápido y directo a la red de transporte de la ciudad.' },
  { name: 'Av. Boyacá (Cra 72)', lng: -74.072, lat: 4.735, color: '#4b5563', icon: ICONS.road, description: 'Una de las arterias viales más importantes de Bogotá, facilitando la movilidad hacia el norte y el sur.' },
  { name: 'Autopista Norte', lng: -74.051, lat: 4.735, color: '#4b5563', icon: ICONS.road, description: 'Conexión rápida y estratégica que conecta con el centro financiero y salidas de la ciudad.' },
  { name: 'Cll 147 / Cll 136', lng: -74.060, lat: 4.731, color: '#4b5563', icon: ICONS.road, description: 'Vías locales e internas de La Colina que permiten un flujo vehicular tranquilo y residencial.' },

  // TRANSMILENIO (Rosa/Rojo)
  { name: 'Estación Gratamira', lng: -74.055, lat: 4.735, color: '#e11d48', icon: ICONS.bus, description: 'Estación de Transmilenio ideal para tu movilidad diaria. (Cll 145b · ~1 km ⭐4.0 · 4am–11pm L-V)' },
  { name: 'Av. Suba / Av. Boyacá', lng: -74.069, lat: 4.733, color: '#e11d48', icon: ICONS.bus, description: 'Parada estratégica de conexión masiva cerca de tu hogar. (~1.5 km)' },
  { name: '21 Ángeles', lng: -74.075, lat: 4.738, color: '#e11d48', icon: ICONS.bus, description: 'Estación de la Troncal Suba con múltiples rutas expresas. (~2 km)' },
  { name: 'Suba – Tv. 91', lng: -74.085, lat: 4.745, color: '#e11d48', icon: ICONS.bus, description: 'Acceso a rutas alimentadoras y servicios principales de Transmilenio. (Cra 91 #139 · ~2.5 km ⭐4.1)' },
  { name: 'Portal Suba', lng: -74.095, lat: 4.755, color: '#e11d48', icon: ICONS.bus, description: 'Terminal troncal con inicio de rutas y amplio servicio de alimentadores. (~4 km)' },
  { name: 'Estación Mazurén', lng: -74.052, lat: 4.743, color: '#e11d48', icon: ICONS.bus, description: 'Estación sobre la Autopista Norte para desplazamientos rápidos al centro. (~2.5 km)' },

  // SITP (Azul)
  { name: 'Paradero Cll 147 / Cra 58C', lng: -74.062, lat: 4.735, color: '#2563eb', icon: ICONS.bus, description: 'Frente al proyecto. Transporte público a solo unos pasos de casa. Rutas: 107B, 26B, 16, 62.' },
  { name: 'Urb. La Colina Campestre', lng: -74.067, lat: 4.738, color: '#2563eb', icon: ICONS.bus, description: 'Diversas paradas del SITP por la Cra 72 para mayor comodidad.' },
  { name: 'Br. Atenas', lng: -74.067, lat: 4.730, color: '#2563eb', icon: ICONS.bus, description: 'Paradero del sistema integrado en la Cll 145 con Cra 72.' },

  // CENTROS COMERCIALES (Morado)
  { name: 'Parque La Colina', lng: -74.059, lat: 4.734, color: '#8b5cf6', icon: ICONS.bag, description: 'El centro comercial más moderno y exclusivo del sector, con cines, restaurantes y tiendas premium. (Cra 58D #146-51 · ~700m ⭐4.6)' },
  { name: 'XMALL Colina Campestre', lng: -74.061, lat: 4.733, color: '#8b5cf6', icon: ICONS.bag, description: 'Mall de conveniencia pet-friendly ideal para compras rápidas y el día a día. (~800m ⭐4.6)' },
  { name: 'CC Multi Drive', lng: -74.064, lat: 4.732, color: '#8b5cf6', icon: ICONS.bag, description: 'Práctico centro comercial con D1, Dollar City, bancos y servicios esenciales. (~500m ⭐4.3)' },
  { name: 'Mall 138', lng: -74.058, lat: 4.720, color: '#8b5cf6', icon: ICONS.bag, description: 'Zona comercial con amplia oferta gastronómica, abierto todos los días. (~1 km ⭐4.3)' },
  { name: 'Porto Alegre Mall', lng: -74.065, lat: 4.725, color: '#8b5cf6', icon: ICONS.bag, description: 'Un espacio familiar con CineColombia, supermercados y entretenimiento. (~1.2 km ⭐4.2)' },
  { name: 'CC Sendero de la Colina', lng: -74.055, lat: 4.730, color: '#8b5cf6', icon: ICONS.bag, description: 'Lugar acogedor con farmacias, cafés y cajeros automáticos. (~1 km ⭐4.3)' },

  // SUPERMERCADOS Y TIENDAS (Verde)
  { name: 'Carulla Rincón de la Colina', lng: -74.061, lat: 4.737, color: '#10b981', icon: ICONS.cart, description: 'Supermercado premium ideal para mercar con comodidad y variedad de productos. (7am–9pm · ~900m ⭐4.5)' },
  { name: 'Supermercado Fruvar Express', lng: -74.0615, lat: 4.734, color: '#10b981', icon: ICONS.cart, description: 'La mejor opción para encontrar frutas, verduras y productos frescos de calidad. (~300m ⭐4.4)' },
  { name: 'Tienda Margareth', lng: -74.0625, lat: 4.735, color: '#10b981', icon: ICONS.cart, description: 'Tienda de barrio tradicional, perfecta para las compras del día a día. (8am–9:30pm · ~200m ⭐4.5)' },
  { name: 'Supermercado Olímpica', lng: -74.065, lat: 4.725, color: '#10b981', icon: ICONS.cart, description: 'Supermercado de gran formato para compras quincenales o mensuales. (6am–10pm · ~1.2 km ⭐4.3)' },
  { name: 'Éxito WOW Colina', lng: -74.058, lat: 4.733, color: '#10b981', icon: ICONS.cart, description: 'Hipermercado 24 horas con absolutamente todo lo que necesitas a cualquier hora. (~1 km ⭐4.4)' },
  { name: 'D1 / Ara', lng: -74.063, lat: 4.732, color: '#10b981', icon: ICONS.cart, description: 'Múltiples sedes de supermercados de descuento duro (Hard Discount) en la zona.' },

  // COLEGIOS (Naranja)
  { name: 'Colegio Anglo Colombiano', lng: -74.055, lat: 4.742, color: '#f59e0b', icon: ICONS.school, description: 'Bilingüe, IB · ⭐Prestigioso' },
];

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});
  const [activeLight, setActiveLight] = useState('dawn');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        // Cierra todos los demás popups usando la API
        Object.values(markersRef.current).forEach(m => {
          if (m && m.getPopup() && m.getPopup().isOpen()) {
            m.getPopup().remove();
          }
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
      center: [-74.059, 4.734],
      zoom: 15.5,
      pitch: 60,
      bearing: -20,
      antialias: true
    });

    map.current.on('load', () => {
      // Mapbox Standard has 3D buildings enabled by default!
      // We can also configure the light preset if desired (e.g. 'dusk', 'dawn', 'night')
      map.current.setConfigProperty('basemap', 'lightPreset', 'dawn');
      // Re-enable POI labels if the user wants them
      map.current.setConfigProperty('basemap', 'showPointOfInterestLabels', true);

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
              modelRotation: [0, 0, 15], // Girar en el eje Z para alinear a la carretera
              modelScale: [1, 1, 0.7] // Reducir la altura (eje Z)
            }
          }
        },
        layout: {
          'model-id': 'modelo-borneo'
        },
        paint: {
          'model-rotation': ['get', 'modelRotation'],
          'model-scale': ['get', 'modelScale'],
          'model-translation': [0, 0, -11.4], // Restaurar altura original para que no se hunda
          'model-color': '#ffffff', // Blanco puro
          'model-color-mix-intensity': 0.6 // Nivel de mezcla para aclarar significativamente la textura original
        }
      });

      // Render POIs
      POIs.forEach(poi => {
        const imageHtml = poi.image
          ? `<div style="height: 200px; width: 100%; overflow: hidden;">
               <img src="${poi.image}" alt="${poi.name}" style="width: 100%; height: 100%; object-fit: cover;" />
             </div>`
          : `<div style="height: 8px; width: 100%; background-color: ${poi.color};"></div>`;

        const descHtml = poi.description
          ? `<p style="margin-top: 8px; font-size: 14px; line-height: 1.5; color: #4b5563;">${poi.description}</p>`
          : '';

        const popupContent = `
          <div style="width: 320px; font-family: 'Inter', system-ui, sans-serif;">
            ${imageHtml}
            <div style="padding: 16px;">
              <h3 style="margin: 0; font-size: 20px; color: ${poi.color}; font-weight: 800; letter-spacing: -0.5px; line-height: 1.2;">${poi.name}</h3>
              ${descHtml}
            </div>
          </div>
        `;

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: true,
          maxWidth: '350px',
          className: 'modern-popup'
        }).setHTML(popupContent);

        if (poi.name.includes('Luar')) {
          // Custom marker for Luar
          const el = document.createElement('div');
          el.className = 'custom-borneo-marker';

          const inner = document.createElement('div');
          inner.className = 'custom-borneo-inner';
          inner.style.overflow = 'hidden';
          inner.innerHTML = '<img src="/logo-luar.png" alt="Luar" style="width: 100%; height: 100%; object-fit: cover;" />';

          const pulse = document.createElement('div');
          pulse.className = 'custom-borneo-pulse';

          el.appendChild(pulse);
          el.appendChild(inner);

          // Al ser un elemento HTML en 2D, colocar un offset alto hace que flote en el cielo al alejar.
          // Le pondremos un offset muy sutil para que no se separe de la ubicación geográfica.
          const marker = new mapboxgl.Marker({ element: el, offset: [0, -30] })
            .setLngLat([poi.lng, poi.lat])
            .setPopup(popup)
            .addTo(map.current);

          markersRef.current[poi.name] = marker;
        } else {
          // Attractive POI markers with SVG icons and labels
          const container = document.createElement('div');
          container.className = 'promo-marker-container';

          const circle = document.createElement('div');
          circle.className = 'promo-marker';
          circle.style.backgroundColor = poi.color; // Set the specific color for the icon background

          circle.innerHTML = `<svg viewBox="0 0 24 24"><path d="${poi.icon}"></path></svg>`;

          const label = document.createElement('div');
          label.className = 'promo-label';
          label.style.color = poi.color; // Match text color to the circle
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
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#1a1a1a] overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Controles de Iluminación */}
      <div className="absolute bottom-5  left-6 z-10 flex gap-2">
        <button
          onClick={() => changeLighting('dawn')}
          className={`px-4 py-2 rounded-full font-medium shadow-md transition-all cursor-pointer ${activeLight === 'dawn'
            ? 'bg-[#ff0000] text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          Mañana
        </button>
        <button
          onClick={() => changeLighting('day')}
          className={`px-4 py-2 rounded-full font-medium shadow-md transition-all cursor-pointer ${activeLight === 'day'
            ? 'bg-[#ff0000] text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          Día
        </button>
        <button
          onClick={() => changeLighting('dusk')}
          className={`px-4 py-2 rounded-full font-medium shadow-md transition-all cursor-pointer ${activeLight === 'dusk'
            ? 'bg-[#ff0000] text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          Noche
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

          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {POIs.map((poi, idx) => (
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
    </div>
  );
};

export default Map;
