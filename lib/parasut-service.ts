import { ParasutInvoiceData } from './wim-data';

export interface CreateInvoiceParams {
  contactName: string;
  taxNumber: string;
  description: string;
  amountEur?: number;
  amountTry?: number;
  currency?: 'EUR' | 'TRY';
  daysDue?: number;
  type?: 'e-Fatura' | 'e-Arşiv';
}

export class ParasutBillingService {
  private invoices: ParasutInvoiceData[] = [
    {
      id: 'INV-2025-001',
      invoiceNo: 'WIM2025000000089',
      contactName: 'Tatiana Maritime Ltd',
      taxNumber: '8291039182',
      description: 'M/Y Tatiana (80m) - 700T Travel Lift Haul-Out & Heavy Cradle Docking',
      currency: 'TRY',
      amountTry: 547500.0,
      vatRate: 20,
      vatAmountTry: 109500.0,
      totalWithVatTry: 657000.0,
      issueDate: '2025-10-16',
      dueDate: '2025-10-23',
      type: 'e-Fatura',
      status: 'issued',
      pdfUrl: '#'
    },
    {
      id: 'INV-2025-002',
      invoiceNo: 'WIM2025000000088',
      contactName: 'Horizon Blue Marine Ltd',
      taxNumber: '9921049281',
      description: 'M/Y Blue Horizon (50m) - 1 Yıllık Bağlama ve Elektrik/Su Ön Avansı',
      currency: 'TRY',
      amountTry: 1825000.0,
      vatRate: 20,
      vatAmountTry: 365000.0,
      totalWithVatTry: 2190000.0,
      issueDate: '2025-10-14',
      dueDate: '2025-10-21',
      type: 'e-Fatura',
      status: 'paid',
      pdfUrl: '#'
    },
    {
      id: 'INV-2025-003',
      invoiceNo: 'WIM2025000000087',
      contactName: 'Calisto Mediterranean Fish & Lounge',
      taxNumber: '2840192831',
      description: 'Çarşı Pierfront #04 - Ekim 2025 Ticari Alan Kira Bedeli',
      currency: 'TRY',
      amountTry: 310250.0,
      vatRate: 20,
      vatAmountTry: 62050.0,
      totalWithVatTry: 372300.0,
      issueDate: '2025-10-01',
      dueDate: '2025-10-10',
      type: 'e-Fatura',
      status: 'paid',
      pdfUrl: '#'
    }
  ];

  public getInvoices(): ParasutInvoiceData[] {
    return this.invoices;
  }

  public getTotalRevenueTry(): number {
    return this.invoices.reduce((acc, inv) => acc + inv.totalWithVatTry, 0);
  }

  public createInvoice(params: CreateInvoiceParams): ParasutInvoiceData {
    const exchangeRateEurToTry = 36.50; // Central bank exchange rate anchor

    let amountTry = params.amountTry || 0;
    if (params.amountEur && params.amountEur > 0) {
      amountTry = params.amountEur * exchangeRateEurToTry;
    }
    if (amountTry <= 0) {
      amountTry = 25000; // default baseline
    }

    const vatRate = 20;
    const vatAmountTry = amountTry * (vatRate / 100);
    const totalWithVatTry = amountTry + vatAmountTry;

    const issueDate = new Date().toISOString().split('T')[0];
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + (params.daysDue || 7));
    const dueDate = dueDateObj.toISOString().split('T')[0];

    const nextNumber = this.invoices.length + 90;
    const invoiceNo = `WIM20250000000${nextNumber}`;

    const newInvoice: ParasutInvoiceData = {
      id: `INV-2025-${nextNumber.toString().padStart(3, '0')}`,
      invoiceNo,
      contactName: params.contactName,
      taxNumber: params.taxNumber || '1234567890',
      description: params.description,
      currency: 'TRY',
      amountTry: Math.round(amountTry * 100) / 100,
      vatRate,
      vatAmountTry: Math.round(vatAmountTry * 100) / 100,
      totalWithVatTry: Math.round(totalWithVatTry * 100) / 100,
      issueDate,
      dueDate,
      type: params.type || (params.taxNumber && params.taxNumber.length === 10 ? 'e-Fatura' : 'e-Arşiv'),
      status: 'issued',
      pdfUrl: '#'
    };

    this.invoices.unshift(newInvoice);
    return newInvoice;
  }
}

export const parasutService = new ParasutBillingService();
