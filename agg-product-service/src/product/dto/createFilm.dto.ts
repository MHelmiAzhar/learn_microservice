import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFilmDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  year: string;

  @IsNotEmpty()
  @IsString()
  author: string;
}
