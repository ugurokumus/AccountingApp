import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { InvoiceLine } from './invoice-line.entity';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Customer } from '../customers/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, InvoiceLine, Customer])],
  providers: [InvoicesService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
