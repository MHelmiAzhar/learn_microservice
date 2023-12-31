import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RmqModuleService } from './rmq/rmq.module.service';
import { RmqModule } from './rmq/rmq.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URI, {
      dbName: process.env.DB_NAME,
    }),
    RmqModuleService,
    RmqModule,
  ],
})
export class AppModule {}
