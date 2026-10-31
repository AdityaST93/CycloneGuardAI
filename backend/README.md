# Backend

The project uses a dependency-free Node.js HTTP server. API handlers use the WeatherAPI proxy (or Open-Meteo fallback), GDACS event feed, Google News RSS search, and optional server-side OpenAI Responses API. Secrets are read from `.env` only; static hosting blocks private service and model folders.
