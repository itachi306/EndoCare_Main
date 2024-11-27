import React, { useState, useEffect } from 'react';
import { isSameDay } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from './components/Calendar';
import SymptomModal from './components/SymptomModal';
import WeeklyReport from './components/WeeklyReport';
import FileUpload from './components/FileUpload';
import { DailyData, DailySymptoms } from './types';
import { api } from './services/api';
import { Activity, Loader2 } from 'lucide-react';

export default function App() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleSymptomSubmit = async (symptoms: DailySymptoms) => {
    try {
      setIsLoading(true);
      setError(null);
      const riskScore = await api.predictDaily(symptoms);
      
      const newDailyData: DailyData = {
        ...symptoms,
        date: selectedDate.toISOString(),
        riskScore
      };

      await api.storeDaily(newDailyData);
      
      setDailyData(prev => {
        const filtered = prev.filter(d => !isSameDay(new Date(d.date), selectedDate));
        return [...filtered, newDailyData];
      });

      setIsModalOpen(false);
      toast.success('Symptoms saved successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save symptoms';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileData = (data: DailyData[]) => {
    setDailyData(data);
    toast.success('Historical data loaded successfully');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Processing your health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="w-8 h-8 text-indigo-600" />
            Endometriosis Monitoring System
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Calendar
              currentDate={currentDate}
              dailyData={dailyData}
              onDateSelect={handleDateSelect}
            />
            <WeeklyReport dailyData={dailyData} />
          </div>
          <div className="space-y-8">
            <FileUpload onDataLoaded={handleFileData} />
          </div>
        </div>
      </main>

      <SymptomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSubmit={handleSymptomSubmit}
      />
    </div>
  );
}