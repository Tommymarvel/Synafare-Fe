import { STATUSCONST } from "@/lib/constants";
export type LoanReqType = {
  name: string;
  id: string;
  userType: string;
  customer: string;
  loanAmount: string;
  dateRequested: string;
  duration: string;
};

type LoanStatus =
  | typeof STATUSCONST.PENDING
  | typeof STATUSCONST.PAID
  | typeof STATUSCONST.REJECTED;

export type LoanRecord = {
  name: string;
  id: string;
  loanOffer: string;
  equityAmount: string;
  customer: string;
  datePaid: string | null;
  status: LoanStatus;
};

export type DeclineLoanType = {
  id: string;
  name: string;
  userType: string;
  loanAmount: string;
  dateRequested: string;
  duration: string;
  status: LoanStatus;
};

export type AllLoansType = {
  name: string;
  id: string;
  loanAmount: string;
  amountDue: string;
  dateDisbursed: string;
  duration: string;
  nextPayment: string | null;
  status:
    | typeof STATUSCONST.ACTIVE
    | typeof STATUSCONST.COMPLETED
    | typeof STATUSCONST.OVERDUE;
};
