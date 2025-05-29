import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/model/user.model';
import { CategoryModule } from './category/category.module';
import { Market } from './market/model/market.model';
import { MarketModule } from './market/market.module';
import { SavatModule } from './savat/savat.module';
import { OrderModule } from './order/order.module';
import { OrderItemsModule } from './order_items/order_items.module';
import { AdminModule } from './admin/admin.module';
import { UploutModule } from './uplout/uplout.module';
import { MailModule } from './mail/mail.module';
import { VerifyModule } from './verify/verify.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: String(process.env.HOST),
      username: String(process.env.NAME),
      password: String(process.env.PASS),
      port: Number(process.env.PORTS),
      logging: false,
      database: process.env.DB,
      autoLoadModels: true,
      synchronize: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      models: [User, Market],
    }),
    UserModule,
    CategoryModule,
    MarketModule,
    SavatModule,
    OrderModule,
    OrderItemsModule,
    AdminModule,
    UploutModule,
    MailModule,
    VerifyModule,
  ],
})
export class AppModule {}