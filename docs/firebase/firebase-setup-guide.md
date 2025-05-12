# Configuración para Firebase en Angular

Para integrar Firebase en tu proyecto de Angular y utilizar los datos JSON del ejemplo, sigue estos pasos:

## 1. Instalar dependencias de Firebase

```bash
npm install @angular/fire firebase
```

## 2. Crear un proyecto en Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Sigue los pasos para crear un nuevo proyecto
4. Registra tu aplicación web en Firebase (haz clic en el ícono "</>" en la página principal del proyecto)
5. Copia la configuración proporcionada por Firebase

## 3. Configurar environment.ts

Actualiza tu archivo `environments/environment.ts` con la configuración de Firebase:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api', // Mantener para compatibilidad
  firebaseConfig: {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID",
    measurementId: "TU_MEASUREMENT_ID" // Opcional, para Google Analytics
  }
};
```

## 4. Importar los datos a Firestore

Puedes importar los datos JSON a Firestore de varias maneras:

### Opción 1: Mediante scripts

Puedes usar el SDK Admin de Firebase para nodejs para crear un script que importe tus datos:

1. Instala las herramientas de Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Inicia sesión en Firebase:
```bash
firebase login
```

3. Inicializa el proyecto Firebase en tu directorio:
```bash
firebase init
```

4. Crea un script de importación (ejemplo simplificado):

```javascript
// import-data.js
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');
const data = require('./docs/firebase/reponse.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Importar usuarios
async function importData() {
  // Convertir usuarios a estructura de Firestore
  for (const usuario of data.usuarios) {
    await db.collection('usuarios').doc(usuario.ID.toString()).set({
      nombre_usuario: usuario.nombre_usuario,
      email: usuario.email,
      foto_perfil: usuario.foto_perfil,
      fecha_nacimiento: admin.firestore.Timestamp.fromDate(new Date(usuario.fecha_nacimiento)),
      genero: usuario.genero,
      estado_cuenta: usuario.estado_cuenta,
      create_at: admin.firestore.Timestamp.fromDate(new Date(usuario.create_at)),
      update_at: admin.firestore.Timestamp.fromDate(new Date(usuario.update_at))
    });
    console.log(`Importado usuario ${usuario.ID}`);
  }

  // Importar comunidades
  for (const comunidad of data.comunidades) {
    await db.collection('comunidades').doc(comunidad.ID.toString()).set({
      nombre: comunidad.nombre,
      descripcion: comunidad.descripcion,
      logo: comunidad.logo,
      cover: comunidad.cover,
      creador_id: comunidad.creador_id.toString(),
      ubicacion: comunidad.ubicacion,
      create_at: admin.firestore.Timestamp.fromDate(new Date(comunidad.create_at)),
      update_at: admin.firestore.Timestamp.fromDate(new Date(comunidad.update_at))
    });
    console.log(`Importada comunidad ${comunidad.ID}`);
  }

  // Continuar para todas las demás colecciones...

  console.log('Importación completada');
}

importData().catch(console.error);
```

5. Ejecuta el script:
```bash
node import-data.js
```

### Opción 2: Usando la consola Firebase

También puedes crear manualmente las colecciones y documentos a través de la consola web de Firebase:

1. Ve a tu proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Navega a "Firestore Database"
3. Crea colecciones y documentos manualmente usando la interfaz gráfica

### Opción 3: Usando funcionalidades de importación/exportación

Firebase tiene herramientas para importar/exportar datos:

```bash
# Exportar desde una base de datos existente
firebase firestore:export ./data

# Importar a la base de datos
firebase firestore:import ./data
```

## 5. Reglas de seguridad de Firestore

No olvides configurar las reglas de seguridad de Firestore según tus necesidades:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para usuarios
    match /usuarios/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Reglas para comunidades
    match /comunidades/{comunidadId} {
      allow read: if true; // Comunidades públicas pueden ser leídas por todos
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        exists(/databases/$(database)/documents/usuarios_comunidades_roles/$(request.auth.uid + '_' + comunidadId)) &&
        get(/databases/$(database)/documents/usuarios_comunidades_roles/$(request.auth.uid + '_' + comunidadId)).data.rol_id == '1';
    }

    // Continúa con reglas para otras colecciones según tus necesidades
  }
}
```

## 6. Verifica la estructura de datos

Revisa el documento `firestore-structure.md` que hemos creado para asegurarte de que la estructura de datos sigue las mejores prácticas de Firestore.
