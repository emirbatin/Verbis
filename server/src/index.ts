import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/database';
import { translateText } from './services/translationService';

// Routerları import et
import userRoutes from './routes/userRoutes';
import roomRoutes from './routes/roomRoutes';
import translationRoutes from './routes/translationRoutes';
import speechRoutes from './routes/speechRoutes';

// Çevresel değişkenleri yükle
dotenv.config();

// Express uygulamasını oluştur
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB'ye bağlan
connectDB();

// Ana rota
app.get('/', (req, res) => {
  res.send('Verbis API çalışıyor!');
});

// Routerları kullan
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/translate', translationRoutes);
app.use('/api/speech', speechRoutes);

// WebSocket bağlantıları
io.on('connection', (socket) => {
  console.log('Kullanıcı bağlandı:', socket.id);
  
  // Odaya katılma
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Kullanıcı ${socket.id} oda ${roomId}'ye katıldı`);
  });
  
  // Gerçek zamanlı çeviri
  socket.on('translate-message', async (data) => {
    try {
      const { roomId, userId, originalText, sourceLanguage, targetLanguages } = data;
      
      // Her hedef dil için çeviri yap
      const translations = await Promise.all(
        targetLanguages.map(async (targetLang: string) => {
          const translatedText = await translateText(
            originalText,
            sourceLanguage,
            targetLang
          );
          
          return {
            targetLanguage: targetLang,
            translatedText
          };
        })
      );
      
      // Çevirileri odadaki herkese gönder
      io.to(roomId).emit('translation-result', {
        userId,
        originalText,
        sourceLanguage,
        translations
      });
    } catch (error) {
      console.error('WebSocket çeviri hatası:', error);
      socket.emit('translation-error', { error: 'Çeviri sırasında bir hata oluştu' });
    }
  });
  
  // Odadan ayrılma
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`Kullanıcı ${socket.id} oda ${roomId}'den ayrıldı`);
  });
  
  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı:', socket.id);
  });
});

// Server'ı başlat
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});