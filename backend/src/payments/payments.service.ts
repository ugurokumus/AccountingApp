import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Invoice } from '../invoices/invoice.entity';

type CreatePaymentDto = {
  invoiceId: string;
  amount: number;
  method: 'cash' | 'bank' | 'card';
  paidAt: string; // YYYY-MM-DD
};

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private payRepo: Repository<Payment>,
    @InjectRepository(Invoice) private invRepo: Repository<Invoice>,
  ) {}

  async create(dto: CreatePaymentDto) {
    const inv = await this.invRepo.findOne({ where: { id: dto.invoiceId } });
    if (!inv) throw new NotFoundException('Invoice not found');

    const amount = round2(Number(dto.amount));
    if (!amount || amount <= 0) throw new BadRequestException('Invalid amount');


    const paidTotalRow = await this.payRepo
        .createQueryBuilder('p')
        .select('COALESCE(SUM(p.amount),0)', 'sum')
        .where('p.invoiceId = :invoiceId', { invoiceId: dto.invoiceId })
        .getRawOne<{ sum: string }>();

    const alreadyPaid = Number(paidTotalRow?.sum ?? 0);

    const grand = Number(inv.grandTotal);

    if (round2(alreadyPaid + amount) > round2(grand)) {
      throw new BadRequestException('Payment exceeds invoice total');
    }

    const payment = this.payRepo.create({
      invoiceId: dto.invoiceId,
      amount: amount.toFixed(2),
      method: dto.method,
      paidAt: dto.paidAt,
    });

    return this.payRepo.save(payment);
  }

  findByInvoice(invoiceId: string) {
    return this.payRepo.find({ where: { invoiceId }, order: { createdAt: 'DESC' } });
  }
}
