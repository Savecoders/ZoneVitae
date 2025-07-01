namespace api.DTOs.Usuario
{
    public class UsuarioDto
    {
        public Guid Id { get; set; }
        public string NombreUsuario { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? FotoPerfil { get; set; }
        public string EstadoCuenta { get; set; } = null!;
        public DateOnly? FechaNacimiento { get; set; }
        public String Genero { get; set; } = null!;
    }
}
