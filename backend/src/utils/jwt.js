const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

/**
 * Generar un token JWT
 * @param {Object} payload - Datos a incluir en el token
 * @returns {string} Token JWT
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

/**
 * Verificar un token JWT
 * @param {string} token - Token a verificar
 * @returns {Object|null} Datos decodificados o null si es inválido
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

/**
 * Decodificar un token sin verificar (solo lectura)
 * @param {string} token - Token a decodificar
 * @returns {Object|null} Datos decodificados o null
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};
