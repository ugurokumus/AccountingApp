import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentsService } from './payments.service';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private service: PaymentsService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get('invoice/:invoiceId')
  listForInvoice(@Param('invoiceId') invoiceId: string) {
    return this.service.findByInvoice(invoiceId);
  }
}
