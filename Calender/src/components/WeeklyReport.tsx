import React from 'react';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyData } from '../types';
import { Activity, TrendingUp } from 'lucide-react';

interface WeeklyReportProps {
  dailyData: DailyData[];
}

export default function WeeklyReport({ dailyData }: WeeklyReportProps) {
  const getWeeklyData = () => {
    const weeklyMap = new Map();

    dailyData.forEach(data => {
      const date = new Date(data.date);
      const weekStart = startOfWeek(date);
      const weekKey = format(weekStart, 'yyyy-MM-dd');

      if (!weeklyMap.has(weekKey)) {
        weeklyMap.set(weekKey, {
          week: format(weekStart, 'MMM d'),
          riskScore: data.riskScore,
          count: 1
        });
      } else {
        const current = weeklyMap.get(weekKey);
        weeklyMap.set(weekKey, {
          ...current,
          riskScore: current.riskScore + data.riskScore,
          count: current.count + 1
        });
      }
    });

    return Array.from(weeklyMap.values()).map(({ week, riskScore, count }) => ({
      week,
      averageRiskScore: riskScore / count
    }));
  };

  const weeklyData = getWeeklyData();
  const currentWeekStart = startOfWeek(new Date());
  const currentWeekEnd = endOfWeek(new Date());

  const currentWeekData = dailyData.filter(data => 
    isWithinInterval(new Date(data.date), {
      start: currentWeekStart,
      end: currentWeekEnd
    })
  );

  const currentWeekAverage = currentWeekData.length > 0
    ? currentWeekData.reduce((acc, curr) => acc + curr.riskScore, 0) / currentWeekData.length
    : 0;

  const getAlertLevel = (score: number) => {
    if (score >= 8) return { text: 'High Risk', color: 'text-red-600' };
    if (score >= 5) return { text: 'Moderate Risk', color: 'text-orange-600' };
    return { text: 'Low Risk', color: 'text-green-600' };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Activity className="w-6 h-6 text-indigo-600" />
          Weekly Analysis
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm">
          <h4 className="font-medium mb-2">Current Week</h4>
          <p className="text-sm text-gray-600 mb-4">
            {format(currentWeekStart, 'MMM d')} - {format(currentWeekEnd, 'MMM d, yyyy')}
          </p>
          <div className="space-y-2">
            <p className={`text-lg font-semibold ${getAlertLevel(currentWeekAverage).color}`}>
              {getAlertLevel(currentWeekAverage).text}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentWeekAverage / 10) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">
                {currentWeekAverage.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h4 className="font-medium">Risk Trend</h4>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData.slice(-5)}>
                <Line
                  type="monotone"
                  dataKey="averageRiskScore"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ fill: '#4f46e5' }}
                />
                <XAxis dataKey="week" />
                <YAxis domain={[1, 10]} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-medium mb-4">Historical Risk Scores</h4>
        <div className="bg-white rounded-xl p-4 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" />
              <YAxis domain={[1, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="averageRiskScore"
                stroke="#4f46e5"
                name="Weekly Average Risk Score"
                strokeWidth={2}
                dot={{ fill: '#4f46e5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}