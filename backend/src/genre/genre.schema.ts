import { Schema, Document, model } from 'mongoose';
import { GenreModule } from './genre.module';

export interface Genre extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export const GenreSchema = new Schema<Genre>(
  {
    name: { type: String },
    slug: { type: String, unique: true },
    description: { type: String },
    icon: { type: String },
  },
  { timestamps: true },
);

export const GenreModel = model<Genre>('Genre', GenreSchema);
