import { Schema, model, Document, Types } from 'mongoose';

export interface Parameter {
  year: number;
  duration: number;
  country: string;
}

export interface Movie extends Document {
  poster: string;
  bigPoster: string;
  title: string;
  parameters: Parameter;
  rating?: number;
  genres: Types.ObjectId[];
  countOpened?: number;
  videoUrl: string;
  actors: Types.ObjectId[];
  slug: string;
  isSendTelegram?: boolean;
}

const ParameterSchema = new Schema<Parameter>({
  year: { type: Number, required: true },
  duration: { type: Number, required: true },
  country: { type: String, required: true },
});

export const MovieSchema = new Schema<Movie>(
  {
    poster: { type: String, required: true },
    bigPoster: { type: String, required: true },
    title: { type: String, unique: true, required: true },
    parameters: { type: ParameterSchema, required: false },
    rating: { type: Number, default: 4.0 },
    genres: [{ type: Types.ObjectId, ref: 'Genre' }],
    countOpened: { type: Number, default: 0 },
    videoUrl: { type: String, unique: true, required: true },
    actors: [{ type: Types.ObjectId, ref: 'Actor' }],
    slug: { type: String, unique: true, required: true },
    isSendTelegram: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const MovieModel = model<Movie>('Movie', MovieSchema);
