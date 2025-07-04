using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class ReportDto
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "El título del reporte es requerido")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "El título debe tener entre 5 y 200 caracteres")]
        public string Titulo { get; set; } = null!;

        [Required(ErrorMessage = "El contenido del reporte es requerido")]
        [StringLength(2000, MinimumLength = 10, ErrorMessage = "El contenido debe tener entre 10 y 2000 caracteres")]
        public string Contenido { get; set; } = null!;

        public bool Anonimo { get; set; }

        [Required(ErrorMessage = "El estado del reporte es requerido")]
        [RegularExpression(@"^(Pendiente|En Revision|Resuelto|Rechazado)$", ErrorMessage = "El estado debe ser Pendiente, En Revision, Resuelto o Rechazado")]
        public string Estado { get; set; } = null!;

        public DateTime CreateAt { get; set; }
        public DateTime UpdateAt { get; set; }
    }
}
