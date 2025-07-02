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

        [Required(ErrorMessage = "La categoría es requerida")]
        [RegularExpression(@"^(Tecnologia|Deportes|Arte|Musica|Gaming|Educacion|Ciencia|Entretenimiento|Salud|Negocios|Otro)$",
            ErrorMessage = "La categoría debe ser una de las opciones válidas")]
        public string Categoria { get; set; } = null!;

        public IFormFile? Logo { get; set; }

        public IFormFile? Cover { get; set; }

        [Range(1, 10000, ErrorMessage = "El límite de miembros debe estar entre 1 y 10,000")]
        public int LimiteMiembros { get; set; } = 1000;

        public bool EsPrivada { get; set; } = false;

        [StringLength(200, ErrorMessage = "Las reglas no pueden exceder los 200 caracteres")]
        public string? Reglas { get; set; }
    }
}
