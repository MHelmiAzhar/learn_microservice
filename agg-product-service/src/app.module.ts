import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from './rmq/rmq.module.service';
import { ProductModule } from './product/product.module';
import * as Joi from 'joi';

@Module({
  providers: [],
  controllers: [],
  imports: [
    RmqModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_PRODUCT_QUEUE: Joi.string().required(),
      }),
    }),
    ProductModule,
  ],
})
export class AppModule {}
