import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {
  AUTH_SERVICE,
  MINIO_SERVICE,
  PRODUCT_SERVICE,
  USER_SERVICE,
} from 'src/constants/service';
import { RmqModule } from 'src/rmq/rmq.module.service';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [
    RmqModule.register({
      name: PRODUCT_SERVICE,
    }),
    RmqModule.register({
      name: USER_SERVICE,
    }),
    RmqModule.register({
      name: AUTH_SERVICE,
    }),
    RmqModule.register({
      name: MINIO_SERVICE,
    }),
  ],
})
export class ProductModule {}
