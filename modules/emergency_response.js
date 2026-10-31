(() => {
  const officialSources = [{ name: 'IMD Mausam', url: 'https://mausam.imd.gov.in/' }, { name: 'NDMA SACHET', url: 'https://sachet.ndma.gov.in/' }];
  function safetyText() { return 'Follow official instructions first. Keep medicines, water, charged phones, and important documents ready. Avoid flooded roads and shorelines during warnings. Check IMD Mausam and NDMA SACHET; this dashboard does not issue warnings.'; }
  const modules = window.CycloneGuardModules = window.CycloneGuardModules || {};
  modules.emergency = { officialSources, safetyText };
})();
