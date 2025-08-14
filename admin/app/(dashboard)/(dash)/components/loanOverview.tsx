"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import CardWrapper from "../../../../components/cardWrapper";

// Type definitions
interface LoanDataPoint {
  name: string;
  value: number;
  color: string;
}

interface LoanOverviewChartProps {
  data?: LoanDataPoint[];
  className?: string;
}

const LoanOverviewChart: React.FC<LoanOverviewChartProps> = ({
  data = [],
  className,
}) => {
  const totalLoans = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <CardWrapper className={"pb-[51px] " + className}>
      <h2 className="text-lg font-medium text-resin-black mb-6">
        Loan Overview
      </h2>

      <div className="flex items-center justify-center">
        <div className="relative">
          <ResponsiveContainer width={219} height={219}>
            <PieChart>
              {data.map((entry, index) => (
                <Pie
                  key={index}
                  data={[entry]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  startAngle={90}
                  endAngle={90 + entry.value * 3.6}
                  cornerRadius={90}
                  stroke="none"
                >
                  <Cell fill={entry.color} />
                </Pie>
              ))}
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div>
              <div className="text-[26px] font-medium text-resin-black text-center">
                {totalLoans}
              </div>
              <div className="text-sm text-resin-black text-center">Loans</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 space-y-3 max-w-[219px] mx-auto text-sm flex gap-x-4 flex-wrap">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-x-[10px] ">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-resin-black">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-resin-black">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
};

export default LoanOverviewChart;
