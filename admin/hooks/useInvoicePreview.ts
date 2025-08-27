'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export interface InvoiceItem {
  _id: string;
  product: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Recipient {
  _id: string;
  customer_name: string;
  customer_email: string;
  customer_phn?: string;
  user: string;
  date_joined: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OwnerBankDetails {
  bank_code: string;
  bank_name: string;
  acc_name: string;
  acc_no: string;
  set: boolean;
  _id: string;
}

export interface Owner {
  _id: string;
  firebaseUid: string;
  email: string;
  email_confirmed: boolean;
  account_status: string;
  business_document: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  bvn: string;
  first_name: string;
  id_number: string;
  id_type: string;
  last_name: string;
  nature_of_solar_business: string;
  phn_no: string;
  wallet_balance: number;
  role: string;
  loan_agreement: string;
  loan_balance: number;
  bank_details: OwnerBankDetails;
  business: string;
}

export interface InvoiceData {
  _id: string;
  receipient: Recipient;
  issue_date: string;
  invoice_number: number;
  due_date: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  owner: Owner;
  createdAt: string;
  updatedAt: string;
  __v: number;
  tax: number;
  additional_information?: string;
}

export interface BankInfo {
  _id: string;
  user: string;
  accountHolderId: string;
  accountName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankName: string;
  accountRef: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BusinessDetails {
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
  business_logo: string;
}

export function useInvoicePreview(
  userId: string | null,
  invoiceId: string | null
) {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [business, setBusiness] = useState<BusinessDetails | null>(null);
  const [bank, setBank] = useState<BankInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !invoiceId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(
          `/invoice/admin/preview/${userId}/${invoiceId}`
        );

        setInvoice(res.data.invoice_data as InvoiceData);
        setBusiness(res.data.business_details as BusinessDetails);
        setBank(res.data.bank_info?.data as BankInfo);
        setError(null);
      } catch (err) {
        console.error('Invoice preview error:', err);

        let message = 'Something went wrong';
        if (err instanceof AxiosError) {
          message =
            err.response?.data?.message ||
            err.message ||
            'Failed to fetch invoice preview';
        }

        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, invoiceId]);

  return { invoice, business, bank, isLoading, error };
}
