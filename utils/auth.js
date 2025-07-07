import jwt from 'jsonwebtoken';

export const getUserFromToken = (token) => {
  try {
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};
