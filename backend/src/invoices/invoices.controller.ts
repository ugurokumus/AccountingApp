import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InvoicesService } from './invoices.service';

@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private service: InvoicesService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
