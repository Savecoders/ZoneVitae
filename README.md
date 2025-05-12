# ZoneVitae

ZoneVitae es una plataforma diseñada para la gestión de comunidades locales y el reporte de incidencias. Permite a los usuarios crear y unirse a comunidades, reportar problemas y organizar actividades comunitarias.

## Estructura del Proyecto

El proyecto ZoneVitae está organizado en las siguientes carpetas principales:

- `api/`: Backend del proyecto (si utiliza una API REST)
- `client/`: Cliente Angular
- `docs/`: Documentación del proyecto
  - `database/`: Esquemas y documentación de la base de datos
  - `firebase/`: Implementación con Firebase
  - `test/`: Casos de prueba

## Tecnologías Utilizadas

- **Frontend**: Angular Tailwind
- **Backend**: DotNet Core 8
- **Autenticación**: Firebase Authentication | JWT
- **Almacenamiento**: Firebase Storage

## Características Principales

- **Gestión de Comunidades**: Creación y administración de comunidades locales
- **Reportes**: Sistema para reportar incidencias y problemas en la comunidad
- **Actividades**: Organización de eventos y actividades comunitarias
- **Seguimiento**: Seguimiento del estado de reportes y resolución de problemas
- **Perfiles de Usuario**: Gestión de perfiles y roles dentro de las comunidades

## Docker

ZoneVitae utiliza Docker para facilitar la implementación y el desarrollo. Asegúrate de tener Docker instalado y ejecutándose en tu máquina.

### Comandos Docker

- **Construir la imagen**:

  ```bash
  docker build -t zonevitae .
  ```

- **Ejecutar el contenedor**:

  ```bash
  docker run -d -p 8080:80 zonevitae
  ```

- **Detener el contenedor**:

  ```bash
  docker stop <container_id>
  ```

- **Eliminar el contenedor**:

  ```bash
  docker rm <container_id>
  ```

## Configuración del Proyecto

### Prerrequisitos

- Node.js (v18 o superior)
- npm o bun
- Angular CLI

### Instalación

1. Clonar el repositorio:

   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd ZoneVitae
   ```

2. Instalar dependencias del cliente:

   ```bash
   cd client
   bun install
   ```

3. Configurar Firebase (opcional):

   - Seguir las instrucciones en `docs/firebase/firebase-setup-guide.md`

4. Ejecutar el cliente:
   ```bash
   cd client
   bun run start
   ```

## Documentación Adicional

- [Estructura de la Base de Datos](./docs/database/README.md)
- [Implementación de Firebase](./docs/firebase/README.md)
