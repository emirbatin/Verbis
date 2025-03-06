import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Oda ayarları için arayüz
interface RoomSettings {
  recordConversation: boolean;
  allowJoinRequests: boolean;
  autoTranslateMessages: boolean;
}

// Oda için arayüz
export interface IRoom extends Document {
  roomCode: string;
  qrCodeUrl?: string;
  ownerId: mongoose.Types.ObjectId;
  name: string;
  supportedLanguages: string[];
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  isPrivate: boolean;
  maxParticipants: number;
  settings: RoomSettings;
}

const roomSchema = new Schema<IRoom>({
  roomCode: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => uuidv4().substring(0, 6).toUpperCase() // UUID'den ilk 6 karakteri alıyoruz
  },
  qrCodeUrl: { 
    type: String 
  },
  ownerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  supportedLanguages: { 
    type: [String], 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  expiresAt: { 
    type: Date 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isPrivate: { 
    type: Boolean, 
    default: false 
  },
  maxParticipants: { 
    type: Number, 
    default: 10 
  },
  settings: {
    recordConversation: { 
      type: Boolean, 
      default: false 
    },
    allowJoinRequests: { 
      type: Boolean, 
      default: true 
    },
    autoTranslateMessages: { 
      type: Boolean, 
      default: true 
    }
  }
});

export const Room = mongoose.model<IRoom>('Room', roomSchema);