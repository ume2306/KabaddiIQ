import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import shap
import joblib
import os

def train_valuation_model():
    try:
        df = pd.read_csv('data/players_features.csv')
    except FileNotFoundError:
        print("data/players_features.csv not found. Run feature_engineering.py first.")
        return

    # Select feature columns
    candidate_features = [
        'raid_success_rate', 'tackle_success_rate',
        'consistency_score', 'super_raid_rate',
        'points_per_match'
    ]
    features = [f for f in candidate_features if f in df.columns]
    target = 'valuation_score'

    if target not in df.columns or not features:
        print("Required columns missing.")
        return

    df_model = df[features + [target, 'name', 'season']].dropna()
    X = df_model[features]
    y = df_model[target]

    if len(X) < 10:
        print("Not enough data to train model.")
        # Create dummy shap values for API consistency
        dummy_shap = pd.DataFrame(np.zeros((len(df), len(features))), columns=features)
        dummy_shap['name'] = df['name']
        dummy_shap.to_csv('data/shap_values.csv', index=False)
        return

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = XGBRegressor(n_estimators=100, max_depth=4, learning_rate=0.1, random_state=42)
    model.fit(X_train, y_train)

    # Save model and features
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/valuation_model.pkl')
    joblib.dump(features, 'models/feature_names.pkl')

    # Compute SHAP values
    explainer = shap.Explainer(model)
    shap_values = explainer(X)
    shap_df = pd.DataFrame(shap_values.values, columns=features)
    shap_df['name'] = df_model['name'].values
    shap_df.to_csv('data/shap_values.csv', index=False)

    print("Model and SHAP values saved successfully.")

if __name__ == "__main__":
    train_valuation_model()
