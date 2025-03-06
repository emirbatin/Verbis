// src/routes/speechRoutes.ts
import express from 'express';
import multer from 'multer';
import speechController from '../controllers/speechController';
import { auth } from '../middleware/auth';

// Hafızada ses dosyası saklama için multer konfigürasyonu
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Ses dosyasını metne çevirme
router.post('/transcribe', auth, upload.single('audio'), (req, res) => {
  speechController.transcribeAudio(req, res);
});

// Metni sese çevirme
router.post('/synthesize', auth, (req, res) => {
  speechController.synthesizeSpeech(req, res);
});

export default router;