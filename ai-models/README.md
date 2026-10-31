# Optional research baselines

Install Python dependencies using `python -m pip install -r ai-models/requirements.txt`. Add documented, verified historical rows to the CSV files in `data/`, then run `npm run models:train`. Training intentionally fails if source data or minimum observation counts are missing. The included files contain headers only; no synthetic cyclone or rainfall records are supplied. Models are research experiments, not operational forecasts or warnings.
