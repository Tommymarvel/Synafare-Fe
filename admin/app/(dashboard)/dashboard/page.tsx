'use client';
import CardWrapper from '../../../components/cardWrapper';
import CashFlow from '../dashboard/components/cashflow';
import LoanOverviewChart from '../dashboard/components/loanOverview';
import PageIntro from '@/components/page-intro';
import StatusComp from '@/components/status';
import TopCards from '@/components/top-cards';
import ViewTransactionReceipt from './components/modals/view-transaction';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import Link from 'next/link';
import {
  useDashboardData,
  useRecentTransaction,
  Transaction,
} from '@/hooks/useDashboard';
import { formatWalletBalance } from '@/lib/utils/userUtils';
import { fmtNaira } from '@/lib/format';
import { useState } from 'react';
const Dasboard = () => {
  const { dashboardData } = useDashboardData();
  const { transactionData } = useRecentTransaction();
  const [openModal, setOpenModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<
    Transaction | undefined
  >();

  const handleShowTransaction = function (id: string) {
    const transaction = transactionData.find((x) => x._id === id);
    if (!transaction) return;
    setCurrentTransaction(transaction);
    setOpenModal(true);
  };
  return (
    <div>
      <ViewTransactionReceipt
        receipt={currentTransaction}
        open={openModal}
        onOpenChange={setOpenModal}
      />
      <PageIntro>Welcome Admin,</PageIntro>
      <div className="space-y-5">
        <div className="flex gap-x-[13px]">
          <div className="rounded-[6px] flex-1 bg-cover bg-deep-green text-white bg-[url('/card-green.png')] py-8 px-4 space-y-[6px]">
            <h3 className="text-[13px]">Wallet balance</h3>
            <p className="text-lg font-medium">
              {fmtNaira(Number(dashboardData?.wallet_bal?.amount ?? 0))}
            </p>
          </div>

          <TopCards
            title="Verification Requests"
            value={dashboardData.verify_request}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.0001 18.9583C9.35008 18.9583 8.71675 18.625 8.28341 18.0417L7.44175 16.9167C7.26675 16.6833 7.03342 16.55 6.78342 16.5333C6.53342 16.525 6.28342 16.6333 6.08342 16.8417L5.60841 16.4167L6.06675 16.8417C4.86675 18.125 3.94175 18.025 3.50008 17.85C3.05008 17.675 2.29175 17.1 2.29175 15.25V5.86667C2.29175 2.16667 3.35841 1.04167 6.85008 1.04167H13.1501C16.6417 1.04167 17.7084 2.16667 17.7084 5.86667V15.25C17.7084 17.0917 16.9501 17.6667 16.5001 17.85C16.0584 18.025 15.1417 18.125 13.9334 16.8417C13.7334 16.625 13.4834 16.5083 13.2251 16.5333C12.9751 16.55 12.7334 16.6833 12.5584 16.9167L11.7167 18.0417C11.2834 18.625 10.6501 18.9583 10.0001 18.9583ZM6.73341 15.275C6.76675 15.275 6.80841 15.275 6.84175 15.275C7.45842 15.3083 8.04175 15.6333 8.43341 16.1583L9.27508 17.2833C9.68341 17.825 10.3084 17.825 10.7167 17.2833L11.5584 16.1583C11.9584 15.6333 12.5334 15.3083 13.1584 15.275C13.7751 15.2417 14.3917 15.5 14.8417 15.9833C15.4751 16.6583 15.8834 16.7417 16.0334 16.6833C16.2334 16.6 16.4501 16.1167 16.4501 15.25V5.86667C16.4501 2.85834 15.9251 2.29167 13.1417 2.29167H6.85008C4.06675 2.29167 3.54175 2.85834 3.54175 5.86667V15.25C3.54175 16.125 3.75841 16.6083 3.95841 16.6833C4.10008 16.7417 4.51675 16.6583 5.15008 15.9833C5.60008 15.525 6.15841 15.275 6.73341 15.275Z"
                fill="#38655D"
              />
              <path
                d="M13.525 9.79167H8.94165C8.59998 9.79167 8.31665 9.50834 8.31665 9.16667C8.31665 8.82501 8.59998 8.54167 8.94165 8.54167H13.525C13.8667 8.54167 14.15 8.82501 14.15 9.16667C14.15 9.50834 13.8667 9.79167 13.525 9.79167Z"
                fill="#38655D"
              />
              <path
                d="M13.525 6.45833H8.94165C8.59998 6.45833 8.31665 6.17499 8.31665 5.83333C8.31665 5.49166 8.59998 5.20833 8.94165 5.20833H13.525C13.8667 5.20833 14.15 5.49166 14.15 5.83333C14.15 6.17499 13.8667 6.45833 13.525 6.45833Z"
                fill="#38655D"
              />
              <path
                d="M6.48324 6.66667C6.0249 6.66667 5.6499 6.29167 5.6499 5.83333C5.6499 5.375 6.0249 5 6.48324 5C6.94157 5 7.31657 5.375 7.31657 5.83333C7.31657 6.29167 6.94157 6.66667 6.48324 6.66667Z"
                fill="#38655D"
              />
              <path
                d="M6.48324 9.99999C6.0249 9.99999 5.6499 9.62499 5.6499 9.16666C5.6499 8.70833 6.0249 8.33333 6.48324 8.33333C6.94157 8.33333 7.31657 8.70833 7.31657 9.16666C7.31657 9.62499 6.94157 9.99999 6.48324 9.99999Z"
                fill="#38655D"
              />
            </svg>
          </TopCards>

          <TopCards title="Total Users" value={dashboardData.total_users}>
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.38338 9.55834C8.30005 9.55 8.20005 9.55 8.10838 9.55834C6.12505 9.49167 4.55005 7.86667 4.55005 5.86667C4.55005 3.82501 6.20005 2.16667 8.25005 2.16667C10.2917 2.16667 11.95 3.82501 11.95 5.86667C11.9417 7.86667 10.3667 9.49167 8.38338 9.55834Z"
                stroke="#38655D"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.425 3.83333C16.0416 3.83333 17.3416 5.14166 17.3416 6.74999C17.3416 8.32499 16.0917 9.60833 14.5333 9.66666C14.4667 9.65833 14.3917 9.65833 14.3167 9.66666"
                stroke="#38655D"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.2166 12.6333C2.19993 13.9833 2.19993 16.1833 4.2166 17.525C6.50827 19.0583 10.2666 19.0583 12.5583 17.525C14.5749 16.175 14.5749 13.975 12.5583 12.6333C10.2749 11.1083 6.5166 11.1083 4.2166 12.6333Z"
                stroke="#38655D"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.0334 17.1667C16.6334 17.0417 17.2001 16.8 17.6668 16.4417C18.9668 15.4667 18.9668 13.8583 17.6668 12.8833C17.2084 12.5333 16.6501 12.3 16.0584 12.1667"
                stroke="#38655D"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </TopCards>

          <TopCards title="Total Loans" value={dashboardData.total_loans}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.99979 11.0833C9.89145 11.0833 9.78312 11.0583 9.68312 11L2.3248 6.74169C2.0248 6.56669 1.92478 6.18333 2.09978 5.88333C2.27478 5.58333 2.64978 5.48331 2.95811 5.65831L9.99979 9.73332L16.9998 5.68334C17.2998 5.50834 17.6831 5.61669 17.8581 5.90835C18.0331 6.20835 17.9248 6.59166 17.6331 6.76666L10.3248 11C10.2165 11.05 10.1081 11.0833 9.99979 11.0833Z"
                fill="#38655D"
              />
              <path
                d="M10 18.6334C9.65833 18.6334 9.375 18.35 9.375 18.0084V10.45C9.375 10.1084 9.65833 9.82503 10 9.82503C10.3417 9.82503 10.625 10.1084 10.625 10.45V18.0084C10.625 18.35 10.3417 18.6334 10 18.6334Z"
                fill="#38655D"
              />
              <path
                d="M10 18.9583C9.26669 18.9583 8.54168 18.8 7.96668 18.4833L3.51669 16.0084C2.30835 15.3417 1.3667 13.7333 1.3667 12.35V7.64165C1.3667 6.25832 2.30835 4.65836 3.51669 3.98336L7.96668 1.51667C9.10835 0.883338 10.8917 0.883338 12.0334 1.51667L16.4834 3.99165C17.6917 4.65831 18.6333 6.26666 18.6333 7.64999V12.3583C18.6333 13.7417 17.6917 15.3416 16.4834 16.0166L12.0334 18.4833C11.4584 18.8 10.7334 18.9583 10 18.9583ZM10 2.29167C9.47502 2.29167 8.95836 2.4 8.57503 2.60834L4.12503 5.08331C3.32503 5.53331 2.6167 6.72499 2.6167 7.64999V12.3583C2.6167 13.275 3.32503 14.475 4.12503 14.925L8.57503 17.4C9.33336 17.825 10.6667 17.825 11.425 17.4L15.875 14.925C16.675 14.475 17.3833 13.2833 17.3833 12.3583V7.64999C17.3833 6.73333 16.675 5.53331 15.875 5.08331L11.425 2.60834C11.0417 2.4 10.525 2.29167 10 2.29167Z"
                fill="#38655D"
              />
              <path
                d="M14.1667 11.6584C13.8251 11.6584 13.5417 11.375 13.5417 11.0334V8.35007L5.94174 3.96673C5.64174 3.79173 5.54172 3.40838 5.71672 3.11671C5.89172 2.81671 6.26674 2.71669 6.56674 2.89169L14.4751 7.4584C14.6667 7.56673 14.7917 7.77503 14.7917 8.00003V11.0501C14.7917 11.3751 14.5084 11.6584 14.1667 11.6584Z"
                fill="#38655D"
              />
            </svg>
          </TopCards>
        </div>

        <div className="flex gap-x-4">
          <CashFlow data={dashboardData.cashFlow} className="grow" />
          <LoanOverviewChart
            data={[
              {
                name: 'Active',
                value: dashboardData.active_loans,
                color: '#FCB022',
              },
              {
                name: 'Repaid',
                value: dashboardData.paid_loans,
                color: '#3D8B40',
              },
              {
                name: 'Overdue',
                value: dashboardData.overdue_loans,
                color: '#C21A18',
              },
            ]}
            className="shrink-0 min-w-[352px] px-5 pt-[26px]"
          />
        </div>

        <CardWrapper className="text-sm px-0 mb-12 pb-0">
          <div className="pb-[11px] px-[18px] flex justify-between font-medium">
            <h2>Recent Transactions</h2>
            <Link href="#"> View all </Link>
          </div>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="bg-gray-200 py-3 px-6 border-none">
                <TableHead className="py-[13px] ps-6">#ID</TableHead>
                <TableHead className="py-[13px] ps-6">
                  Transaction Type
                </TableHead>
                <TableHead className="py-[13px] ps-6">Amount</TableHead>
                <TableHead className="py-[13px] ps-6">Date</TableHead>
                <TableHead className="py-[13px] ps-6">Status</TableHead>
                <TableHead className="py-[13px] ps-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            {transactionData.length > 0 ? (
              <TableBody>
                {transactionData.slice(0, 10).map((item, idxx) => {
                  return (
                    <TableRow key={idxx} className="border-b border-b-gray-200">
                      <TableCell className="p-6 w-[12ch] truncate">
                        {item.trx_id}
                      </TableCell>
                      <TableCell className="p-6 capitalize">
                        {item.trx_type.replace(/_/g, ' ')}
                      </TableCell>
                      <TableCell className="p-6 ">
                        {formatWalletBalance(item.trx_amount)}
                      </TableCell>
                      <TableCell className="p-6">
                        {new Date(item.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="p-6">
                        <StatusComp status={item.trx_status} />
                      </TableCell>
                      <TableCell
                        onClick={() => handleShowTransaction(item._id)}
                        className="text-[#E2A109] p-6 cursor-pointer hover:underline"
                      >
                        View
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            ) : (
              <div>Recent Transaction not available</div>
            )}
          </Table>
        </CardWrapper>
      </div>
    </div>
  );
};

export default Dasboard;
