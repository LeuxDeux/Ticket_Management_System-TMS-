const { generateToken } = require("../utils/jwt");
const { prisma } = require("../config/database");
const bcrypt = require("bcryptjs");
const { validatePassword, isValidEmail } = require("../utils/validation");

/**
 * Registro de nuevo usuario
 * Valida email/username únicos, hashea contraseña y crea usuario
 */
const register = async (req, res) => {
  try {
    const { email, username, password, passwordConfirm, name, phone } =
      req.body;

    // Validación básica
    if (!email || !username || !password || !passwordConfirm || !name) {
      return res.status(400).json({
        error: "Campos requeridos",
        message:
          "Email, username, contraseña (2x) y nombre son obligatorios",
      });
    }

    // Validar formato de email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: "Email inválido",
      });
    }

    // Validar que las contraseñas coincidan
    if (password !== passwordConfirm) {
      return res.status(400).json({
        error: "Las contraseñas no coinciden",
      });
    }

    // Validar requisitos de contraseña
    try {
      validatePassword(password);
    } catch (err) {
      return res.status(400).json({
        error: "Contraseña débil",
        message: err.message,
      });
    }

    // Verificar que email no exista
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(409).json({
        error: "El email ya está registrado",
      });
    }

    // Verificar que username no exista
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return res.status(409).json({
        error: "El nombre de usuario ya existe",
      });
    }

    // Hashear contraseña con bcrypt (salt rounds = 10)
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario en BD
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        name,
        phone: phone || null,
        role: "CLIENT", // Por defecto, nuevos usuarios son CLIENTE
        isActive: true,
      },
    });

    // Generar token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    });

    res.status(201).json({
      message: "Registro exitoso",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "Error en registro",
      message: err.message,
    });
  }
};

/**
 * Login de usuario existente
 * Verifica email/contraseña y genera token JWT
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email y contraseña requeridos",
      });
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    // Generar token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    });

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "Error en login",
      message: err.message,
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        phone: true,
        createdAt: true,
        isActive: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    res.json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error al obtener perfil",
      message: err.message,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
