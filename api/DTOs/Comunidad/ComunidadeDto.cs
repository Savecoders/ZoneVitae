namespace api.DTOs
{
    public class ComunidadeDto
    {
        public long Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string? Descripcion { get; set; }
        public string? Logo { get; set; }
        public string? Cover { get; set; }
        public string Estado { get; set; } = null!;
    }
}
