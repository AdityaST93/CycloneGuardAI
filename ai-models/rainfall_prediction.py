"""Research rainfall baseline; requires real hourly weather observation data."""
import argparse
from pathlib import Path
import joblib,pandas as pd
from sklearn.ensemble import RandomForestRegressor
FEATURES=['temperature_c','humidity_percent','wind_kmh','pressure_hpa'];TARGET='rainfall_next_hour_mm'
def train(csv_path,model_path):
    frame=pd.read_csv(csv_path);missing=set([*FEATURES,TARGET])-set(frame.columns)
    if missing:raise ValueError('Missing columns: '+', '.join(sorted(missing)))
    frame=frame.dropna(subset=[*FEATURES,TARGET])
    if len(frame)<100:raise ValueError('At least 100 real hourly observations are required.')
    model=RandomForestRegressor(n_estimators=250,min_samples_leaf=3,random_state=42,n_jobs=-1).fit(frame[FEATURES],frame[TARGET].clip(lower=0));model_path=Path(model_path);model_path.parent.mkdir(parents=True,exist_ok=True);joblib.dump({'model':model,'features':FEATURES,'rows':len(frame)},model_path);return len(frame)
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--data',default='data/weather_observations.csv');p.add_argument('--model',default='ai-models/artifacts/rainfall.joblib');a=p.parse_args();print({'training_rows':train(a.data,a.model),'warning':'Research model only; not an official forecast.'})
