import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomersService } from './customers.service';

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private service: CustomersService) {}

  @Post()
  create(@Body() body: { name: string; taxNumber?: string; phone?: string; city?: string }) {
    return this.service.create({
      name: body.name,
      taxNumber: body.taxNumber ?? null,
      phone: body.phone ?? null,
      city: body.city ?? null,
    });
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
