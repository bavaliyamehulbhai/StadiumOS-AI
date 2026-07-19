import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const socketAuthMiddleware = async (socket, next) => {
  try {
    let token;

    // 1. Try to get token from socket auth payload
    if (socket.handshake.auth && socket.handshake.auth.token) {
      token = socket.handshake.auth.token;
    } 
    // 2. Try to get token from cookies
    else if (socket.handshake.headers.cookie) {
      const cookieStr = socket.handshake.headers.cookie;
      const cookies = cookieStr.split(';').reduce((acc, curr) => {
        const [key, val] = curr.trim().split('=');
        acc[key] = val;
        return acc;
      }, {});
      token = cookies.jwt;
    }

    if (!token) {
      return next(new Error('Authentication Error: Missing Token'));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return next(new Error('Authentication Error: User not found'));
    }

    // Attach user to socket
    socket.user = user;
    next();
  } catch (error) {
    console.error('Socket Auth Error:', error.message);
    next(new Error('Authentication Error: Invalid Token'));
  }
};
