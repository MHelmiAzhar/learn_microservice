import { Controller } from '@nestjs/common';
import { RmqService } from 'src/rmq/rmq.service';
import { ProductService } from './product.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('create_film')
  createFilm(@Payload() data, @Ctx() context: RmqContext) {
    this.productService.createFilm(data);
    this.rmqService.ack(context);
  }

  @EventPattern('get_all_film')
  getAllFilm(@Payload() data: any, @Ctx() context: RmqContext) {
    const films = this.productService.getAllFilm();
    this.rmqService.ack(context);
    return films;
  }

  @EventPattern('get_data_by_id')
  async getFilmById(@Payload() data: any, @Ctx() context: RmqContext) {
    const film = await this.productService.getFilmById(data);
    this.rmqService.ack(context);
    return film;
  }

  @EventPattern('update_film')
  updateFilm(@Payload() data: any, @Ctx() context: RmqContext) {
    const film = this.productService.updateFilm(data);
    this.rmqService.ack(context);
    return film;
  }

  @EventPattern('delete_film_by_id')
  deleteFilm(@Payload() data: any, @Ctx() context) {
    this.productService.deleteFilm(data);
    this.rmqService.ack(context);
  }
}
