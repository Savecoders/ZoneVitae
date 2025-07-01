using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Comunidade
{
    public long Id { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public string? Logo { get; set; }

    public string? Cover { get; set; }

    public Guid? CreadorId { get; set; }

    public string Ubicacion { get; set; } = null!;

    public string Estado { get; set; } = null!;

    public DateTime? DeletedAt { get; set; }

    public DateTime CreateAt { get; set; }

    public DateTime UpdateAt { get; set; }

    public virtual ICollection<Actividade> Actividades { get; set; } = new List<Actividade>();

    public virtual Usuario? Creador { get; set; }

    public virtual ICollection<GaleriaComunidad> GaleriaComunidads { get; set; } = new List<GaleriaComunidad>();

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();

    public virtual ICollection<UsuariosComunidadesRole> UsuariosComunidadesRoles { get; set; } = new List<UsuariosComunidadesRole>();

    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();

    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
