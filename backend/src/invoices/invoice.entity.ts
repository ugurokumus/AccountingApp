import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Customer } from '../customers/customer.entity';
import { InvoiceLine } from './invoice-line.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 30 })
  invoiceNo: string;

  @Column({ type: 'date' })
  issueDate: string; // YYYY-MM-DD

  @ManyToOne(() => Customer, { nullable: false, onDelete: 'RESTRICT' })
  customer: Customer;

  @Column({ type: 'uuid' })
  customerId: string;


  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  subtotal: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  taxTotal: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  grandTotal: string;

  @OneToMany(() => InvoiceLine, (line) => line.invoice, { cascade: true })
  lines: InvoiceLine[];

  @CreateDateColumn()
  createdAt: Date;
}
