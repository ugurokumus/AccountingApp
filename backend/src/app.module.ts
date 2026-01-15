import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';


@Module({
imports: [
  ConfigModule.forRoot({ isGlobal: true }),
  AuthModule,
  CustomersModule,
  InvoicesModule,
  PaymentsModule,
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'postgres',
      host: config.get<string>('DB_HOST'),
      port: Number(config.get<string>('DB_PORT')),
      username: config.get<string>('DB_USER'),
      password: config.get<string>('DB_PASSWORD'),
      database: config.get<string>('DB_NAME'),
      autoLoadEntities: true,
      synchronize: true,
    }),
  }),

  UsersModule,
],

})
export class AppModule {}
