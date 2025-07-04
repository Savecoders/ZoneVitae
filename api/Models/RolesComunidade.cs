using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

[Table("roles_comunidades")]
[Index("Nombre", Name = "IX_roles_comunidades_nombre", IsUnique = true)]
public partial class RolesComunidade
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("nombre")]
    [StringLength(50)]
    [Unicode(false)]
    public string Nombre { get; set; } = null!;

    [Column("descripcion")]
    [StringLength(255)]
    [Unicode(false)]
    public string? Descripcion { get; set; }

    [InverseProperty("Rol")]
    public virtual ICollection<UsuariosComunidadesRole> UsuariosComunidadesRoles { get; set; } = new List<UsuariosComunidadesRole>();
}
