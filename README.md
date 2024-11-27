
# Endocare

Overview
This project is a web-based application designed to predict the risk of endometriosis in women using machine learning models. The application allows users to input daily symptom data and view risk predictions for both individual days and weekly trends.
Features:
•⁠  ⁠Daily Risk Prediction: Users can select a date, input symptoms, and receive a prediction for that day.
•⁠  ⁠Weekly Risk Prediction: After inputting data for 7 consecutive days, users can receive a weekly risk prediction.
•⁠  ⁠Interactive Calendar: A calendar interface allows easy date selection for data input.

This project consists of two parts: NoPass and Calender
## Installation

Installation
1.⁠ ⁠Clone the repository:
2.⁠ ⁠git clone https://github.com/amey-patil306/EndoCare_Main
3.⁠ ⁠cd 'Model Training'
4.⁠ ⁠Create a virtual environment and activate it:
5.⁠ ⁠python -m venv venv
6.⁠ ⁠source venv/bin/activate  # On Windows: venv\Scripts\activate
7.⁠ ⁠Install the dependencies:
8.⁠ ⁠pip install -r requirements.txt
9.⁠ ⁠Place the models (dailymodel.pkl and time_series_model.pkl) in the project directory.

## Deployment

To deploy this project run

For NoPass Folder:
```bash
  npm install
  npm run dev
```
And in new terminal:
```bash
npm start server
```

For Calender :
```bash
  cd ..
  cd Calender
  npm install
  npm run dev
```
```bash
cd backend
```
in new terminal
```bash
python -m venv venv  
venv\Scripts\activate
pip install -r requirements.txt  
python app.py
```



## Usage

Usage
1.⁠ ⁠Run the Flask application:
2.⁠ ⁠python app.py
3.⁠ ⁠Open the browser and go to:
4.⁠ ⁠http://127.0.0.1:5000/
5.⁠ ⁠Select a date from the calendar and input symptoms for daily prediction. For weekly predictions, enter data for 7 days.

## API Reference

Llama AI has been used through its api. Llama AI, developed by Meta, is an open-source large language model (LLM) that can be highly useful in various projects due to its versatility and strong language-processing abilities.



| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. "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 " |




## Machine Learning Models used:

The project uses two models:
1.⁠ ⁠Model 1: A RandomForestClassifier for predicting daily risk scores based on symptom inputs.
2.⁠ ⁠Model 2: A RandomForestRegressor for predicting the average weekly risk score using data from 7 consecutive days.
Both models are trained on a dataset containing symptoms and corresponding risk scores.
Features Used for Model Training:
•⁠  ⁠Daily Model (Model 1):
o	period_pain
o	pelvic_pain
o	period_flow
o	pain_during_sex
o	fatigue_level
o	constipation
o	diarrhea
o	pain_during_bowel_movement
o	pain_during_urination
o	nausea
o	unexplained_bleeding
•⁠  ⁠Weekly Model (Model 2): Uses the same features but with averaged data over 7 days.
Dataset
The dataset is stored in an Excel file (dailydata.xlsx and timeseries.xlsx), containing the following columns:
•⁠  ⁠avgperiod_pain
•⁠  ⁠avgpelvic_pain
•⁠  ⁠avgperiod_flow
•⁠  ⁠avgpain_during_sex
•⁠  ⁠avgfatigue_level
•⁠  ⁠avgconstipation
•⁠  ⁠avgdiarrhea
•⁠  ⁠avgpain_during_bowel_movement
•⁠  ⁠avgpain_during_urination
•⁠  ⁠avgnausea
•⁠  ⁠avgunexplained_bleeding
•⁠  ⁠avgrisk_score (target variable)

## Prerequisites

•⁠  ⁠Python 3.8+
•⁠  ⁠pip (Python package manager)


Required Libraries:
•⁠  ⁠Flask
•⁠  ⁠pandas
•⁠  ⁠scikit-learn
•⁠  ⁠joblib
•⁠  ⁠openpyxl (for reading Excel files)

## Model Training 

Model Training Process
1.⁠ ⁠Data Cleaning: Columns were stripped of extra spaces, and missing values were handled using median imputation.
2.⁠ ⁠Model Selection: Random Forest models were chosen for both classification (daily) and regression (weekly) tasks due to their robustness.
3.⁠ ⁠Hyperparameter Tuning: GridSearchCV was used to optimize parameters, such as: 
o	n_estimators
o	max_depth
o	min_samples_split
o	min_samples_leaf
4.⁠ ⁠Evaluation Metrics: 
o	Daily Model: Accuracy, F1 Score.
o	Weekly Model: Mean Squared Error (MSE), R² score.

## Future Enhancements

•⁠  ⁠Add more features to capture additional symptoms or lifestyle factors.
•⁠  ⁠Implement a database for storing user data instead of Excel files.
•⁠  ⁠Improve UI/UX for a smoother user experience.

## Contributing

Feel free to fork the repository and submit pull requests. Contributions are welcome!

For any query contact:
Amey Patil
9022217721