"""Train baselines only when verified source datasets have been added."""
from pathlib import Path
from cyclone_prediction import train as train_cyclone
from rainfall_prediction import train as train_rainfall
ROOT=Path(__file__).resolve().parent.parent
def main():
    cyclone=ROOT/'data'/'historical_cyclone_data.csv';weather=ROOT/'data'/'weather_observations.csv'
    if cyclone.stat().st_size<60 or weather.stat().st_size<80:raise SystemExit('Add real, source-documented historical datasets first; the included files are headers only.')
    print({'cyclone_training_rows':train_cyclone(cyclone,ROOT/'ai-models/artifacts/cyclone.joblib'),'rainfall_training_rows':train_rainfall(weather,ROOT/'ai-models/artifacts/rainfall.joblib')})
if __name__=='__main__':main()
