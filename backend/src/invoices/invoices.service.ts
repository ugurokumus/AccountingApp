import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { InvoiceLine } from './invoice-line.entity';
import { Customer } from '../customers/customer.entity';

type CreateInvoiceDto = {
  invoiceNo: string;
  issueDate: string; // YYYY-MM-DD
  customerId: string;
  lines: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    vatRate?: number; // default 20
  }>;
};

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
    @InjectRepository(InvoiceLine) private lineRepo: Repository<InvoiceLine>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
  ) {}

  async create(dto: CreateInvoiceDto) {
    if (!dto.lines?.length) throw new BadRequestException('Invoice must have at least 1 line');

    const customer = await this.customerRepo.findOne({ where: { id: dto.customerId } });
    if (!customer) throw new NotFoundException('Customer not found');


    const invoice = this.invoiceRepo.create({
      invoiceNo: dto.invoiceNo,
      issueDate: dto.issueDate,
      customerId: dto.customerId,
      customer,
      subtotal: '0',
      taxTotal: '0',
      grandTotal: '0',
      lines: [],
    });


    let subtotal = 0;
    let taxTotal = 0;

    for (const l of dto.lines) {
      const qty = Number(l.quantity);
      const price = Number(l.unitPrice);
      const vatRate = l.vatRate ?? 20;

      if (!l.description || qty <= 0 || price < 0) {
        throw new BadRequestException('Invalid invoice line');
      }

      const lineNet = round2(qty * price);
      const lineVat = round2(lineNet * (vatRate / 100));
      const lineTotal = round2(lineNet + lineVat);

      subtotal += lineNet;
      taxTotal += lineVat;

      const line = this.lineRepo.create({
        description: l.description,
        quantity: lineNet === 0 ? '0.00' : qty.toFixed(2),
        unitPrice: price.toFixed(2),
        vatRate: vatRate.toFixed(2),
        lineNet: lineNet.toFixed(2),
        lineVat: lineVat.toFixed(2),
        lineTotal: lineTotal.toFixed(2),
      });

      invoice.lines.push(line);
    }

    subtotal = round2(subtotal);
    taxTotal = round2(taxTotal);
    const grandTotal = round2(subtotal + taxTotal);

    invoice.subtotal = subtotal.toFixed(2);
    invoice.taxTotal = taxTotal.toFixed(2);
    invoice.grandTotal = grandTotal.toFixed(2);


    return this.invoiceRepo.save(invoice);
  }

async findAll() {
  const invoices = await this.invoiceRepo.find({
    order: { createdAt: 'DESC' },
    relations: { customer: true, lines: true },
  });


  for (const inv of invoices) {
    const row = await this.invoiceRepo.manager.query(
      'SELECT COALESCE(SUM(amount),0) as sum FROM payments WHERE "invoiceId" = $1',
      [inv.id],
    );
    const paidTotal = Number(row[0].sum);
    const remaining = Number(inv.grandTotal) - paidTotal;

    (inv as any).paidTotal = paidTotal.toFixed(2);
    (inv as any).remaining = remaining.toFixed(2);
  }

  return invoices;
}


  async findOne(id: string) {
    const inv = await this.invoiceRepo.findOne({
      where: { id },
      relations: { customer: true, lines: true },
    });
    if (!inv) throw new NotFoundException('Invoice not found');
    return inv;
  }
}
