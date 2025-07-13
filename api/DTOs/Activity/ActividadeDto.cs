// DTOs/Actividade/ActividadeDto.cs
using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Actividade;

public class ActividadeDto
{
    public long Id { get; set; }
    
    [Required(ErrorMessage = "El nombre es requerido")]
    [StringLength(100, ErrorMessage = "El nombre no puede exceder 100 caracteres")]
    public string Nombre { get; set; } = null!;
    [StringLength(500, ErrorMessage = "La descripción no puede exceder 500 caracteres")]
    public string? Descripcion { get; set; }
    [Required(ErrorMessage = "La fecha de inicio es requerida")]
    public DateTime FechaInicio { get; set; }
    [Required(ErrorMessage = "La fecha de fin es requerida")]
    public DateTime FechaFin { get; set; }
    [Required(ErrorMessage = "La ubicación es requerida")]
    [StringLength(200, ErrorMessage = "La ubicación no puede exceder 200 caracteres")]
    public string Ubicacion { get; set; } = null!;
    public bool Virtual { get; set; }
    [Required(ErrorMessage = "La frecuencia es requerida")]
    public string Frecuencia { get; set; } = null!;
    public DateTime Fecha { get; set; }
    public DateTime CreateAt { get; set; }
    public DateTime UpdateAt { get; set; }
}

