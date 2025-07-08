using System;
using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Seguimientos
{

    public class SeguimientoReporteDto
    {
        public long? Id { get; set; }  // Solo para actualización, opcional en creación

        [Required]
        public long ReporteId { get; set; }

        [Required]
        public long UsuarioId { get; set; }

        [Required]
        public string EstadoAnterior { get; set; } = null!;

        [Required]
        public string EstadoNuevo { get; set; } = null!;

        public string Comentario { get; set; } = string.Empty;

        [Required(ErrorMessage = "La acción realizada es obligatoria")]
        public string AccionRealizada { get; set; } = null!;

        public string? AccionRecomendada { get; set; }

        public bool DocumentosAdjuntos { get; set; } = false;

        [Required(ErrorMessage = "La prioridad es obligatoria")]
        [EnumDataType(typeof(PrioridadSeguimientoReporte))]

        public string Prioridad { get; set; } = null!;

        public string? Imagen { get; set; }

        public DateTime? CreateAt { get; set; }
        public DateTime? UpdateAt { get; set; }
    }

        public enum PrioridadSeguimientoReporte
{
    Baja,
    Media,
    Alta,
    Critica
}

}
