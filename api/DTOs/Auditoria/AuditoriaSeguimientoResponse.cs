using api.DTOs;
using api.DTOs.Usuario;

namespace api.DTOs.Reports
{
    public class AuditoriaSeguimientoResponse
    {
        public long Id { get; set; }
        public string Titulo { get; set; } = null!;
        public string Contenido { get; set; } = null!;
        public bool Anonimo { get; set; }
        public string? Direccion { get; set; }
        public string Estado { get; set; } = null!;
        public DateTime CreateAt { get; set; }
        public DateTime UpdateAt { get; set; }

        public UsuarioResponseDto? Autor { get; set; }
        public string? InicialNombre { get; set; }
        public List<FotoDto> Fotos { get; set; } = new();
        public List<TagDto> Tags { get; set; } = new();
        public ComunidadDto? Comunidad { get; set; }
    }
}
