using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Comentario
{
    public long Id { get; set; }

    public long? ActividadesId { get; set; }

    public Guid? AutorId { get; set; }

    public string Contenido { get; set; } = null!;

    public DateTime FechaComentario { get; set; }

    public virtual Actividade? Actividades { get; set; }

    public virtual Usuario? Autor { get; set; }
}
