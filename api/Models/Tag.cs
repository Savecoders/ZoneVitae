using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

[Table("tags")]
[Index("Nombre", Name = "IX_tags_nombre", IsUnique = true)]
public partial class Tag
{
    [Key]
    [Column("ID")]
    public Guid Id { get; set; }

    [Column("nombre")]
    [StringLength(255)]
    [Unicode(false)]
    public string Nombre { get; set; } = null!;

    [ForeignKey("TagId")]
    [InverseProperty("Tags")]
    public virtual ICollection<Comunidad> Comunidads { get; set; } = new List<Comunidad>();

    [ForeignKey("TagId")]
    [InverseProperty("Tags")]
    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();
}
