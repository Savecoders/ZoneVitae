using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

[Table("fotos")]
[Index("ReportsId", Name = "IX_fotos_reports_id")]
public partial class Foto
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("image")]
    [StringLength(255)]
    [Unicode(false)]
    public string Image { get; set; } = null!;

    [Column("reports_id")]
    public long? ReportsId { get; set; }

    [ForeignKey("ReportsId")]
    [InverseProperty("Fotos")]
    public virtual Report? Reports { get; set; }
}
