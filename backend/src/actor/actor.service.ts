import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Actor } from './actor.schema';
import { CreateActorDto } from './dto/create-actor.dto';

@Injectable()
export class ActorService {
  constructor(
    @InjectModel('Actor') private readonly ActorModel: Model<Actor>,
  ) {}

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return (
      this.ActorModel.aggregate()
        .match(options)
        .lookup({
          from: 'Movie',
          localField: '_id',
          foreignField: 'actors',
          as: 'movies',
        })
        // .lookup({
        // 	from: 'Movie',
        // 	let: { id: '$_id' },
        // 	pipeline: [
        // 		{
        // 			$match: { $expr: { $in: ['$$id', '$actors'] } },
        // 		},
        // 	],
        // 	as: 'movies',
        // })
        .addFields({
          countMovies: { $size: '$movies' },
        })
        .project({ __v: 0, updatedAt: 0, movies: 0 })
        .sort({ createdAt: -1 })
        .exec()
    );

    // Remove some field
    // why count movies only 1
  }

  async bySlug(slug: string) {
    const actor = await this.ActorModel.findOne({ slug }).exec();
    if (!actor) {
      throw new NotFoundException('Actor not found');
    }
    return actor;
  }

  /* Admin area */

  async byId(id: string) {
    return this.ActorModel.findById(id).exec();
  }

  async create() {
    const defaultValue: CreateActorDto = {
      name: '',
      photo: '',
      slug: '',
    };
    const actor = await this.ActorModel.create(defaultValue);
    return actor._id;
  }

  async update(id: string, dto: CreateActorDto) {
    return this.ActorModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string) {
    return this.ActorModel.findByIdAndDelete(id).exec();
  }
}
