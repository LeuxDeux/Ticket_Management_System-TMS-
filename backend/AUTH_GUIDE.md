# Guía de Autenticación y Autorización

## 📋 Estructura

### Archivos principales:

1. **`src/utils/jwt.js`** - Utilidades para generar y verificar tokens JWT
2. **`src/middleware/auth.js`** - Middlewares de autenticación y autorización
3. **`src/controllers/auth.js`** - Ejemplo de controlador con login
4. **`src/routes/example.js`** - Ejemplos de rutas protegidas

---

## 🔐 Middlewares disponibles

### 1. `authenticate`
Requiere que el usuario esté autenticado. Si no hay token o es inválido, retorna 401.

```javascript
router.get("/profile", authenticate, (req, res) => {
  // req.user contiene los datos decodificados del token
  res.json({ user: req.user });
});
```

### 2. `authorize(...roles)`
Requiere autenticación + rol específico. Si no tiene permisos, retorna 403.

```javascript
// Solo ADMIN
router.post("/admin/users", authenticate, authorize("ADMIN"), controller);

// ADMIN o AGENT
router.get("/tickets", authenticate, authorize("ADMIN", "AGENT"), controller);
```

### 3. `optionalAuth`
Autenticación opcional. No rechaza si no hay token, solo decodifica si existe.

```javascript
router.get("/tickets", optionalAuth, (req, res) => {
  if (req.user) {
    // Usuario autenticado
  } else {
    // Usuario anónimo
  }
});
```

---

## 🔑 Funciones JWT

En `src/utils/jwt.js`:

### Generar token
```javascript
const { generateToken } = require("../utils/jwt");

const token = generateToken({
  id: "123",
  email: "user@example.com",
  role: "CLIENT"
});
// Retorna: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Verificar token
```javascript
const { verifyToken } = require("../utils/jwt");

const decoded = verifyToken(token);
// Retorna: { id: "123", email: "user@example.com", role: "CLIENT", iat: ..., exp: ... }
// Si es inválido o expiró, retorna null
```

### Decodificar token (sin verificar)
```javascript
const { decodeToken } = require("../utils/jwt");

const data = decodeToken(token); // Lee sin validar firma
```

---

## 📝 Cómo usar en tus rutas

### Archivo: `src/routes/users.js`

```javascript
const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const { login, getProfile } = require("../controllers/users");

// Ruta pública - Login
router.post("/login", login);

// Ruta privada - Perfil del usuario
router.get("/profile", authenticate, getProfile);

// Ruta solo ADMIN - Ver todos los usuarios
router.get("/admin/all", authenticate, authorize("ADMIN"), getAllUsers);

module.exports = router;
```

### Actualizar `src/routes/index.js`

```javascript
const express = require("express");
const router = express.Router();

const usersRoutes = require("./users");
const ticketsRoutes = require("./tickets");

router.use("/users", usersRoutes);
router.use("/tickets", ticketsRoutes);

module.exports = router;
```

---

## 📡 Cliente - Cómo enviar el token

### Con fetch
```javascript
const token = localStorage.getItem("token");

fetch("http://localhost:5000/api/users/profile", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
});
```

### Con axios (React)
```javascript
import axios from "axios";

const token = localStorage.getItem("token");

axios.get("/api/users/profile", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
```

---

## 🛡️ Flujo típico de autenticación

1. **Login**: Usuario envía email/password → Backend genera token JWT
2. **Cliente almacena**: Token se guarda en localStorage
3. **Requests privados**: Cliente envía `Authorization: Bearer <token>`
4. **Middleware valida**: `authenticate` verifica el token
5. **Acceso a req.user**: El controlador accede a `req.user` con los datos del usuario

---

## ⚙️ Configuración

En `.env`:

```env
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRE=7d
```

> **Importante**: Usa un secret fuerte en producción

---

## 🧪 Testear los ejemplos

1. **GET** `/api/public` - Sin autenticación
2. **GET** `/api/profile` - Requiere token
3. **GET** `/api/admin/dashboard` - Requiere ADMIN
4. **GET** `/api/agents/list` - Requiere ADMIN o AGENT
5. **GET** `/api/tickets` - Autenticación opcional

Prueba con los headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```
