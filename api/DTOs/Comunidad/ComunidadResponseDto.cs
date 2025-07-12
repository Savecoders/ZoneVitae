

namespace api.DTOs.Comunidad
{
    public class ComunidadResponseDto
    {
        public long Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string? Descripcion { get; set; } = null!;
        public string? Logo { get; set; } 
        public string? Cover { get; set; } 
        public string Ubicacion { get; set; } = null!;
        public string TipoComunidad { get; set; } = null!;
        public bool SoloMayoresEdad { get; set; }
        public List<TagDto> Tags { get; set; } = new();
        public Guid? CreadorId { get; set; }
        public string Estado { get; set; } = null!;
    }
}
