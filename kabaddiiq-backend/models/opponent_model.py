import pandas as pd
import numpy as np

def build_opponent_profiles():
    try:
        df = pd.read_csv('data/players_features.csv')
    except FileNotFoundError:
        print("data/players_features.csv not found.")
        return

    # Build team-level aggregates
    agg_dict = {'valuation_score': 'mean'}
    if 'raid_success_rate' in df.columns: agg_dict['raid_success_rate'] = 'mean'
    if 'tackle_success_rate' in df.columns: agg_dict['tackle_success_rate'] = 'mean'

    team_profiles = df.groupby('team').agg(agg_dict).reset_index()
    team_profiles.columns = ['team', 'avg_valuation'] + [f'avg_{c}' for c in agg_dict.keys() if c != 'valuation_score']
    
    team_profiles.to_csv('data/team_profiles.csv', index=False)
    print(f"Team profiles built for {len(team_profiles)} teams")
    return team_profiles

if __name__ == "__main__":
    build_opponent_profiles()
