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
import { ProductModule } from './product/product.module';
import { Product } from './product/model/product.entity';
import { AdminModule } from './admin/admin.module';
import { UploutModule } from './uploads/uplout.module';
import { MailModule } from './mail/mail.module';
import { VerifyModule } from './verify/verify.module';
import { JwtModule } from '@nestjs/jwt';
import { Orders } from './order/model/order.entity';
import { Savat } from './savat/model/savat.model';
import { Order_Item } from './order_items/model/order_item.model';
import { Category } from './category/model/category.model';
import { RatingModule } from './rating/rating.module';
import { SupportTicket } from './support_ticket/model/support_ticket.model';
import { Rating } from './rating/model/rating.model';
import { SupportTicketModule } from './support_ticket/support_ticket.module';
import { NotificationModule } from './notification/notification.module';
import { ChatModule } from './chat/chat.module';
import { Comment } from './comment/model/comment.model';
import { CommentModule } from './comment/comment.module';
import { Chat } from './chat/model/chat.entity';
import { Notification } from './notification/model/notification.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadController } from './uploads/uplout.controller';
import { TranzaktionModule } from './tranzaktion/tranzaktion.module';
import { Tranzaksiya } from './tranzaktion/model/tranzaktion.model';
import { InfoModule } from './info/info.module';
import { FileModule } from './file/file.module';
import { DeleteModule } from './delete/delete.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
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
      models: [
        User,
        Market,
        Product,
        Orders,
        Savat,
        Order_Item,
        SupportTicket,
        Rating,
        Category,
        Chat,
        Comment,
        Notification,
        Tranzaksiya,
      ],
    }),
    UserModule,
    CategoryModule,
    RatingModule,
    MarketModule,
    SavatModule,
    OrderModule,
    OrderItemsModule,
    ProductModule,
    AdminModule,
    UploutModule,
    MailModule,
    VerifyModule,
    SupportTicketModule,
    NotificationModule,
    ChatModule,
    CommentModule,
    TranzaktionModule,
    InfoModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/file',
    }),

    FileModule,
    DeleteModule,
  ],
  controllers: [UploadController],
})
export class AppModule {}
