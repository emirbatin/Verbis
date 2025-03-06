import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

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

// Ana rota
app.get('/', (req, res) => {
  res.send('Verbis API çalışıyor!');
});

// WebSocket bağlantıları
io.on('connection', (socket) => {
  console.log('Kullanıcı bağlandı:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı:', socket.id);
  });
});

// Server'ı başlat
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
