'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

export default function RepaymentScheduleCard() {
  return (
    <div className="bg-white rounded-2xl shadow p-5 flex items-center space-x-4">
      <div className="p-3 bg-blue-100 rounded-full">
        <Calendar className="h-6 w-6 text-blue-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">Next Repayment</p>
        <p className="text-xl font-semibold text-gray-900">Aug 15, 2025</p>
      </div>
    </div>
  );
}
