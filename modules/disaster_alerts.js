(() => {
  function screen(wind, rain) {
    wind = Number(wind) || 0; rain = Number(rain) || 0;
    return { level: wind >= 60 || rain >= 100 ? 'HIGH' : wind >= 40 || rain >= 60 ? 'MODERATE' : 'LOW', officialWarning: false, method: 'Simple screening thresholds' };
  }
  const modules = window.CycloneGuardModules = window.CycloneGuardModules || {};
  modules.alerts = { screen };
})();
