// src/controllers/translationController.ts
import { Request, Response } from 'express';
import { translateText } from '../services/translationService';

const translationController = {
  // Metin çevirisi
  translateText: async (req: Request, res: Response): Promise<void> => {
    try {
      const { text, sourceLanguage, targetLanguage } = req.body;
      
      // Gerekli alanların kontrolü
      if (!text || !sourceLanguage || !targetLanguage) {
        res.status(400).json({ error: 'Metin, kaynak dil ve hedef dil gereklidir' });
        return;
      }

      // Metni çevir
      const translatedText = await translateText(
        text, 
        sourceLanguage, 
        targetLanguage
      );

      // Yanıt döndür
      res.json({
        originalText: text,
        originalLanguage: sourceLanguage,
        translatedText: translatedText,
        targetLanguage: targetLanguage,
        translationModel: 'openai' // 'model' yerine 'translationModel' kullanıyoruz
      });
    } catch (error) {
      console.error('Çeviri controller hatası:', error);
      res.status(500).json({ error: 'Çeviri işlemi sırasında bir hata oluştu' });
    }
  },

  // Desteklenen dilleri listeleme
  getSupportedLanguages: async (_req: Request, res: Response): Promise<void> => {
    // Verbis'in desteklediği diller
    const supportedLanguages = [
      { code: 'en', name: 'English' },
      { code: 'tr', name: 'Turkish' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'ar', name: 'Arabic' }
    ];
    
    res.json(supportedLanguages);
  }
};

export default translationController;