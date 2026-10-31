"""Transparent screen from weather values; not an official warning or probability model."""
import argparse,json
def assess(wind_gust_kmh,rainfall_24h_mm):
    wind=max(0,float(wind_gust_kmh));rain=max(0,float(rainfall_24h_mm));level='HIGH' if wind>=60 or rain>=100 else 'MODERATE' if wind>=40 or rain>=60 else 'LOW'
    return {'level':level,'wind_gust_kmh':wind,'rainfall_24h_mm':rain,'official_warning':False,'method':'simple CycloneGuard thresholds'}
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--wind-gust-kmh',type=float,required=True);p.add_argument('--rainfall-24h-mm',type=float,required=True);a=p.parse_args();print(json.dumps(assess(a.wind_gust_kmh,a.rainfall_24h_mm),indent=2))
