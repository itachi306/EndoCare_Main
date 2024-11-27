import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const endometriosisRecommendation = async (data: any): Promise<string> => {
  try {
    const messages = [
      { role: "system", content: "You are an expert in endometriosis care. Provide safe exercise and diet recommendations based on the user's information." },
      { 
        role: "user", 
        content: `Please recommend exercises and a diet plan for a person with the following details: 
                  Age: ${data.age}, 
                  BMI: ${data.bmi}, 
                  Pain Level: ${data.painLevel}, 
                  Symptoms: ${data.symptoms}, 
                  Activity Level: ${data.activityLevel}, 
                  Dietary Preferences: ${data.dietaryPreferences || 'None'}, 
                  Existing Conditions: ${data.existingConditions}` 
      }
    ];

    // Save user data and preferences
    await axios.post(`${API_URL}/recommendations`, {
      userId: data.userId,
      age: parseInt(data.age),
      bmi: parseFloat(data.bmi),
      painLevel: parseInt(data.painLevel),
      symptoms: data.symptoms,
      activityLevel: data.activityLevel,
      dietaryPreferences: data.dietaryPreferences,
      existingConditions: data.existingConditions
    });

    // Get recommendations from LLaMA API
    const response = await axios.post(`${API_URL}/chat`, { 
      messages,
      userId: data.userId 
    });
    
    return response.data;
  } catch (error) {
    console.error('Error calling the API service:', error);
    throw new Error('Failed to get recommendations. Please try again.');
  }
};

export const getParticipationData = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics/participation`);
    return response.data;
  } catch (error) {
    console.error('Error fetching participation data:', error);
    throw new Error('Failed to fetch participation data');
  }
};

export const getWellnessScores = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics/wellness`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wellness scores:', error);
    throw new Error('Failed to fetch wellness scores');
  }
};

export const sendMessage = async (userId: string, message: string) => {
  try {
    const response = await axios.post(`${API_URL}/messages`, { userId, content: message });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
};
