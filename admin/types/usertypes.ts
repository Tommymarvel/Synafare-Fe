import { STATUSCONST } from "@/lib/constants";

export type UserStatus =
  | typeof STATUSCONST.PENDINGVERIFICATION
  | typeof STATUSCONST.VERIFIED;

export type UserLoanReqStatus =
  | typeof STATUSCONST.OFFERRECEIVED
  | typeof STATUSCONST.ACTIVE
  | typeof STATUSCONST.COMPLETED
  | typeof STATUSCONST.REJECTED;

export type AllUsers = {
  id: string;
  name: string;
  email: string;
  userType: string;
  dateAdded: string;
  status: UserStatus;
};

export interface UserLoanRecord {
  id: string;
  name: string;
  email: string;
  transactionCost: string;
  loanAmount: string;
  dateRequested: string;
  duration: string;
  nextPayment?: string | undefined;
  status: UserLoanReqStatus;
}

export type InventoryType = {
  id: string;
  product: string;
  category: string;
  dateCreated: string;
};

export type UserCustomer = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dateAdded: string;
};
