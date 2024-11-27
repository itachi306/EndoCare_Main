import React from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, isSameMonth, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DailyData } from '../types';

interface CalendarProps {
  currentDate: Date;
  dailyData: DailyData[];
  onDateSelect: (date: Date) => void;
}

export default function Calendar({ currentDate, dailyData, onDateSelect }: CalendarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);

  const getRiskColor = (risk: number) => {
    if (risk >= 75) return 'bg-red-500';
    if (risk >= 50) return 'bg-orange-500';
    if (risk >= 25) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= monthEnd) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayData = dailyData.find(d => isSameDay(new Date(d.date), cloneDay));
        
        days.push(
          <div
            key={day.toString()}
            className={`calendar-day relative p-4 border ${
              !isSameMonth(day, monthStart)
                ? 'text-gray-400 bg-gray-50'
                : 'text-gray-900 bg-white'
            }`}
            onClick={() => onDateSelect(cloneDay)}
          >
            <span className="absolute top-2 left-2 font-medium">
              {format(cloneDay, 'd')}
            </span>
            {dayData && (
              <>
                <div className="mt-6 text-xs font-medium">
                  Risk Score: {Math.round(dayData.riskScore)}%
                </div>
                <div className={`risk-indicator ${getRiskColor(dayData.riskScore)}`} />
              </>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-px">
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-3">
          <CalendarIcon className="w-7 h-7 text-indigo-600" />
          <span>{format(currentDate, 'MMMM yyyy')}</span>
        </h2>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium py-2 text-gray-600">
            {day}
          </div>
        ))}
      </div>
      <div className="border rounded-lg overflow-hidden">
        {renderCells()}
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-600">Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-sm text-gray-600">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-sm text-gray-600">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-600">Severe</span>
        </div>
      </div>
    </div>
  );
}