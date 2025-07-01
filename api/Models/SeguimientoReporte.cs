using System;
using System.Collections.Generic;

namespace api.Models;

public partial class SeguimientoReporte
{
    public long Id { get; set; }

    public long ReporteId { get; set; }

    public Guid UsuarioId { get; set; }

    public string EstadoAnterior { get; set; } = null!;

    public string Estado { get; set; } = null!;

    public string Comentario { get; set; } = null!;

    public string AccionRealizada { get; set; } = null!;

    public string? AccionRecomendada { get; set; }

    public bool DocumentosAdjuntos { get; set; }

    public string Prioridad { get; set; } = null!;

    public DateTime CreateAt { get; set; }

    public DateTime UpdateAt { get; set; }

    public string? Imagen { get; set; }

    public virtual Report Reporte { get; set; } = null!;

    public virtual Usuario Usuario { get; set; } = null!;
}
