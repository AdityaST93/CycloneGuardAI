"""Research baseline: predict next best-track point from sourced historical data.
CSV columns: storm_id,time,latitude,longitude,max_wind_kmh,pressure_hpa.
Not an operational cyclone forecast.
"""
import argparse
from pathlib import Path
import joblib,pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
FEATURES=['latitude','longitude','max_wind_kmh','pressure_hpa'];TARGETS=['latitude','longitude','max_wind_kmh']
def train(csv_path,model_path):
    frame=pd.read_csv(csv_path);missing=set(['storm_id','time',*FEATURES])-set(frame.columns)
    if missing:raise ValueError('Missing columns: '+', '.join(sorted(missing)))
    frame['time']=pd.to_datetime(frame.time,utc=True,errors='coerce');frame=frame.dropna(subset=['storm_id','time',*FEATURES]).sort_values(['storm_id','time']);xs=[];ys=[]
    for _,g in frame.groupby('storm_id'):
        if len(g)>1:xs.extend(g[FEATURES].iloc[:-1].values);ys.extend(g[TARGETS].iloc[1:].values)
    if len(xs)<20:raise ValueError('At least 20 consecutive, verified best-track transitions are required.')
    model=MultiOutputRegressor(RandomForestRegressor(n_estimators=250,min_samples_leaf=2,random_state=42,n_jobs=-1)).fit(xs,ys);model_path=Path(model_path);model_path.parent.mkdir(parents=True,exist_ok=True);joblib.dump({'model':model,'features':FEATURES,'targets':TARGETS,'rows':len(xs)},model_path);return len(xs)
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--data',default='data/historical_cyclone_data.csv');p.add_argument('--model',default='ai-models/artifacts/cyclone.joblib');a=p.parse_args();print({'training_rows':train(a.data,a.model),'warning':'Research model only; not an official forecast.'})
