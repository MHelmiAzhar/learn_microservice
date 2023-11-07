import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateFilmDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsString()
  author?: string;
}
