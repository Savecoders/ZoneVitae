using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Usuario
{
    public class UsuarioCreateDto
    {
        [Required(ErrorMessage = "El nombre de usuario es requerido")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "El nombre de usuario debe tener entre 3 y 50 caracteres")]
        [RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "El nombre de usuario solo puede contener letras, números y guiones bajos")]
        public string NombreUsuario { get; set; } = null!;

        [Required(ErrorMessage = "El email es requerido")]
        [EmailAddress(ErrorMessage = "El formato del email no es válido")]
        [StringLength(100, ErrorMessage = "El email no puede exceder los 100 caracteres")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "La contraseña es requerida")]
        [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$", ErrorMessage = "La contraseña debe contener al menos una mayúscula, una minúscula y un número")]
        public string Password { get; set; } = null!;

        [RegularExpression(@"^[MFO]$", ErrorMessage = "El género debe ser M (Masculino), F (Femenino) o O (Otro)")]
        public string? Genero { get; set; }

        [DataType(DataType.Date, ErrorMessage = "La fecha de nacimiento debe ser una fecha válida")]
        public DateOnly? FechaNacimiento { get; set; }

        public IFormFile? FotoPerfil { get; set; }
    }
}
