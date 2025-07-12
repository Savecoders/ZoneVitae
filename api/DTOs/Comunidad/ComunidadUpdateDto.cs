using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Comunidad
{
    public class ComunidadUpdateDto
    {
        [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres")]
        [RegularExpression(@"^[a-zA-Z0-9\s\-_]+$", ErrorMessage = "El nombre solo puede contener letras, números, espacios, guiones y guiones bajos")]
        public string? Nombre { get; set; }

        [StringLength(500, ErrorMessage = "La descripción no puede exceder los 500 caracteres")]
        public string? Descripcion { get; set; }

        public IFormFile? Logo { get; set; }

        public IFormFile? Cover { get; set; }

        [StringLength(50, MinimumLength = 10, ErrorMessage = "La ubicación debe tener entre 10 y 50 caracteres")]
        
        public string? Ubicacion { get; set; }

        [RegularExpression(@"^(Publica|Restringida|Privada)$",
            ErrorMessage = "El tipo de comunidad no es válido")]
        public string? TipoComunidad { get; set; }

        public bool? SoloMayoresEdad { get; set; }

        [MinLength(1, ErrorMessage = "Debe seleccionar al menos un tag")]
        public List<Guid> Tags { get; set; } = new();

        [RegularExpression(@"^(Aprobado|Pendiente de Revision|Rechazado|Suspendido)$", 
            ErrorMessage = "El estado debe ser Activo, Inactivo o Suspendido")]
        public string? Estado { get; set; } 
    }
}
