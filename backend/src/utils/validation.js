/**
 * Validaciones comunes para usuarios
 */

/**
 * Validar formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} Email válido
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar requisitos de contraseña
 * - Mínimo 8 caracteres
 * - Al menos 1 mayúscula
 * - Al menos 1 minúscula
 * - Al menos 1 número
 * @param {string} password - Contraseña a validar
 * @throws {Error} Si no cumple los requisitos
 */
const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!minLength) {
    throw new Error("La contraseña debe tener al menos 8 caracteres");
  }
  if (!hasUppercase) {
    throw new Error("La contraseña debe incluir al menos una mayúscula");
  }
  if (!hasLowercase) {
    throw new Error("La contraseña debe incluir al menos una minúscula");
  }
  if (!hasNumber) {
    throw new Error("La contraseña debe incluir al menos un número");
  }
};

/**
 * Validar username
 * - Mínimo 3 caracteres
 * - Solo letras, números y guiones bajos
 * @param {string} username - Username a validar
 * @throws {Error} Si no cumple los requisitos
 */
const validateUsername = (username) => {
  if (username.length < 3) {
    throw new Error("El nombre de usuario debe tener al menos 3 caracteres");
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error(
      "El nombre de usuario solo puede contener letras, números y guiones bajos"
    );
  }
};

module.exports = {
  isValidEmail,
  validatePassword,
  validateUsername,
};
