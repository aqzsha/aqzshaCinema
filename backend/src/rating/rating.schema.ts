import { Schema, Document, model } from 'mongoose';

export interface Rating extends Document {
  userId: Schema.Types.ObjectId;
  movieId: Schema.Types.ObjectId;
  value: number;
}

export const RatingSchema = new Schema<Rating>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
    value: { type: Number, required: true },
  },
  { timestamps: true },
);

export const RatingModel = model<Rating>('Rating', RatingSchema);
