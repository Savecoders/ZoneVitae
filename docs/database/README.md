# Database schema for the application

This schema is designed to support the functionality of the application, including user management, community management, reports, comments, activities, and tags.

dbml diagram supports the following features:

- Enum types
- Tables with primary keys
- Tables with foreign keys
- Indexes on tables
- Default values for columns
- Timestamps for auditing
- Unique constraints on columns
- Long blob types for images
- Text types for long strings
- Tinyint for boolean values

View diagram in dbdiagram.io: [dbdiagram](https://dbdiagram.io/d/ZoneVitae-681d626c5b2fc4582fd7950a)

```dbml
// This is the database schema for the application
Enum "usuarios_genero_enum" {
  "M"
  "F"
  "O"
}




Table "usuarios" {
  "ID" bigint(20) [pk, not null, increment]
  "nombre_usuario" varchar(255) [not null]
  "email" varchar(255) [not null]
  "password" varchar(255) [not null]
  "foto_perfil" LONGBLOB [default: NULL]
  "fecha_nacimiento" date [default: NULL]
  "genero" usuarios_genero_enum [default: NULL]

  // Auditoria
  "create_at" timestamp [not null, default: `current_timestamp()`]
  "update_at" timestamp [not null, default: `current_timestamp()`]

  Indexes {
    email [unique, name: "email"]
    nombre_usuario [unique, name: "nombre_usuario"]
  }
}

Table "tags" {
  "ID" bigint(20) [pk, not null, increment]
  "nombre" varchar(255) [not null]

  Indexes {
    nombre [unique, name: "nombre"]
  }
}


Table "roles" {
  "ID" bigint(20) [pk, not null, increment]
  "nombre" text [not null]

  Indexes {
    nombre [unique, name: "nombre"]
  }
}

Table "usuarios_roles" {
  "id_usuario" bigint(20) [not null]
  "id_rol" bigint(20) [not null]


  indexes {
    id_usuario [name: "id_usuario"]
    id_rol [name: "id_rol"]
  }

}


Table "roles_comunidades" {
  "ID" bigint(20) [pk, not null, increment]
  "nombre" varchar(50) [not null]

  Indexes {
    nombre [unique, name: "nombre"]
  }
}

Table "comunidades" {
  "ID" bigint(20) [pk, not null, increment]
  "nombre" text [not null]
  "descripcion" text [default: NULL]
  "logo" LONGBLOB [default: NULL]
  "cover" LONGBLOB [default: NULL]
  "creador_id" bigint(20) [default: NULL]
  "ubicacion" text [not null]

  // Auditoria
  "create_at" timestamp [not null, default: `current_timestamp()`]
  "update_at" timestamp [not null, default: `current_timestamp()`]
  Indexes {
    creador_id [name: "creador_id"]
  }
}

Table "reports" {
  "ID" bigint(20) [pk, not null, increment]
  "comunidad_id" bigint(20) [default: NULL]
  "autor_id" bigint(20) [default: NULL]
  "titulo" varchar(255) [not null]
  "contenido" text [not null]
  "anonimo" tinyint(1) [not null, default: '0']

  // Auditoria
  "create_at" timestamp [not null, default: `current_timestamp()`]
  "update_at" timestamp [not null, default: `current_timestamp()`]
  Indexes {
    comunidad_id [name: "comunidad_id"]
    autor_id [name: "autor_id"]
  }
}

Table "comentarios" {
  "ID" bigint(20) [pk, not null, increment]
  "actividades_Id" bigint(20) [default: NULL]
  "autor_id" bigint(20) [default: NULL]
  "contenido" text [not null]
  "fecha_comentario" timestamp [not null, default: `current_timestamp()`]

  Indexes {
    actividades_Id [name: "actividades_Id"]
    autor_id [name: "autor_id"]
  }
}

Table "actividades" {
  "ID" bigint(20) [pk, not null, increment]
  "comunidad_id" bigint(20) [default: NULL]
  "nombre" text [not null]
  "descripcion" text [default: NULL]
  "fecha_inicio" date [not null]
  "fecha_fin" date [not null]
  "ubicacion" text [not null]
  "virtual" tinyint(1) [not null, default: '0']
  "frecuencia" text [not null]
  "cover" longblob [not null]
  "fecha" timestamp [not null, default: `current_timestamp()`]

  // Auditoria
  "create_at" timestamp [not null, default: `current_timestamp()`]
  "update_at" timestamp [not null, default: `current_timestamp()`]

  Indexes {
    comunidad_id [name: "comunidad_id"]
  }
}

Table "fotos" {
  "ID" bigint(20) [pk, not null, increment]
  "image" LONGBLOB [not null]
  "reports_id" bigint(20) [default: NULL]

  Indexes {
    reports_id [name: "reports_id"]
  }
}

Table "reports_tags" {
  "reports_id" bigint(20) [not null]
  "tag_id" bigint(20) [not null]

  Indexes {
    (reports_id, tag_id) [pk]
    tag_id [name: "tag_id"]
  }
}

Table "comunidad_tags" {
  "comunidad_id" bigint(20) [not null]
  "tag_id" bigint(20) [not null]

  Indexes {
    (comunidad_id, tag_id) [pk]
    tag_id [name: "tag_id"]
  }
}

Table "usuarios_comunidades_roles" {
  "usuario_id" bigint(20) [not null]
  "comunidad_id" bigint(20) [not null]
  "rol_id" bigint(20) [not null]
  "fecha_asignacion" timestamp [not null, default: `current_timestamp()`]

  Indexes {
    (usuario_id, comunidad_id) [pk]
  }
}

Table "galeria_comunidad" {
  "ID" bigint(20) [pk, not null, increment]
  "comunidad_id" bigint(20) [default: NULL]
  "imagen" LONGBLOB [not null]

  Indexes {
    comunidad_id [name: "comunidad_id"]
  }
}

Table "me_encanta" {
  "usuario_id" bigint(20) [not null]
  "reports_id" bigint(20) [not null]

  Indexes {
    (usuario_id, reports_id) [pk]
    reports_id [name: "reports_id"]
  }
}


Table "seguimientos" {
  "usuario_id" bigint(20) [not null]
  "comunidad_id" bigint(20) [not null]

  Indexes {
    (usuario_id, comunidad_id) [pk]
    comunidad_id [name: "comunidad_id"]
  }
}


Ref "comunidades_ibfk_1":"usuarios"."ID" < "comunidades"."creador_id"

Ref "reports_ibfk_1":"comunidades"."ID" < "reports"."comunidad_id"

Ref "reports_ibfk_3":"usuarios"."ID" < "reports"."autor_id"

Ref "comentarios_ibfk_1":"actividades"."ID" < "comentarios"."actividades_Id"

Ref "comentarios_ibfk_2":"usuarios"."ID" < "comentarios"."autor_id"

Ref "actividades_ibfk_1":"comunidades"."ID" < "actividades"."comunidad_id"

Ref "fotos_ibfk_1":"reports"."ID" < "fotos"."reports_id"

Ref "reports_tags_ibfk_1":"tags"."ID" < "reports_tags"."tag_id" [delete: cascade]

Ref "reports_tags_ibfk_2":"reports"."ID" < "reports_tags"."reports_id" [delete: cascade]

Ref "comunidad_tags_ibfk_1":"tags"."ID" < "comunidad_tags"."tag_id" [delete: cascade]

Ref "comunidad_tags_ibfk_2":"comunidades"."ID" < "comunidad_tags"."comunidad_id" [delete: cascade]

Ref:"usuarios"."ID" < "usuarios_comunidades_roles"."usuario_id" [delete: cascade]

Ref:"comunidades"."ID" < "usuarios_comunidades_roles"."comunidad_id" [delete: cascade]

Ref:"roles_comunidades"."ID" < "usuarios_comunidades_roles"."rol_id" [delete: cascade]

Ref:"usuarios"."ID" < "usuarios_roles"."id_usuario" [delete: cascade]

Ref:"roles"."ID" < "usuarios_roles"."id_rol" [delete: cascade]

Ref "galeria_comunidad_ibfk_1":"comunidades"."ID" < "galeria_comunidad"."comunidad_id"

Ref "me_encanta_ibfk_1":"usuarios"."ID" < "me_encanta"."usuario_id"

Ref "me_encanta_ibfk_2":"reports"."ID" < "me_encanta"."reports_id"

Ref "seguimientos_ibfk_1":"usuarios"."ID" < "seguimientos"."usuario_id"

Ref "seguimientos_ibfk_2":"comunidades"."ID" < "seguimientos"."comunidad_id"



Ref: "reports"."titulo" < "reports"."ID"
```
