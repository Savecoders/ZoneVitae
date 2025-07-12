
using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Reports
{
    public class ReportEditDto
    {
        public string Titulo { get; set; }
        public string Contenido { get; set; }
        public bool Anonimo { get; set; }
        public string? Direccion { get; set; }
        public int ComunidadId { get; set; }
        public List<string> Tags { get; set; } = new();
        public List<string> FotosUrls { get; set; } = new();
    }
}