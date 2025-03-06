import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Kullanıcı tipini tanımlama
interface JwtPayload {
  user: {
    id: string;
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'verbis-secret-key';

// Middleware fonksiyonu - void döndürmeli
export const auth = (req: Request, res: Response, next: NextFunction): void => {
  // Token'ı header'dan al
  const token = req.header('x-auth-token');

  // Token yoksa erişim engelle
  if (!token) {
    res.status(401).json({ msg: 'Yetkilendirme başarısız, token bulunamadı' });
    return; // Fonksiyon bitimini belirt
  }

  try {
    // Token'ı doğrula
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // Request'e user bilgisini ekle
    (req as any).user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Geçersiz token' });
    return; // Fonksiyon bitimini belirt
  }
};