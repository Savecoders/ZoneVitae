using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

[Table("seguimiento_reportes")]
[Index("Estado", "CreateAt", Name = "IX_seguimiento_reportes_estado")]
[Index("ReporteId", Name = "IX_seguimiento_reportes_reporte_id")]
[Index("UsuarioId", Name = "IX_seguimiento_reportes_usuario_id")]
public partial class SeguimientoReporte
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("reporte_id")]
    public long ReporteId { get; set; }

    [Column("usuario_id")]
    public Guid UsuarioId { get; set; }

    [Column("estado_anterior")]
    [StringLength(50)]
    public string EstadoAnterior { get; set; } = null!;

    [Column("estado")]
    [StringLength(50)]
    public string Estado { get; set; } = null!;

    [Column("comentario")]
    public string Comentario { get; set; } = null!;

    [Column("accion_realizada")]
    public string AccionRealizada { get; set; } = null!;

    [Column("accion_recomendada")]
    public string? AccionRecomendada { get; set; }

    [Column("documentos_adjuntos")]
    public bool DocumentosAdjuntos { get; set; }

    [Column("prioridad")]
    [StringLength(20)]
    public string Prioridad { get; set; } = null!;

    [Column("create_at")]
    public DateTime CreateAt { get; set; }

    [Column("update_at")]
    public DateTime UpdateAt { get; set; }

    [Column("imagen")]
    [StringLength(255)]
    [Unicode(false)]
    public string? Imagen { get; set; }

    [ForeignKey("ReporteId")]
    [InverseProperty("SeguimientoReportes")]
    public virtual Report Reporte { get; set; } = null!;

    [ForeignKey("UsuarioId")]
    [InverseProperty("SeguimientoReportes")]
    public virtual Usuario Usuario { get; set; } = null!;
}
