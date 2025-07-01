using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Actividade
{
    public long Id { get; set; }

    public long? ComunidadId { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public DateOnly FechaInicio { get; set; }

    public DateOnly FechaFin { get; set; }

    public string Ubicacion { get; set; } = null!;

    public bool Virtual { get; set; }

    public string Frecuencia { get; set; } = null!;

    public string Cover { get; set; } = null!;

    public DateTime Fecha { get; set; }

    public DateTime CreateAt { get; set; }

    public DateTime UpdateAt { get; set; }

    public virtual ICollection<Comentario> Comentarios { get; set; } = new List<Comentario>();

    public virtual Comunidade? Comunidad { get; set; }
}
