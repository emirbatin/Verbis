// src/controllers/speechController.ts
import { Request, Response } from 'express';
import { speechToText, textToSpeech } from '../services/translationService';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const speechController = {
  // Konuşmayı metne çevirme
  transcribeAudio: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Ses dosyası gereklidir' });
        return;
      }

      const audioBuffer = req.file.buffer;
      const language = req.body.language || 'en';

      const transcription = await speechToText(audioBuffer, language);

      res.json({
        text: transcription,
        language: language
      });
    } catch (error) {
      console.error('Transcription hatası:', error);
      res.status(500).json({ error: 'Ses dosyası işlenirken bir hata oluştu' });
    }
  },

  // Metni sese çevirme
  synthesizeSpeech: async (req: Request, res: Response): Promise<void> => {
    try {
      const { text, voice } = req.body;
      
      if (!text) {
        res.status(400).json({ error: 'Metin gereklidir' });
        return;
      }

      const audioBuffer = await textToSpeech(text, voice);
      
      // Geçici dosya oluştur (opsiyonel, sadece dosya olarak kaydetmek isterseniz)
      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const fileName = `speech_${uuidv4()}.mp3`;
      const filePath = path.join(tempDir, fileName);
      fs.writeFileSync(filePath, audioBuffer);

      // Ses dosyasını yanıt olarak gönder
      res.set('Content-Type', 'audio/mpeg');
      res.send(audioBuffer);
    } catch (error) {
      console.error('Speech synthesis hatası:', error);
      res.status(500).json({ error: 'Metin sese çevrilirken bir hata oluştu' });
    }
  }
};

export default speechController;