import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
from sklearn.metrics import classification_report

# Load the dataset
file_path = 'timeseries.xlsx'
data = pd.read_excel(file_path)

# Drop non-feature columns
features = [
    'Avg. Period Pain', 'Avg. Pelvic Pain', 'Avg. Period Flow', 'Avg. Pain During Sex',
    'Avg. Fatigue Level', 'Avg. Constipation', 'Avg. Diarrhea', 
    'Avg. Pain During Bowel Movements', 'Avg. Pain During Urination', 
    'Avg. Nausea', 'Avg. Unexplained Bleeding'
]
X = data[features]
y = data['Endometriosis Risk Score']  

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a Random Forest Regressor
model = RandomForestRegressor(random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"Mean Squared Error: {mse}")
print(f"R^2 Score: {r2}")

y_pred = model.predict(X_test)
print("Classification Report:\n", classification_report(y_test, y_pred))

# Save the trained model
model_path = 'time_series_model.pkl'
joblib.dump(model, model_path)
print(f"Time Series Model saved at {model_path}")
