import axios from 'axios';
import { DailySymptoms, DailyData } from '../types';

const API_URL = 'http://localhost:5000';

export const api = {
  async predictDaily(symptoms: DailySymptoms): Promise<number> {
    try {
      // Format symptoms exactly as expected by the Flask backend
      const formattedSymptoms = {
        periodPain: symptoms.periodPain,
        pelvicPain: symptoms.pelvicPain,
        periodFlow: symptoms.periodFlow,
        painDuringSex: symptoms.painDuringSex,
        fatigueLevel: symptoms.fatigueLevel,
        constipation: symptoms.constipation,
        diarrhea: symptoms.diarrhea,
        painDuringBowelMovement: symptoms.painDuringBowelMovement,
        painDuringUrination: symptoms.painDuringUrination,
        nausea: symptoms.nausea,
        unexplainedBleeding: symptoms.unexplainedBleeding
      };

      const response = await axios.post(`${API_URL}/predict-daily`, formattedSymptoms);
      return Number(response.data.risk_score);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to predict daily risk');
      }
      throw new Error('Failed to predict daily risk');
    }
  },

  async storeDaily(data: DailyData): Promise<void> {
    try {
      // Format data exactly as expected by the Flask backend
      const formattedData = {
        date: data.date,
        periodPain: data.periodPain,
        pelvicPain: data.pelvicPain,
        periodFlow: data.periodFlow,
        painDuringSex: data.painDuringSex,
        fatigueLevel: data.fatigueLevel,
        constipation: data.constipation,
        diarrhea: data.diarrhea,
        painDuringBowelMovement: data.painDuringBowelMovement,
        painDuringUrination: data.painDuringUrination,
        nausea: data.nausea,
        unexplainedBleeding: data.unexplainedBleeding,
        riskScore: data.riskScore
      };

      await axios.post(`${API_URL}/store-daily`, formattedData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to store daily data');
      }
      throw new Error('Failed to store daily data');
    }
  }
};