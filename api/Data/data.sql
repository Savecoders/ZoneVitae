-- Create the database if it doesn't exist
-- Create the database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'zone_vitae_sql')
BEGIN
    CREATE DATABASE [zone_vitae_sql];
END
GO

-- Set the sa login's default database to master.
ALTER LOGIN sa WITH DEFAULT_DATABASE = master;
GO

USE [zone_vitae_sql];
GO

-- Create tables
CREATE TABLE [usuarios] (
  [ID] uniqueidentifier PRIMARY KEY NOT NULL DEFAULT (NEWID()),
  [nombre_usuario] varchar(255) NOT NULL,
  [email] varchar(255) NOT NULL,
  [password] varchar(255) NOT NULL,
  [foto_perfil] varchar(255),
  [fecha_nacimiento] date,
  [genero] nvarchar(1) NOT NULL CHECK ([genero] IN ('M', 'F', 'O')),
  [estado_cuenta] nvarchar(20) NOT NULL CHECK ([estado_cuenta] IN ('Activo', 'Suspendido', 'Inactivo', 'Eliminado')) DEFAULT 'Activo',
  [deleted_at] datetime2,
  [create_at] datetime2 NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  [update_at] datetime2 NOT NULL DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [tags] (
  [ID] uniqueidentifier PRIMARY KEY NOT NULL DEFAULT (NEWID()),
  [nombre] varchar(255) NOT NULL
)
GO

CREATE TABLE [roles] (
  [ID] uniqueidentifier PRIMARY KEY NOT NULL DEFAULT (NEWID()),
  [nombre] nvarchar(255) NOT NULL
)
GO

CREATE TABLE [usuarios_roles] (
  [id] uniqueidentifier PRIMARY KEY NOT NULL DEFAULT (NEWID()),
  [id_usuario] uniqueidentifier NOT NULL,
  [id_rol] uniqueidentifier NOT NULL,
  [asignado_por] uniqueidentifier,
  [fecha_asignacion] datetime2 NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  [fecha_expiracion] datetime2,
  [activo] bit NOT NULL DEFAULT (1)
)
GO

CREATE TABLE [roles_comunidades] (
  [ID] bigint PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [nombre] varchar(50) NOT NULL,
  [descripcion] varchar(255)
)
GO

CREATE TABLE [comunidades] (
  [ID] bigint PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [nombre] nvarchar(500) NOT NULL,
  [descripcion] nvarchar(max),
  [logo] VARCHAR(255),
  [cover] VARCHAR(255),
  [creador_id] uniqueidentifier,
  [ubicacion] nvarchar(500) NOT NULL,
  [estado] nvarchar(50) NOT NULL CHECK ([estado] IN ('Aprobado', 'Pendiente de Revision', 'Rechazado', 'Suspendido')) DEFAULT 'Pendiente de Revision',
  [deleted_at] datetime2,
  [create_at] datetime2 NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  [update_at] datetime2 NOT NULL DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [reports] (
  [ID] bigint PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [comunidad_id] bigint,
  [autor_id] uniqueidentifier,
  [titulo] varchar(255) NOT NULL,
  [contenido] nvarchar(max) NOT NULL,
  [anonimo] bit NOT NULL DEFAULT 0,
  [estado] nvarchar(50) NOT NULL CHECK ([estado] IN ('Pendiente_Moderacion', 'Aprobado', 'En_Seguimiento', 'En_Proceso', 'Rechazado', 'Resuelto')) DEFAULT 'Pendiente_Moderacion',
  [deleted_at] datetime2,
  [create_at] datetime2 NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  [update_at] datetime2 NOT NULL DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [comentarios] (
  [ID] bigint PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [actividades_Id] bigint,
  [autor_id] uniqueidentifier,
  [contenido] nvarchar(max) NOT NULL,
  [fecha_comentario] datetime2 NOT NULL DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [actividades] (
  [ID] bigint PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [comunidad_id] bigint,
  [nombre] nvarchar(500) NOT NULL,
  [descripcion] nvarchar(max),
  [fecha_inicio] date NOT NULL,
  [fecha_fin] date NOT NULL,
  [ubicacion] nvarchar(500) NOT NULL,
  [virtual] bit NOT NULL DEFAULT 0,
  [frecuencia] nvarchar(100) NOT NULL,
  [cover] VARCHAR(255) NOT NULL,
  [fecha] datetime2 NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  [create_at] datetime2 NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  [update_at] datetime2 NOT NULL DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [fotos] (
  [ID] bigint PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [image] varchar(255) NOT NULL,
  [reports_id] bigint
)
GO

CREATE TABLE [reports_tags] (
  [reports_id] bigint NOT NULL,
  [tag_id] uniqueidentifier NOT NULL,
  PRIMARY KEY ([reports_id], [tag_id])
)
GO

CREATE TABLE [comunidad_tags] (
  [comunidad_id] bigint NOT NULL,
  [tag_id] uniqueidentifier NOT NULL,
  PRIMARY KEY ([comunidad_id], [tag_id])
)
GO

CREATE TABLE [usuarios_comunidades_roles] (
  [usuario_id] uniqueidentifier NOT NULL,
  [comunidad_id] bigint NOT NULL,
  [rol_id] bigint NOT NULL,
  [fecha_asignacion] datetime2 NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  PRIMARY KEY ([usuario_id], [comunidad_id])
)
GO

CREATE TABLE [galeria_comunidad] (
  [ID] bigint PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [comunidad_id] bigint,
  [imagen] VARCHAR(255) NOT NULL
)
GO

CREATE TABLE [me_encanta] (
  [usuario_id] uniqueidentifier NOT NULL,
  [reports_id] bigint NOT NULL,
  PRIMARY KEY ([usuario_id], [reports_id])
)
GO

CREATE TABLE [follows] (
  [usuario_id] uniqueidentifier NOT NULL,
  [comunidad_id] bigint NOT NULL,
  PRIMARY KEY ([usuario_id], [comunidad_id])
)
GO

CREATE TABLE [seguimiento_reportes] (
  [ID] bigint PRIMARY KEY NOT NULL IDENTITY(1, 1),
  [reporte_id] bigint NOT NULL,
  [usuario_id] uniqueidentifier NOT NULL,
  [estado_anterior] nvarchar(50) NOT NULL CHECK ([estado_anterior] IN ('Cancelado', 'Pendiente de Revision', 'Revisado', 'En Progreso', 'Resuelto')),
  [estado] nvarchar(50) NOT NULL CHECK ([estado] IN ('Cancelado', 'Pendiente de Revision', 'Revisado', 'En Progreso', 'Resuelto')),
  [comentario] nvarchar(max) NOT NULL,
  [accion_realizada] nvarchar(max) NOT NULL,
  [accion_recomendada] nvarchar(max),
  [documentos_adjuntos] bit NOT NULL DEFAULT 0,
  [prioridad] nvarchar(20) NOT NULL CHECK ([prioridad] IN ('Baja', 'Media', 'Alta', 'Crítica')) DEFAULT 'Media',
  [create_at] datetime2 NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  [update_at] datetime2 NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  [imagen] VARCHAR(255)
)
GO

-- Create indexes
CREATE UNIQUE INDEX [IX_usuarios_email] ON [usuarios] ([email])
GO

CREATE UNIQUE INDEX [IX_usuarios_nombre_usuario] ON [usuarios] ([nombre_usuario])
GO

CREATE UNIQUE INDEX [IX_tags_nombre] ON [tags] ([nombre])
GO

CREATE UNIQUE INDEX [IX_roles_nombre] ON [roles] ([nombre])
GO

CREATE UNIQUE INDEX [IX_usuarios_roles_unique] ON [usuarios_roles] ([id_usuario], [id_rol])
GO

CREATE INDEX [IX_usuarios_roles_usuario] ON [usuarios_roles] ([id_usuario])
GO

CREATE INDEX [IX_usuarios_roles_rol] ON [usuarios_roles] ([id_rol])
GO

CREATE UNIQUE INDEX [IX_roles_comunidades_nombre] ON [roles_comunidades] ([nombre])
GO

CREATE INDEX [IX_comunidades_creador_id] ON [comunidades] ([creador_id])
GO

CREATE INDEX [IX_comunidades_estado] ON [comunidades] ([estado])
GO

CREATE INDEX [IX_reports_comunidad_id] ON [reports] ([comunidad_id])
GO

CREATE INDEX [IX_reports_autor_id] ON [reports] ([autor_id])
GO

CREATE INDEX [IX_reports_estado_fecha] ON [reports] ([estado], [create_at])
GO

CREATE INDEX [IX_comentarios_actividades_Id] ON [comentarios] ([actividades_Id])
GO

CREATE INDEX [IX_comentarios_autor_id] ON [comentarios] ([autor_id])
GO

CREATE INDEX [IX_actividades_comunidad_id] ON [actividades] ([comunidad_id])
GO

CREATE INDEX [IX_actividades_fechas] ON [actividades] ([fecha_inicio], [fecha_fin])
GO

CREATE INDEX [IX_fotos_reports_id] ON [fotos] ([reports_id])
GO

CREATE INDEX [IX_reports_tags_tag_id] ON [reports_tags] ([tag_id])
GO

CREATE INDEX [IX_comunidad_tags_tag_id] ON [comunidad_tags] ([tag_id])
GO

CREATE INDEX [IX_galeria_comunidad_comunidad_id] ON [galeria_comunidad] ([comunidad_id])
GO

CREATE INDEX [IX_me_encanta_reports_id] ON [me_encanta] ([reports_id])
GO

CREATE INDEX [IX_follows_comunidad_id] ON [follows] ([comunidad_id])
GO

CREATE INDEX [IX_seguimiento_reportes_reporte_id] ON [seguimiento_reportes] ([reporte_id])
GO

CREATE INDEX [IX_seguimiento_reportes_usuario_id] ON [seguimiento_reportes] ([usuario_id])
GO

-- Add foreign key constraints
ALTER TABLE [comunidades] ADD CONSTRAINT [FK_comunidades_creador] FOREIGN KEY ([creador_id]) REFERENCES [usuarios] ([ID])
GO

ALTER TABLE [reports] ADD CONSTRAINT [FK_reports_comunidad] FOREIGN KEY ([comunidad_id]) REFERENCES [comunidades] ([ID])
GO

ALTER TABLE [reports] ADD CONSTRAINT [FK_reports_autor] FOREIGN KEY ([autor_id]) REFERENCES [usuarios] ([ID])
GO

ALTER TABLE [comentarios] ADD CONSTRAINT [FK_comentarios_actividad] FOREIGN KEY ([actividades_Id]) REFERENCES [actividades] ([ID])
GO

ALTER TABLE [comentarios] ADD CONSTRAINT [FK_comentarios_autor] FOREIGN KEY ([autor_id]) REFERENCES [usuarios] ([ID])
GO

ALTER TABLE [actividades] ADD CONSTRAINT [FK_actividades_comunidad] FOREIGN KEY ([comunidad_id]) REFERENCES [comunidades] ([ID])
GO

ALTER TABLE [fotos] ADD CONSTRAINT [FK_fotos_reports] FOREIGN KEY ([reports_id]) REFERENCES [reports] ([ID])
GO

ALTER TABLE [reports_tags] ADD CONSTRAINT [FK_reports_tags_tag] FOREIGN KEY ([tag_id]) REFERENCES [tags] ([ID]) ON DELETE CASCADE
GO

ALTER TABLE [reports_tags] ADD CONSTRAINT [FK_reports_tags_report] FOREIGN KEY ([reports_id]) REFERENCES [reports] ([ID]) ON DELETE CASCADE
GO

ALTER TABLE [comunidad_tags] ADD CONSTRAINT [FK_comunidad_tags_tag] FOREIGN KEY ([tag_id]) REFERENCES [tags] ([ID]) ON DELETE CASCADE
GO

ALTER TABLE [comunidad_tags] ADD CONSTRAINT [FK_comunidad_tags_comunidad] FOREIGN KEY ([comunidad_id]) REFERENCES [comunidades] ([ID]) ON DELETE CASCADE
GO

ALTER TABLE [usuarios_comunidades_roles] ADD CONSTRAINT [FK_usuarios_comunidades_roles_usuario] FOREIGN KEY ([usuario_id]) REFERENCES [usuarios] ([ID]) ON DELETE CASCADE
GO

ALTER TABLE [usuarios_comunidades_roles] ADD CONSTRAINT [FK_usuarios_comunidades_roles_comunidad] FOREIGN KEY ([comunidad_id]) REFERENCES [comunidades] ([ID]) ON DELETE CASCADE
GO

ALTER TABLE [usuarios_comunidades_roles] ADD CONSTRAINT [FK_usuarios_comunidades_roles_rol] FOREIGN KEY ([rol_id]) REFERENCES [roles_comunidades] ([ID]) ON DELETE CASCADE
GO

ALTER TABLE [usuarios_roles] ADD CONSTRAINT [FK_usuarios_roles_usuario] FOREIGN KEY ([id_usuario]) REFERENCES [usuarios] ([ID]) ON DELETE CASCADE
GO

ALTER TABLE [usuarios_roles] ADD CONSTRAINT [FK_usuarios_roles_rol] FOREIGN KEY ([id_rol]) REFERENCES [roles] ([ID]) ON DELETE CASCADE
GO

ALTER TABLE [galeria_comunidad] ADD CONSTRAINT [FK_galeria_comunidad_comunidad] FOREIGN KEY ([comunidad_id]) REFERENCES [comunidades] ([ID])
GO

ALTER TABLE [me_encanta] ADD CONSTRAINT [FK_me_encanta_usuario] FOREIGN KEY ([usuario_id]) REFERENCES [usuarios] ([ID])
GO

ALTER TABLE [me_encanta] ADD CONSTRAINT [FK_me_encanta_report] FOREIGN KEY ([reports_id]) REFERENCES [reports] ([ID])
GO

ALTER TABLE [follows] ADD CONSTRAINT [FK_follows_usuario] FOREIGN KEY ([usuario_id]) REFERENCES [usuarios] ([ID])
GO

ALTER TABLE [follows] ADD CONSTRAINT [FK_follows_comunidad] FOREIGN KEY ([comunidad_id]) REFERENCES [comunidades] ([ID])
GO

ALTER TABLE [seguimiento_reportes] ADD CONSTRAINT [FK_seguimiento_reportes_reporte] FOREIGN KEY ([reporte_id]) REFERENCES [reports] ([ID]) ON DELETE CASCADE
GO

ALTER TABLE [seguimiento_reportes] ADD CONSTRAINT [FK_seguimiento_reportes_usuario] FOREIGN KEY ([usuario_id]) REFERENCES [usuarios] ([ID])
GO

-- Insert basic roles
INSERT INTO [roles] ([nombre]) VALUES ('Administrador');
INSERT INTO [roles] ([nombre]) VALUES ('Moderador');
INSERT INTO [roles] ([nombre]) VALUES ('Usuario');
GO

INSERT INTO [roles_comunidades] ([nombre], [descripcion]) VALUES ('Administrador', 'Administrador de la comunidad con todos los permisos');
INSERT INTO [roles_comunidades] ([nombre], [descripcion]) VALUES ('Moderador', 'Moderador de la comunidad con permisos de gestión de contenido');
INSERT INTO [roles_comunidades] ([nombre], [descripcion]) VALUES ('Miembro', 'Miembro regular de la comunidad');
GO

-- Create triggers
CREATE TRIGGER [tr_asignar_rol_usuario_regular]
ON [usuarios]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @rol_usuario_regular uniqueidentifier;
    SELECT @rol_usuario_regular = ID FROM [roles] WHERE [nombre] = 'Usuario';

    INSERT INTO [usuarios_roles] ([id_usuario], [id_rol])
    SELECT
        i.[ID],
        @rol_usuario_regular
    FROM inserted i
    WHERE NOT EXISTS (
        SELECT 1 FROM [usuarios_roles] ur
        WHERE ur.[id_usuario] = i.[ID]
    );
END;
GO

CREATE TRIGGER [tr_asignar_admin_creador]
ON [comunidades]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @admin_rol_id BIGINT;
    SELECT @admin_rol_id = ID FROM [roles_comunidades] WHERE [nombre] = 'Administrador';

    INSERT INTO [usuarios_comunidades_roles] ([usuario_id], [comunidad_id], [rol_id])
    SELECT
        i.[creador_id],
        i.[ID],
        @admin_rol_id
    FROM inserted i
    WHERE i.[creador_id] IS NOT NULL
    AND NOT EXISTS (
        SELECT 1 FROM [usuarios_comunidades_roles] ucr
        WHERE ucr.[usuario_id] = i.[creador_id]
        AND ucr.[comunidad_id] = i.[ID]
    );
END;
GO

-- Add constraints
ALTER TABLE [actividades]
ADD CONSTRAINT [CK_actividades_fechas_validas]
CHECK ([fecha_fin] >= [fecha_inicio]);
GO

ALTER TABLE [usuarios]
ADD CONSTRAINT [CK_usuarios_email_formato]
CHECK ([email] LIKE '%_@_%._%');
GO

ALTER TABLE [usuarios]
ADD CONSTRAINT [CK_usuarios_fecha_nacimiento]
CHECK ([fecha_nacimiento] IS NULL OR
       ([fecha_nacimiento] >= '1900-01-01' AND [fecha_nacimiento] <= CAST(GETDATE() AS DATE)));
GO

-- Additional indexes for performance
CREATE INDEX [IX_usuarios_estado_cuenta] ON [usuarios] ([estado_cuenta]);
GO

CREATE INDEX [IX_reports_estado_comunidad] ON [reports] ([estado], [comunidad_id]);
GO

CREATE INDEX [IX_seguimiento_reportes_estado] ON [seguimiento_reportes] ([estado], [create_at]);
GO

PRINT 'Database schema created successfully!';
GO
