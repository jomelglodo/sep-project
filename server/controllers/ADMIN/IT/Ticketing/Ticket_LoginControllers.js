import { ticketPool } from "../../../../db.js";
import { v4 as uuidv4 } from "uuid";

import {
  hashRefreshToken,
  getRefreshTokenExpiry,
  getSessionExpiry,
} from "../../../../utils/ADMIN/IT/Ticketing/auth.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} from "../../../../utils/ADMIN/IT/Ticketing/jwt.js";
import path from "path";

//ACCOUNT VALIDATION
export const accountValidation = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await ticketPool.query(
      `
            SELECT 
            user_id,
            username,
            password,
            d_name,
            role,
            status,
            maximum_sessions
            FROM "tbl_userAccounts"
            WHERE username = $1
            `,
      [username],
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const user = result.rows[0];

    // =========================================================
    // Validate Password
    // =========================================================

    if (user.password !== password) {
      return res.json({
        success: false,
        message: "Incorrect Password",
      });
    }

    // =========================================================
    // Check Account Status
    // =========================================================

    if (user.status && user.status.toUpperCase() !== "ACTIVE") {
      let message;
      if (user.status.toUpperCase() === "DELETED") {
        message = "Account is deleted";
      } else if (user.status.toUpperCase() === "INACTIVE") {
        message = "Account is inactive";
      }

      return res.json({
        success: false,
        message,
      });
    }

    // =========================================================
    // Count active sessions
    // =========================================================

    const sessionCount = await ticketPool.query(
      `
        SELECT 
          COUNT(*) AS active_sessions
        FROM tbl_refresh_tokens
        WHERE user_id=$1
        AND is_revoked = FALSE
        AND expires_at > NOW()
      `,
      [user.user_id],
    );

    const activeSessions = Number(sessionCount.rows[0].active_sessions);

    if (activeSessions >= user.maximum_sessions) {
      return res.status(403).json({
        success: false,
        code: "MAXIMUM_SESSION_REACHED",
        message: "Maximum active sessions reached",
      });
    }

    // =========================================================
    // Generate Tokens
    // =========================================================
    const sessionId = uuidv4();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, sessionId);

    // =========================================================
    // Hash Refresh Token
    // =========================================================

    const tokenHash = hashRefreshToken(refreshToken);

    // =========================================================
    // Save Refresh Token
    // =========================================================

    await ticketPool.query(
      `
      INSERT INTO tbl_refresh_tokens(
      user_id,
      session_id,
      token_hash,
      user_agent,
      ip_address,
      expires_at,
      session_expires_at
      )
      VALUES($1,$2,$3,$4,$5,$6,$7)
      `,
      [
        user.user_id,
        sessionId,
        tokenHash,
        req.headers["user-agent"],
        req.ip,
        getRefreshTokenExpiry(),
        getSessionExpiry(),
      ],
    );

    // =========================================================
    // Send Refresh Cookie
    // =========================================================

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/ticketing/login",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      accessToken,
      d_name: user.d_name,
      role: user.role,
      user_id: user.user_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//REFRESH COOKIE
