# Aplicación Móvil PetLodge


Una aplicación móvil React Native para el sistema de gestión de la guardería de mascotas PetLodge, construida con Expo. Esta aplicación permite a los propietarios de mascotas gestionar sus mascotas, ver reservas e hacer nuevas reservaciones.

## Características

- **Autenticación de Usuario** - Registrarse e iniciar sesión en tu cuenta
- **Gestión de Mascotas** - Añadir, editar y administrar tus mascotas
- **Sistema de Reservas** - Crear y seguimiento de reservas para tus mascotas
- **Perfil de Usuario** - Ver y administrar la información de tu cuenta
- **Diseño Responsivo** - Optimizado para teléfonos y tablets en modos vertical y horizontal

## Inicio Rápido

1. Instalar dependencias

   ```bash
   # En la carpeta backend
   cd backend
   npm install

   # En la carpeta frontend (en otra terminal)
   cd frontend
   npm install
   ```

2. Iniciar la aplicación

   ```bash
   npx expo start
   ```

3. Ejecutar en Android/Web:
   - Presiona `a` para Android Emulator (por ejemplo, emulador de Android Studio)
   - Presiona `w` para Web
   - O escanea el código QR con la aplicación Expo Go


## Tech Stack

- **Framework:** React Native con Expo
- **Navegación:** React Navigation (Stack & Bottom Tab)
- **Gestión de Estado:** React Context API + Hooks
- **Estilos:** React Native StyleSheet + tema personalizado
- **Manejo de Fechas:** date-fns

## Estructura del Proyecto

```
src/
├── screens/auth/          # Inicio de sesión y Registro
├── screens/user/          # Pantallas del panel de usuario
├── components/ui/         # Componentes reutilizables
├── navigation/            # Configuración de navegación
├── context/               # Gestión de estado
├── hooks/                 # Hooks personalizados
├── utils/                 # Tema y utilidades
└── types/                 # Tipos TypeScript
```

## Pantallas de Usuario

### Autenticación
- **LoginScreen** - Inicio de sesión de usuario
- **RegisterScreen** - Crear nueva cuenta

### Usuarios Autenticados
- **HomeScreen** - Panel de control con estadísticas
- **PetsScreen** - Ver y gestionar mascotas
- **EditPetScreen** - Añadir/editar detalles de mascota
- **ReservationsScreen** - Ver reservas
- **NewReservationScreen** - Crear reserva
- **ReservationDetailScreen** - Ver detalles de reserva
- **ProfileScreen** - Perfil de usuario y cerrar sesión
