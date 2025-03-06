import express from 'express';
import roomController from '../controllers/roomController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Oda oluşturma
router.post('/create', auth, (req, res) => {
  roomController.createRoom(req, res);
});

// Odaya katılma
router.post('/join', auth, (req, res) => {
  roomController.joinRoom(req, res);
});

// Kullanıcının odalarını listeleme
router.get('/list', auth, (req, res) => {
  roomController.listRooms(req, res);
});

// Oda detaylarını getirme
router.get('/:roomId', auth, (req, res) => {
  roomController.getRoomDetails(req, res);
});

// Odadan ayrılma
router.post('/:roomId/leave', auth, (req, res) => {
  roomController.leaveRoom(req, res);
});

export default router;