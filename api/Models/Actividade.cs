using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

[Table("actividades")]
[Index("ComunidadId", Name = "IX_actividades_comunidad_id")]
[Index("FechaInicio", "FechaFin", Name = "IX_actividades_fechas")]
public partial class Actividade
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("comunidad_id")]
    public long? ComunidadId { get; set; }

    [Column("nombre")]
    [StringLength(500)]
    public string Nombre { get; set; } = null!;

    [Column("descripcion")]
    public string? Descripcion { get; set; }

    [Column("fecha_inicio")]
    public DateOnly FechaInicio { get; set; }

    [Column("fecha_fin")]
    public DateOnly FechaFin { get; set; }

    [Column("ubicacion")]
    [StringLength(500)]
    public string Ubicacion { get; set; } = null!;

    [Column("virtual")]
    public bool Virtual { get; set; }

    [Column("frecuencia")]
    [StringLength(100)]
    public string Frecuencia { get; set; } = null!;

    [Column("cover")]
    [StringLength(255)]
    [Unicode(false)]
    public string Cover { get; set; } = null!;

    [Column("fecha")]
    public DateTime Fecha { get; set; }

    [Column("create_at")]
    public DateTime CreateAt { get; set; }

    [Column("update_at")]
    public DateTime UpdateAt { get; set; }

    [InverseProperty("Actividades")]
    public virtual ICollection<Comentario> Comentarios { get; set; } = new List<Comentario>();

    [ForeignKey("ComunidadId")]
    [InverseProperty("Actividades")]
    public virtual Comunidad? Comunidad { get; set; }
}
