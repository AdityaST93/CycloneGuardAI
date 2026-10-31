# CycloneGuard AI

**Weather Forecasting & Natural Disaster Intelligence System** — a local web dashboard for current weather, forecasts, global hazard events, risk-screening indicators, and optional AI/voice assistance.

## Run locally (Windows / VS Code)

Requirements: Node.js 18 or later. No `npm install` is required; the server uses Node built-ins and browser libraries load from public CDNs.

```powershell
cd "C:\path\to\CycloneGuard-AI"
npm start
```

Open the URL printed by the server (normally `http://localhost:5173`). Keep the terminal open while using the site. Do not double-click `index.html`; microphone access and the backend require localhost. Stop the server with Ctrl+C.

## Deploy online (Render)

This is a Node web service, so deploy the project folder through a GitHub repository to Render (a static-only host such as GitHub Pages cannot run `server.js`). In Render, create **New → Web Service**, connect the GitHub repository, and use:

- Runtime: **Node**
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/status`
- Environment variable: `HOST` = `0.0.0.0`

Render supplies `PORT` automatically. The app uses Open-Meteo and public feeds without API keys. Add optional `WEATHER_API_KEY` or `OPENAI_API_KEY` later in the Render service's **Environment** settings; do not commit `.env` or put keys in frontend files. A free Render service may sleep after inactivity and take about a minute to start again.

## Optional credentials

The dashboard runs without API keys using Open-Meteo weather/geocoding and public GDACS/news feeds. To enable WeatherAPI and model-backed conversational AI:

```powershell
Copy-Item .env.example .env
notepad .env
```

Set `WEATHER_API_KEY` to a newly generated WeatherAPI key, and optionally set `OPENAI_API_KEY` for conversational chat and voice answers. Then restart `npm start`. Keep `.env` private; it is ignored by Git and never returned to the browser. The WeatherAPI key shared in the prior chat should be revoked and replaced.

## What the app does

- Location search, current conditions, 7-day forecast, hourly charts, temperature/wind/rain metrics, and optional air-quality readings.
- Interactive Leaflet street, terrain, Esri satellite, NASA GIBS/VIIRS imagery, and GDACS event layers. Satellite imagery is a basemap; this project does not label it as radar.
- Recent global multi-hazard event data from GDACS and weather headlines from Google News RSS, alongside official India IMD and NDMA SACHET links.
- Weather alert notices where the WeatherAPI plan/region supplies them. Risk colors use simple wind/rain thresholds and are not calibrated impact probabilities or official warnings.
- Optional server-side OpenAI assistant uses refreshed dashboard context and short conversation history. Without an AI key, typed questions receive a clearly limited local data summary; voice AI explains the missing setup rather than pretending a fixed answer is an AI model.
- Opt-in continuous browser speech recognition, speech output, interruption, Stop Voice, Mute, and English/Hindi selection. Browser/OS support varies; microphone audio may be processed by the browser speech provider.
- Visible-page feed refresh every 15 minutes.

## Project structure

```text
backend/       Node route dispatcher and weather/cyclone/alert/news/satellite services
ai-models/     optional cyclone/rainfall research training and threshold screening
data/          empty JSON stores and header-only CSV dataset templates
modules/       live weather, GIS, satellite, risk, voice, emergency browser helpers
database/      validated JSON collection helpers (not MongoDB)
public/        images/, icons/, maps/ asset folders
index.html     dashboard structure
app.js         browser UI and dashboard orchestration
server.js      local HTTP server, secure API proxies, optional OpenAI endpoint
styles.css     responsive dark/light UI
```

## Optional model experiments

Install the Python packages with `python -m pip install -r ai-models/requirements.txt`. Add verified, licensed cyclone best-track and hourly weather observations matching the CSV headers. Run `npm run models:train`. It will stop if adequate data is missing; no historical sample values are fabricated. These baseline models are not validated operational forecasts.

## Limitations

Public feed availability depends on upstream services and connectivity. No official district-warning API, flood extent model, verified shelter directory, or operational cyclone track/intensity model is connected. Use official authorities for emergency decisions. Forecast maps and global event feeds do not establish local safety.
