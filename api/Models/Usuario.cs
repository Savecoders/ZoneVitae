using System;
using System.Collections.Generic;

namespace api.Models;

public partial class Usuario
{
    public Guid Id { get; set; }

    public string NombreUsuario { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? FotoPerfil { get; set; }

    public DateOnly? FechaNacimiento { get; set; }

    public string Genero { get; set; } = null!;

    public string EstadoCuenta { get; set; } = null!;

    public DateTime? DeletedAt { get; set; }

    public DateTime CreateAt { get; set; }

    public DateTime UpdateAt { get; set; }

    public virtual ICollection<Comentario> Comentarios { get; set; } = new List<Comentario>();

    public virtual ICollection<Comunidade> Comunidades { get; set; } = new List<Comunidade>();

    public virtual ICollection<Report> ReportsNavigation { get; set; } = new List<Report>();

    public virtual ICollection<SeguimientoReporte> SeguimientoReportes { get; set; } = new List<SeguimientoReporte>();

    public virtual ICollection<UsuariosComunidadesRole> UsuariosComunidadesRoles { get; set; } = new List<UsuariosComunidadesRole>();

    public virtual ICollection<UsuariosRole> UsuariosRoles { get; set; } = new List<UsuariosRole>();

    public virtual ICollection<Comunidade> Comunidads { get; set; } = new List<Comunidade>();

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();
}
