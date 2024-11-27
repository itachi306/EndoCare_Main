import React from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { DailyData } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: DailyData[]) => void;
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const formattedData: DailyData[] = jsonData.map((row: any) => ({
          date: new Date(row.date).toISOString(),
          riskScore: Math.min(Math.max(Number(row.dailyRiskScore), 1), 10), // Ensure score is between 1-10
          periodPain: 1,
          pelvicPain: 1,
          periodFlow: 1,
          painDuringSex: 1,
          fatigueLevel: 1,
          constipation: 1,
          diarrhea: 1,
          painDuringBowelMovement: 1,
          painDuringUrination: 1,
          nausea: 1,
          unexplainedBleeding: 1
        }));

        onDataLoaded(formattedData);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error parsing Excel file. Please ensure it has the correct format.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Upload className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold">Import Historical Data</h3>
      </div>
      <div className="mt-2">
        <label className="block">
          <span className="sr-only">Choose Excel file</span>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100
              cursor-pointer"
          />
        </label>
        <p className="mt-2 text-sm text-gray-500">
          Upload Excel file with columns: "date" and "dailyRiskScore" (1-10)
        </p>
      </div>
    </div>
  );
}