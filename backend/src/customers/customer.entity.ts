import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  taxNumber: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  city: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
