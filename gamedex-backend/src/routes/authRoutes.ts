import express from 'express';
import { register, login } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/test', (req, res) => {
  res.send('Test route works');
});

export default router;