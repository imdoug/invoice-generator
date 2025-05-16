export interface InvoiceItem {
    description: string;
    quantity: number;
    price: number;
  }
  
  export interface ResendInvoiceData {
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    paymentMethods: string;
    items: InvoiceItem[];
    invoiceNumber: string;
    issueDate?: string;
    currency: string;
    total?: number;
  }