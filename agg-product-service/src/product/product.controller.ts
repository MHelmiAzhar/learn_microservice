import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateFilmDto } from 'src/product/dto/createFilm.dto';
import { UpdateFilmDto } from 'src/product/dto/updateFilm.dto';
import { JwtAuthGuard } from 'src/product/guard/jwt.guard';
import { GetUser } from 'src/decorator/auth.decorator';
import { ParseImagePipe } from 'src/pipe/image.pipe';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('film')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createFilm(
    @Body() dto: CreateFilmDto,
    @UploadedFile(ParseImagePipe)
    image: Express.Multer.File,
    @GetUser('sub') userId: string,
  ) {
    return this.productService.createFilm(dto, userId, image);
  }

  @Get()
  getAllFilm() {
    return this.productService.getAllFilm();
  }

  @Get(':id')
  getFilmById(@Param('id') id: string) {
    return this.productService.getFilmById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  updateFilm(
    @Param('id') productId: string,
    @Body() dto: UpdateFilmDto,
    @GetUser('sub') userId: string,
    @UploadedFile(ParseImagePipe)
    image: Express.Multer.File,
  ) {
    return this.productService.updateFilm(productId, dto, userId, image);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteFilm(@Param('id') productId: string, @GetUser('sub') userId: string) {
    return this.productService.deleteFilm(productId, userId);
  }
}
