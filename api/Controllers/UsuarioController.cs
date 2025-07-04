using api.Models;
using api.Services.Usuario;
using api.Services.Auth;
using api.DTOs.Usuario;
using api.DTOs.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using api.DTOs.Auth;
using Microsoft.IdentityModel.JsonWebTokens;
using ChangePasswordDto = api.DTOs.Usuario.ChangePasswordDto;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuarioController(UsuarioService usuarioService, AuthService authService) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Administrador, Moderador")]
    public async Task<ActionResult<ApiResponse<IEnumerable<UsuarioResponseDto>>>> GetAll()
    {
        var usuarios = await usuarioService.GetAllAsync();
        var usuariosDto = usuarios.Select(user => new UsuarioResponseDto
        {
            Id = user.Id,
            NombreUsuario = user.NombreUsuario,
            Email = user.Email,
            FotoPerfil = user.FotoPerfil,
            FechaNacimiento = user.FechaNacimiento,
            Genero = user.Genero,
            EstadoCuenta = user.EstadoCuenta,
            CreateAt = user.CreateAt,
            UpdateAt = user.UpdateAt
        });

        return Ok(new ApiResponse<IEnumerable<UsuarioResponseDto>>
        {
            Success = true,
            Message = "Usuarios obtenidos exitosamente",
            Data = usuariosDto
        });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<UsuarioResponseDto>>> GetById(string id)
    {
        if (!Guid.TryParse(id, out var userGuid))
        {
            return BadRequest(new ApiResponse<UsuarioResponseDto>
            {
                Success = false,
                Message = "ID de usuario inválido",
                Data = default
            });
        }

        var usuario = await usuarioService.GetByIdWithRelationshipsAsync(userGuid);
        if (usuario == null)
            return NotFound(new ApiResponse<UsuarioResponseDto>
            {
                Success = false,
                Message = "Usuario no encontrado",
                Data = default
            });

        var usuarioDto = new UsuarioResponseDto
        {
            Id = usuario.Id,
            NombreUsuario = usuario.NombreUsuario,
            Email = usuario.Email,
            FotoPerfil = usuario.FotoPerfil,
            FechaNacimiento = usuario.FechaNacimiento,
            Genero = usuario.Genero,
            EstadoCuenta = usuario.EstadoCuenta,
            CreateAt = usuario.CreateAt,
            UpdateAt = usuario.UpdateAt
        };

        return Ok(new ApiResponse<UsuarioResponseDto>
        {
            Success = true,
            Message = "Usuario obtenido exitosamente",
            Data = usuarioDto
        });
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<UsuarioResponseDto>>> Create(UsuarioCreateDto usuarioDto)
    {
        try
        {
            var usuario = new Usuario
            {
                Id = Guid.NewGuid(),
                NombreUsuario = usuarioDto.NombreUsuario,
                Email = usuarioDto.Email,
                Password = usuarioDto.Password,
                Genero = usuarioDto.Genero ?? "O",
                FechaNacimiento = usuarioDto.FechaNacimiento,
                EstadoCuenta = "Activo",
                CreateAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow
            };

            await usuarioService.AddAsync(usuario);

            return Created(string.Empty, new ApiResponse<Usuario>
            {
                Success = true,
                Message = "Usuario creado exitosamente",
                Data = usuario
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ApiResponse<Usuario>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<Usuario>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Administrador")]
    public async Task<ActionResult<ApiResponse<UsuarioResponseDto>>> Update(
        string id,
        [FromForm] UsuarioUpdateDto usuarioDto)
    {
        if (!Guid.TryParse(id, out var userGuid))
        {
            return BadRequest(new ApiResponse<UsuarioResponseDto>
            {
                Success = false,
                Message = "ID de usuario inválido",
                Data = default
            });
        }

        try
        {
            var current_user = await usuarioService.GetByIdAsync(userGuid);
            if (current_user == null)
                return NotFound(new ApiResponse<UsuarioResponseDto>
                {
                    Success = false,
                    Message = "Usuario no encontrado",
                    Data = default
                });

            current_user.NombreUsuario = usuarioDto.NombreUsuario;

            current_user.Email = usuarioDto.Email;

            current_user.Genero = usuarioDto.Genero;

            current_user.FechaNacimiento = usuarioDto.FechaNacimiento;

            current_user.EstadoCuenta = usuarioDto.EstadoCuenta;

            current_user.UpdateAt = DateTime.UtcNow;


            await usuarioService.UpdateAsync(current_user);

            return Ok(new ApiResponse<Usuario>
            {
                Success = true,
                Message = "Usuario actualizado exitosamente",
                Data = current_user
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ApiResponse<UsuarioResponseDto>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<UsuarioResponseDto>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new ApiResponse<UsuarioResponseDto>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
        catch (Exception ex)
        {
            // Any error that is not handled specifically
            return StatusCode(500, new ApiResponse<UsuarioResponseDto>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
    }

    [Authorize]
    [HttpPut("update-profile")]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> UpdateProfile(
        [FromForm] UsuarioUpdateDto usuarioDto)
    {
        try
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return BadRequest(new ApiResponse<AuthResponseDto>
                {
                    Success = false,
                    Message = "ID de usuario inválido",
                    Data = default
                });
            }
            var current_user = await usuarioService.GetByIdAsync(userGuid);

            if (current_user == null)
                return NotFound(new ApiResponse<AuthResponseDto>
                {
                    Success = false,
                    Message = "Usuario no encontrado",
                    Data = default
                });

            current_user.NombreUsuario = usuarioDto.NombreUsuario;
            current_user.Email = usuarioDto.Email;
            current_user.Genero = usuarioDto.Genero;
            current_user.FechaNacimiento = usuarioDto.FechaNacimiento;
            current_user.EstadoCuenta = usuarioDto.EstadoCuenta ?? "Activo";
            current_user.UpdateAt = DateTime.UtcNow;

            await usuarioService.UpdateAsync(current_user);

            // Generar nuevo token con la información actualizada
            return Ok(new ApiResponse<AuthResponseDto>
            {
                Success = true,
                Message = "Usuario actualizado exitosamente",
                Data = new AuthResponseDto
                {
                    Token = authService.GenerateJwtToken(current_user),
                    Usuario = new UsuarioDto()
                    {
                        Id = current_user.Id,
                        NombreUsuario = current_user.NombreUsuario,
                        Email = current_user.Email,
                        FotoPerfil = current_user.FotoPerfil,
                        FechaNacimiento = current_user.FechaNacimiento,
                        Genero = current_user.Genero,
                        EstadoCuenta = current_user.EstadoCuenta,
                    }
                }
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ApiResponse<AuthResponseDto>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<AuthResponseDto>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new ApiResponse<AuthResponseDto>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<AuthResponseDto>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
        
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(string id)
    {
        if (!Guid.TryParse(id, out var userGuid))
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "ID de usuario inválido",
                Data = default
            });
        }

        var usuario = await usuarioService.GetByIdAsync(userGuid);
        if (usuario == null)
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Usuario no encontrado",
                Data = default
            });

        try
        {
            await usuarioService.DeleteAsync(usuario);
            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Usuario eliminado exitosamente",
                Data = default
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ApiResponse<object>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new ApiResponse<object>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
    }

    [Authorize]
    [HttpPost("{id}/change-password")]
    public async Task<ActionResult<ApiResponse<object>>> ChangePassword(string id,
        [FromBody] ChangePasswordDto changePasswordDto)
    {
        if (!Guid.TryParse(id, out var userGuid))
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "ID de usuario inválido",
                Data = default
            });
        }

        var usuario = await usuarioService.GetByIdAsync(userGuid);
        if (usuario == null)
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Usuario no encontrado",
                Data = default
            });

        try
        {
            // Verify current user can change this password
            string? currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId != id)
            {
                return StatusCode(403, new ApiResponse<object>
                {
                    Success = false,
                    Message = "No tienes permisos para cambiar esta contraseña",
                    Data = default
                });
            }

            await usuarioService.ChangePasswordAsync(usuario, changePasswordDto.CurrentPassword,
                changePasswordDto.NewPassword);

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Contraseña actualizada exitosamente",
                Data = default
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new ApiResponse<object>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
    }

    [HttpPost("validate-email")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<object>>> ValidateEmail([FromBody] EmailValidationDto emailValidationDto)
    {
        try
        {
            var allUsers = await usuarioService.GetAllAsync();
            var existingUser =
                allUsers.FirstOrDefault(usuario => usuario.Email.ToLower() == emailValidationDto.Email.ToLower());

            if (existingUser != null)
            {
                return Conflict(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Este correo electrónico ya está registrado",
                    Data = default
                });
            }

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Correo electrónico disponible",
                Data = default
            });
        }
        catch (Exception)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Message = "Error al validar el correo electrónico",
                Data = default
            });
        }
    }
}