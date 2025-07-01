using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

public partial class ZoneVitaeSqlContext : DbContext
{
    public ZoneVitaeSqlContext()
    {
    }

    public ZoneVitaeSqlContext(DbContextOptions<ZoneVitaeSqlContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Actividade> Actividades { get; set; }

    public virtual DbSet<Comentario> Comentarios { get; set; }

    public virtual DbSet<Comunidade> Comunidades { get; set; }

    public virtual DbSet<Foto> Fotos { get; set; }

    public virtual DbSet<GaleriaComunidad> GaleriaComunidads { get; set; }

    public virtual DbSet<Report> Reports { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RolesComunidade> RolesComunidades { get; set; }

    public virtual DbSet<SeguimientoReporte> SeguimientoReportes { get; set; }

    public virtual DbSet<Tag> Tags { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    public virtual DbSet<UsuariosComunidadesRole> UsuariosComunidadesRoles { get; set; }

    public virtual DbSet<UsuariosRole> UsuariosRoles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Actividade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__activida__3214EC27B858A9C9");

            entity.ToTable("actividades");

            entity.HasIndex(e => e.ComunidadId, "IX_actividades_comunidad_id");

            entity.HasIndex(e => new { e.FechaInicio, e.FechaFin }, "IX_actividades_fechas");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ComunidadId).HasColumnName("comunidad_id");
            entity.Property(e => e.Cover)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("cover");
            entity.Property(e => e.CreateAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("create_at");
            entity.Property(e => e.Descripcion).HasColumnName("descripcion");
            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("fecha");
            entity.Property(e => e.FechaFin).HasColumnName("fecha_fin");
            entity.Property(e => e.FechaInicio).HasColumnName("fecha_inicio");
            entity.Property(e => e.Frecuencia)
                .HasMaxLength(100)
                .HasColumnName("frecuencia");
            entity.Property(e => e.Nombre)
                .HasMaxLength(500)
                .HasColumnName("nombre");
            entity.Property(e => e.Ubicacion)
                .HasMaxLength(500)
                .HasColumnName("ubicacion");
            entity.Property(e => e.UpdateAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("update_at");
            entity.Property(e => e.Virtual).HasColumnName("virtual");

            entity.HasOne(d => d.Comunidad).WithMany(p => p.Actividades)
                .HasForeignKey(d => d.ComunidadId)
                .HasConstraintName("FK_actividades_comunidad");
        });

        modelBuilder.Entity<Comentario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__comentar__3214EC2706CC10D4");

            entity.ToTable("comentarios");

            entity.HasIndex(e => e.ActividadesId, "IX_comentarios_actividades_Id");

            entity.HasIndex(e => e.AutorId, "IX_comentarios_autor_id");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ActividadesId).HasColumnName("actividades_Id");
            entity.Property(e => e.AutorId).HasColumnName("autor_id");
            entity.Property(e => e.Contenido).HasColumnName("contenido");
            entity.Property(e => e.FechaComentario)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("fecha_comentario");

            entity.HasOne(d => d.Actividades).WithMany(p => p.Comentarios)
                .HasForeignKey(d => d.ActividadesId)
                .HasConstraintName("FK_comentarios_actividad");

            entity.HasOne(d => d.Autor).WithMany(p => p.Comentarios)
                .HasForeignKey(d => d.AutorId)
                .HasConstraintName("FK_comentarios_autor");
        });

        modelBuilder.Entity<Comunidade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__comunida__3214EC275E116622");

            entity.ToTable("comunidades", tb => tb.HasTrigger("tr_asignar_admin_creador"));

            entity.HasIndex(e => e.CreadorId, "IX_comunidades_creador_id");

            entity.HasIndex(e => e.Estado, "IX_comunidades_estado");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Cover)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("cover");
            entity.Property(e => e.CreadorId).HasColumnName("creador_id");
            entity.Property(e => e.CreateAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("create_at");
            entity.Property(e => e.DeletedAt).HasColumnName("deleted_at");
            entity.Property(e => e.Descripcion).HasColumnName("descripcion");
            entity.Property(e => e.Estado)
                .HasMaxLength(50)
                .HasDefaultValue("Pendiente de Revision")
                .HasColumnName("estado");
            entity.Property(e => e.Logo)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("logo");
            entity.Property(e => e.Nombre)
                .HasMaxLength(500)
                .HasColumnName("nombre");
            entity.Property(e => e.Ubicacion)
                .HasMaxLength(500)
                .HasColumnName("ubicacion");
            entity.Property(e => e.UpdateAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("update_at");

            entity.HasOne(d => d.Creador).WithMany(p => p.Comunidades)
                .HasForeignKey(d => d.CreadorId)
                .HasConstraintName("FK_comunidades_creador");

            entity.HasMany(d => d.Tags).WithMany(p => p.Comunidads)
                .UsingEntity<Dictionary<string, object>>(
                    "ComunidadTag",
                    r => r.HasOne<Tag>().WithMany()
                        .HasForeignKey("TagId")
                        .HasConstraintName("FK_comunidad_tags_tag"),
                    l => l.HasOne<Comunidade>().WithMany()
                        .HasForeignKey("ComunidadId")
                        .HasConstraintName("FK_comunidad_tags_comunidad"),
                    j =>
                    {
                        j.HasKey("ComunidadId", "TagId").HasName("PK__comunida__A2962651151FB263");
                        j.ToTable("comunidad_tags");
                        j.HasIndex(new[] { "TagId" }, "IX_comunidad_tags_tag_id");
                        j.IndexerProperty<long>("ComunidadId").HasColumnName("comunidad_id");
                        j.IndexerProperty<Guid>("TagId").HasColumnName("tag_id");
                    });
        });

        modelBuilder.Entity<Foto>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__fotos__3214EC27A2E45509");

            entity.ToTable("fotos");

            entity.HasIndex(e => e.ReportsId, "IX_fotos_reports_id");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Image)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("image");
            entity.Property(e => e.ReportsId).HasColumnName("reports_id");

            entity.HasOne(d => d.Reports).WithMany(p => p.Fotos)
                .HasForeignKey(d => d.ReportsId)
                .HasConstraintName("FK_fotos_reports");
        });

        modelBuilder.Entity<GaleriaComunidad>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__galeria___3214EC27A81157AB");

            entity.ToTable("galeria_comunidad");

            entity.HasIndex(e => e.ComunidadId, "IX_galeria_comunidad_comunidad_id");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ComunidadId).HasColumnName("comunidad_id");
            entity.Property(e => e.Imagen)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("imagen");

            entity.HasOne(d => d.Comunidad).WithMany(p => p.GaleriaComunidads)
                .HasForeignKey(d => d.ComunidadId)
                .HasConstraintName("FK_galeria_comunidad_comunidad");
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__reports__3214EC273EE1463B");

            entity.ToTable("reports");

            entity.HasIndex(e => e.AutorId, "IX_reports_autor_id");

            entity.HasIndex(e => e.ComunidadId, "IX_reports_comunidad_id");

            entity.HasIndex(e => new { e.Estado, e.ComunidadId }, "IX_reports_estado_comunidad");

            entity.HasIndex(e => new { e.Estado, e.CreateAt }, "IX_reports_estado_fecha");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Anonimo).HasColumnName("anonimo");
            entity.Property(e => e.AutorId).HasColumnName("autor_id");
            entity.Property(e => e.ComunidadId).HasColumnName("comunidad_id");
            entity.Property(e => e.Contenido).HasColumnName("contenido");
            entity.Property(e => e.CreateAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("create_at");
            entity.Property(e => e.DeletedAt).HasColumnName("deleted_at");
            entity.Property(e => e.Estado)
                .HasMaxLength(50)
                .HasDefaultValue("Pendiente_Moderacion")
                .HasColumnName("estado");
            entity.Property(e => e.Titulo)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("titulo");
            entity.Property(e => e.UpdateAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("update_at");

            entity.HasOne(d => d.Autor).WithMany(p => p.ReportsNavigation)
                .HasForeignKey(d => d.AutorId)
                .HasConstraintName("FK_reports_autor");

            entity.HasOne(d => d.Comunidad).WithMany(p => p.Reports)
                .HasForeignKey(d => d.ComunidadId)
                .HasConstraintName("FK_reports_comunidad");

            entity.HasMany(d => d.Tags).WithMany(p => p.Reports)
                .UsingEntity<Dictionary<string, object>>(
                    "ReportsTag",
                    r => r.HasOne<Tag>().WithMany()
                        .HasForeignKey("TagId")
                        .HasConstraintName("FK_reports_tags_tag"),
                    l => l.HasOne<Report>().WithMany()
                        .HasForeignKey("ReportsId")
                        .HasConstraintName("FK_reports_tags_report"),
                    j =>
                    {
                        j.HasKey("ReportsId", "TagId").HasName("PK__reports___C56F988DAEA91C7D");
                        j.ToTable("reports_tags");
                        j.HasIndex(new[] { "TagId" }, "IX_reports_tags_tag_id");
                        j.IndexerProperty<long>("ReportsId").HasColumnName("reports_id");
                        j.IndexerProperty<Guid>("TagId").HasColumnName("tag_id");
                    });
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__roles__3214EC2707BC9C90");

            entity.ToTable("roles");

            entity.HasIndex(e => e.Nombre, "IX_roles_nombre").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("ID");
            entity.Property(e => e.Nombre)
                .HasMaxLength(255)
                .HasColumnName("nombre");
        });

        modelBuilder.Entity<RolesComunidade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__roles_co__3214EC276083F2C5");

            entity.ToTable("roles_comunidades");

            entity.HasIndex(e => e.Nombre, "IX_roles_comunidades_nombre").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("nombre");
        });

        modelBuilder.Entity<SeguimientoReporte>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__seguimie__3214EC274713A4BA");

            entity.ToTable("seguimiento_reportes");

            entity.HasIndex(e => new { e.Estado, e.CreateAt }, "IX_seguimiento_reportes_estado");

            entity.HasIndex(e => e.ReporteId, "IX_seguimiento_reportes_reporte_id");

            entity.HasIndex(e => e.UsuarioId, "IX_seguimiento_reportes_usuario_id");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.AccionRealizada).HasColumnName("accion_realizada");
            entity.Property(e => e.AccionRecomendada).HasColumnName("accion_recomendada");
            entity.Property(e => e.Comentario).HasColumnName("comentario");
            entity.Property(e => e.CreateAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("create_at");
            entity.Property(e => e.DocumentosAdjuntos).HasColumnName("documentos_adjuntos");
            entity.Property(e => e.Estado)
                .HasMaxLength(50)
                .HasColumnName("estado");
            entity.Property(e => e.EstadoAnterior)
                .HasMaxLength(50)
                .HasColumnName("estado_anterior");
            entity.Property(e => e.Imagen)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("imagen");
            entity.Property(e => e.Prioridad)
                .HasMaxLength(20)
                .HasDefaultValue("Media")
                .HasColumnName("prioridad");
            entity.Property(e => e.ReporteId).HasColumnName("reporte_id");
            entity.Property(e => e.UpdateAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("update_at");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

            entity.HasOne(d => d.Reporte).WithMany(p => p.SeguimientoReportes)
                .HasForeignKey(d => d.ReporteId)
                .HasConstraintName("FK_seguimiento_reportes_reporte");

            entity.HasOne(d => d.Usuario).WithMany(p => p.SeguimientoReportes)
                .HasForeignKey(d => d.UsuarioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_seguimiento_reportes_usuario");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tags__3214EC27E9822C9E");

            entity.ToTable("tags");

            entity.HasIndex(e => e.Nombre, "IX_tags_nombre").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("ID");
            entity.Property(e => e.Nombre)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("nombre");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__usuarios__3214EC2747520E7B");

            entity.ToTable("usuarios", tb => tb.HasTrigger("tr_asignar_rol_usuario_regular"));

            entity.HasIndex(e => e.Email, "IX_usuarios_email").IsUnique();

            entity.HasIndex(e => e.EstadoCuenta, "IX_usuarios_estado_cuenta");

            entity.HasIndex(e => e.NombreUsuario, "IX_usuarios_nombre_usuario").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("ID");
            entity.Property(e => e.CreateAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("create_at");
            entity.Property(e => e.DeletedAt).HasColumnName("deleted_at");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.EstadoCuenta)
                .HasMaxLength(20)
                .HasDefaultValue("Activo")
                .HasColumnName("estado_cuenta");
            entity.Property(e => e.FechaNacimiento).HasColumnName("fecha_nacimiento");
            entity.Property(e => e.FotoPerfil)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("foto_perfil");
            entity.Property(e => e.Genero)
                .HasMaxLength(1)
                .HasColumnName("genero");
            entity.Property(e => e.NombreUsuario)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("nombre_usuario");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password");
            entity.Property(e => e.UpdateAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("update_at");

            entity.HasMany(d => d.Comunidads).WithMany(p => p.Usuarios)
                .UsingEntity<Dictionary<string, object>>(
                    "Follow",
                    r => r.HasOne<Comunidade>().WithMany()
                        .HasForeignKey("ComunidadId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_follows_comunidad"),
                    l => l.HasOne<Usuario>().WithMany()
                        .HasForeignKey("UsuarioId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_follows_usuario"),
                    j =>
                    {
                        j.HasKey("UsuarioId", "ComunidadId").HasName("PK__follows__93BC2668D4053F6C");
                        j.ToTable("follows");
                        j.HasIndex(new[] { "ComunidadId" }, "IX_follows_comunidad_id");
                        j.IndexerProperty<Guid>("UsuarioId").HasColumnName("usuario_id");
                        j.IndexerProperty<long>("ComunidadId").HasColumnName("comunidad_id");
                    });

            entity.HasMany(d => d.Reports).WithMany(p => p.Usuarios)
                .UsingEntity<Dictionary<string, object>>(
                    "MeEncantum",
                    r => r.HasOne<Report>().WithMany()
                        .HasForeignKey("ReportsId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_me_encanta_report"),
                    l => l.HasOne<Usuario>().WithMany()
                        .HasForeignKey("UsuarioId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_me_encanta_usuario"),
                    j =>
                    {
                        j.HasKey("UsuarioId", "ReportsId").HasName("PK__me_encan__55C3BD85055B436C");
                        j.ToTable("me_encanta");
                        j.HasIndex(new[] { "ReportsId" }, "IX_me_encanta_reports_id");
                        j.IndexerProperty<Guid>("UsuarioId").HasColumnName("usuario_id");
                        j.IndexerProperty<long>("ReportsId").HasColumnName("reports_id");
                    });
        });

        modelBuilder.Entity<UsuariosComunidadesRole>(entity =>
        {
            entity.HasKey(e => new { e.UsuarioId, e.ComunidadId }).HasName("PK__usuarios__93BC2668204D9603");

            entity.ToTable("usuarios_comunidades_roles");

            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");
            entity.Property(e => e.ComunidadId).HasColumnName("comunidad_id");
            entity.Property(e => e.FechaAsignacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("fecha_asignacion");
            entity.Property(e => e.RolId).HasColumnName("rol_id");

            entity.HasOne(d => d.Comunidad).WithMany(p => p.UsuariosComunidadesRoles)
                .HasForeignKey(d => d.ComunidadId)
                .HasConstraintName("FK_usuarios_comunidades_roles_comunidad");

            entity.HasOne(d => d.Rol).WithMany(p => p.UsuariosComunidadesRoles)
                .HasForeignKey(d => d.RolId)
                .HasConstraintName("FK_usuarios_comunidades_roles_rol");

            entity.HasOne(d => d.Usuario).WithMany(p => p.UsuariosComunidadesRoles)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("FK_usuarios_comunidades_roles_usuario");
        });

        modelBuilder.Entity<UsuariosRole>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__usuarios__3213E83F4BA7710F");

            entity.ToTable("usuarios_roles");

            entity.HasIndex(e => e.IdRol, "IX_usuarios_roles_rol");

            entity.HasIndex(e => new { e.IdUsuario, e.IdRol }, "IX_usuarios_roles_unique").IsUnique();

            entity.HasIndex(e => e.IdUsuario, "IX_usuarios_roles_usuario");

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("id");
            entity.Property(e => e.Activo)
                .HasDefaultValue(true)
                .HasColumnName("activo");
            entity.Property(e => e.AsignadoPor).HasColumnName("asignado_por");
            entity.Property(e => e.FechaAsignacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("fecha_asignacion");
            entity.Property(e => e.FechaExpiracion).HasColumnName("fecha_expiracion");
            entity.Property(e => e.IdRol).HasColumnName("id_rol");
            entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");

            entity.HasOne(d => d.IdRolNavigation).WithMany(p => p.UsuariosRoles)
                .HasForeignKey(d => d.IdRol)
                .HasConstraintName("FK_usuarios_roles_rol");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.UsuariosRoles)
                .HasForeignKey(d => d.IdUsuario)
                .HasConstraintName("FK_usuarios_roles_usuario");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
