import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Invoice } from '../invoices/invoice.entity';

export type PaymentMethod = 'cash' | 'bank' | 'card';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => Invoice, { nullable: false, onDelete: 'CASCADE' })
  invoice: Invoice;

  @Column({ type: 'uuid' })
  invoiceId: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: string;

  @Column({ type: 'varchar', length: 10 })
  method: PaymentMethod;

  @Column({ type: 'date' })
  paidAt: string; // YYYY-MM-DD

  @CreateDateColumn()
  createdAt: Date;
}
