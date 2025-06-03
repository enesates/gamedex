import prisma from './prisma';

export const isExistingUser = async (username: string, email: string) => {
  let user;

  try {
    user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });
  } catch (error) {
    console.error('Error checking existing user', error);
    return false;
  }

  return user !== null;
}

export const getUser = async (email: string) => {
  try {
    return await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('User not found');
  }
}

export const createUser = async (username: string, email: string, password: string) => {
  try {
    return await prisma.user.create({
      data: {
        username,
        email,
        password
      },
      select: {
        id: true,
        username: true,
        email: true,
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('User creation failed');
  }
}