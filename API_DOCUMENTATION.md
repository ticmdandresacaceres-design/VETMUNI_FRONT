# 📋 Documentación API - Veterinaria

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Autenticación](#autenticación)
3. [Endpoints de Autenticación](#endpoints-de-autenticación)
4. [Endpoints de Usuarios](#endpoints-de-usuarios)
5. [Endpoints de Mascotas](#endpoints-de-mascotas)
6. [Endpoints de Vacunas](#endpoints-de-vacunas)
7. [Endpoints de Imágenes](#endpoints-de-imágenes)
8. [Endpoints de Estadísticas](#endpoints-de-estadísticas)
9. [Códigos de Error](#códigos-de-error)
10. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Introducción

Esta es la documentación completa de la API REST de Veterinaria. La API se construye con **Laravel** y utiliza **JWT (JSON Web Tokens)** para la autenticación.

### Base URL
```
http://localhost:8000/api
```

### Headers Requeridos
Todos los endpoints (excepto login) requieren el siguiente header:
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## Autenticación

La API utiliza **JWT (JSON Web Tokens)** para autenticación. Después de hacer login, recibirás un token que debes incluir en el header `Authorization: Bearer` de cada solicitud.

### Roles de Usuario
- **ADMIN**: Administrador del sistema
- **VETERINARIAN**: Veterinario (puede gestionar mascotas, vacunas y ver estadísticas)
- **OWNER**: Dueño de mascotas

---

## Endpoints de Autenticación

### 1. Login
**POST** `/auth/login`

Autentica un usuario y retorna un JWT válido.

#### Headers
```
Content-Type: application/json
```

#### Body
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

#### Respuesta exitosa (200)
```json
{
  "data": {
    "user": {
      "id": "01JVMR0M2T6FC7NG8R5GRM5AJV",
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez",
      "roles": [
        {
          "name": "VETERINARIAN"
        }
      ]
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

#### Respuestas de error
- **401 - Credenciales inválidas**: Email o contraseña incorrectos
- **422 - Error de validación**: Campos requeridos faltantes

---

### 2. Logout
**POST** `/auth/logout`

Invalida el token JWT actual e interrumpe la sesión del usuario.

#### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Respuesta exitosa (200)
```json
{
  "message": "Cierre de sesión exitoso"
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido o expirado

---

### 3. Usuario Autenticado
**GET** `/user`

Retorna los datos del usuario autenticado actualmente.

#### Headers
```
Authorization: Bearer {token}
```

#### Respuesta exitosa (200)
```json
{
  "data": {
    "id": "01JVMR0M2T6FC7NG8R5GRM5AJV",
    "email": "usuario@ejemplo.com",
    "name": "Juan Pérez",
    "dni": "12345678",
    "phone": "+34 666 555 444",
    "address": "Calle Principal 123, Madrid",
    "latitude": 40.4168,
    "longitude": -3.7038,
    "active": true,
    "roles": [
      {
        "name": "VETERINARIAN"
      }
    ]
  }
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido o expirado

---

## Endpoints de Usuarios

### 1. Listar Veterinarios
**GET** `/users/veterinarians`

Retorna el listado de todos los veterinarios registrados en el sistema.

#### Headers
```
Authorization: Bearer {token}
```

#### Permisos Requeridos
- Autenticado

#### Respuesta exitosa (200)
```json
{
  "data": [
    {
      "id": "01JVMR0M2T6FC7NG8R5GRM5AJV",
      "email": "vet@ejemplo.com",
      "name": "Dra. María López",
      "dni": "98765432",
      "phone": "+34 666 555 444",
      "address": "Calle Veterinaria 456",
      "latitude": 40.4168,
      "longitude": -3.7038,
      "active": true,
      "created_at": "2026-05-15T10:30:00Z",
      "updated_at": "2026-05-15T10:30:00Z"
    }
  ]
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **403 - No autorizado**: Permisos insuficientes

---

### 2. Crear Veterinario
**POST** `/users/veterinarians`

Crea un nuevo veterinario en el sistema.

#### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Permisos Requeridos
- Rol: **ADMIN**

#### Body
```json
{
  "dni": "12345678",
  "name": "Dr. Carlos González",
  "email": "carlos@ejemplo.com",
  "password": "contraseña123",
  "phone": "+34 666 555 444",
  "address": "Calle Nueva 789",
  "latitude": 40.4168,
  "longitude": -3.7038,
  "active": true
}
```

#### Validaciones
- `dni`: Requerido, string, máximo 20 caracteres, único
- `name`: Requerido, string, máximo 255 caracteres
- `email`: Requerido, email válido, máximo 255 caracteres, único
- `password`: Requerido, string, mínimo 8 caracteres
- `phone`: Opcional, string, máximo 30 caracteres
- `address`: Opcional, string, máximo 255 caracteres
- `latitude`: Opcional, número
- `longitude`: Opcional, número
- `active`: Opcional, booleano

#### Respuesta exitosa (201)
```json
{
  "message": "Veterinario creado correctamente.",
  "data": {
    "id": "01JVMR0M2T6FC7NG8R5GRM5AJV",
    "email": "carlos@ejemplo.com",
    "name": "Dr. Carlos González",
    "dni": "12345678",
    "phone": "+34 666 555 444",
    "address": "Calle Nueva 789",
    "latitude": 40.4168,
    "longitude": -3.7038,
    "active": true,
    "created_at": "2026-05-18T14:30:00Z",
    "updated_at": "2026-05-18T14:30:00Z"
  }
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **403 - No autorizado**: No es administrador
- **422 - Error de validación**: Validación fallida

---

### 3. Listar Dueños
**GET** `/users/owners`

Retorna el listado de todos los dueños de mascotas.

#### Headers
```
Authorization: Bearer {token}
```

#### Respuesta exitosa (200)
```json
{
  "data": [
    {
      "id": "01JVMR0M2T6FC7NG8R5GRM5AJW",
      "email": "owner@ejemplo.com",
      "name": "Pedro Rodríguez",
      "dni": "87654321",
      "phone": "+34 666 555 333",
      "address": "Avenida Principal 100",
      "latitude": 40.4168,
      "longitude": -3.7038,
      "active": true,
      "created_at": "2026-05-10T09:15:00Z",
      "updated_at": "2026-05-10T09:15:00Z"
    }
  ]
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **403 - No autorizado**: Permisos insuficientes

---

### 4. Crear Dueño
**POST** `/users/owners`

Crea un nuevo dueño de mascotas en el sistema.

#### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Permisos Requeridos
- Rol: **ADMIN**

#### Body
```json
{
  "dni": "87654321",
  "name": "Laura Martínez",
  "email": "laura@ejemplo.com",
  "password": "contraseña456",
  "phone": "+34 666 555 222",
  "address": "Calle del Parque 50",
  "latitude": 40.4168,
  "longitude": -3.7038,
  "active": true
}
```

#### Validaciones
- `dni`: Requerido, string, máximo 20 caracteres, único
- `name`: Requerido, string, máximo 255 caracteres
- `email`: Requerido, email válido, máximo 255 caracteres, único
- `password`: Requerido, string, mínimo 8 caracteres
- `phone`: Opcional, string, máximo 30 caracteres
- `address`: Opcional, string, máximo 255 caracteres
- `latitude`: Opcional, número
- `longitude`: Opcional, número
- `active`: Opcional, booleano

#### Respuesta exitosa (201)
```json
{
  "message": "Dueño creado correctamente.",
  "data": {
    "id": "01JVMR0M2T6FC7NG8R5GRM5AJW",
    "email": "laura@ejemplo.com",
    "name": "Laura Martínez",
    "dni": "87654321",
    "phone": "+34 666 555 222",
    "address": "Calle del Parque 50",
    "latitude": 40.4168,
    "longitude": -3.7038,
    "active": true,
    "created_at": "2026-05-18T15:45:00Z",
    "updated_at": "2026-05-18T15:45:00Z"
  }
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **403 - No autorizado**: No es administrador
- **422 - Error de validación**: Validación fallida

---

### 5. Ver Usuario
**GET** `/users/{user}`

Obtiene los detalles de un usuario específico por su ID.

#### Headers
```
Authorization: Bearer {token}
```

#### Parámetros de Ruta
- `user` (string): ULID del usuario (ejemplo: `01JVMR0M2T6FC7NG8R5GRM5AJV`)

#### Respuesta exitosa (200)
```json
{
  "data": {
    "id": "01JVMR0M2T6FC7NG8R5GRM5AJV",
    "email": "usuario@ejemplo.com",
    "name": "Juan Pérez",
    "dni": "12345678",
    "phone": "+34 666 555 444",
    "address": "Calle Principal 123",
    "latitude": 40.4168,
    "longitude": -3.7038,
    "active": true,
    "created_at": "2026-05-15T10:30:00Z",
    "updated_at": "2026-05-15T10:30:00Z"
  }
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **403 - No autorizado**: No tiene permisos para ver este usuario
- **404 - No encontrado**: El usuario no existe

---

### 6. Actualizar Usuario
**PUT/PATCH** `/users/{user}`

Actualiza los datos de un usuario existente.

#### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Parámetros de Ruta
- `user` (string): ULID del usuario

#### Body
```json
{
  "name": "Juan Pedro Pérez",
  "phone": "+34 666 777 888",
  "address": "Calle Nueva 456",
  "latitude": 40.4200,
  "longitude": -3.7100,
  "active": true
}
```

#### Validaciones
- `name`: Opcional, string, máximo 255 caracteres
- `phone`: Opcional, string, máximo 30 caracteres
- `address`: Opcional, string, máximo 255 caracteres
- `latitude`: Opcional, número
- `longitude`: Opcional, número
- `active`: Opcional, booleano

#### Respuesta exitosa (200)
```json
{
  "data": {
    "id": "01JVMR0M2T6FC7NG8R5GRM5AJV",
    "email": "usuario@ejemplo.com",
    "name": "Juan Pedro Pérez",
    "dni": "12345678",
    "phone": "+34 666 777 888",
    "address": "Calle Nueva 456",
    "latitude": 40.4200,
    "longitude": -3.7100,
    "active": true,
    "created_at": "2026-05-15T10:30:00Z",
    "updated_at": "2026-05-18T16:20:00Z"
  }
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **403 - No autorizado**: No tiene permisos para actualizar este usuario
- **404 - No encontrado**: El usuario no existe
- **422 - Error de validación**: Validación fallida

---

### 7. Eliminar Usuario
**DELETE** `/users/{user}`

Elimina un usuario del sistema.

#### Headers
```
Authorization: Bearer {token}
```

#### Parámetros de Ruta
- `user` (string): ULID del usuario

#### Respuesta exitosa (204)
Sin contenido

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **403 - No autorizado**: No tiene permisos para eliminar este usuario
- **404 - No encontrado**: El usuario no existe

---

## Endpoints de Mascotas

### 1. Listar Mascotas
**GET** `/pets`

Retorna el listado de todas las mascotas registradas.

#### Headers
```
Authorization: Bearer {token}
```

#### Permisos Requeridos
- Rol: **VETERINARIAN**

#### Respuesta exitosa (200)
```json
{
  "data": [
    {
      "id": "01JVMR0M2T6FC7NG8R5GRM5AJX",
      "name": "Max",
      "species": "Perro",
      "race": "Labrador",
      "gender": "Macho",
      "temperament": "Cariñoso",
      "reproductive_condition": "Castrado",
      "color": "Marrón",
      "years": 3,
      "months": 6,
      "status": "Activo",
      "user_id": "01JVMR0M2T6FC7NG8R5GRM5AJW",
      "user": {
        "id": "01JVMR0M2T6FC7NG8R5GRM5AJW",
        "name": "Pedro Rodríguez",
        "email": "owner@ejemplo.com"
      },
      "created_at": "2026-05-12T08:00:00Z",
      "updated_at": "2026-05-12T08:00:00Z"
    }
  ]
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **403 - No autorizado**: Rol insuficiente

---

### 2. Crear Mascota
**POST** `/pets`

Crea una nueva mascota en el sistema.

#### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Permisos Requeridos
- Rol: **VETERINARIAN**

#### Body
```json
{
  "name": "Luna",
  "species": "Gato",
  "race": "Persa",
  "gender": "Hembra",
  "temperament": "Tranquilo",
  "reproductive_condition": "No esterilizado",
  "color": "Blanco",
  "years": 2,
  "months": 3,
  "status": "Activo",
  "user_id": "01JVMR0M2T6FC7NG8R5GRM5AJW"
}
```

#### Validaciones
- `name`: Requerido, string, máximo 255 caracteres
- `species`: Requerido, string
- `race`: Requerido, string
- `gender`: Requerido, string
- `temperament`: Requerido, string
- `reproductive_condition`: Requerido, string
- `color`: Requerido, string
- `years`: Requerido, entero
- `months`: Requerido, entero
- `status`: Requerido, string
- `user_id`: Requerido, debe existir en la tabla de usuarios

#### Respuesta exitosa (201)
```json
{
  "data": {
    "id": "01JVMR0M2T6FC7NG8R5GRM5AJY",
    "name": "Luna",
    "species": "Gato",
    "race": "Persa",
    "gender": "Hembra",
    "temperament": "Tranquilo",
    "reproductive_condition": "No esterilizado",
    "color": "Blanco",
    "years": 2,
    "months": 3,
    "status": "Activo",
    "user_id": "01JVMR0M2T6FC7NG8R5GRM5AJW",
    "user": {
      "id": "01JVMR0M2T6FC7NG8R5GRM5AJW",
      "name": "Pedro Rodríguez",
      "email": "owner@ejemplo.com"
    },
    "created_at": "2026-05-18T17:00:00Z",
    "updated_at": "2026-05-18T17:00:00Z"
  }
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **403 - No autorizado**: Rol insuficiente
- **422 - Error de validación**: Validación fallida

---

### 3. Ver Mascota
**GET** `/pets/{pet}`

Obtiene los detalles de una mascota específica.

#### Headers
```
Authorization: Bearer {token}
```

#### Parámetros de Ruta
- `pet` (string): ULID de la mascota

#### Respuesta exitosa (200)
```json
{
  "data": {
    "id": "01JVMR0M2T6FC7NG8R5GRM5AJX",
    "name": "Max",
    "species": "Perro",
    "race": "Labrador",
    "gender": "Macho",
    "temperament": "Cariñoso",
    "reproductive_condition": "Castrado",
    "color": "Marrón",
    "years": 3,
    "months": 6,
    "status": "Activo",
    "user_id": "01JVMR0M2T6FC7NG8R5GRM5AJW",
    "user": {
      "id": "01JVMR0M2T6FC7NG8R5GRM5AJW",
      "name": "Pedro Rodríguez",
      "email": "owner@ejemplo.com"
    },
    "created_at": "2026-05-12T08:00:00Z",
    "updated_at": "2026-05-12T08:00:00Z"
  }
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **404 - No encontrado**: La mascota no existe

---

### 4. Actualizar Mascota
**PUT** `/pets/{pet}`

Actualiza los datos de una mascota existente.

#### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Parámetros de Ruta
- `pet` (string): ULID de la mascota

#### Body
```json
{
  "name": "Max Junior",
  "species": "Perro",
  "race": "Labrador",
  "gender": "Macho",
  "temperament": "Muy cariñoso",
  "reproductive_condition": "Castrado",
  "color": "Marrón oscuro",
  "years": 3,
  "months": 8,
  "status": "Activo"
}
```

#### Validaciones
- `name`: Opcional, string, máximo 255 caracteres
- `species`: Opcional, string
- `race`: Opcional, string
- `gender`: Opcional, string
- `temperament`: Opcional, string
- `reproductive_condition`: Opcional, string
- `color`: Opcional, string
- `years`: Opcional, entero
- `months`: Opcional, entero
- `status`: Opcional, string

#### Respuesta exitosa (200)
```json
{
  "data": {
    "id": "01JVMR0M2T6FC7NG8R5GRM5AJX",
    "name": "Max Junior",
    "species": "Perro",
    "race": "Labrador",
    "gender": "Macho",
    "temperament": "Muy cariñoso",
    "reproductive_condition": "Castrado",
    "color": "Marrón oscuro",
    "years": 3,
    "months": 8,
    "status": "Activo",
    "user_id": "01JVMR0M2T6FC7NG8R5GRM5AJW",
    "user": {
      "id": "01JVMR0M2T6FC7NG8R5GRM5AJW",
      "name": "Pedro Rodríguez",
      "email": "owner@ejemplo.com"
    },
    "created_at": "2026-05-12T08:00:00Z",
    "updated_at": "2026-05-18T17:30:00Z"
  }
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **404 - No encontrado**: La mascota no existe
- **422 - Error de validación**: Validación fallida

---

### 5. Eliminar Mascota
**DELETE** `/pets/{pet}`

Elimina una mascota del sistema.

#### Headers
```
Authorization: Bearer {token}
```

#### Parámetros de Ruta
- `pet` (string): ULID de la mascota

#### Respuesta exitosa (204)
Sin contenido

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **404 - No encontrado**: La mascota no existe

---

## Endpoints de Vacunas

### 1. Listar Vacunas por Mascota
**GET** `/pets/{pet}/vaccines`

Retorna todas las vacunas registradas para una mascota específica.

#### Headers
```
Authorization: Bearer {token}
```

#### Parámetros de Ruta
- `pet` (string): ULID de la mascota

#### Permisos Requeridos
- Rol: **VETERINARIAN**

#### Respuesta exitosa (200)
```json
{
  "data": [
    {
      "id": "01JVMR0M2T6FC7NG8R5GRM5AJZ",
      "type": "Rabia",
      "aplication_date": "2026-03-15",
      "months_validity": 12,
      "expiration_date": "2027-03-15",
      "pet_id": "01JVMR0M2T6FC7NG8R5GRM5AJX",
      "pet": {
        "id": "01JVMR0M2T6FC7NG8R5GRM5AJX",
        "name": "Max",
        "species": "Perro"
      },
      "created_at": "2026-03-15T10:00:00Z",
      "updated_at": "2026-03-15T10:00:00Z"
    },
    {
      "id": "01JVMR0M2T6FC7NG8R5GRM5AKA",
      "type": "DHPP",
      "aplication_date": "2026-03-20",
      "months_validity": 12,
      "expiration_date": "2027-03-20",
      "pet_id": "01JVMR0M2T6FC7NG8R5GRM5AJX",
      "pet": {
        "id": "01JVMR0M2T6FC7NG8R5GRM5AJX",
        "name": "Max",
        "species": "Perro"
      },
      "created_at": "2026-03-20T11:00:00Z",
      "updated_at": "2026-03-20T11:00:00Z"
    }
  ]
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **403 - No autorizado**: Rol insuficiente
- **404 - No encontrado**: La mascota no existe

---

### 2. Listar Todas las Vacunas
**GET** `/vaccines`

Retorna el listado de todas las vacunas registradas en el sistema.

#### Headers
```
Authorization: Bearer {token}
```

#### Permisos Requeridos
- Rol: **VETERINARIAN**

#### Respuesta exitosa (200)
```json
{
  "data": [
    {
      "id": "01JVMR0M2T6FC7NG8R5GRM5AJZ",
      "type": "Rabia",
      "aplication_date": "2026-03-15",
      "months_validity": 12,
      "expiration_date": "2027-03-15",
      "pet_id": "01JVMR0M2T6FC7NG8R5GRM5AJX",
      "pet": {
        "id": "01JVMR0M2T6FC7NG8R5GRM5AJX",
        "name": "Max",
        "species": "Perro"
      },
      "created_at": "2026-03-15T10:00:00Z",
      "updated_at": "2026-03-15T10:00:00Z"
    }
  ]
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido

---

### 3. Crear Vacuna
**POST** `/vaccines`

Crea una nueva vacuna para una mascota.

#### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Permisos Requeridos
- Rol: **VETERINARIAN**

#### Body
```json
{
  "type": "Leucemia Felina",
  "aplication_date": "2026-05-18",
  "months_validity": 12,
  "pet_id": "01JVMR0M2T6FC7NG8R5GRM5AJY"
}
```

#### Validaciones
- `type`: Requerido, string
- `aplication_date`: Requerido, fecha (formato: YYYY-MM-DD)
- `months_validity`: Requerido, entero
- `pet_id`: Requerido, debe existir en la tabla de mascotas

#### Respuesta exitosa (201)
```json
{
  "data": {
    "id": "01JVMR0M2T6FC7NG8R5GRM5AKB",
    "type": "Leucemia Felina",
    "aplication_date": "2026-05-18",
    "months_validity": 12,
    "expiration_date": "2027-05-18",
    "pet_id": "01JVMR0M2T6FC7NG8R5GRM5AJY",
    "pet": {
      "id": "01JVMR0M2T6FC7NG8R5GRM5AJY",
      "name": "Luna",
      "species": "Gato"
    },
    "created_at": "2026-05-18T18:00:00Z",
    "updated_at": "2026-05-18T18:00:00Z"
  }
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **403 - No autorizado**: Rol insuficiente
- **422 - Error de validación**: Validación fallida

---

### 4. Ver Vacuna
**GET** `/vaccines/{vaccine}`

Obtiene los detalles de una vacuna específica.

#### Headers
```
Authorization: Bearer {token}
```

#### Parámetros de Ruta
- `vaccine` (string): ULID de la vacuna

#### Respuesta exitosa (200)
```json
{
  "data": {
    "id": "01JVMR0M2T6FC7NG8R5GRM5AJZ",
    "type": "Rabia",
    "aplication_date": "2026-03-15",
    "months_validity": 12,
    "expiration_date": "2027-03-15",
    "pet_id": "01JVMR0M2T6FC7NG8R5GRM5AJX",
    "pet": {
      "id": "01JVMR0M2T6FC7NG8R5GRM5AJX",
      "name": "Max",
      "species": "Perro"
    },
    "created_at": "2026-03-15T10:00:00Z",
    "updated_at": "2026-03-15T10:00:00Z"
  }
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **404 - No encontrado**: La vacuna no existe

---

### 5. Actualizar Vacuna
**PUT** `/vaccines/{vaccine}`

Actualiza los datos de una vacuna existente.

#### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Parámetros de Ruta
- `vaccine` (string): ULID de la vacuna

#### Body
```json
{
  "type": "Rabia (Refuerzo)",
  "aplication_date": "2027-03-15",
  "months_validity": 12,
  "pet_id": "01JVMR0M2T6FC7NG8R5GRM5AJX"
}
```

#### Validaciones
- `type`: Opcional, string
- `aplication_date`: Opcional, fecha (formato: YYYY-MM-DD)
- `months_validity`: Opcional, entero
- `pet_id`: Opcional, debe existir en la tabla de mascotas

#### Respuesta exitosa (200)
```json
{
  "data": {
    "id": "01JVMR0M2T6FC7NG8R5GRM5AJZ",
    "type": "Rabia (Refuerzo)",
    "aplication_date": "2027-03-15",
    "months_validity": 12,
    "expiration_date": "2028-03-15",
    "pet_id": "01JVMR0M2T6FC7NG8R5GRM5AJX",
    "pet": {
      "id": "01JVMR0M2T6FC7NG8R5GRM5AJX",
      "name": "Max",
      "species": "Perro"
    },
    "created_at": "2026-03-15T10:00:00Z",
    "updated_at": "2026-05-18T18:30:00Z"
  }
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **404 - No encontrado**: La vacuna no existe
- **422 - Error de validación**: Validación fallida

---

### 6. Eliminar Vacuna
**DELETE** `/vaccines/{vaccine}`

Elimina una vacuna del sistema.

#### Headers
```
Authorization: Bearer {token}
```

#### Parámetros de Ruta
- `vaccine` (string): ULID de la vacuna

#### Respuesta exitosa (204)
Sin contenido

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **404 - No encontrado**: La vacuna no existe

---

## Endpoints de Imágenes

### 1. Subir Imagen de Mascota
**POST** `/pets/images`

Sube una imagen para una mascota.

#### Headers
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

#### Permisos Requeridos
- Rol: **VETERINARIAN**

#### Parámetros del Formulario (Form-Data)
- `image` (file): Archivo de imagen (requerido)
- `pet_id` (string): ULID de la mascota (requerido)

#### Respuesta exitosa (201)
```json
{
  "message": "Imagen de la mascota guardada exitosamente.",
  "data": {
    "id": "01JVMR0M2T6FC7NG8R5GRM5AKC",
    "filename": "image_1234567890.jpg",
    "path": "/storage/images/01JVMR0M2T6FC7NG8R5GRM5AKC.jpg",
    "pet_id": "01JVMR0M2T6FC7NG8R5GRM5AJX",
    "created_at": "2026-05-18T19:00:00Z",
    "updated_at": "2026-05-18T19:00:00Z"
  }
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **403 - No autorizado**: Rol insuficiente
- **422 - Error de validación**: Validación fallida

---

### 2. Eliminar Imagen de Mascota
**DELETE** `/pets/images/{image}`

Elimina una imagen de mascota del sistema.

#### Headers
```
Authorization: Bearer {token}
```

#### Parámetros de Ruta
- `image` (string): ULID de la imagen

#### Permisos Requeridos
- Rol: **VETERINARIAN**

#### Respuesta exitosa (200)
```json
{
  "message": "La imagen y el archivo físico fueron eliminados correctamente."
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido
- **403 - No autorizado**: Rol insuficiente
- **404 - No encontrado**: La imagen no existe

---

## Endpoints de Estadísticas

### 1. Dashboard Principal
**GET** `/stats/dashboard`

Retorna números clave para el panel principal.

#### Headers
```
Authorization: Bearer {token}
```

#### Permisos Requeridos
- Rol: **VETERINARIAN**

#### Respuesta exitosa (200)
```json
{
  "data": {
    "total_pets": 45,
    "total_vaccines_applied": 128,
    "active_owners": 23,
    "total_veterinarians": 3,
    "upcoming_vaccine_alerts": 7,
    "unvaccinated_pets": 5
  }
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido

---

### 2. Alertas de Vacunas
**GET** `/stats/vaccine-alerts`

Retorna mascotas con vacunas vencidas o próximas a vencer.

#### Headers
```
Authorization: Bearer {token}
```

#### Permisos Requeridos
- Rol: **VETERINARIAN**

#### Respuesta exitosa (200)
```json
{
  "data": [
    {
      "pet_id": "01JVMR0M2T6FC7NG8R5GRM5AJX",
      "pet_name": "Max",
      "vaccine_type": "Rabia",
      "expiration_date": "2026-06-15",
      "days_until_expiration": 28,
      "status": "alert"
    },
    {
      "pet_id": "01JVMR0M2T6FC7NG8R5GRM5AJY",
      "pet_name": "Luna",
      "vaccine_type": "Leucemia Felina",
      "expiration_date": "2026-05-20",
      "days_until_expiration": 2,
      "status": "urgent"
    }
  ]
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido

---

### 3. Mascotas Sin Vacunas
**GET** `/stats/unvaccinated`

Retorna mascotas sin ninguna vacuna registrada.

#### Headers
```
Authorization: Bearer {token}
```

#### Permisos Requeridos
- Rol: **VETERINARIAN**

#### Respuesta exitosa (200)
```json
{
  "data": [
    {
      "id": "01JVMR0M2T6FC7NG8R5GRM5AKD",
      "name": "Rocky",
      "species": "Perro",
      "race": "Pastor Alemán",
      "owner_name": "Carlos García",
      "owner_phone": "+34 666 555 999"
    }
  ]
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido

---

### 4. Actividad Mensual
**GET** `/stats/monthly-activity`

Retorna datos de mascotas nuevas y vacunas aplicadas por mes (últimos 12 meses).

#### Headers
```
Authorization: Bearer {token}
```

#### Permisos Requeridos
- Rol: **VETERINARIAN**

#### Respuesta exitosa (200)
```json
{
  "data": [
    {
      "month": "2025-06",
      "new_pets": 3,
      "vaccines_applied": 8
    },
    {
      "month": "2025-07",
      "new_pets": 5,
      "vaccines_applied": 12
    },
    {
      "month": "2026-05",
      "new_pets": 2,
      "vaccines_applied": 6
    }
  ]
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido

---

### 5. Distribución por Especie
**GET** `/stats/species-distribution`

Retorna la distribución de mascotas por especie.

#### Headers
```
Authorization: Bearer {token}
```

#### Permisos Requeridos
- Rol: **VETERINARIAN**

#### Respuesta exitosa (200)
```json
{
  "data": [
    {
      "species": "Perro",
      "count": 28,
      "percentage": 62.22
    },
    {
      "species": "Gato",
      "count": 14,
      "percentage": 31.11
    },
    {
      "species": "Conejo",
      "count": 3,
      "percentage": 6.67
    }
  ]
}
```

#### Respuestas de error
- **401 - No autenticado**: Token inválido

---

## Códigos de Error

La API utiliza los siguientes códigos de estado HTTP estándar:

### Códigos de Éxito

| Código | Significado | Descripción |
|--------|-------------|-------------|
| **200** | OK | Solicitud exitosa |
| **201** | Created | Recurso creado exitosamente |
| **204** | No Content | Solicitud exitosa, sin contenido en la respuesta |

### Códigos de Error de Cliente

| Código | Significado | Descripción |
|--------|-------------|-------------|
| **400** | Bad Request | Solicitud malformada |
| **401** | Unauthorized | Token inválido o expirado, autenticación requerida |
| **403** | Forbidden | Acceso denegado, permisos insuficientes |
| **404** | Not Found | Recurso no encontrado |
| **422** | Unprocessable Entity | Error de validación en los datos enviados |
| **429** | Too Many Requests | Límite de solicitudes excedido |

### Códigos de Error de Servidor

| Código | Significado | Descripción |
|--------|-------------|-------------|
| **500** | Internal Server Error | Error interno del servidor |
| **503** | Service Unavailable | Servicio no disponible |

### Estructura de Respuesta de Error

```json
{
  "message": "Descripción del error",
  "errors": {
    "field_name": ["Mensaje de error del campo"]
  }
}
```

#### Ejemplo de Error de Validación (422)

```json
{
  "message": "The email field is required. (and 1 more error)",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}
```

#### Ejemplo de Error de No Autorizado (401)

```json
{
  "message": "Unauthorized"
}
```

#### Ejemplo de Error de No Encontrado (404)

```json
{
  "message": "No query results found for model [App\\Models\\Pet]."
}
```

---

## Ejemplos de Uso

### Ejemplo 1: Login y Obtener Token

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
  }'
```

**Respuesta:**
```json
{
  "data": {
    "user": {
      "id": "01JVMR0M2T6FC7NG8R5GRM5AJV",
      "email": "usuario@ejemplo.com",
      "name": "Juan Pérez",
      "roles": [{"name": "VETERINARIAN"}]
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

---

### Ejemplo 2: Crear Mascota

```bash
curl -X POST http://localhost:8000/api/pets \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Max",
    "species": "Perro",
    "race": "Labrador",
    "gender": "Macho",
    "temperament": "Cariñoso",
    "reproductive_condition": "Castrado",
    "color": "Marrón",
    "years": 3,
    "months": 6,
    "status": "Activo",
    "user_id": "01JVMR0M2T6FC7NG8R5GRM5AJW"
  }'
```

---

### Ejemplo 3: Registrar Vacuna

```bash
curl -X POST http://localhost:8000/api/vaccines \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Rabia",
    "aplication_date": "2026-05-18",
    "months_validity": 12,
    "pet_id": "01JVMR0M2T6FC7NG8R5GRM5AJX"
  }'
```

---

### Ejemplo 4: Subir Imagen de Mascota

```bash
curl -X POST http://localhost:8000/api/pets/images \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -F "image=@/ruta/a/imagen.jpg" \
  -F "pet_id=01JVMR0M2T6FC7NG8R5GRM5AJX"
```

---

### Ejemplo 5: Obtener Estadísticas del Dashboard

```bash
curl -X GET http://localhost:8000/api/stats/dashboard \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

---

## Notas Importantes

- **Autenticación**: Todos los endpoints (excepto `/auth/login`) requieren un token JWT válido
- **ULID**: Los identificadores utilizan el formato ULID (Universally Unique Lexicographically Sortable Identifier)
- **Rate Limiting**: La API puede aplicar limitaciones de tasa para prevenir abuso
- **CORS**: La API soporta CORS para solicitudes desde navegadores
- **Versionado**: Los endpoints utilizan la versión v1 implícita en la ruta `/api`

---

*Última actualización: 19 de mayo de 2026*
