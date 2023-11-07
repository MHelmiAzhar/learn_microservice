import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { RmqModule } from 'src/rmq/rmq.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmSchema } from './schema/film.schema';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [
    RmqModule,
    MongooseModule.forFeature([
      {
        name: 'Film',
        schema: FilmSchema,
      },
    ]),
  ],
})
export class ProductModule {}
