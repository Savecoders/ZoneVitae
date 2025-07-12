using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Comunidad
{
    public class ComunidadCreateDto
    {
        [Required(ErrorMessage = "El nombre de la comunidad es requerido")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres")]
        [RegularExpression(@"^[a-zA-Z0-9\s\-_]+$", ErrorMessage = "El nombre solo puede contener letras, números, espacios, guiones y guiones bajos")]
        public string Nombre { get; set; } = null!;

        [Required(ErrorMessage = "La descripción de la comunidad es requerida")]
        [StringLength(500, MinimumLength = 10, ErrorMessage = "La descripción debe tener entre 10 y 500 caracteres")]
        public string Descripcion { get; set; } = null!;

        public IFormFile? Logo { get; set; }

        public IFormFile? Cover { get; set; }

        [Required(ErrorMessage = "La ubicación de la comunidad es requerida")]
        [StringLength(50, MinimumLength = 10, ErrorMessage = "La ubicación debe tener entre 10 y 50 caracteres")]
        public string Ubicacion { get; set; } = null!;

        [Required(ErrorMessage = "El tipo de comunidad es requerido")]
        [RegularExpression(@"^(Publica|Restringida|Privada)$",
          ErrorMessage = "El tipo de comunidad no es válido")]
        public string TipoComunidad { get; set; } = null!;

        [Required(ErrorMessage = "Debe especificar si es solo para mayores de edad")]
        public bool SoloMayoresEdad { get; set; } = false;

        [Required(ErrorMessage = "Debe seleccionar al menos un tag")]
        [MinLength(1, ErrorMessage = "Debe seleccionar al menos un tag")]
        public List<Guid> Tags { get; set; } = new();

        public Guid? CreadorId { get; set; }
    }
}
