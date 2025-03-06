// server/src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';
import { hash, compare } from 'bcrypt';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  preferredLanguage: string;
  profilePictureUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  preferredLanguage: { 
    type: String, 
    required: true,
    default: 'en'
  },
  profilePictureUrl: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLogin: { 
    type: Date 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return await compare(password, this.passwordHash);
};

// Güncelleme tarihini otomatik güncelle
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const User = mongoose.model<IUser>('User', userSchema);