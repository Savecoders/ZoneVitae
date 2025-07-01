namespace api.DTOs
{
    public class ReportDto
    {
        public long Id { get; set; }
        public string Titulo { get; set; } = null!;
        public string Contenido { get; set; } = null!;
        public bool Anonimo { get; set; }
        public string Estado { get; set; } = null!;
        public DateTime CreateAt { get; set; }
        public DateTime UpdateAt { get; set; }
    }
}
