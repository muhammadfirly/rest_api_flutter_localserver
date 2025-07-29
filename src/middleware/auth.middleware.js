// src/middleware/auth.middleware.js
import jwtHelper from "../helper/jwt.helper.js";

const publicUrls = [
  "/",
  "/login",
  "/refresh", // Jika Anda memiliki endpoint refresh token
];

const AuthMiddleware = (req, res, next) => {
  try {
    // Cek apakah URL termasuk publicUrls (tidak memerlukan otentikasi)
    if (publicUrls.includes(req.originalUrl)) {
      return next();
    }

    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "No authorization header provided." });
    }

    const tokenParts = authHeader.split(" ");
    // Pastikan format token adalah "Bearer <token>"
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res
        .status(401)
        .json({ message: "Token format invalid. Expected: Bearer <token>" });
    }

    const token = tokenParts[1];

    // Dekripsi token
    const decoded = jwtHelper.decryptToken(token);

    // Cek apakah token berhasil didekripsi dan memiliki properti 'data'
    if (!decoded) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid token or token is expired!",
      });
    }

    if (!decoded.data || !decoded.data.id) {
      // Ini akan menangkap kasus di mana payload tidak memiliki 'data' atau 'data.id'
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Unauthorized: User ID not found in token payload.",
      });
    }

    // <<< PERBAIKAN KRUSIAL DI SINI >>>
    // Lampirkan objek data pengguna dari payload ke objek request
    req.user = decoded.data; // req.user sekarang akan berisi { id: ..., name: ..., email: ..., ... }

    next(); // Lanjutkan ke route handler berikutnya
  } catch (error) {
    console.error("AuthMiddleware Error:", error.message); // Log error untuk debugging
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid token or token is expired!",
      error: error.message, // Sertakan pesan error asli untuk debugging
    });
  }
};

export default AuthMiddleware;