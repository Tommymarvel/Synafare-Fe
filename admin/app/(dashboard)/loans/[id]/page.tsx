'use client';

import PageIntro from '@/components/page-intro';
import CardWrapper from '@/components/cardWrapper';
import InfoDetail from './components/detail';
import Status from '@/components/status';
// import RepaymentHistory from './components/repayment-history';
import {
  useLoanById,
  useRepayById,
  useDisburseLoan,
} from '../../loans/hooks/useLoans';
import { useParams } from 'next/navigation';
import GoBack from '@/components/goback';
import Document from '@/components/document';
import { useMemo, useState } from 'react';
import Button from '@/components/button';
import { AlertCircle } from 'lucide-react';
import { fmtDate, formatPhoneNumber } from '@/lib/format';
import { STATUSCONST } from '@/lib/constants';
import Image from 'next/image';
import Empty from '@/app/assets/repayHistory-empty.png';
import { toast } from 'react-toastify';

const fmtNaira = (n: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(
    n ?? 0
  );

export default function LoanRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const { loan, isLoading, error } = useLoanById(id);
  const { repayData } = useRepayById(id as string);
  const { disburseLoan } = useDisburseLoan(id);
  const [isDisbursing, setIsDisbursing] = useState(false);

  const summary = useMemo(() => {
    if (!loan) {
      return {
        outstanding: 0,
        elapsed: 0,
        duration: 0,
      };
    }
    return {
      outstanding: loan.outstandingBalance ?? 0,
      elapsed: loan.elapsedMonths ?? 0,
      duration: loan.loanDurationInMonths ?? 0,
    };
  }, [loan]);

  const handleDisburseLoan = async () => {
    if (!loan) return;

    try {
      setIsDisbursing(true);
      await disburseLoan();
      // Optionally refresh the loan data or show success message
      toast.success('Loan disbursed successfully!');
      window.location.reload(); // Simple refresh, could be improved with SWR mutate
    } catch (error) {
      console.error('Error disbursing loan:', error);
      toast.error('Failed to disburse loan. Please try again.');
    } finally {
      setIsDisbursing(false);
    }
  };

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (error || !loan) return <div className="p-6">Failed to load loan.</div>;

  return (
    <div>
      <GoBack className="mt-5 mb-3" />

      <div className="flex items-center mb-5">
        <PageIntro>
          {loan.userFirstName} {loan.userLastName}
        </PageIntro>
        {loan.loanStatus === 'Overdue' && (
          <div className="flex items-center gap-x-3 ms-auto text-resin-black font-medium">
            <Button variant="Colored" className="flex gap-x-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="inherit">
                <path
                  d="M14.166 17.7083H5.83268C2.79102 17.7083 1.04102 15.9583 1.04102 12.9166V7.08329C1.04102 4.04163 2.79102 2.29163 5.83268 2.29163H14.166C17.2077 2.29163 18.9577 4.04163 18.9577 7.08329V12.9166C18.9577 15.9583 17.2077 17.7083 14.166 17.7083ZM5.83268 3.54163C3.44935 3.54163 2.29102 4.69996 2.29102 7.08329V12.9166C2.29102 15.3 3.44935 16.4583 5.83268 16.4583H14.166C16.5493 16.4583 17.7077 15.3 17.7077 12.9166V7.08329C17.7077 4.69996 16.5493 3.54163 14.166 3.54163H5.83268Z"
                  fill="inherit"
                />
                <path
                  d="M9.999 10.725C9.299 10.725 8.59067 10.5083 8.049 10.0666L5.44067 7.98331C5.174 7.76664 5.124 7.37497 5.34067 7.10831C5.55734 6.84164 5.94901 6.79164 6.21567 7.00831L8.824 9.09164C9.45733 9.59998 10.5323 9.59998 11.1657 9.09164L13.774 7.00831C14.0407 6.79164 14.4407 6.83331 14.649 7.10831C14.8657 7.37497 14.824 7.77498 14.549 7.98331L11.9407 10.0666C11.4073 10.5083 10.699 10.725 9.999 10.725Z"
                  fill="inherit"
                />
              </svg>
              Send Reminder
            </Button>
          </div>
        )}
        {loan.loanStatus === STATUSCONST.AWAITING_LOAN_DISBURSEMENT && (
          <div className="flex items-center gap-x-3 ms-auto text-resin-black font-medium">
            <Button
              onClick={handleDisburseLoan}
              disabled={isDisbursing}
              className="  bg-green-600 hover:bg-green-700 text-white"
            >
              {isDisbursing ? 'Disbursing...' : 'Disburse Loan'}
            </Button>
          </div>
        )}
      </div>

      <div className="bg-resin-black text-gray-4 rounded-4 p-10 flex justify-between rounded-2xl">
        <div className="space-y-[10px]">
          <p className="text-sm">Outstanding Balance</p>
          <h3 className="font-bold text-[28px]/[100%]">
            {fmtNaira(summary.outstanding)}
          </h3>
        </div>
        <div>
          <p className="text-sm">Duration</p>
          <h3 className="text-[32px]/[100%] font-medium">
            {summary.elapsed}/{summary.duration} Months
          </h3>
        </div>
      </div>

      <div className="mt-[10px] flex gap-x-5">
        <div className="grow space-y-5">
          {/* If loan is overdue, show banner based on your own logic */}
          {/* Example condition could be derived from nextPaymentDate if you add it */}
          {loan.loanStatus === 'Overdue' && (
            <div className="flex items-center justify-center gap-2 border border-red-500 bg-red-100 text-red-700 rounded-lg px-4 py-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="font-medium">Loan is overdue</span>
            </div>
          )}

          <CardWrapper className="p-0 w-full ps-[18px] pb-6">
            <h2 className="border-b border-b-gray-4 p-4 pb-[10px] font-medium text-[16px]">
              Loan Details
            </h2>

            <div className="flex justify-between pt-7">
              <div className="grid grid-cols-2 flex-1 gap-[15px]">
                <InfoDetail
                  title="Transaction Cost"
                  value={fmtNaira(loan.transactionCost)}
                />
                <InfoDetail
                  title="Loan Duration"
                  value={`${loan.loanDurationInMonths} months`}
                />
                <InfoDetail
                  title={`Downpayment (${Math.round(
                    loan.downpaymentInPercent * 100
                  )}%)`}
                  value={fmtNaira(loan.downpaymentInNaira)}
                />
                <InfoDetail
                  title="Total Repayment"
                  value={fmtNaira(loan.totalRepayment)}
                />
              </div>

              <div className="grid grid-cols-2 flex-1 gap-[15px]">
                <InfoDetail
                  title="Interest (per month)"
                  value={loan.interest ? `${loan.interest}` : '—'}
                />
                <InfoDetail
                  title="Loan Amount"
                  value={fmtNaira(loan.loanAmount)}
                />
                <InfoDetail
                  title="Next Payment"
                  value={
                    loan.nextPaymentDate
                      ? new Date(loan.nextPaymentDate).toLocaleDateString(
                          'en-NG'
                        )
                      : 'N/A'
                  }
                />
                <InfoDetail title="Status" value="">
                  <div className="flex items-center gap-3">
                    <Status status={loan.loanStatus} className="font-medium" />
                  </div>
                </InfoDetail>
              </div>
            </div>
          </CardWrapper>

          {/* Show only if rejected and backend provides reason; toggle as needed */}
          {/* <CardWrapper className="p-0 w-full ps-[18px] pb-10 pt-4">
            <InfoDetail title="Reason for Decline" value={loan.declineReason ?? '—'} />
          </CardWrapper> */}

          <CardWrapper className="p-0 w-full">
            <h2 className="border-b border-b-gray-4 p-4 pb-[10px] font-medium text-[16px]">
              Customer Information
            </h2>
            <div className="flex justify-between py-[27px] px-[18px]">
              <InfoDetail
                title="Customer’s Name"
                value={
                  loan.customerName?.trim() && loan.customerName !== '-'
                    ? loan.customerName
                    : loan.userFirstName && loan.userLastName
                    ? `${loan.userFirstName} ${loan.userLastName}`
                    : 'N/A'
                }
              />
              <InfoDetail
                title="Customer’s Email Address"
                value={
                  loan.customerEmail?.trim() && loan.customerEmail !== '-'
                    ? loan.userEmail
                    : 'N/A'
                }
              />
              <InfoDetail
                title="Customer’s Phone Number"
                value={
                  loan.customerPhone?.trim() && loan.customerPhone !== '-'
                    ? formatPhoneNumber(loan.customerPhone)
                    : loan.userPhnNo?.trim() && loan.userPhnNo !== '-'
                    ? formatPhoneNumber(loan.userPhnNo)
                    : 'N/A'
                }
              />
            </div>
          </CardWrapper>

          <CardWrapper className="p-0 w-full mb-4">
            <h2 className="border-b border-b-gray-4 p-4 pb-[10px] font-medium text-[16px]">
              Documents
            </h2>
            <ul>
              {loan.bankStatement && (
                <Document name="Bank Statement" url={loan.bankStatement} />
              )}
              {loan.trxInvoice && (
                <Document name="Invoice" url={loan.trxInvoice} />
              )}
            </ul>
          </CardWrapper>
        </div>

        {/* <RepaymentHistory /> */}
        <section className="rounded-lg border mt-2 lg:mt-1 lg:w-[20%]">
          <header className="px-4 py-3 border-b bg-[#F0F2F5] rounded-t-lg text-sm font-medium">
            Repayment History
          </header>
          <div className="p-6 flex items-center justify-center">
            {repayData?.result?.length === 0 ? (
              <div className="text-center h-fit text-sm text-[#797979]">
                <Image
                  src={Empty}
                  alt="No Repayment History"
                  width={100}
                  height={100}
                />
                <p>No repayment history</p>
              </div>
            ) : (
              <ul className="w-full space-y-3">
                {repayData?.result.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <div className="flex flex-col justify-center items-center gap-2">
                      <Image
                        src={r.is_paid ? '/repay-dot.svg' : '/notrepay-dot.svg'}
                        alt=""
                        className=""
                        width={10}
                        height={10}
                      />
                      <Image
                        src={'/notrepay-line.svg'}
                        alt=""
                        className=""
                        width={1}
                        height={10}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium lg:text-base">
                        {fmtNaira(r.amount)}
                      </h4>
                      <p>
                        Repayment: {fmtDate(r?.repayment_date?.toISOString())}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
