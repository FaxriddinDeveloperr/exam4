import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ".env"
  }),
  SequelizeModule.forRoot({
    dialect: "postgres",
    host: process.env.HOST,
    username: process.env.NAME,
    password: String(process.env.PASS),
    port: Number(process.env.PORTS),
    logging: false,
    database: process.env.DB,
    autoLoadModels: true,
    synchronize: true,
    models:[]
  }),
   UserModule],

})
export class AppModule {}
