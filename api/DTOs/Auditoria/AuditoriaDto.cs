using System;
using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class AuditoriaDto
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "El ID del reporte es obligatorio")]
        public long ReporteId { get; set; }

        [Required(ErrorMessage = "El estado anterior es obligatorio")]
        [StringLength(100, ErrorMessage = "El estado anterior no debe superar los 100 caracteres")]
        public string EstadoAnterior { get; set; } = null!;

        [Required(ErrorMessage = "El nuevo estado es obligatorio")]
        [StringLength(100, ErrorMessage = "El nuevo estado no debe superar los 100 caracteres")]
        public string EstadoNuevo { get; set; } = null!;

        [StringLength(1000, MinimumLength = 5, ErrorMessage = "El comentario debe tener entre 5 y 1000 caracteres")]
        public string Comentario { get; set; } = string.Empty;

        [StringLength(500, MinimumLength = 5, ErrorMessage = "La acción realizada debe tener entre 5 y 500 caracteres")]
        public string? AccionRealizada { get; set; }

        [Required(ErrorMessage = "La prioridad es obligatoria")]
        [RegularExpression("^(Baja|Media|Alta|Crítica)$", ErrorMessage = "La prioridad debe ser Baja, Media, Alta o Crítica")]
        public string Prioridad { get; set; } = null!;

        [StringLength(1000, ErrorMessage = "La URL de la imagen no debe exceder los 1000 caracteres")]
        public string? Imagen { get; set; }

        public DateTime FechaCambio { get; set; } = DateTime.UtcNow;
    }
}
