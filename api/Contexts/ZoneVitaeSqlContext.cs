using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Contexts;

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

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:default");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Actividade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__activida__3214EC2704CC9C9E");

            entity.Property(e => e.CreateAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Fecha).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.UpdateAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<Comentario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__comentar__3214EC27259081A3");

            entity.Property(e => e.FechaComentario).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Actividades).WithMany(p => p.Comentarios).HasConstraintName("FK_comentarios_actividad");

            entity.HasOne(d => d.Autor).WithMany(p => p.Comentarios).HasConstraintName("FK_comentarios_autor");
        });

        modelBuilder.Entity<Comunidade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__comunida__3214EC2796D579AF");

            entity.ToTable("comunidades", tb => tb.HasTrigger("tr_asignar_admin_creador"));

            entity.Property(e => e.CreateAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Estado).HasDefaultValue("Pendiente de Revision");
            entity.Property(e => e.UpdateAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Creador).WithMany(p => p.Comunidades).HasConstraintName("FK_comunidades_creador");

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
                        j.HasKey("ComunidadId", "TagId").HasName("PK__comunida__A29626518B665AC8");
                        j.ToTable("comunidad_tags");
                        j.HasIndex(new[] { "TagId" }, "IX_comunidad_tags_tag_id");
                        j.IndexerProperty<long>("ComunidadId").HasColumnName("comunidad_id");
                        j.IndexerProperty<Guid>("TagId").HasColumnName("tag_id");
                    });
        });

        modelBuilder.Entity<Foto>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__fotos__3214EC2785EB10FF");

            entity.HasOne(d => d.Reports).WithMany(p => p.Fotos).HasConstraintName("FK_fotos_reports");
        });

        modelBuilder.Entity<GaleriaComunidad>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__galeria___3214EC276F658F9C");

            entity.HasOne(d => d.Comunidad).WithMany(p => p.GaleriaComunidads).HasConstraintName("FK_galeria_comunidad_comunidad");
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__reports__3214EC27DFC3948F");

            entity.Property(e => e.CreateAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Estado).HasDefaultValue("Pendiente_Moderacion");
            entity.Property(e => e.UpdateAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Autor).WithMany(p => p.ReportsNavigation).HasConstraintName("FK_reports_autor");

            entity.HasOne(d => d.Comunidad).WithMany(p => p.Reports).HasConstraintName("FK_reports_comunidad");

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
                        j.HasKey("ReportsId", "TagId").HasName("PK__reports___C56F988DB1023F4C");
                        j.ToTable("reports_tags");
                        j.HasIndex(new[] { "TagId" }, "IX_reports_tags_tag_id");
                        j.IndexerProperty<long>("ReportsId").HasColumnName("reports_id");
                        j.IndexerProperty<Guid>("TagId").HasColumnName("tag_id");
                    });
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__roles__3214EC276EF62A55");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
        });

        modelBuilder.Entity<RolesComunidade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__roles_co__3214EC277049B55F");
        });

        modelBuilder.Entity<SeguimientoReporte>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__seguimie__3214EC27FCBF6892");

            entity.Property(e => e.CreateAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Prioridad).HasDefaultValue("Media");
            entity.Property(e => e.UpdateAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Reporte).WithMany(p => p.SeguimientoReportes).HasConstraintName("FK_seguimiento_reportes_reporte");

            entity.HasOne(d => d.Usuario).WithMany(p => p.SeguimientoReportes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_seguimiento_reportes_usuario");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tags__3214EC2793C444BB");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__usuarios__3214EC27952B0CA3");

            entity.ToTable("usuarios", tb => tb.HasTrigger("tr_asignar_rol_usuario_regular"));

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.CreateAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.EstadoCuenta).HasDefaultValue("Activo");
            entity.Property(e => e.UpdateAt).HasDefaultValueSql("(getdate())");

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
                        j.HasKey("UsuarioId", "ComunidadId").HasName("PK__follows__93BC2668534D06C6");
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
                        j.HasKey("UsuarioId", "ReportsId").HasName("PK__me_encan__55C3BD85822A15B5");
                        j.ToTable("me_encanta");
                        j.HasIndex(new[] { "ReportsId" }, "IX_me_encanta_reports_id");
                        j.IndexerProperty<Guid>("UsuarioId").HasColumnName("usuario_id");
                        j.IndexerProperty<long>("ReportsId").HasColumnName("reports_id");
                    });
        });

        modelBuilder.Entity<UsuariosComunidadesRole>(entity =>
        {
            entity.HasKey(e => new { e.UsuarioId, e.ComunidadId }).HasName("PK__usuarios__93BC266809EF91CD");

            entity.Property(e => e.FechaAsignacion).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Comunidad).WithMany(p => p.UsuariosComunidadesRoles).HasConstraintName("FK_usuarios_comunidades_roles_comunidad");

            entity.HasOne(d => d.Rol).WithMany(p => p.UsuariosComunidadesRoles).HasConstraintName("FK_usuarios_comunidades_roles_rol");

            entity.HasOne(d => d.Usuario).WithMany(p => p.UsuariosComunidadesRoles).HasConstraintName("FK_usuarios_comunidades_roles_usuario");
        });

        modelBuilder.Entity<UsuariosRole>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__usuarios__3213E83FCC724F4F");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
            entity.Property(e => e.Activo).HasDefaultValue(true);
            entity.Property(e => e.FechaAsignacion).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdRolNavigation).WithMany(p => p.UsuariosRoles).HasConstraintName("FK_usuarios_roles_rol");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.UsuariosRoles).HasConstraintName("FK_usuarios_roles_usuario");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
