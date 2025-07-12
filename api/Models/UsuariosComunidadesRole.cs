using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

[PrimaryKey("UsuarioId", "ComunidadId")]
[Table("usuarios_comunidades_roles")]
public partial class UsuariosComunidadesRole
{
    [Key]
    [Column("usuario_id")]
    public Guid UsuarioId { get; set; }

    [Key]
    [Column("comunidad_id")]
    public long ComunidadId { get; set; }

    [Column("rol_id")]
    public long RolId { get; set; }

    [Column("fecha_asignacion")]
    public DateTime FechaAsignacion { get; set; }

    [ForeignKey("ComunidadId")]
    [InverseProperty("UsuariosComunidadesRoles")]
    public virtual Comunidade Comunidad { get; set; } = null!;

    [ForeignKey("RolId")]
    [InverseProperty("UsuariosComunidadesRoles")]
    public virtual RolesComunidade Rol { get; set; } = null!;

    [ForeignKey("UsuarioId")]
    [InverseProperty("UsuariosComunidadesRoles")]
    public virtual Usuario Usuario { get; set; } = null!;
}
