using System;
using System.Collections.Generic;

namespace api.Models;

public partial class UsuariosRole
{
    public Guid Id { get; set; }

    public Guid IdUsuario { get; set; }

    public Guid IdRol { get; set; }

    public Guid? AsignadoPor { get; set; }

    public DateTime FechaAsignacion { get; set; }

    public DateTime? FechaExpiracion { get; set; }

    public bool Activo { get; set; }

    public virtual Role IdRolNavigation { get; set; } = null!;

    public virtual Usuario IdUsuarioNavigation { get; set; } = null!;
}
