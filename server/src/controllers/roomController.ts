import { Request, Response } from 'express';
import { Room } from '../models/Room';
import { RoomParticipant } from '../models/RoomParticipant';
import QRCode from 'qrcode';

// QR kod URL'si oluşturma yardımcı fonksiyonu
const generateQRCode = async (roomCode: string): Promise<string> => {
  try {
    // Odaya katılım URL'si oluştur
    const joinUrl = `verbis://room/join?code=${roomCode}`;
    
    // QR kodu Data URL olarak oluştur
    const qrDataUrl = await QRCode.toDataURL(joinUrl);
    return qrDataUrl;
  } catch (error) {
    console.error('QR kod oluşturma hatası:', error);
    return '';
  }
};

const roomController = {
  // Oda oluşturma - Promise<void> dönüş tipi
  createRoom: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, supportedLanguages, isPrivate, maxParticipants, settings } = req.body;
      const userId = (req as any).user.id;

      // Yeni oda oluştur
      const newRoom = new Room({
        ownerId: userId,
        name,
        supportedLanguages: supportedLanguages || ['en'],
        isPrivate: isPrivate || false,
        maxParticipants: maxParticipants || 10,
        settings: {
          recordConversation: settings?.recordConversation || false,
          allowJoinRequests: settings?.allowJoinRequests || true,
          autoTranslateMessages: settings?.autoTranslateMessages || true
        }
      });

      // Odayı kaydet
      const room = await newRoom.save();

      // QR kod oluştur
      const qrCodeUrl = await generateQRCode(room.roomCode);
      room.qrCodeUrl = qrCodeUrl;
      await room.save();

      // Oda sahibini katılımcı olarak ekle
      const userInfo = await RoomParticipant.create({
        roomId: room._id,
        userId,
        speakingLanguage: supportedLanguages?.[0] || 'en',
        listeningLanguage: supportedLanguages?.[0] || 'en',
        role: 'owner'
      });

      res.status(201).json({
        room,
        userInfo
      });
    } catch (error) {
      console.error('Oda oluşturma hatası:', error);
      res.status(500).json({ error: 'Oda oluşturulurken bir hata oluştu' });
    }
  },

  // Odaya katılma - Promise<void> dönüş tipi
  joinRoom: async (req: Request, res: Response): Promise<void> => {
    try {
      const { roomCode, speakingLanguage, listeningLanguage } = req.body;
      const userId = (req as any).user.id;

      // Odayı bul
      const room = await Room.findOne({ roomCode, isActive: true });
      if (!room) {
        res.status(404).json({ error: 'Oda bulunamadı veya aktif değil' });
        return;
      }

      // Kullanıcının zaten katılmış olup olmadığını kontrol et
      let participant = await RoomParticipant.findOne({ roomId: room._id, userId });
      
      if (participant) {
        // Kullanıcı zaten katılmış, bilgileri güncelle
        participant.speakingLanguage = speakingLanguage || participant.speakingLanguage;
        participant.listeningLanguage = listeningLanguage || participant.listeningLanguage;
        participant.lastActive = new Date();
        await participant.save();
      } else {
        // Yeni katılımcı oluştur
        participant = await RoomParticipant.create({
          roomId: room._id,
          userId,
          speakingLanguage: speakingLanguage || room.supportedLanguages[0],
          listeningLanguage: listeningLanguage || room.supportedLanguages[0],
          role: room.ownerId.toString() === userId ? 'owner' : 'participant'
        });
      }

      res.json({
        room,
        participant
      });
    } catch (error) {
      console.error('Odaya katılma hatası:', error);
      res.status(500).json({ error: 'Odaya katılırken bir hata oluştu' });
    }
  },

  // Kullanıcının odalarını listeleme - Promise<void> dönüş tipi
  listRooms: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      // Kullanıcının katıldığı odaları bul
      const participations = await RoomParticipant.find({ userId }).select('roomId');
      const roomIds = participations.map(p => p.roomId);

      // Odaları getir
      const rooms = await Room.find({ 
        $or: [
          { _id: { $in: roomIds } },
          { ownerId: userId }
        ],
        isActive: true
      }).sort({ createdAt: -1 });

      res.json(rooms);
    } catch (error) {
      console.error('Oda listeleme hatası:', error);
      res.status(500).json({ error: 'Odalar listelenirken bir hata oluştu' });
    }
  },

  // Oda detaylarını getirme - Promise<void> dönüş tipi
  getRoomDetails: async (req: Request, res: Response): Promise<void> => {
    try {
      const { roomId } = req.params;
      const userId = (req as any).user.id;

      // Odayı ve katılımcıları getir
      const room = await Room.findById(roomId);
      if (!room) {
        res.status(404).json({ error: 'Oda bulunamadı' });
        return;
      }

      // Kullanıcının bu odaya erişimi var mı kontrol et
      const isParticipant = await RoomParticipant.exists({ roomId, userId });
      const isOwner = room.ownerId.toString() === userId;

      if (!isParticipant && !isOwner) {
        res.status(403).json({ error: 'Bu odaya erişim izniniz yok' });
        return;
      }

      // Odanın tüm katılımcılarını getir
      const participants = await RoomParticipant.find({ roomId })
        .populate('userId', 'name email preferredLanguage profilePictureUrl');

      res.json({
        room,
        participants
      });
    } catch (error) {
      console.error('Oda detayları hatası:', error);
      res.status(500).json({ error: 'Oda detayları alınırken bir hata oluştu' });
    }
  },

  // Odadan ayrılma - Promise<void> dönüş tipi
  leaveRoom: async (req: Request, res: Response): Promise<void> => {
    try {
      const { roomId } = req.params;
      const userId = (req as any).user.id;

      // Kullanıcının katılımcı kaydını bul ve sil
      const participant = await RoomParticipant.findOneAndDelete({ roomId, userId });
      
      if (!participant) {
        res.status(404).json({ error: 'Bu odada katılımcı değilsiniz' });
        return;
      }

      // Oda sahibi ayrılıyorsa ve başka katılımcı yoksa odayı pasif hale getir
      const isOwner = await Room.exists({ _id: roomId, ownerId: userId });
      if (isOwner) {
        const otherParticipants = await RoomParticipant.countDocuments({ roomId });
        
        if (otherParticipants === 0) {
          // Odayı pasif hale getir
          await Room.findByIdAndUpdate(roomId, { isActive: false });
        } else {
          // Başka bir katılımcıyı oda sahibi yap
          const newOwner = await RoomParticipant.findOne({ roomId }).sort({ joinedAt: 1 });
          if (newOwner) {
            await RoomParticipant.findByIdAndUpdate(newOwner._id, { role: 'owner' });
            await Room.findByIdAndUpdate(roomId, { ownerId: newOwner.userId });
          }
        }
      }

      res.json({ message: 'Odadan başarıyla ayrıldınız' });
    } catch (error) {
      console.error('Odadan ayrılma hatası:', error);
      res.status(500).json({ error: 'Odadan ayrılırken bir hata oluştu' });
    }
  }
};

export default roomController;