import jwt from "jsonwebtoken";

export function generateAccessToken(user) {
  return jwt.sign(
    {
      userId: user.user_id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
    },
  );
}

export function generateRefreshToken(user, sessionId) {
  return jwt.sign(
    {
      userId: user.user_id,
      sessionId,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
    },
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}
