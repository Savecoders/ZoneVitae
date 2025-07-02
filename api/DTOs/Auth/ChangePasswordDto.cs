using System.ComponentModel.DataAnnotations;

namespace api.DTOs.Auth
{
    public class ChangePasswordDto
    {
        [Required(ErrorMessage = "La contraseña actual es requerida")]
        public string CurrentPassword { get; set; } = null!;

        [Required(ErrorMessage = "La nueva contraseña es requerida")]
        [MinLength(8, ErrorMessage = "La nueva contraseña debe tener al menos 8 caracteres")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$", ErrorMessage = "La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número")]
        public string NewPassword { get; set; } = null!;

        [Required(ErrorMessage = "La confirmación de contraseña es requerida")]
        [Compare("NewPassword", ErrorMessage = "La confirmación de contraseña no coincide con la nueva contraseña")]
        public string ConfirmPassword { get; set; } = null!;
    }
}
