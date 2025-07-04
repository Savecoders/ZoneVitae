using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Usuario
{
    public class EmailValidationDto
    {
        [Required(ErrorMessage = "El email es requerido")]
        [EmailAddress(ErrorMessage = "El formato del email no es válido")]
        [StringLength(100, ErrorMessage = "El email no puede exceder los 100 caracteres")]
        public string Email { get; set; } = null!;
    }
}
