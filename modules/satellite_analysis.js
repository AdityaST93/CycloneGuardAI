(() => {
  function imageryConfig(date = new Date(Date.now() - 2 * 86400000)) {
    const day = date.toISOString().slice(0, 10);
    return { day, url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${day}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`, maxNativeZoom: 9, maxZoom: 15, attribution: `NASA GIBS / VIIRS SNPP · imagery ${day}` };
  }
  const modules = window.CycloneGuardModules = window.CycloneGuardModules || {};
  modules.satellite = { imageryConfig };
})();
