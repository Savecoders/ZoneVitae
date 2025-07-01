# ZoneVitae

ZoneVitae es una plataforma diseñada para la gestión de comunidades locales y el reporte de incidencias. Permite a los usuarios crear y unirse a comunidades, reportar problemas y organizar actividades comunitarias.

## Estructura del Proyecto

El proyecto ZoneVitae está organizado en las siguientes carpetas principales:

- `api/`: Backend del proyecto (utiliza una Asp .Net Core 9 -> Web Api)
- `client/`: Cliente Angular 19
- `docs/`: Documentación del proyecto
  - `database/`: Esquemas y documentación de la base de datos (por documentar)

## Tecnologías Utilizadas

- **Frontend**: Angular Tailwind
- **Backend**: DotNet Core 9
- **Autenticación**: JWT | Clerk
- **Almacenamiento**: Clodinary

## Características Principales

- **Gestión de Comunidades**: Creación y administración de comunidades locales
- **Reportes**: Sistema para reportar incidencias y problemas en la comunidad
- **Actividades**: Organización de eventos y actividades comunitarias
- **Seguimiento**: Seguimiento del estado de reportes y resolución de problemas
- **Perfiles de Usuario**: Gestión de perfiles y roles dentro de las comunidades

## Docker

ZoneVitae utiliza Docker para facilitar la implementación y el desarrollo. Asegúrate de tener Docker instalado y ejecutándose en tu máquina.

### Comandos Docker

- **Ejecutar el contenedor**:

  ```bash
  docker-compose up
  ```

- **Detener el contenedor**:

  ```bash
  docker-compose stop
  ```

- **Eliminar el contenedor**:

  ```bash
  docker-compose down -v
  ```

## Configuración del Proyecto

### Prerrequisitos

- Node.js (v18 o superior)
- npm o bun
- Angular CLI

### Repositorio

1. Clonar el repositorio:

   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd ZoneVitae
   ```

### Ejecutar Cliente

1. Instalar dependencias del cliente:

   ```bash
   cd client
   bun install
   ```

2. Configurar Envirioments Dir:
   - Seguir las instrucciones en `https://angular.dev/tools/cli/environments`
   - `ng generate environments`
   - Se creara el directorio de environments y Ahora copia la siguiente estructura

  ```ts
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:5000/api',
      jsonServerUrl: 'http://localhost:5000/api/',
      cloudinary: {
        // CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@dtfdnwkao
        cloud_name: '',
        api_key: '',
        upload_preset: '',
      },
    };
  ```

> [!WARNING]  
> ⚠ Esa misma estructura para todos los archivos

3. Ejecutar el cliente:

   ```bash
   cd client
   bun run start
   ```

### Ejecutar Api

1. Instalacion de las dependencias

```bash
  cd api
  dotnet restore
```

2. Crear el archivo .env del proyecto

```bash
  touch .env
```

y seguir la siguiente estructura del .env de la api

```bash
  DB_PASSWORD=
  CLOUDINARY_URL=
  CLOUDINARY_CLOUD_NAME=
  CLOUDINARY_API_KEY=
  CLOUDINARY_API_SECRET=
```

Y la siguiente estructura del appsettings.json appsettings.Development.json

```bash
  {
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "default": ""
  },
  "Jwt": {
    "Key": "",
    "Issuer": "",
    "Audience": ""
  }
}
```

3. Ejecutar la api

```bash
  dotnet run
```

o tambien usar el modo watch(mas recomendado)

```bash
  dotnet watch -lp http
```

## Documentación Adicional

- [Estructura de la Base de Datos](./docs/database/README.md)
- [Implementación de Firebase](./docs/firebase/README.md)
