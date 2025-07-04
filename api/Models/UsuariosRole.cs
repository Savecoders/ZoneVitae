using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

[Table("usuarios_roles")]
[Index("IdRol", Name = "IX_usuarios_roles_rol")]
[Index("IdUsuario", "IdRol", Name = "IX_usuarios_roles_unique", IsUnique = true)]
[Index("IdUsuario", Name = "IX_usuarios_roles_usuario")]
public partial class UsuariosRole
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("id_usuario")]
    public Guid IdUsuario { get; set; }

    [Column("id_rol")]
    public Guid IdRol { get; set; }

    [Column("asignado_por")]
    public Guid? AsignadoPor { get; set; }

    [Column("fecha_asignacion")]
    public DateTime FechaAsignacion { get; set; }

    [Column("fecha_expiracion")]
    public DateTime? FechaExpiracion { get; set; }

    [Column("activo")]
    public bool Activo { get; set; }

    [ForeignKey("IdRol")]
    [InverseProperty("UsuariosRoles")]
    public virtual Role IdRolNavigation { get; set; } = null!;

    [ForeignKey("IdUsuario")]
    [InverseProperty("UsuariosRoles")]
    public virtual Usuario IdUsuarioNavigation { get; set; } = null!;
}
