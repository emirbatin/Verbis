import express from 'express';
import userController from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = express.Router();

// @route   POST api/users/register
// @desc    Kullanıcı kaydı
// @access  Public
router.post('/register', userController.register);

// @route   POST api/users/login
// @desc    Kullanıcı girişi ve JWT token alma
// @access  Public
router.post('/login', userController.login);

// @route   GET api/users/me
// @desc    Giriş yapmış kullanıcının bilgilerini getir
// @access  Private
router.get('/me', auth, userController.getMe);

// @route   PUT api/users/profile
// @desc    Kullanıcı profilini güncelle
// @access  Private
router.put('/profile', auth, userController.updateProfile);

export default router;