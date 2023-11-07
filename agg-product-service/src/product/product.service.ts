import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  MINIO_SERVICE,
  PRODUCT_SERVICE,
  USER_SERVICE,
} from 'src/constants/service';
import { CreateFilmDto } from 'src/product/dto/createFilm.dto';
import { UpdateFilmDto } from 'src/product/dto/updateFilm.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_SERVICE) private productClient: ClientProxy,
    @Inject(USER_SERVICE) private userClient: ClientProxy,
    @Inject(MINIO_SERVICE) private minioClient: ClientProxy,
  ) {}

  async createFilm(
    dto: CreateFilmDto,
    userId: string,
    image: Express.Multer.File,
  ) {
    const imageUrl$ = this.minioClient.send('send_image', image);
    const imageUrl = await firstValueFrom(imageUrl$);
    const data = { ...dto, userId, imageUrl };
    await this.productClient.emit('create_film', data);
    return data;
  }

  async getAllFilm() {
    const films$ = this.productClient.send('get_all_film', {});
    const films = await firstValueFrom(films$);
    return {
      data: films,
    };
  }

  async getFilmById(id: string) {
    const film$$ = this.productClient.send('get_data_by_id', id);
    const film = await firstValueFrom(film$$);

    // const user$ = this.userClient.send('get_user_by_id', film.userId);
    // const user = await firstValueFrom(user$);

    const data = { ...film };
    return {
      data,
    };
  }

  async updateFilm(
    id: string,
    dto: UpdateFilmDto,
    userId: string,
    image: Express.Multer.File,
  ) {
    const film$ = this.productClient.send('get_data_by_id', id);
    const currentFilm = await firstValueFrom(film$);

    if (userId != currentFilm.userId) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'This is not your product',
      });
    }
    const imageUrl = await this.handleImageUrl(image, currentFilm);

    dto = this.handleUpdateDto(dto, currentFilm);

    const data = { id, ...dto, imageUrl };

    await this.productClient.emit('update_film', data);

    return {
      statusCode: 201,
      message: `Success Update Film Id : ${id}`,
    };
  }

  async deleteFilm(id: string, userId: string) {
    const film$$ = this.productClient.send('get_data_by_id', id);
    const film = await firstValueFrom(film$$);
    if (userId != film.userId) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'This is not your product',
      });
    }
    await this.handleDeleteImage(film);
    this.productClient.emit('delete_film_by_id', id);

    return {
      message: `Success Delete film Id : ${id}`,
    };
  }

  async handleDeleteImage(film) {
    const imageName = film.image.substring(film.image.lastIndexOf('/') + 1);
    this.minioClient.emit('delete_image_by_name', imageName);
  }
  async handleImageUrl(image, currentProduct) {
    let imageUrl;

    if (!image) {
      imageUrl = currentProduct.image;
    } else {
      const newImageUrl$ = this.minioClient.send('send_image', image);
      const newImageUrl = await firstValueFrom(newImageUrl$);
      const imageName = currentProduct.image.substring(
        currentProduct.image.lastIndexOf('/') + 1,
      );
      this.minioClient.emit('delete_image_by_name', imageName);
      imageUrl = newImageUrl;
    }

    return imageUrl;
  }

  handleUpdateDto(dto, currentFilm) {
    let title: string;
    if (!dto.title) {
      title = currentFilm.title;
    } else {
      title = dto.title;
    }

    let year: number;
    if (!dto.year) {
      year = currentFilm.year;
    } else {
      year = dto.year;
    }

    let author: string;
    if (!dto.price) {
      author = currentFilm.price;
    } else {
      author = dto.price;
    }

    return { title, year, author };
  }
}
