export type LoanReqType = {
  name: string;
  id: string;
  userType: string;
  customer: string;
  loanAmount: string;
  dateRequested: string;
  duration: string;
};

type LoanStatus = "Pending" | "Paid" | "Rejected";

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
