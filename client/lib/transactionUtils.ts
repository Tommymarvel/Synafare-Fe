import { toast } from 'react-toastify';
import { fmtDate, fmtNaira } from './format';
import { Transaction } from '@/app/dashboard/wallet/hooks/useTransactions';

export const downloadTransactionReceipt = (transaction: Transaction) => {
  try {
    // Create a simple HTML receipt
    const receiptHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Transaction Receipt</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .receipt {
              max-width: 400px;
              margin: 0 auto;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: #1a1a1a;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .header p {
              margin: 5px 0 0 0;
              opacity: 0.8;
              font-size: 14px;
            }
            .content {
              padding: 20px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #e9ecef;
            }
            .row:last-child {
              border-bottom: none;
            }
            .label {
              color: #6c757d;
              font-size: 14px;
            }
            .value {
              color: #1a1a1a;
              font-size: 14px;
              font-weight: 500;
            }
            .amount {
              font-size: 18px;
              font-weight: 600;
              color: #28a745;
            }
            .status {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 500;
              text-transform: capitalize;
            }
            .status.successful {
              background: #d4edda;
              color: #155724;
            }
            .status.pending {
              background: #fff3cd;
              color: #856404;
            }
            .status.failed {
              background: #f8d7da;
              color: #721c24;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background: #f8f9fa;
              font-size: 12px;
              color: #6c757d;
            }
            .mono {
              font-family: 'Courier New', monospace;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1>Synafare</h1>
              <p>Transaction Receipt</p>
            </div>
            <div class="content">
              <div class="row">
                <span class="label">Transaction Date</span>
                <span class="value">${fmtDate(transaction.date)}</span>
              </div>
              <div class="row">
                <span class="label">Transaction Type</span>
                <span class="value">${transaction.type
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (m) => m.toUpperCase())}</span>
              </div>
              <div class="row">
                <span class="label">Amount</span>
                <span class="value amount">${fmtNaira(
                  transaction.amount
                )}</span>
              </div>
              <div class="row">
                <span class="label">Reference ID</span>
                <span class="value mono">${transaction.refId}</span>
              </div>
              <div class="row">
                <span class="label">Status</span>
                <span class="value">
                  <span class="status ${transaction.status.toLowerCase()}">${
      transaction.status
    }</span>
                </span>
              </div>
              <div class="row">
                <span class="label">Transaction ID</span>
                <span class="value mono">${transaction.id}</span>
              </div>
            </div>
            <div class="footer">
              <p>Generated on ${new Date().toLocaleString('en-NG')}</p>
              <p>This is an electronic receipt</p>
            </div>
          </div>
        </body>
        </html>
      `;

    // Create a blob with the HTML content
    const blob = new Blob([receiptHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = `synafare-receipt-${transaction.refId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);

    toast.success('Receipt downloaded successfully');
  } catch (error) {
    console.error('Error downloading receipt:', error);
    toast.error('Failed to download receipt');
  }
};
