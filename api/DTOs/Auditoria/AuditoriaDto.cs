using System;
using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Seguimientos
{
    public class SeguimientoReporteDto
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "El reporte es requerido")]
        public long ReporteId { get; set; }

        [Required(ErrorMessage = "El estado anterior es requerido")]
        [StringLength(50, ErrorMessage = "El estado anterior no puede exceder 50 caracteres")]
        public string EstadoAnterior { get; set; } = null!;

        [Required(ErrorMessage = "El estado actual es requerido")]
        [StringLength(50, ErrorMessage = "El estado actual no puede exceder 50 caracteres")]
        public string Estado { get; set; } = null!;

        [Required(ErrorMessage = "El comentario es requerido")]
        public string Comentario { get; set; } = null!;

        [Required(ErrorMessage = "La acción realizada es requerida")]
        public string AccionRealizada { get; set; } = null!;

       

        [Required(ErrorMessage = "La prioridad es requerida")]
        [StringLength(20, ErrorMessage = "La prioridad no puede exceder 20 caracteres")]
        public string Prioridad { get; set; } = null!;

        public DateTime CreateAt { get; set; }
        public DateTime UpdateAt { get; set; }

      
    }
}