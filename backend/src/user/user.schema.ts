import { Schema, Document, model, Types } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  isAdmin?: boolean;
  favorites?: Types.ObjectId[];
}

export const UserSchema = new Schema<User>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    favorites: [{ type: Types.ObjectId, ref: 'Movie', default: [] }],
  },
  { timestamps: true },
);

export const UserModel = model<User>('User', UserSchema);
