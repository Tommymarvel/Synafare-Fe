'use client'

import React from 'react'
import { Banknote } from 'lucide-react'

export default function LoanBalanceCard() {
  return (
    <div className="bg-white rounded-2xl shadow p-5 flex items-center space-x-4">
      <div className="p-3 bg-red-100 rounded-full">
        <Banknote className="h-6 w-6 text-red-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">Outstanding Loan</p>
        <p className="text-xl font-semibold text-gray-900">₦80,000</p>
      </div>
    </div>
  )
}