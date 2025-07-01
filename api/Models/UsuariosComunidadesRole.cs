using System;
using System.Collections.Generic;

namespace api.Models;

public partial class UsuariosComunidadesRole
{
    public Guid UsuarioId { get; set; }

    public long ComunidadId { get; set; }

    public long RolId { get; set; }

    public DateTime FechaAsignacion { get; set; }

    public virtual Comunidade Comunidad { get; set; } = null!;

    public virtual RolesComunidade Rol { get; set; } = null!;

    public virtual Usuario Usuario { get; set; } = null!;
}
