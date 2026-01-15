import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity('invoice_lines')
export class InvoiceLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.lines, { onDelete: 'CASCADE' })
  invoice: Invoice;

  @Column({ type: 'uuid' })
  invoiceId: string;

  @Column({ type: 'varchar', length: 200 })
  description: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  quantity: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  unitPrice: string;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 20 })
  vatRate: string; // örn 20.00

  // line totals
  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  lineNet: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  lineVat: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  lineTotal: string;
}
