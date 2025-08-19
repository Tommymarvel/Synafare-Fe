import { STATUSCONST } from "@/lib/constants";

export type UserStatus =
  | typeof STATUSCONST.PENDINGVERIFICATION
  | typeof STATUSCONST.VERIFIED;

export type UserLoanReqStatus =
  | typeof STATUSCONST.OFFER_RECEIVED
  | typeof STATUSCONST.ACTIVE
  | typeof STATUSCONST.COMPLETED
  | typeof STATUSCONST.REJECTED;

export type InvoiceStatus =
  | typeof STATUSCONST.PENDING
  | typeof STATUSCONST.PAID;

export type DInventoryStatus =
  | typeof STATUSCONST.DRAFT
  | typeof STATUSCONST.UNPUBLISHED
  | typeof STATUSCONST.PUBLISHED
  | typeof STATUSCONST.OUTOFSTOCK;

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

export type CatelogueType = {
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

export interface Invoice {
  invoiceId: string;
  customerName: string;
  customerEmail: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
}

export type QuoteRequestStatus =
  | typeof STATUSCONST.PENDING
  | typeof STATUSCONST.QUOTESENT
  | typeof STATUSCONST.NEGOTIATED
  | typeof STATUSCONST.REJECTED
  | typeof STATUSCONST.ACCEPTED
  | typeof STATUSCONST.DELIVERED;

export type QuoteRequest = {
  id: string;
  customer: string;
  quantity: number;
  quoteSent: number | null;
  counterAmount: number | null;
  dateRequested: string;
  status: QuoteRequestStatus;
};

export interface DInventoryDataType {
  id: string;
  productName: string;
  url: string;
  sku: string | null;
  category: string;
  price: number;
  inStock: number;
  lastUpdated: string;
  status: DInventoryStatus;
}
