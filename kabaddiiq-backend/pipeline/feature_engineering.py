import pandas as pd
import numpy as np

def build_features(path='data/players_clean.csv'):
    try:
        df = pd.read_csv(path)
    except FileNotFoundError:
        print(f"File {path} not found. Skipping.")
        return None

    print("Available columns:", df.columns.tolist())

    # --- Core rate features ---
    if 'total_raids' in df.columns and 'successful_raids' in df.columns:
        df['raid_success_rate'] = (
            df['successful_raids'] / df['total_raids'].replace(0, np.nan)
        ).fillna(0)
    
    if 'total_tackles' in df.columns and 'successful_tackles' in df.columns:
        df['tackle_success_rate'] = (
            df['successful_tackles'] / df['total_tackles'].replace(0, np.nan)
        ).fillna(0)

    # --- Consistency score ---
    if 'raid_points' in df.columns:
        std_per_player = df.groupby('name')['raid_points'].transform('std').fillna(0)
        max_std = std_per_player.max()
        df['consistency_score'] = 1 - (std_per_player / (max_std + 1e-9))

    # --- Super raid frequency ---
    if 'super_raids' in df.columns and 'total_raids' in df.columns:
        df['super_raid_rate'] = (
            df['super_raids'] / df['total_raids'].replace(0, np.nan)
        ).fillna(0)

    # --- Points per match ---
    if 'raid_points' in df.columns and 'matches_played' in df.columns:
        df['points_per_match'] = (
            df['raid_points'] / df['matches_played'].replace(0, np.nan)
        ).fillna(0)

    # --- Composite valuation score (weighted) ---
    score_components = []
    if 'raid_success_rate' in df.columns:
        score_components.append(('raid_success_rate', 0.30))
    if 'tackle_success_rate' in df.columns:
        score_components.append(('tackle_success_rate', 0.25))
    if 'consistency_score' in df.columns:
        score_components.append(('consistency_score', 0.20))
    if 'super_raid_rate' in df.columns:
        score_components.append(('super_raid_rate', 0.15))
    if 'points_per_match' in df.columns:
        score_components.append(('points_per_match', 0.10))

    if score_components:
        df['raw_score'] = sum(
            df[col] * weight for col, weight in score_components
        )
        # Normalise to 0–100
        min_score = df['raw_score'].min()
        max_score = df['raw_score'].max()
        if max_score > min_score:
            df['valuation_score'] = (
                (df['raw_score'] - min_score) / (max_score - min_score) * 100
            ).round(1)
        else:
            df['valuation_score'] = 50.0

    # --- Tier assignment ---
    def assign_tier(score):
        if score >= 80: return 'Elite'
        elif score >= 65: return 'Strong'
        elif score >= 45: return 'Average'
        else: return 'Developing'

    if 'valuation_score' in df.columns:
        df['tier'] = df['valuation_score'].apply(assign_tier)

    # --- Form indicator (last 3 seasons trend) ---
    if 'valuation_score' in df.columns and 'season' in df.columns:
        df = df.sort_values(['name', 'season'])
        df['prev_score'] = df.groupby('name')['valuation_score'].shift(1)
        df['form'] = df.apply(
            lambda row: 'rising' if row['valuation_score'] > (row['prev_score'] or 0) + 3
            else 'falling' if row['valuation_score'] < (row['prev_score'] or 0) - 3
            else 'stable', axis=1
        )

    df.to_csv('data/players_features.csv', index=False)
    print(f"Features built. Shape: {df.shape}")
    return df

if __name__ == "__main__":
    build_features()
    print("Feature engineering complete.")
