from kabaddipy import PKL
import pandas as pd
import os

pkl = PKL()

def fetch_all_player_stats():
    all_seasons = []
    for season in range(1, 12):
        try:
            df = pkl.get_player_stats(season=season)
            df['season'] = season
            all_seasons.append(df)
            print(f"Season {season} fetched — {len(df)} players")
        except Exception as e:
            print(f"Season {season} failed: {e}")
    if not all_seasons:
        print("No player stats fetched.")
        return None
    full = pd.concat(all_seasons, ignore_index=True)
    full.to_csv('data/raw/players_all_seasons.csv', index=False)
    print(f"Saved {len(full)} total records")
    return full

def fetch_match_data():
    all_matches = []
    for season in range(1, 12):
        try:
            matches = pkl.get_matches_by_season(season=season)
            matches['season'] = season
            all_matches.append(matches)
            print(f"Season {season} matches fetched — {len(matches)} matches")
        except Exception as e:
            print(f"Season {season} matches failed: {e}")
    if not all_matches:
        print("No match data fetched.")
        return None
    full = pd.concat(all_matches, ignore_index=True)
    full.to_csv('data/raw/matches_all_seasons.csv', index=False)
    return full

def fetch_zone_data():
    all_zones = []
    for season in range(1, 12):
        try:
            zones = pkl.get_player_stats(
                season=season,
                rank_by="raid_points"
            )
            zones['season'] = season
            all_zones.append(zones)
        except Exception as e:
            print(f"Season {season} zone data failed: {e}")
    if not all_zones:
        print("No zone data fetched.")
        return None
    full = pd.concat(all_zones, ignore_index=True)
    full.to_csv('data/raw/zones_all_seasons.csv', index=False)
    return full

if __name__ == "__main__":
    os.makedirs('data/raw', exist_ok=True)
    print("Fetching player stats...")
    fetch_all_player_stats()
    print("Fetching match data...")
    fetch_match_data()
    print("Fetching zone data...")
    fetch_zone_data()
    print("All data fetched successfully.")
