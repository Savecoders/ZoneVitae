using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class ComunidadeDto
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "El nombre de la comunidad es requerido")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres")]
        public string Nombre { get; set; } = null!;

        [StringLength(500, ErrorMessage = "La descripción no puede exceder los 500 caracteres")]
        public string? Descripcion { get; set; }

        [Url(ErrorMessage = "El logo debe ser una URL válida")]
        public string? Logo { get; set; }

        [Url(ErrorMessage = "La imagen de portada debe ser una URL válida")]
        public string? Cover { get; set; }

        [Required(ErrorMessage = "El estado de la comunidad es requerido")]
        [RegularExpression(@"^(Activo|Inactivo|Suspendido)$", ErrorMessage = "El estado debe ser Activo, Inactivo o Suspendido")]
        public string Estado { get; set; } = null!;
    }
}
