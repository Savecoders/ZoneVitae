using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Models;

[Table("comunidades")]
[Index("CreadorId", Name = "IX_comunidades_creador_id")]
[Index("Estado", Name = "IX_comunidades_estado")]
public partial class Comunidade
{
    [Key]
    [Column("ID")]
    public long Id { get; set; }

    [Column("nombre")]
    [StringLength(500)]
    public string Nombre { get; set; } = null!;

    [Column("descripcion")]
    public string? Descripcion { get; set; }

    [Column("logo")]
    [StringLength(255)]
    [Unicode(false)]
    public string? Logo { get; set; }

    [Column("cover")]
    [StringLength(255)]
    [Unicode(false)]
    public string? Cover { get; set; }

    [Column("creador_id")]
    public Guid? CreadorId { get; set; }

    [Column("ubicacion")]
    [StringLength(500)]
    public string Ubicacion { get; set; } = null!;

    [Column("estado")]
    [StringLength(50)]
    public string Estado { get; set; } = null!;

    [Column("deleted_at")]
    public DateTime? DeletedAt { get; set; }

    [Column("create_at")]
    public DateTime CreateAt { get; set; }

    [Column("update_at")]
    public DateTime UpdateAt { get; set; }

    [InverseProperty("Comunidad")]
    public virtual ICollection<Actividade> Actividades { get; set; } = new List<Actividade>();

    [ForeignKey("CreadorId")]
    [InverseProperty("Comunidades")]
    public virtual Usuario? Creador { get; set; }

    [InverseProperty("Comunidad")]
    public virtual ICollection<GaleriaComunidad> GaleriaComunidads { get; set; } = new List<GaleriaComunidad>();

    [InverseProperty("Comunidad")]
    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();

    [InverseProperty("Comunidad")]
    public virtual ICollection<UsuariosComunidadesRole> UsuariosComunidadesRoles { get; set; } = new List<UsuariosComunidadesRole>();

    [ForeignKey("ComunidadId")]
    [InverseProperty("Comunidads")]
    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();

    [ForeignKey("ComunidadId")]
    [InverseProperty("Comunidads")]
    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
