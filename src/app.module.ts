import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/model/user.model';
import { CategoryModule } from './category/category.module';
<<<<<<< HEAD
import { RatingModule } from './rating/rating.module';
=======
import { Market } from './market/model/market.model';
import { MarketModule } from './market/market.module';
import { SavatModule } from './savat/savat.module';
import { OrderModule } from './order/order.module';
import { OrderItemsModule } from './order_items/order_items.module';
>>>>>>> 2100402c22aa3414ed78ba14a88f559b2176acb9

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
<<<<<<< HEAD
      host: process.env.HOST,
      username: process.env.NAME,
=======
      host: String(process.env.HOST),
      username: String(process.env.NAME),
>>>>>>> 2100402c22aa3414ed78ba14a88f559b2176acb9
      password: String(process.env.PASS),
      port: Number(process.env.PORTS),
      logging: false,
      database: process.env.DB,
      autoLoadModels: true,
      synchronize: true,
<<<<<<< HEAD
      models: [User],
    }),
    UserModule,
    CategoryModule,
    RatingModule,
=======
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
>>>>>>> 2100402c22aa3414ed78ba14a88f559b2176acb9
  ],
})
export class AppModule {}