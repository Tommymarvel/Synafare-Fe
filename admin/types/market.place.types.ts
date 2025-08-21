import { STATUSCONST, TRANSACTIONTYPE } from "@/lib/constants";

export type ProductListingType = {
  id: string;
  src: string;
  category: string;
  title: string;
  url: string;
  supplier_name: string;
  supplier_profile: string;
  supplier_id: string;
};

export type WalletTransactions = {
  id: string;
  date: string;
  name: string;
  transactionType:
    | typeof TRANSACTIONTYPE.DOWNPAYMENT
    | typeof TRANSACTIONTYPE.LOANDISBURSAL
    | typeof TRANSACTIONTYPE.LOANREPAYMENT;
  transactionRef: string;
  channel: string;
  amount: number;
  status: typeof STATUSCONST.SUCCESS | typeof STATUSCONST.PENDING;
};
