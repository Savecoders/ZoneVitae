using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

[Table("comentarios")]
[Index("ActividadesId", Name = "IX_comentarios_actividades_Id")]
[Index("AutorId", Name = "IX_comentarios_autor_id")]
public partial class Comentario
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("actividades_Id")]
    public long? ActividadesId { get; set; }

    [Column("autor_id")]
    public Guid? AutorId { get; set; }

    [Column("contenido")]
    public string Contenido { get; set; } = null!;

    [Column("fecha_comentario")]
    public DateTime FechaComentario { get; set; }

    [ForeignKey("ActividadesId")]
    [InverseProperty("Comentarios")]
    public virtual Actividade? Actividades { get; set; }

    [ForeignKey("AutorId")]
    [InverseProperty("Comentarios")]
    public virtual Usuario? Autor { get; set; }
}
