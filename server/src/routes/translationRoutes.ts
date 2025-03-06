// src/routes/translationRoutes.ts
import express from 'express';
import translationController from '../controllers/translationController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Metin çevirisi
router.post('/text', auth, (req, res) => {
  translationController.translateText(req, res);
});

// Desteklenen diller
router.get('/languages', (req, res) => {
  translationController.getSupportedLanguages(req, res);
});

export default router;