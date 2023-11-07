import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({})
export class Film {
  @Prop({
    required: true,
  })
  title: string;

  @Prop()
  year: number;

  @Prop()
  author: string;
  @Prop()
  userId: string;
  @Prop()
  image: string;
}

export const FilmSchema = SchemaFactory.createForClass(Film);
