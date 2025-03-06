// src/models/Translation.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITranslation extends Document {
  originalText: string;
  originalLanguage: string;
  translatedText: string;
  targetLanguage: string;
  translationModel: string;  // 'claude', 'openai', 'google' vb. - 'model' yerine 'translationModel' kullanıyoruz
  createdAt: Date;
  usageCount: number;
}

const translationSchema = new Schema<ITranslation>({
  originalText: {
    type: String,
    required: true
  },
  originalLanguage: {
    type: String,
    required: true
  },
  translatedText: {
    type: String,
    required: true
  },
  targetLanguage: {
    type: String,
    required: true
  },
  translationModel: {  // 'model' yerine 'translationModel' kullanıyoruz
    type: String,
    required: true,
    default: 'claude'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d' // 30 gün sonra otomatik silinir
  },
  usageCount: {
    type: Number,
    default: 1
  }
});

// Önbellek için bileşik indeks
translationSchema.index({ 
  originalText: 1, 
  originalLanguage: 1, 
  targetLanguage: 1 
});

export const Translation = mongoose.model<ITranslation>('Translation', translationSchema);