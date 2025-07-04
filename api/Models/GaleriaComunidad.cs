using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

[Table("galeria_comunidad")]
[Index("ComunidadId", Name = "IX_galeria_comunidad_comunidad_id")]
public partial class GaleriaComunidad
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("comunidad_id")]
    public long? ComunidadId { get; set; }

    [Column("imagen")]
    [StringLength(255)]
    [Unicode(false)]
    public string Imagen { get; set; } = null!;

    [ForeignKey("ComunidadId")]
    [InverseProperty("GaleriaComunidads")]
    public virtual Comunidade? Comunidad { get; set; }
}
