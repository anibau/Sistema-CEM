# 📱 Sistema de Gestión de Reparaciones de Aparatos Móviles

Este proyecto es una aplicación web para la gestión de reparaciones de dispositivos móviles, permitiendo la administración eficiente de órdenes de servicio, comunicación con clientes y técnicos, y seguimiento en tiempo real.

## 🚀 Tecnologías Utilizadas

### **Frontend**
- React.js
- Tailwind CSS
- Axios

### **Backend**
- NestJS
- PostgreSQL
- TypeORM
- Passport.js (para autenticación)

### **Otros Servicios**
- Google OAuth (Autenticación de terceros)
- Nodemailer (Notificaciones por correo electrónico)
- Cloudinary (Carga de imágenes de evidencias)
- WebSockets (Chat de atención al usuario)

## 🔑 **Características Principales**

- ✅ **Autenticación y Autorización**
  - Registro e inicio de sesión de usuarios
  - Inicio de sesión con Google OAuth
  - Autorización basada en roles: `Admin`, `Técnico`, `Cliente`

- ✅ **Gestión de Órdenes**
  - Creación, actualización y seguimiento de órdenes de reparación
  - Filtros avanzados de búsqueda por número de orden, estado, fecha, cliente, etc.
  - Dashboard personalizado para cada rol

- ✅ **Notificaciones**
  - Notificaciones en tiempo real para usuarios
  - Envío de correos automáticos para cambios de estado de la orden

- ✅ **Gestión de Evidencias**
  - Carga y almacenamiento de imágenes como evidencia del servicio

- ✅ **Chat en Tiempo Real**
  - Atención al cliente mediante chat integrado con WebSockets

## 📂 **Estructura del Proyecto**

```
mi-proyecto/
│── pfback/   # Backend (NestJS, PostgreSQL)
│── pffront/  # Frontend (React, Tailwind)
```

## ⚡ **Instalación y Configuración**

### **Backend**

```bash
cd pfback
npm install
cp .env.example .env  # Configurar variables de entorno
npm run start:dev
```

### **Frontend**

```bash
cd pffront
npm install
npm run dev
```

## 🛠 **Contribución**
¡Toda contribución es bienvenida! Si deseas colaborar, sigue estos pasos:

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature-nueva`).
3. Realiza tus cambios y haz commit (`git commit -m "Añadir nueva funcionalidad"`).
4. Haz push a tu rama (`git push origin feature-nueva`).
5. Abre un Pull Request.

## 📄 **Licencia**
Este proyecto está bajo la licencia MIT.

---

🔧 **Desarrollado con amor y código por el equipo 🚀**
