using System;
using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Seguimientos
{
    public class SeguimientoReporteCreateDto
    {
        [Required(ErrorMessage = "El ID del reporte es requerido")]
        public long ReporteId { get; set; }

        [Required(ErrorMessage = "El estado actual es requerido")]
        [StringLength(50, ErrorMessage = "El estado actual no puede exceder 50 caracteres")]
        public string Estado { get; set; } = null!;

        [Required(ErrorMessage = "El comentario es requerido")]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "El comentario debe tener entre 10 y 1000 caracteres")]
        public string Comentario { get; set; } = null!;

        [Required(ErrorMessage = "La acción realizada es requerida")]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "La acción realizada debe tener entre 10 y 1000 caracteres")]
        public string AccionRealizada { get; set; } = null!;

        [Required(ErrorMessage = "La prioridad es requerida")]
        [StringLength(20, ErrorMessage = "La prioridad no puede exceder 20 caracteres")]
        [RegularExpression(@"^(Alta|Media|Baja)$", ErrorMessage = "La prioridad debe ser Alta, Media o Baja")]
        public string Prioridad { get; set; } = null!;
    }
}