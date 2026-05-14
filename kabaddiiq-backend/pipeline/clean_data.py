import pandas as pd
import numpy as np

def clean_players(path='data/raw/players_all_seasons.csv'):
    try:
        df = pd.read_csv(path)
    except FileNotFoundError:
        print(f"File {path} not found. Skipping.")
        return None
    print(f"Raw shape: {df.shape}")

    # Drop rows with no player name
    df = df.dropna(subset=['name'] if 'name' in df.columns else [df.columns[0]])

    # Fill numeric missing with 0 for early seasons
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    df[numeric_cols] = df[numeric_cols].fillna(0)

    # Standardise column names to lowercase
    df.columns = df.columns.str.lower().str.replace(' ', '_')

    df.to_csv('data/players_clean.csv', index=False)
    print(f"Clean shape: {df.shape}")
    return df

def clean_matches(path='data/raw/matches_all_seasons.csv'):
    try:
        df = pd.read_csv(path)
    except FileNotFoundError:
        print(f"File {path} not found. Skipping.")
        return None
    df.columns = df.columns.str.lower().str.replace(' ', '_')
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    df[numeric_cols] = df[numeric_cols].fillna(0)
    df.to_csv('data/matches_clean.csv', index=False)
    return df

if __name__ == "__main__":
    clean_players()
    clean_matches()
    print("Cleaning complete.")
