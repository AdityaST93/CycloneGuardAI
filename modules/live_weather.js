(() => {
  async function request(url, options = {}) {
    const response = await fetch(url, { cache: 'no-store', ...options });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
    return data;
  }
  const modules = window.CycloneGuardModules = window.CycloneGuardModules || {};
  modules.weather = { forecast: (query, days = 7) => request(`/api/weather/forecast?${new URLSearchParams({ q: query, days })}`), search: query => request(`/api/weather/search?q=${encodeURIComponent(query)}`) };
})();
