// DTOs/Actividade/ActividadeDto.cs
namespace api.DTOs.ActividadeUpdate;

public class ActividadeUpdateDto
{
    public string Nombre { get; set; } = null!;
    public string? Descripcion { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public string Ubicacion { get; set; } = null!;
    public bool Virtual { get; set; }
    public string Frecuencia { get; set; } = null!;
    
}

