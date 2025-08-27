import { STATUSCONST } from '@/lib/constants';

export type UserStatus =
  | typeof STATUSCONST.PENDINGVERIFICATION
  | typeof STATUSCONST.VERIFIED;

export type UserLoanReqStatus =
  | typeof STATUSCONST.OFFER_RECEIVED
  | typeof STATUSCONST.ACTIVE
  | typeof STATUSCONST.COMPLETED
  | typeof STATUSCONST.REJECTED
  | typeof STATUSCONST.PENDING
  | typeof STATUSCONST.OVERDUE
  | typeof STATUSCONST.AWAITING_DOWNPAYMENT
  | typeof STATUSCONST.AWAITING_LOAN_DISBURSEMENT;

export type InvoiceStatus =
  | typeof STATUSCONST.PENDING
  | typeof STATUSCONST.PAID;

export type DInventoryStatus =
  | typeof STATUSCONST.DRAFT
  | typeof STATUSCONST.UNPUBLISHED
  | typeof STATUSCONST.PUBLISHED
  | typeof STATUSCONST.OUTOFSTOCK;

// API Response Types
export interface BankDetails {
  bank_code: string;
  bank_name: string;
  acc_name: string;
  acc_no: string;
  set: boolean;
  _id: string;
}

export interface BusinessInfo {
  _id: string;
  business_name: string;
  reg_number: string;
  cac_certificate: string;
  bank_statement: string;
  business_address: string;
  city: string;
  state: string;
  country: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  business_logo?: string;
}

export interface APIUser {
  _id: string;
  firebaseUid: string;
  email: string;
  email_confirmed: boolean;
  account_status: string;
  business_document: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  bvn?: string;
  first_name?: string;
  id_number?: string;
  id_type?: string;
  last_name?: string;
  nature_of_solar_business?: string;
  phn_no?: string;
  wallet_balance?: number;
  role?: string;
  loan_agreement?: string;
  loan_balance?: number;
  bank_details?: BankDetails;
  avatar?: string;
  otp?: string;
  otpExpiry?: string;
  business?: BusinessInfo;
  available_credit?: number;
}

export interface UsersAPIResponse {
  data: APIUser[];
  verify_request: number;
  verified_users: number;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// UI Types (transformed from API)
export type AllUsers = {
  id: string;
  firebaseUid?: string;
  name: string;
  email: string;
  userType: string;
  dateAdded: string;
  status: UserStatus;
  avatar?: string;
  phoneNumber?: string;
  walletBalance?: number;
  loanBalance?: number;
  businessDocument: string;
  emailConfirmed: boolean;
  accountStatus: string;
  role?: string;
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
  _id: string;
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

export interface TeamMembers {
  id: string;
  name: string;
  email: string;
  role: string;
  dateAdded: string;
}
