"use client";
import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import CardWrapper from "../../../../components/cardWrapper";
import CashFlowButton from "./cashflow-buttons";
import { Transaction } from "@/hooks/useDashboard";
import { format, getWeek } from "date-fns";

// Type definitions
interface CashflowDataPoint {
  period: string;
  inflow: number;
  outflow: number;
}


interface CashflowChartProps {
  data: Transaction[];
  className?: string;
}


interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    dataKey: string;
    value: number;
  }>;
  label?: string;
}

type TimeframeType = "Weekly" | "Annually";

function transformCashflow(
  transactions: Transaction[],
  timeframe: TimeframeType
): CashflowDataPoint[] {
  const grouped: Record<string, { inflow: number; outflow: number }> = {};

  transactions.forEach((trx) => {
    const date = new Date(trx.createdAt);

    // Decide grouping key
    const key =
      timeframe === "Annually"
        ? format(date, "MMM") // "Jan", "Feb"
        : `Wk ${getWeek(date)}`; // "Wk 34"

    if (!grouped[key]) {
      grouped[key] = { inflow: 0, outflow: 0 };
    }

    if (trx.trx_type === "fund_wallet") {
      grouped[key].inflow += trx.trx_amount;
    } else if (trx.trx_type === "withdrawal") {
      grouped[key].outflow += trx.trx_amount;
    }
  });

  return Object.entries(grouped).map(([period, { inflow, outflow }]) => ({
    period,
    inflow,
    outflow,
  }));
}



const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-700">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value?.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CashflowChart: React.FC<CashflowChartProps> = ({ data, className }) => {
  const [timeframe, setTimeframe] = useState<TimeframeType>("Annually");

  // recompute chartData whenever timeframe or data changes
  const chartData = useMemo(
    () => transformCashflow(data, timeframe),
    [data, timeframe]
  );

  return (
    <CardWrapper className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium text-resin-black">Cashflow</h2>
        <div className="flex bg-gray-100 rounded-full p-1 text-sm">
          <CashFlowButton
            curr="Weekly"
            setTimeframe={setTimeframe}
            timeframe={timeframe}
          >
            Weekly
          </CashFlowButton>
          <CashFlowButton
            curr="Annually"
            setTimeframe={setTimeframe}
            timeframe={timeframe}
          >
            Annually
          </CashFlowButton>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-mikado-yellow"></div>
          <span className="text-sm text-gray-600">Inflow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#40B219]"></div>
          <span className="text-sm text-gray-600">Outflow</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-3/4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="inflowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F1B424BF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F1B424BF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="outflowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#E5E5EF" vertical={false} />
            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#615E83" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#615E83" }}
              tickFormatter={(value: number) => `${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="inflow"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#inflowGradient)"
            />
            <Area
              type="monotone"
              dataKey="outflow"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#outflowGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardWrapper>
  );
};

export default CashflowChart;
