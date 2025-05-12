// Configuración para conectar con servicios de Firebase
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api', // Mantener para compatibilidad
  firebaseConfig: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'your-project-id.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project-id.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
    measurementId: 'YOUR_MEASUREMENT_ID', // Opcional, para Google Analytics
  },
};
