using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

[Table("usuarios")]
[Index("Email", Name = "IX_usuarios_email", IsUnique = true)]
[Index("EstadoCuenta", Name = "IX_usuarios_estado_cuenta")]
[Index("NombreUsuario", Name = "IX_usuarios_nombre_usuario", IsUnique = true)]
public partial class Usuario
{
    [Key]
    [Column("ID")]
    public Guid Id { get; set; }

    [Column("nombre_usuario")]
    [StringLength(255)]
    [Unicode(false)]
    public string NombreUsuario { get; set; } = null!;

    [Column("email")]
    [StringLength(255)]
    [Unicode(false)]
    public string Email { get; set; } = null!;

    [Column("password")]
    [StringLength(255)]
    [Unicode(false)]
    public string Password { get; set; } = null!;

    [Column("foto_perfil")]
    [StringLength(255)]
    [Unicode(false)]
    public string? FotoPerfil { get; set; }

    [Column("fecha_nacimiento")]
    public DateOnly? FechaNacimiento { get; set; }

    [Column("genero")]
    [StringLength(1)]
    public string Genero { get; set; } = null!;

    [Column("estado_cuenta")]
    [StringLength(20)]
    public string EstadoCuenta { get; set; } = null!;

    [Column("deleted_at")]
    public DateTime? DeletedAt { get; set; }

    [Column("create_at")]
    public DateTime CreateAt { get; set; }

    [Column("update_at")]
    public DateTime UpdateAt { get; set; }

    [InverseProperty("Autor")]
    public virtual ICollection<Comentario> Comentarios { get; set; } = new List<Comentario>();

    [InverseProperty("Creador")]
    public virtual ICollection<Comunidade> Comunidades { get; set; } = new List<Comunidade>();

    [InverseProperty("Autor")]
    public virtual ICollection<Report> ReportsNavigation { get; set; } = new List<Report>();

    [InverseProperty("Usuario")]
    public virtual ICollection<SeguimientoReporte> SeguimientoReportes { get; set; } = new List<SeguimientoReporte>();

    [InverseProperty("Usuario")]
    public virtual ICollection<UsuariosComunidadesRole> UsuariosComunidadesRoles { get; set; } = new List<UsuariosComunidadesRole>();

    [InverseProperty("IdUsuarioNavigation")]
    public virtual ICollection<UsuariosRole> UsuariosRoles { get; set; } = new List<UsuariosRole>();

    [ForeignKey("UsuarioId")]
    [InverseProperty("Usuarios")]
    public virtual ICollection<Comunidade> Comunidads { get; set; } = new List<Comunidade>();

    [ForeignKey("UsuarioId")]
    [InverseProperty("Usuarios")]
    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();
}
