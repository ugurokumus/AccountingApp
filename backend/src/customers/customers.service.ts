import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomersService {
  constructor(@InjectRepository(Customer) private repo: Repository<Customer>) {}

  create(data: Partial<Customer>) {
    const c = this.repo.create(data);
    return this.repo.save(c);
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Customer not found');
    return c;
  }

  async update(id: string, data: Partial<Customer>) {
    const c = await this.findOne(id);
    Object.assign(c, data);
    return this.repo.save(c);
  }

  async remove(id: string) {
    const c = await this.findOne(id);
    await this.repo.remove(c);
    return { deleted: true };
  }
}
