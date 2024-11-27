from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import joblib

app = Flask(__name__)
CORS(app)

# Load ML models
MODEL_DIR = 'models'
daily_model = joblib.load(os.path.join(MODEL_DIR, 'optimized_daily_symptom_model.pkl'))
weekly_model = joblib.load(os.path.join(MODEL_DIR, 'time_series_model.pkl'))

# Data storage paths
DATA_DIR = 'data'
DAILY_DATA_PATH = os.path.join(DATA_DIR, 'daily_data.xlsx')
WEEKLY_DATA_PATH = os.path.join(DATA_DIR, 'weekly_predictions.xlsx')

def ensure_data_files_exist():
    """Ensure data directory and files exist"""
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    
    if not os.path.exists(DAILY_DATA_PATH):
        pd.DataFrame(columns=[
            'date', 'periodPain', 'pelvicPain', 'periodFlow', 'painDuringSex',
            'fatigueLevel', 'constipation', 'diarrhea', 'painDuringBowelMovement',
            'painDuringUrination', 'nausea', 'unexplainedBleeding', 'riskScore'
        ]).to_excel(DAILY_DATA_PATH, index=False)
    
    if not os.path.exists(WEEKLY_DATA_PATH):
        pd.DataFrame(columns=[
            'weekStart', 'weekEnd', 'averageRiskScore',
            'endometriosisLikelihood'
        ]).to_excel(WEEKLY_DATA_PATH, index=False)

ensure_data_files_exist()

def format_daily_input(data):
    """Format input data for daily model prediction with correct feature names"""
    return pd.DataFrame([{
        'Period Pain (1-10)': float(data['periodPain']),
        'Pelvic Pain (1-10)': float(data['pelvicPain']),
        'Period Flow (Light=1/Moderate=2/Heavy=3)': float(data['periodFlow']),
        'Pain During Sex (1-10)': float(data['painDuringSex']),
        'Fatigue Level (1-10)': float(data['fatigueLevel']),
        'Constipation (1-10)': float(data['constipation']),
        'Diarrhea (1-10)': float(data['diarrhea']),
        'Pain During Bowel Movement (1-10)': float(data['painDuringBowelMovement']),
        'Pain During Urination (1-10)': float(data['painDuringUrination']),
        'Nausea (1-10)': float(data['nausea']),
        'Unexplained Bleeding (1-10)': float(data['unexplainedBleeding'])
    }])

def format_weekly_input(data):
    """Format input data for weekly model prediction with correct feature names"""
    return pd.DataFrame([{
        'Avg. Period Pain': float(data['periodPain']),
        'Avg. Pelvic Pain': float(data['pelvicPain']),
        'Avg. Period Flow': float(data['periodFlow']),
        'Avg. Pain During Sex': float(data['painDuringSex']),
        'Avg. Fatigue Level': float(data['fatigueLevel']),
        'Avg. Constipation': float(data['constipation']),
        'Avg. Diarrhea': float(data['diarrhea']),
        'Avg. Pain During Bowel Movements': float(data['painDuringBowelMovement']),
        'Avg. Pain During Urination': float(data['painDuringUrination']),
        'Avg. Nausea': float(data['nausea']),
        'Avg. Unexplained Bleeding': float(data['unexplainedBleeding'])
    }])

@app.route('/predict-daily', methods=['POST'])
def predict_daily():
    try:
        data = request.json
        formatted_data = format_daily_input(data)
        risk_score = float(daily_model.predict(formatted_data)[0])
        return jsonify({'risk_score': risk_score})
    except Exception as e:
        print(f"Error in predict_daily: {str(e)}")
        return jsonify({'error': str(e)}), 400

@app.route('/store-daily', methods=['POST'])
def store_daily():
    try:
        data = request.json
        df = pd.read_excel(DAILY_DATA_PATH)
        
        new_row = pd.DataFrame([{
            'date': data['date'],
            'periodPain': data['periodPain'],
            'pelvicPain': data['pelvicPain'],
            'periodFlow': data['periodFlow'],
            'painDuringSex': data['painDuringSex'],
            'fatigueLevel': data['fatigueLevel'],
            'constipation': data['constipation'],
            'diarrhea': data['diarrhea'],
            'painDuringBowelMovement': data['painDuringBowelMovement'],
            'painDuringUrination': data['painDuringUrination'],
            'nausea': data['nausea'],
            'unexplainedBleeding': data['unexplainedBleeding'],
            'riskScore': data['riskScore']
        }])
        
        df = pd.concat([df, new_row], ignore_index=True)
        df.to_excel(DAILY_DATA_PATH, index=False)
        
        update_weekly_predictions()
        return jsonify({'message': 'Data stored successfully'})
    except Exception as e:
        print(f"Error in store_daily: {str(e)}")
        return jsonify({'error': str(e)}), 400

def update_weekly_predictions():
    """Update weekly predictions based on daily data"""
    try:
        df = pd.read_excel(DAILY_DATA_PATH)
        weekly_df = pd.DataFrame(columns=['weekStart', 'weekEnd', 'averageRiskScore', 'endometriosisLikelihood'])
        
        if not df.empty:
            df['date'] = pd.to_datetime(df['date'])
            min_date = df['date'].min()
            max_date = df['date'].max()
            
            current_week = min_date - pd.Timedelta(days=min_date.weekday())
            while current_week <= max_date:
                week_end = current_week + pd.Timedelta(days=6)
                week_data = df[(df['date'] >= current_week) & (df['date'] <= week_end)]
                
                if not week_data.empty:
                    avg_data = {
                        'periodPain': week_data['periodPain'].mean(),
                        'pelvicPain': week_data['pelvicPain'].mean(),
                        'periodFlow': week_data['periodFlow'].mean(),
                        'painDuringSex': week_data['painDuringSex'].mean(),
                        'fatigueLevel': week_data['fatigueLevel'].mean(),
                        'constipation': week_data['constipation'].mean(),
                        'diarrhea': week_data['diarrhea'].mean(),
                        'painDuringBowelMovement': week_data['painDuringBowelMovement'].mean(),
                        'painDuringUrination': week_data['painDuringUrination'].mean(),
                        'nausea': week_data['nausea'].mean(),
                        'unexplainedBleeding': week_data['unexplainedBleeding'].mean()
                    }
                    
                    formatted_data = format_weekly_input(avg_data)
                    likelihood = float(weekly_model.predict(formatted_data)[0])
                    
                    weekly_df = pd.concat([weekly_df, pd.DataFrame([{
                        'weekStart': current_week.isoformat(),
                        'weekEnd': week_end.isoformat(),
                        'averageRiskScore': week_data['riskScore'].mean(),
                        'endometriosisLikelihood': likelihood
                    }])], ignore_index=True)
                
                current_week += pd.Timedelta(days=7)
        
        weekly_df.to_excel(WEEKLY_DATA_PATH, index=False)
    except Exception as e:
        print(f"Error in update_weekly_predictions: {str(e)}")
        raise

@app.route('/get-history', methods=['GET'])
def get_history():
    try:
        daily_df = pd.read_excel(DAILY_DATA_PATH)
        weekly_df = pd.read_excel(WEEKLY_DATA_PATH)
        
        return jsonify({
            'dailyData': daily_df.to_dict('records'),
            'weeklyPredictions': weekly_df.to_dict('records')
        })
    except Exception as e:
        print(f"Error in get_history: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)