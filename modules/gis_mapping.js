(() => {
  function createBaseLayers() {
    const imagery = window.CycloneGuardModules.satellite.imageryConfig();
    return {
      street: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Tiles © Esri, HERE, Garmin, FAO, NOAA, USGS' }),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Tiles © Esri' }),
      terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17, attribution: '© OpenStreetMap contributors · OpenTopoMap' }),
      viirs: L.tileLayer(imagery.url, { maxNativeZoom: imagery.maxNativeZoom, maxZoom: imagery.maxZoom, attribution: imagery.attribution }),
      imageryDate: imagery.day,
    };
  }
  const modules = window.CycloneGuardModules = window.CycloneGuardModules || {};
  modules.gis = { createBaseLayers };
})();
