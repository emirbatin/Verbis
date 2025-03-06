import { Request, Response, RequestHandler } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface UserRequest extends Request {
  user?: any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'verbis-secret-key';

const userController = {
  // RequestHandler tipini kullanarak tanımlayalım
  register: (req: Request, res: Response) => {
    const { email, password, name, preferredLanguage } = req.body;

    try {
      // Email kontrolü yapıp kullanıcının zaten olup olmadığını kontrol edelim
      User.findOne({ email }).then(user => {
        if (user) {
          return res.status(400).json({ msg: 'Bu email zaten kullanımda' });
        }

        // Yeni kullanıcı oluşturalım
        const newUser = new User({
          email,
          passwordHash: '',
          name,
          preferredLanguage: preferredLanguage || 'en'
        });

        // Şifreyi hashleyelim
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            newUser.passwordHash = hash;
            newUser.save()
              .then(user => {
                // JWT için payload
                const payload = {
                  user: {
                    id: user.id
                  }
                };

                // JWT token oluşturalım
                jwt.sign(
                  payload,
                  JWT_SECRET,
                  { expiresIn: '24h' },
                  (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                  }
                );
              })
              .catch(err => {
                console.error(err);
                res.status(500).send('Server hatası');
              });
          });
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server hatası');
    }
  },

  login: (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      // Kullanıcıyı bulalım
      User.findOne({ email }).then(user => {
        if (!user) {
          return res.status(400).json({ msg: 'Geçersiz kimlik bilgileri' });
        }

        // Şifreyi kontrol edelim
        bcrypt.compare(password, user.passwordHash).then(isMatch => {
          if (!isMatch) {
            return res.status(400).json({ msg: 'Geçersiz kimlik bilgileri' });
          }

          // Son giriş zamanını güncelleyelim
          user.lastLogin = new Date();
          user.save();

          // JWT için payload
          const payload = {
            user: {
              id: user.id
            }
          };

          // JWT token oluşturalım
          jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server hatası');
    }
  },

  getMe: (req: UserRequest, res: Response) => {
    try {
      User.findById(req.user.id).select('-passwordHash')
        .then(user => {
          if (!user) {
            return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
          }
          res.json(user);
        });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server hatası');
    }
  },

  updateProfile: (req: UserRequest, res: Response) => {
    const { name, preferredLanguage, profilePictureUrl } = req.body;

    try {
      User.findById(req.user.id).then(user => {
        if (!user) {
          return res.status(404).json({ msg: 'Kullanıcı bulunamadı' });
        }

        // Güncelleme alanlarını kontrol edelim
        if (name) user.name = name;
        if (preferredLanguage) user.preferredLanguage = preferredLanguage;
        if (profilePictureUrl) user.profilePictureUrl = profilePictureUrl;

        user.save().then(updatedUser => {
          res.json(updatedUser);
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server hatası');
    }
  }
};

export default userController;