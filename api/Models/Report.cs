using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Report
{
    public long Id { get; set; }

    public long? ComunidadId { get; set; }

    public Guid? AutorId { get; set; }

    public string Titulo { get; set; } = null!;

    public string Contenido { get; set; } = null!;

    public bool Anonimo { get; set; }

    public string Estado { get; set; } = null!;

    public DateTime? DeletedAt { get; set; }

    public DateTime CreateAt { get; set; }

    public DateTime UpdateAt { get; set; }

    public virtual Usuario? Autor { get; set; }

    public virtual Comunidade? Comunidad { get; set; }

    public virtual ICollection<Foto> Fotos { get; set; } = new List<Foto>();

    public virtual ICollection<SeguimientoReporte> SeguimientoReportes { get; set; } = new List<SeguimientoReporte>();

    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();

    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