export const refreshAccessToken = async (req, res) => {
  try {
    // =========================================================
    // Read Refresh Cookie
    // =========================================================
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    // =========================================================
    // Verify JWT
    // =========================================================
    const payload = verifyRefreshToken(refreshToken);

    // ===========================================
    // Hash Refresh Token
    // ===========================================

    const tokenHash = hashRefreshToken(refreshToken);

    // =========================================================
    // Find Session
    // =========================================================

    const sessionResult = await ticketPool.query(
      `
      SELECT
        rt.user_id,
        rt.session_id,
        rt.is_revoked,
        rt.token_hash,
        rt.expires_at,
        rt.session_expires_at,

        ua.username,
        ua.role,
        ua.d_name
      
      FROM tbl_refresh_tokens rt
      INNER JOIN "tbl_userAccounts" ua
        ON ua.user_id=rt.user_id
      WHERE
        rt.token_hash = $1
        AND rt.session_id = $2
      `,
      [tokenHash, payload.sessionId],
    );

    if (sessionResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid session",
      });
    }

    const session = sessionResult.rows[0];

    if (session.is_revoked) {
      res.clearCookie("refreshToken", {
        path: "/",
      });

      return res.status(401).json({
        success: false,
        message: "Session revoked. Please login again.",
      });
    }

    // =========================================================
    // Detect Token Replay
    // =========================================================

    if (session.token_hash !== tokenHash) {
      await ticketPool.query(
        `
        UPDATE tbl_refresh_tokens
        SET
            is_revoked = TRUE,
            revoked_at = NOW(),
            revoked_reason = 'Refresh Token Replay Attack'
        WHERE session_id = $1
        `,
        [session.session_id],
      );

      res.clearCookie("refreshToken", {
        path: "/ticketing/login",
      });

      return res.status(401).json({
        success: false,
        code: "TOKEN_REPLAY",
        message: "Refresh token reuse detected. Please login again",
      });
    }

    // =========================================================
    // Check expiration
    // =========================================================

    if (new Date(session.expires_at) < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired",
      });
    }

    // ===========================================
    // Check Maximum Session Lifetime
    // ===========================================
    if (new Date(session.session_expires_at) < new Date()) {
      await ticketPool.query(
        `
        UPDATE tbl_refresh_tokens
        SET
          is_revoked = TRUE,
          revoked_at = NOW(),
          revoked_reason = 'Maximum Session Lifetime'
        WHERE session_id = $1
        `,
        [session.session_id],
      );
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again",
      });
    }

    // =========================================================
    // Generate New Access Token
    // =========================================================

    const accessToken = generateAccessToken({
      user_id: session.user_id,
      username: session.username,
      role: session.role,
    });

    const newRefreshToken = generateRefreshToken(
      {
        user_id: session.user_id,
      },
      session.session_id,
    );

    const newTokenHash = hashRefreshToken(newRefreshToken);

    // =========================================================
    // Rotate Refresh Token
    // =========================================================

    await ticketPool.query(
      `
      UPDATE tbl_refresh_tokens
      SET
        token_hash = $1,
        last_used_at = NOW(),
        expires_at = $2
      WHERE session_id = $3
      `,
      [newTokenHash, getRefreshTokenExpiry(), session.session_id],
    );

    // =========================================================
    // Replace Cookie
    // =========================================================
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/ticketing/login",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      accessToken,
      user: {
        user_id: session.user_id,
        username: session.username,
        d_name: session.d_name,
        role: session.role,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(401).json({
      success: false,
      message: "Invalid Refresh Token",
    });
  }
};

//ON LOGOUT
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.json({
        success: true,
      });
    }

    const payload = verifyRefreshToken(refreshToken);
    const tokenHash = hashRefreshToken(refreshToken);

    await ticketPool.query(
      `
      UPDATE tbl_refresh_tokens
      SET
        is_revoked = TRUE,
        revoked_at = NOW(),
        revoked_reason = 'Logout'
      WHERE
        session_id = $1
        AND token_hash = $2
      RETURNING *
      `,
      [payload.sessionId, tokenHash],
    );

    /*     console.log(result.rowCount);
    console.log(result.rows); */

    res.clearCookie("refreshToken", {
      path: "/ticketing/login",
    });

    return res.json({
      success: true,
    });
  } catch (err) {
    res.clearCookie("refreshToken", {
      path: "/ticketing/login",
    });

    return res.json({
      success: true,
    });
  }
};

async function ifAccountExist(username, password) {
  try {
    const result = await ticketPool.query(
      `
        SELECT 1
        FROM "tbl_userAccounts"
        WHERE username =$1
        AND password =$2
        `,
      [username, password],
    );

    return result.rowCount > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}
//UPDATE PASSWORD
export const updatePassword = async (req, res) => {
  const { changeUsername, changeCurrentPassword, changeNewPassword } = req.body;
  const isExist = await ifAccountExist(changeUsername, changeCurrentPassword);

  try {
    if (!isExist) {
      return res.json({ message: "Account not exists!" });
    }

    //UPDATE PASSWORD
    const result = await ticketPool.query(
      `
    UPDATE "tbl_userAccounts"
    SET password = $1
    WHERE username = $2
    `,
      [changeNewPassword, changeUsername],
    );

    if (result.rowCount > 0) {
      return res.json({ success: true, message: "Update Successfully" });
    } else {
      return res.json({ success: false, message: "Update Error" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
