
using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class ComunidadDto
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "El nombre de la comunidad es requerido")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres")]
        public string Nombre { get; set; } = null!;

        [StringLength(500, ErrorMessage = "La descripción no puede exceder los 500 caracteres")]
        public string Descripcion { get; set; } = null!;

        [Url(ErrorMessage = "El logo debe ser una URL válida")]
        public string? Logo { get; set; }

        [Url(ErrorMessage = "La imagen de portada debe ser una URL válida")]
        public string? Cover { get; set; }

        [Required(ErrorMessage = "La ubicación de la comunidad es requerida")]
        [StringLength(50, MinimumLength = 10, ErrorMessage = "La ubicación debe tener entre 10 y 50 caracteres")]
        public string Ubicacion { get; set; } = null!;

        [Required(ErrorMessage = "El tipo de comunidad es requerido")]
        [RegularExpression(@"^(Publica|Restringida|Privada|Musica)$",
        ErrorMessage = "El tipo de comunidad no es válido")]
        public string TipoComunidad { get; set; } = null!;

        public bool SoloMayoresEdad { get; set; } = false;

        [Required(ErrorMessage = "Debe seleccionar al menos un tag")]
        [MinLength(1, ErrorMessage = "Debe seleccionar al menos un tag")]
        public List<TagDto> Tags { get; set; } = new();

        [Required(ErrorMessage = "El estado de la comunidad es requerido")]
        [RegularExpression(@"^(Activo|Inactivo|Suspendido)$", ErrorMessage = "El estado debe ser Activo, Inactivo o Suspendido")]
        public string Estado { get; set; } = null!;
    }
}
