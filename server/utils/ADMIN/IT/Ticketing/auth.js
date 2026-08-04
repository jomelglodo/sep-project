import crypto from "crypto";

/* HASH the refresh token before starting it in the database */
export function hashRefreshToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/* Calculate the refresh token expiration date */
export function getRefreshTokenExpiry(days = 7) {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  return expires;
}

export function getSessionExpiry(days = 30) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
