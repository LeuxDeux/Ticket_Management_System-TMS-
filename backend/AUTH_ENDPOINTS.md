# 📝 ENDPOINTS DE AUTENTICACIÓN

## 🔐 Registrar usuario
**POST** `/api/auth/register`

### Request Body
```json
{
  "email": "usuario@example.com",
  "username": "usuario123",
  "password": "MiContraseña123",
  "passwordConfirm": "MiContraseña123",
  "name": "Juan Pérez",
  "phone": "+34 123 456 789"
}
```

### Validaciones de Contraseña
- ✅ Mínimo 8 caracteres
- ✅ Al menos 1 mayúscula
- ✅ Al menos 1 minúscula
- ✅ Al menos 1 número

### Response (201 Created)
```json
{
  "message": "Registro exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clzabcd1234...",
    "email": "usuario@example.com",
    "username": "usuario123",
    "name": "Juan Pérez",
    "role": "CLIENT"
  }
}
```

### Errores Posibles
- **400**: Campos requeridos, contraseñas no coinciden, contraseña débil
- **409**: Email o username ya registrado
- **500**: Error del servidor

---

## 🔓 Login (ya existente)
**POST** `/api/auth/login`

### Request Body
```json
{
  "email": "usuario@example.com",
  "password": "MiContraseña123"
}
```

### Response (200 OK)
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clzabcd1234...",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "role": "CLIENT"
  }
}
```

---

## 👤 Obtener Perfil
**GET** `/api/auth/profile`

### Headers
```
Authorization: Bearer <token>
```

### Response (200 OK)
```json
{
  "user": {
    "id": "clzabcd1234...",
    "email": "usuario@example.com",
    "username": "usuario123",
    "name": "Juan Pérez",
    "role": "CLIENT",
    "phone": "+34 123 456 789",
    "createdAt": "2026-02-07T10:30:00Z",
    "isActive": true
  }
}
```

---

## 🧪 Pruebas con cURL

### Registrar
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPass123",
    "passwordConfirm": "TestPass123",
    "name": "Test User",
    "phone": "+34 123 456 789"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Obtener Perfil
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <tu_token_aqui>"
```

---

## 🔒 Qué hace bcrypt

1. **Hash**: `MiContraseña123` → `$2b$10$N0r2LLxQm5wlFZ9...`
2. **Almacenado**: En BD se guarda solo el hash
3. **Verificación**: Login rehashea y compara hash

Es computacionalmente imposible obtener la contraseña original del hash.

---

## 💡 Nota sobre contraseñas en Frontend

Guarda el token en `localStorage`:
```javascript
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ... })
});
const data = await response.json();
localStorage.setItem('token', data.token);

// En requests posteriores
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```
