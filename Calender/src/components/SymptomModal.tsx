import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { DailySymptoms } from '../types';
import { X } from 'lucide-react';

interface SymptomModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSubmit: (data: DailySymptoms) => void;
}

export default function SymptomModal({ isOpen, onClose, selectedDate, onSubmit }: SymptomModalProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<DailySymptoms>({
    defaultValues: {
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
    }
  });

  const handleFormSubmit = (data: DailySymptoms) => {
    // Convert string values to numbers
    const formattedData: DailySymptoms = {
      periodPain: Number(data.periodPain),
      pelvicPain: Number(data.pelvicPain),
      periodFlow: Number(data.periodFlow) as 1 | 2 | 3,
      painDuringSex: Number(data.painDuringSex),
      fatigueLevel: Number(data.fatigueLevel),
      constipation: Number(data.constipation),
      diarrhea: Number(data.diarrhea),
      painDuringBowelMovement: Number(data.painDuringBowelMovement),
      painDuringUrination: Number(data.painDuringUrination),
      nausea: Number(data.nausea),
      unexplainedBleeding: Number(data.unexplainedBleeding)
    };
    onSubmit(formattedData);
  };

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
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-medium">
                    Symptoms for {format(selectedDate, 'MMMM d, yyyy')}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                  <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-4">
                    {ratingInputs.map(({ name, label }) => (
                      <div key={name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                            {label}
                          </label>
                          <span className="text-sm text-gray-500">
                            {watch(name as keyof DailySymptoms) || 1}
                          </span>
                        </div>
                        <input
                          type="range"
                          id={name}
                          min="1"
                          max="10"
                          step="1"
                          {...register(name as keyof DailySymptoms, { 
                            required: true,
                            valueAsNumber: true
                          })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>1</span>
                          <span>5</span>
                          <span>10</span>
                        </div>
                      </div>
                    ))}

                    <div className="space-y-2">
                      <label htmlFor="periodFlow" className="block text-sm font-medium text-gray-700">
                        Period Flow
                      </label>
                      <select
                        id="periodFlow"
                        {...register('periodFlow', { 
                          required: true,
                          valueAsNumber: true
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="1">Light</option>
                        <option value="2">Moderate</option>
                        <option value="3">Heavy</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save Symptoms
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}