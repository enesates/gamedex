import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isExistingUser, getUser, createUser } from '../db/db.helper';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  try {
    if (await isExistingUser(username, email)) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await createUser(username, email, hashedPassword);
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      token,
    });

  } catch (error) {
    res.status(500).json({ message: 'Error while registering the user', error });
    return;
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  try {
    const user = await getUser(email);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });

  } catch (error) {
    res.status(500).json({ message: 'Error while logging in', error });
    return;
  }
}