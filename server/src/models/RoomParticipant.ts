import mongoose, { Document, Schema } from 'mongoose';

export interface IRoomParticipant extends Document {
  roomId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  speakingLanguage: string;
  listeningLanguage: string;
  joinedAt: Date;
  lastActive: Date;
  isMuted: boolean;
  role: 'owner' | 'moderator' | 'participant';
}

const roomParticipantSchema = new Schema<IRoomParticipant>({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  speakingLanguage: {
    type: String,
    required: true
  },
  listeningLanguage: {
    type: String,
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  isMuted: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['owner', 'moderator', 'participant'],
    default: 'participant'
  }
});

// Bir kullanıcının bir odada sadece bir katılımcı kaydı olabilir
roomParticipantSchema.index({ roomId: 1, userId: 1 }, { unique: true });

export const RoomParticipant = mongoose.model<IRoomParticipant>('RoomParticipant', roomParticipantSchema);