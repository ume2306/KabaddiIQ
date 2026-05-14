from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os
import anthropic
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="KabaddiIQ API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for data
players_df = None
team_profiles_df = None
shap_df = None
model = None
features = None

@app.on_event("startup")
async def load_data():
    global players_df, team_profiles_df, shap_df, model, features
    try:
        if os.path.exists('data/players_features.csv'):
            players_df = pd.read_csv('data/players_features.csv')
        if os.path.exists('data/team_profiles.csv'):
            team_profiles_df = pd.read_csv('data/team_profiles.csv')
        if os.path.exists('data/shap_values.csv'):
            shap_df = pd.read_csv('data/shap_values.csv')
        if os.path.exists('models/valuation_model.pkl'):
            model = joblib.load('models/valuation_model.pkl')
        if os.path.exists('models/feature_names.pkl'):
            features = joblib.load('models/feature_names.pkl')
        print("Backend data initialized")
    except Exception as e:
        print(f"Startup error: {e}")

# --- Endpoints ---

@app.get("/player/{name}")
async def get_player(name: str):
    if players_df is None: raise HTTPException(status_code=500, detail="Data not loaded")
    matches = players_df[players_df['name'].str.lower().str.contains(name.lower(), na=False)]
    if matches.empty: raise HTTPException(status_code=404, detail="Player not found")

    latest = matches.sort_values('season').iloc[-1]
    
    # SHAP breakdown
    shap_breakdown = {}
    if shap_df is not None:
        p_shap = shap_df[shap_df['name'].str.lower().str.contains(name.lower(), na=False)]
        if not p_shap.empty and features:
            for feat in features:
                if feat in p_shap.columns:
                    shap_breakdown[feat] = float(p_shap[feat].iloc[-1])

    return {
        "name": str(latest['name']),
        "team": str(latest['team']),
        "position": str(latest.get('position', 'Unknown')),
        "valuation_score": float(latest.get('valuation_score', 0)),
        "tier": str(latest.get('tier', 'Unknown')),
        "form": str(latest.get('form', 'stable')),
        "shap": shap_breakdown,
        "season_trend": matches.sort_values('season')[['season', 'valuation_score']].to_dict('records')
    }

@app.get("/players/search/{query}")
async def search_players(query: str):
    if players_df is None: return {"results": []}
    matches = players_df[players_df['name'].str.lower().str.contains(query.lower(), na=False)]
    return {"results": matches['name'].unique().tolist()[:10]}

@app.get("/league/overview")
async def league_overview():
    if players_df is None: raise HTTPException(status_code=500, detail="Data not loaded")
    latest_season = players_df['season'].max()
    current = players_df[players_df['season'] == latest_season]
    
    top10 = current.nlargest(10, 'valuation_score')[['name', 'team', 'valuation_score', 'tier', 'form']].to_dict('records')
    return {"season": int(latest_season), "top10": top10}

@app.get("/teams")
async def get_teams():
    if team_profiles_df is None: return {"teams": []}
    return {"teams": team_profiles_df['team'].unique().tolist()}

@app.get("/opponent/{team}")
async def get_opponent(team: str):
    if team_profiles_df is None: raise HTTPException(status_code=500, detail="Data not loaded")
    match = team_profiles_df[team_profiles_df['team'].str.lower().str.contains(team.lower(), na=False)]
    if match.empty: raise HTTPException(status_code=404, detail="Team not found")
    return match.iloc[0].to_dict()

class ChatRequest(BaseModel):
    message: str
    conversation_history: list = []

@app.post("/chat")
async def chat(request: ChatRequest):
    # If API key not set, return mock
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key or "your_key" in api_key:
        # Fallback to local mock response logic
        msg = request.message.lower()
        if "naveen" in msg: resp = "Naveen Kumar is the top raider this season with a valuation of 87."
        elif "jaipur" in msg: resp = "Jaipur Pink Panthers show strong defense in the right corner but weakness in left-in zone."
        else: resp = "I'm KabaddiIQ. Ask me about player valuations, team tactics, or season trends!"
        return {"response": resp, "role": "assistant"}

    client = anthropic.Anthropic(api_key=api_key)
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=300,
        system="You are KabaddiIQ, a professional PKL analyst. Use data to answer player and tactical questions.",
        messages=request.conversation_history + [{"role": "user", "content": request.message}]
    )
    return {"response": response.content[0].text, "role": "assistant"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
