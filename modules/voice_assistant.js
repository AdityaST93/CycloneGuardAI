(() => {
  function language(text, selected) { return /[\u0900-\u097f]/.test(String(text)) ? 'hi-IN' : selected; }
  function voiceFor(voices, lang) { return voices.find(v => v.lang.toLowerCase() === lang.toLowerCase()) || voices.find(v => v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase())) || null; }
  const modules = window.CycloneGuardModules = window.CycloneGuardModules || {};
  modules.voice = { language, voiceFor };
})();
