using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

[Table("roles")]
[Index("Nombre", Name = "IX_roles_nombre", IsUnique = true)]
public partial class Role
{
    [Key]
    [Column("ID")]
    public Guid Id { get; set; }

    [Column("nombre")]
    [StringLength(255)]
    public string Nombre { get; set; } = null!;

    [InverseProperty("IdRolNavigation")]
    public virtual ICollection<UsuariosRole> UsuariosRoles { get; set; } = new List<UsuariosRole>();
}
