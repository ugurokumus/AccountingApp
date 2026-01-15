import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Invoice } from '../invoices/invoice.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Invoice])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
