import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";


interface DashboardData {
  message: string;
  total_users: number;
  total_loans: number;
  paid_loans: number;
  active_loans: number;
  overdue_loans: number;
  verify_request: number;
  wallet_bal: WalletBalance;
  cashFlow: Transaction[];
}

interface WalletBalance {
  amount: string; // Could be number if parsed
  currency: string;
  timeCreated: string; // ISO date string
}

export interface Transaction {
  _id: string;
  user: string;
  trx_id: string;
  ref_id: string;
  trx_status : "pending" | "successful";
  trx_amount : number;
  trx_type: "fund_wallet" | "withdrawal" | string;
  createdAt : string
  // add other fields if available in real data
}

const emptyDashboardData: DashboardData = {
  message: "",
  total_users: 0,
  total_loans: 0,
  paid_loans: 0,
  active_loans: 0,
  overdue_loans: 0,
  verify_request: 0,
  wallet_bal: {
    amount: "0",
    currency: "NGN",
    timeCreated: new Date().toISOString(),
  },
  cashFlow: [],
};

export const useDashboardData = () => {
  const { data, error, isLoading, mutate } = useSWR(
    [`/admin/dashboard`],
    ([url]) => axiosInstance.get(url)
  );

  const [dashboardData, setDashboardData] =
    useState<DashboardData>(emptyDashboardData);

  useEffect(() => {
    if (error && !data) {
      toast.error("Failed to fetch dashboard data.");
    }
    if (data?.data) {
      setDashboardData(data.data as DashboardData);
    }
  }, [data, error]);

  return {
    dashboardData,
    isLoading,
    refreshAdditions: mutate,
  };
};

export const useRecentTransaction = () => {
  const { data, error, isLoading } = useSWR(
    [`/transaction/all-transactions`],
    ([url]) => axiosInstance.get(url)
  );

  const [transactionData, setTransactionData] =
    useState<Transaction[]>([] as Transaction[]);

  useEffect(() => {
    if (error && !data) {
      toast.error("Failed to fetch dashboard data.");
    }
    if (data?.data) {
        console.log(data.data)
      setTransactionData(data.data.data as Transaction[]);
    }
  }, [data, error]);

  return {
    transactionData,
    isLoading,
  };
};
