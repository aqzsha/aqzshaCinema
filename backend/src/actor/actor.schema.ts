import { Schema, Document, model } from 'mongoose';

export interface Actor extends Document {
  name: string;
  slug: string;
  photo: string;
}

export const ActorSchema = new Schema<Actor>(
  {
    name: { type: String },
    slug: { type: String, unique: true },
    photo: { type: String },
  },
  { timestamps: true },
);

export const ActorModel = model<Actor>('Actor', ActorSchema);
