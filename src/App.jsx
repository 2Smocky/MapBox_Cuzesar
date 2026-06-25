import React from 'react';
import Header from './components/Header';
import Map from './components/Map';

function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Header />
      {/* Map container takes full screen, padding top prevents header overlap if needed, but since it's a map we can let it be full screen and just have header float over it */}
      <div className="absolute inset-0 pt-16">
        <Map />
      </div>
    </div>
  );
}

export default App;
