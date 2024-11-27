import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, f1_score
import joblib

# Load the dataset
file_path = 'dailydata.xlsx' 
data = pd.read_excel(file_path)

# Define features and target 
features = [
    'Period Pain (1-10)', 'Pelvic Pain (1-10)', 'Period Flow (Light=1/Moderate=2/Heavy=3)',
    'Pain During Sex (1-10)', 'Fatigue Level (1-10)', 'Constipation (1-10)',
    'Diarrhea (1-10)', 'Pain During Bowel Movement (1-10)', 'Pain During Urination (1-10)',
    'Nausea (1-10)', 'Unexplained Bleeding (1-10)'
]
target = 'Endometriosis Risk Score '  

# Select features and target
X = data[features]
y = data[target]

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Define the model and grid search for hyperparameter tuning
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'class_weight': ['balanced', None]
}

model = RandomForestClassifier(random_state=42)
grid_search = GridSearchCV(estimator=model, param_grid=param_grid, cv=5, scoring='accuracy', n_jobs=-1)

# Train the model
grid_search.fit(X_train, y_train)

# Get the best model
best_model = grid_search.best_estimator_

# Evaluate the model
y_pred = best_model.predict(X_test)
print("Classification Report:\n", classification_report(y_test, y_pred))
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")
print(f"F1 Score (weighted): {f1_score(y_test, y_pred, average='weighted'):.2f}")

# Feature importances
feature_importances = pd.DataFrame({
    'Feature': features,
    'Importance': best_model.feature_importances_
}).sort_values(by='Importance', ascending=False)
print("\nFeature Importances:\n", feature_importances)

# Save the trained model
model_path = 'optimized_daily_symptom_model.pkl'
joblib.dump(best_model, model_path)
print(f"Model saved at {model_path}")
