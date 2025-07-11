using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Reports
{
    public class ReportCreateDto
    {
        [Required(ErrorMessage = "El título del reporte es requerido")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "El título debe tener entre 5 y 200 caracteres")]
        public string titulo { get; set; } = null!;

        [Required(ErrorMessage = "El contenido del reporte es requerido")]
        [StringLength(2000, MinimumLength = 10, ErrorMessage = "El contenido debe tener entre 10 y 2000 caracteres")]
        public string contenido { get; set; } = null!;

        public bool anonimo { get; set; } = false;

        [StringLength(500, ErrorMessage = "La dirección no puede exceder los 500 caracteres")]
        public string? Direccion { get; set; }

        public Guid? UsuarioReportadoId { get; set; }

        public long? PublicacionId { get; set; }

        public long? ComunidadId { get; set; }
        public List<string>? Tags { get; set; }
        public List<string>? FotosUrls { get; set; }
    }
}
