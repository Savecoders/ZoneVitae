using System;
using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Seguimientos
{

    public class AuditoriaSeguimientoDto
    {
       [Required(ErrorMessage = "El estado anterior es requerido")]
        [StringLength(50, ErrorMessage = "El estado anterior no puede exceder 50 caracteres")]
        public string EstadoAnterior { get; set; } = null!;

        [Required(ErrorMessage = "El estado actual es requerido")]
        [StringLength(50, ErrorMessage = "El estado actual no puede exceder 50 caracteres")]
        public string Estado { get; set; } = null!;

       [Required(ErrorMessage = "La acción realizada es requerida")]
        public string AccionRealizada { get; set; } = null!;
}
    
}