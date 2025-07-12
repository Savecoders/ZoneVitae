using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

[Table("reports")]
[Index("AutorId", Name = "IX_reports_autor_id")]
[Index("ComunidadId", Name = "IX_reports_comunidad_id")]
[Index("Estado", "ComunidadId", Name = "IX_reports_estado_comunidad")]
[Index("Estado", "CreateAt", Name = "IX_reports_estado_fecha")]
public partial class Report
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("comunidad_id")]
    public long? ComunidadId { get; set; }

    [Column("autor_id")]
    public Guid? AutorId { get; set; }

    [Column("titulo")]
    [StringLength(255)]
    [Unicode(false)]
    public string Titulo { get; set; } = null!;

    [Column("contenido")]
    public string Contenido { get; set; } = null!;

    [Column("anonimo")]
    public bool Anonimo { get; set; }

    [Column("estado")]
    [StringLength(50)]
    public string Estado { get; set; } = null!;

    [Column("direccion")]
    [StringLength(500)]
    public string? Direccion { get; set; }

    [Column("deleted_at")]
    public DateTime? DeletedAt { get; set; }

    [Column("create_at")]
    public DateTime CreateAt { get; set; }

    [Column("update_at")]
    public DateTime UpdateAt { get; set; }

    [ForeignKey("AutorId")]
    [InverseProperty("ReportsNavigation")]
    public virtual Usuario? Autor { get; set; }

    [ForeignKey("ComunidadId")]
    [InverseProperty("Reports")]
    public virtual Comunidade? Comunidad { get; set; }

    [InverseProperty("Reports")]
    public virtual ICollection<Foto> Fotos { get; set; } = new List<Foto>();

    [InverseProperty("Reporte")]
    public virtual ICollection<SeguimientoReporte> SeguimientoReportes { get; set; } = new List<SeguimientoReporte>();

    [ForeignKey("ReportsId")]
    [InverseProperty("Reports")]
    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();

    [ForeignKey("ReportsId")]
    [InverseProperty("Reports")]
    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
