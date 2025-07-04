using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Usuario
{
    public class ChangePasswordDto
    {
        [Required(ErrorMessage = "La contraseña actual es requerida")]
        public string CurrentPassword { get; set; } = null!;

        [Required(ErrorMessage = "La nueva contraseña es requerida")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener entre 6 y 100 caracteres")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$",
            ErrorMessage = "La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial")]
        public string NewPassword { get; set; } = null!;

        [Required(ErrorMessage = "La confirmación de contraseña es requerida")]
        [Compare("NewPassword", ErrorMessage = "Las contraseñas no coinciden")]
        public string ConfirmPassword { get; set; } = null!;
    }
}
