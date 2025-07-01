using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Tag
{
    public Guid Id { get; set; }

    public string Nombre { get; set; } = null!;

    public virtual ICollection<Comunidade> Comunidads { get; set; } = new List<Comunidade>();

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();
}
