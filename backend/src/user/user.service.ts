import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async byId(_id: string) {
    const user = await this.UserModel.findById(_id).exec();
    if (user) return user;
    throw new NotFoundException('User not found');
  }

  async updateProfile(_id: string, data: UpdateUserDto) {
    const user = await this.UserModel.findById(_id);
    const isSameUser = await this.UserModel.findOne({ email: data.email });

    if (isSameUser && String(_id) !== String(isSameUser._id)) {
      throw new NotFoundException('Email busy');
    }

    if (user) {
      if (data.password) {
        const salt = await genSalt(10);
        user.password = await hash(data.password, salt);
      }
      user.email = data.email;
      if (data.isAdmin || data.isAdmin === false) {
        user.isAdmin = data.isAdmin;
      }
      await user.save();
      return;
    }
  }

  async getCount() {
    return this.UserModel.find().countDocuments().exec();
  }

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            email: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.UserModel.find(options)
      .select('-password -updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async toggleFavorite(movieId: Types.ObjectId, user: User) {
    const { favorites, _id } = user;

    if (!favorites) {
      throw new NotFoundException('user not found');
    }
    const updatedFavorites = favorites?.some((id) => id.equals(movieId))
      ? favorites.filter((id) => !id.equals(movieId))
      : [...favorites, movieId];

    return await this.UserModel.findByIdAndUpdate(
      _id,
      { favorites: updatedFavorites },
      { new: true },
    );
  }

  async getFavoriteMovies(_id: string) {
    return this.UserModel.findById(_id, 'favorites')
      .populate({
        path: 'favorites',
        populate: {
          path: 'genres',
        },
      })
      .exec()
      .then((data) => {
        return data?.favorites;
      });
  }
}
