using System;
using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Usuario
{
    public class UsuarioResponseDto
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "El nombre de usuario es requerido")]
        [StringLength(50, ErrorMessage = "El nombre de usuario no puede exceder los 50 caracteres")]
        public string NombreUsuario { get; set; } = null!;

        [Required(ErrorMessage = "El email es requerido")]
        [EmailAddress(ErrorMessage = "El formato del email no es válido")]
        public string Email { get; set; } = null!;

        public string? FotoPerfil { get; set; }

        public DateOnly? FechaNacimiento { get; set; }

        [RegularExpression(@"^[MFO]$", ErrorMessage = "El género debe ser M, F o O")]
        public string? Genero { get; set; }

        [Required(ErrorMessage = "El estado de cuenta es requerido")]
        [RegularExpression(@"^(Activo|Inactivo|Suspendido)$", ErrorMessage = "El estado debe ser Activo, Inactivo o Suspendido")]
        public string EstadoCuenta { get; set; } = null!;

        public DateTime CreateAt { get; set; }
        public DateTime UpdateAt { get; set; }
    }
}
