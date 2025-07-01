using Microsoft.AspNetCore.Http;

namespace api.DTOs.Auth
{
    public class RegisterRequestDto
    {
        public string NombreUsuario { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? Genero { get; set; }
        public DateOnly? FechaNacimiento { get; set; }
        public IFormFile? FotoPerfil { get; set; }
    }
}
