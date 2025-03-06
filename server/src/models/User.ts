import mongoose from 'mongoose';

export interface IUser {
  email: string;
  passwordHash: string;
  name: string;
  preferredLanguage: string;
  profilePictureUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  preferredLanguage: { type: String, required: true },
  profilePictureUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true }
});

export const User = mongoose.model<IUser>('User', userSchema);
