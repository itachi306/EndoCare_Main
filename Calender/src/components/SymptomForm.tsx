import React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { DailySymptoms } from '../types';

interface SymptomFormProps {
  selectedDate: Date;
  onSubmit: (data: DailySymptoms) => void;
}

export default function SymptomForm({ selectedDate, onSubmit }: SymptomFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<DailySymptoms>();

  const ratingInputs = [
    { name: 'periodPain', label: 'Period Pain' },
    { name: 'pelvicPain', label: 'Pelvic Pain' },
    { name: 'painDuringSex', label: 'Pain During Sex' },
    { name: 'fatigueLevel', label: 'Fatigue Level' },
    { name: 'constipation', label: 'Constipation' },
    { name: 'diarrhea', label: 'Diarrhea' },
    { name: 'painDuringBowelMovement', label: 'Pain During Bowel Movement' },
    { name: 'painDuringUrination', label: 'Pain During Urination' },
    { name: 'nausea', label: 'Nausea' },
    { name: 'unexplainedBleeding', label: 'Unexplained Bleeding' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        Symptoms for {format(selectedDate, 'MMMM d, yyyy')}
      </h3>

      <div className="space-y-4">
        {ratingInputs.map(({ name, label }) => (
          <div key={name} className="grid grid-cols-2 gap-4 items-center">
            <label htmlFor={name} className="text-sm font-medium text-gray-700">
              {label} (1-10)
            </label>
            <input
              type="number"
              id={name}
              min="1"
              max="10"
              {...register(name as keyof DailySymptoms, { 
                required: true,
                min: 1,
                max: 10
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4 items-center">
          <label htmlFor="periodFlow" className="text-sm font-medium text-gray-700">
            Period Flow
          </label>
          <select
            id="periodFlow"
            {...register('periodFlow' as keyof DailySymptoms, { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="1">Light</option>
            <option value="2">Moderate</option>
            <option value="3">Heavy</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Save Symptoms
      </button>
    </form>
  );
}