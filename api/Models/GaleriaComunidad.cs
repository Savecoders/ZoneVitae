using System;
using System.Collections.Generic;

namespace api.Models;

public partial class GaleriaComunidad
{
    public long Id { get; set; }

    public long? ComunidadId { get; set; }

    public string Imagen { get; set; } = null!;

    public virtual Comunidade? Comunidad { get; set; }
}
