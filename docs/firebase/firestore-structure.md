# Estructura de Firestore para ZoneVitae

## Colecciones principales

### usuarios

```
usuarios/{userId}
{
  nombre_usuario: "juanperez",
  email: "juan.perez@example.com",
  foto_perfil: null, // URL a Storage
  fecha_nacimiento: timestamp, // Firestore Timestamp
  genero: "M",
  estado_cuenta: "Activo",
  create_at: timestamp,
  update_at: timestamp
}
```

Nota: Las contraseñas no se almacenan en Firestore, se manejan a través del sistema de autenticación de Firebase.

### comunidades

```
comunidades/{comunidadId}
{
  nombre: "Comunidad Vecinal Las Flores",
  descripcion: "Comunidad de vecinos...",
  logo: null, // URL a Storage
  cover: null, // URL a Storage
  creador_id: "userId",
  ubicacion: "Barrio Las Flores, Ciudad Ejemplo",
  create_at: timestamp,
  update_at: timestamp
}
```

### reports

```
reports/{reportId}
{
  comunidad_id: "comunidadId",
  autor_id: "userId",
  titulo: "Farola dañada en calle principal",
  contenido: "La farola ubicada...",
  anonimo: false,
  estado: "Pendiente de Revision",
  estado_seguimiento: "Pendiente de Revision",
  create_at: timestamp,
  update_at: timestamp
}
```

### actividades

```
actividades/{actividadId}
{
  comunidad_id: "comunidadId",
  nombre: "Limpieza comunitaria del barrio",
  descripcion: "Actividad de limpieza general...",
  fecha_inicio: timestamp,
  fecha_fin: timestamp,
  ubicacion: "Plaza central del barrio Las Flores",
  virtual: false,
  frecuencia: "Única vez",
  cover: null, // URL a Storage
  fecha: timestamp,
  create_at: timestamp,
  update_at: timestamp
}
```

### tags

```
tags/{tagId}
{
  nombre: "Medio Ambiente"
}
```

### roles

```
roles/{rolId}
{
  nombre: "Administrador"
}
```

### roles_comunidades

```
roles_comunidades/{rolId}
{
  nombre: "Administrador"
}
```

## Subcolecciones

### Comentarios de actividades

```
actividades/{actividadId}/comentarios/{comentarioId}
{
  autor_id: "userId",
  contenido: "¡Gran iniciativa! Estaré presente.",
  fecha_comentario: timestamp
}
```

### Fotos de reportes

```
reports/{reportId}/fotos/{fotoId}
{
  image: "URL_to_storage"
}
```

### Seguimiento de reportes

```
reports/{reportId}/seguimiento/{seguimientoId}
{
  usuario_id: "userId",
  estado_anterior: "Pendiente de Revision",
  estado_nuevo: "Revisado",
  comentario: "Se ha notificado al departamento de limpieza municipal.",
  accion_realizada: "Contacto con servicios municipales",
  accion_recomendada: "Seguimiento en una semana si no se ha resuelto",
  documentos_adjuntos: false,
  prioridad: "Media",
  create_at: timestamp,
  update_at: timestamp,
  imagen: null // URL a Storage
}
```

### Galería de comunidad

```
comunidades/{comunidadId}/galeria/{fotoId}
{
  imagen: "URL_to_storage"
}
```

## Colecciones para relaciones

### usuarios_roles

```
usuarios_roles/{docId}
{
  usuario_id: "userId",
  rol_id: "rolId"
}
```

### comunidad_tags

```
comunidad_tags/{docId}
{
  comunidad_id: "comunidadId",
  tag_id: "tagId"
}
```

### reports_tags

```
reports_tags/{docId}
{
  report_id: "reportId",
  tag_id: "tagId"
}
```

### usuarios_comunidades_roles

```
usuarios_comunidades_roles/{docId}
{
  usuario_id: "userId",
  comunidad_id: "comunidadId",
  rol_id: "rolId",
  fecha_asignacion: timestamp
}
```

### me_encanta

```
me_encanta/{docId}
{
  usuario_id: "userId",
  report_id: "reportId"
}
```

### follows

```
follows/{docId}
{
  usuario_id: "userId",
  comunidad_id: "comunidadId"
}
```

## Notas sobre la estructura

1. Los IDs en Firestore son strings, no números.
2. Se recomienda usar IDs autogenerados por Firestore para los documentos.
3. En lugar de usar valores booleanos como 0/1, se usan true/false.
4. Las fechas se almacenan como objetos Timestamp de Firestore.
5. Las imágenes se almacenan como URLs que apuntan a archivos en Firebase Storage.
6. Para las relaciones muchos a muchos, se pueden crear colecciones específicas o usar arrays de referencias.
