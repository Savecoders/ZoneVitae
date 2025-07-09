using System;
using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Reports
{
    public class ReportUpdateDto
    {
        [Required(ErrorMessage = "El título del reporte es requerido")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "El título debe tener entre 5 y 200 caracteres")]
        public string Titulo { get; set; } = null!;

        [Required(ErrorMessage = "El contenido del reporte es requerido")]
        [StringLength(2000, MinimumLength = 10, ErrorMessage = "El contenido debe tener entre 10 y 2000 caracteres")]
        public string Contenido { get; set; } = null!;

        public bool Anonimo { get; set; }

        [Required(ErrorMessage = "El estado del reporte es requerido")]
        [RegularExpression(@"(Pendiente|En Revision|Resuelto|Rechazado)", ErrorMessage = "El estado debe ser Pendiente, En Revision, Resuelto o Rechazado")]
        public string Estado { get; set; } = null!;
        
        [StringLength(500, ErrorMessage = "La dirección no puede exceder los 500 caracteres")]
        public string? Direccion { get; set; }

        public Guid? UsuarioReportadoId { get; set; }

        public long? PublicacionId { get; set; }

        public long? ComunidadId { get; set; }

        // Optional: List of Tag IDs to update tags associated with the report
        public List<Guid>? TagIds { get; set; }
        
        // Optional: List of image URLs to update photos associated with the report
        public List<string>? ImageUrls { get; set; }
    }
}