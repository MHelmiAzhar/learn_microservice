import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Film } from './schema/film.schema';

interface FilmData {
  id: string;
  title: string;
  year: number;
  author: string;
  userId: string;
  imageUrl: string;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: mongoose.Model<Film>,
  ) {}

  async createFilm(data: FilmData) {
    try {
      const newFilm = await this.filmModel.create({
        title: data.title,
        year: data.year,
        author: data.author,
        userId: data.userId,
        image: data.imageUrl,
      });
      return newFilm;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllFilm() {
    try {
      const film = await this.filmModel.find();
      return film;
    } catch (error) {
      console.error(error);
    }
  }

  async getFilmById(id: any) {
    try {
      const film = await this.filmModel.findOne({
        _id: id,
      });

      return film;
    } catch (error) {
      console.error(error);
    }
  }

  async updateFilm(data: FilmData) {
    try {
      await this.filmModel.updateOne(
        {
          _id: data.id,
        },
        {
          $set: {
            title: data.title,
            year: data.year,
            author: data.author,
            image: data.imageUrl,
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  }

  async deleteFilm(id: string) {
    try {
      await this.filmModel.deleteOne({
        _id: id,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
