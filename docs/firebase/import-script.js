// Script para importar datos del JSON a Firestore
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Ruta al archivo de cuentas de servicio (descargarlo de Firebase Console > Configuración del proyecto > Cuentas de servicio)
const serviceAccount = require('./serviceAccountKey.json');

// Ruta al archivo JSON con los datos
const dataFilePath = path.join(__dirname, '../firebase/reponse.json');
const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

// Inicializar la app con credenciales
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const batch = db.batch();

// Función para convertir fechas string a Timestamp
function toTimestamp(dateStr) {
  return admin.firestore.Timestamp.fromDate(new Date(dateStr));
}

// Función para convertir booleanos
function toBool(value) {
  return value === 1 || value === true;
}

// Función principal de importación
async function importData() {
  console.log('Iniciando importación de datos a Firestore...');

  // Importar usuarios
  console.log('Importando usuarios...');
  for (const usuario of data.usuarios) {
    const userRef = db.collection('usuarios').doc(usuario.ID.toString());
    batch.set(userRef, {
      nombre_usuario: usuario.nombre_usuario,
      email: usuario.email,
      // No importamos las contraseñas - usar Firebase Auth
      foto_perfil: usuario.foto_perfil,
      fecha_nacimiento: usuario.fecha_nacimiento ? toTimestamp(usuario.fecha_nacimiento) : null,
      genero: usuario.genero,
      estado_cuenta: usuario.estado_cuenta,
      create_at: toTimestamp(usuario.create_at),
      update_at: toTimestamp(usuario.update_at),
    });
  }

  // Importar tags
  console.log('Importando tags...');
  for (const tag of data.tags) {
    const tagRef = db.collection('tags').doc(tag.ID.toString());
    batch.set(tagRef, {
      nombre: tag.nombre,
    });
  }

  // Importar roles
  console.log('Importando roles...');
  for (const rol of data.roles) {
    const rolRef = db.collection('roles').doc(rol.ID.toString());
    batch.set(rolRef, {
      nombre: rol.nombre,
    });
  }

  // Importar roles de comunidades
  console.log('Importando roles de comunidades...');
  for (const rol of data.roles_comunidades) {
    const rolRef = db.collection('roles_comunidades').doc(rol.ID.toString());
    batch.set(rolRef, {
      nombre: rol.nombre,
    });
  }

  // Importar comunidades
  console.log('Importando comunidades...');
  for (const comunidad of data.comunidades) {
    const comunidadRef = db.collection('comunidades').doc(comunidad.ID.toString());
    batch.set(comunidadRef, {
      nombre: comunidad.nombre,
      descripcion: comunidad.descripcion,
      logo: comunidad.logo,
      cover: comunidad.cover,
      creador_id: comunidad.creador_id?.toString(),
      ubicacion: comunidad.ubicacion,
      create_at: toTimestamp(comunidad.create_at),
      update_at: toTimestamp(comunidad.update_at),
    });
  }

  try {
    // Ejecutar el primer lote de operaciones
    await batch.commit();
    console.log('Primer lote de datos importados con éxito');

    // Crear un nuevo batch para el resto de los datos
    const batch2 = db.batch();

    // Importar reportes
    console.log('Importando reportes...');
    for (const reporte of data.reports) {
      const reporteRef = db.collection('reports').doc(reporte.ID.toString());
      batch2.set(reporteRef, {
        comunidad_id: reporte.comunidad_id?.toString(),
        autor_id: reporte.autor_id?.toString(),
        titulo: reporte.titulo,
        contenido: reporte.contenido,
        anonimo: toBool(reporte.anonimo),
        estado: reporte.estado,
        estado_seguimiento: reporte.estado_seguimiento,
        create_at: toTimestamp(reporte.create_at),
        update_at: toTimestamp(reporte.update_at),
      });
    }

    // Importar actividades
    console.log('Importando actividades...');
    for (const actividad of data.actividades) {
      const actividadRef = db.collection('actividades').doc(actividad.ID.toString());
      batch2.set(actividadRef, {
        comunidad_id: actividad.comunidad_id?.toString(),
        nombre: actividad.nombre,
        descripcion: actividad.descripcion,
        fecha_inicio: toTimestamp(actividad.fecha_inicio),
        fecha_fin: toTimestamp(actividad.fecha_fin),
        ubicacion: actividad.ubicacion,
        virtual: toBool(actividad.virtual),
        frecuencia: actividad.frecuencia,
        cover: actividad.cover,
        fecha: toTimestamp(actividad.fecha),
        create_at: toTimestamp(actividad.create_at),
        update_at: toTimestamp(actividad.update_at),
      });
    }

    await batch2.commit();
    console.log('Segundo lote de datos importados con éxito');

    // Crear un tercer batch para relaciones
    const batch3 = db.batch();

    // Importar comentarios (como subcolecciones de actividades)
    console.log('Importando comentarios...');
    for (const comentario of data.comentarios) {
      if (comentario.actividades_Id) {
        const comentarioRef = db
          .collection('actividades')
          .doc(comentario.actividades_Id.toString())
          .collection('comentarios')
          .doc(comentario.ID.toString());
        batch3.set(comentarioRef, {
          autor_id: comentario.autor_id?.toString(),
          contenido: comentario.contenido,
          fecha_comentario: toTimestamp(comentario.fecha_comentario),
        });
      }
    }

    // Importar fotos de reportes (como subcolecciones)
    console.log('Importando fotos de reportes...');
    for (const foto of data.fotos) {
      if (foto.reports_id) {
        const fotoRef = db
          .collection('reports')
          .doc(foto.reports_id.toString())
          .collection('fotos')
          .doc(foto.ID.toString());
        batch3.set(fotoRef, {
          image: foto.image,
        });
      }
    }

    await batch3.commit();
    console.log('Tercer lote de datos importados con éxito');

    // Crear un cuarto batch para más relaciones
    const batch4 = db.batch();

    // Importar relaciones reports_tags
    console.log('Importando relaciones reports_tags...');
    for (const [index, rel] of data.reports_tags.entries()) {
      const relRef = db.collection('reports_tags').doc(`rel_${index}`);
      batch4.set(relRef, {
        reports_id: rel.reports_id.toString(),
        tag_id: rel.tag_id.toString(),
      });
    }

    // Importar relaciones comunidad_tags
    console.log('Importando relaciones comunidad_tags...');
    for (const [index, rel] of data.comunidad_tags.entries()) {
      const relRef = db.collection('comunidad_tags').doc(`rel_${index}`);
      batch4.set(relRef, {
        comunidad_id: rel.comunidad_id.toString(),
        tag_id: rel.tag_id.toString(),
      });
    }

    await batch4.commit();
    console.log('Cuarto lote de datos importados con éxito');

    // Crear un quinto batch para las últimas relaciones
    const batch5 = db.batch();

    // Importar usuarios_comunidades_roles
    console.log('Importando relaciones usuarios_comunidades_roles...');
    for (const [index, rel] of data.usuarios_comunidades_roles.entries()) {
      const relRef = db.collection('usuarios_comunidades_roles').doc(`rel_${index}`);
      batch5.set(relRef, {
        usuario_id: rel.usuario_id.toString(),
        comunidad_id: rel.comunidad_id.toString(),
        rol_id: rel.rol_id.toString(),
        fecha_asignacion: toTimestamp(rel.fecha_asignacion),
      });
    }

    // Importar galería de comunidad
    console.log('Importando galería de comunidad...');
    for (const foto of data.galeria_comunidad) {
      if (foto.comunidad_id) {
        const fotoRef = db
          .collection('comunidades')
          .doc(foto.comunidad_id.toString())
          .collection('galeria')
          .doc(foto.ID.toString());
        batch5.set(fotoRef, {
          imagen: foto.imagen,
        });
      }
    }

    // Importar relaciones me_encanta
    console.log('Importando relaciones me_encanta...');
    for (const [index, rel] of data.me_encanta.entries()) {
      const relRef = db.collection('me_encanta').doc(`rel_${index}`);
      batch5.set(relRef, {
        usuario_id: rel.usuario_id.toString(),
        reports_id: rel.reports_id.toString(),
      });
    }

    // Importar relaciones follows
    console.log('Importando relaciones follows...');
    for (const [index, rel] of data.follows.entries()) {
      const relRef = db.collection('follows').doc(`rel_${index}`);
      batch5.set(relRef, {
        usuario_id: rel.usuario_id.toString(),
        comunidad_id: rel.comunidad_id.toString(),
      });
    }

    // Importar seguimiento_reportes
    console.log('Importando seguimiento de reportes...');
    for (const seguimiento of data.seguimiento_reportes) {
      if (seguimiento.reporte_id) {
        const seguimientoRef = db
          .collection('reports')
          .doc(seguimiento.reporte_id.toString())
          .collection('seguimiento')
          .doc(seguimiento.ID.toString());
        batch5.set(seguimientoRef, {
          usuario_id: seguimiento.usuario_id.toString(),
          estado_anterior: seguimiento.estado_anterior,
          estado_nuevo: seguimiento.estado_nuevo,
          comentario: seguimiento.comentario,
          accion_realizada: seguimiento.accion_realizada,
          accion_recomendada: seguimiento.accion_recomendada,
          documentos_adjuntos: toBool(seguimiento.documentos_adjuntos),
          prioridad: seguimiento.prioridad,
          create_at: toTimestamp(seguimiento.create_at),
          update_at: toTimestamp(seguimiento.update_at),
          imagen: seguimiento.imagen,
        });
      }
    }

    await batch5.commit();
    console.log('Quinto lote de datos importados con éxito');

    console.log('Importación completada exitosamente!');
  } catch (error) {
    console.error('Error al importar datos:', error);
  }
}

// Ejecutar el proceso de importación
importData();
