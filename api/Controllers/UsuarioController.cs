using api.Models;
using api.Services.Usuario;
using api.Services.Auth;
using api.DTOs.Usuario;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController(UsuarioService usuarioService, AuthService authService) : ControllerBase
    {
        private readonly UsuarioService _usuarioService = usuarioService;
        private readonly AuthService _authService = authService;

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<UsuarioResponseDto>>> GetAll()
        {
            var usuarios = await _usuarioService.GetAllAsync();
            var usuariosDto = usuarios.Select(u => new UsuarioResponseDto
            {
                Id = u.Id,
                NombreUsuario = u.NombreUsuario,
                Email = u.Email,
                FotoPerfil = u.FotoPerfil,
                FechaNacimiento = u.FechaNacimiento,
                Genero = u.Genero,
                EstadoCuenta = u.EstadoCuenta,
                CreateAt = u.CreateAt,
                UpdateAt = u.UpdateAt
            });
            return Ok(usuariosDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetById(string id)
        {
            var usuario = await _usuarioService.GetByIdWithRelationshipsAsync(id);
            if (usuario == null) return NotFound();

            // Return the full usuario entity with all relationships
            return Ok(usuario);
        }

        [HttpPost]
        public async Task<ActionResult<UsuarioResponseDto>> Create(UsuarioCreateDto usuarioDto)
        {
            var usuario = new Usuario
            {
                Id = Guid.NewGuid(),
                NombreUsuario = usuarioDto.NombreUsuario,
                Email = usuarioDto.Email,
                Password = usuarioDto.Password, // Password will be hashed in the service
                Genero = usuarioDto.Genero ?? "No especificado",
                FechaNacimiento = usuarioDto.FechaNacimiento,
                EstadoCuenta = "Activo",
                CreateAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow
                // FotoPerfil will need to be handled separately if it's a file upload
            };

            await _usuarioService.AddAsync(usuario);

            var responseDto = new UsuarioResponseDto
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

            return CreatedAtAction(nameof(GetById), new { id = usuario.Id }, responseDto);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(string id, UsuarioCreateDto usuarioDto)
        {
            var existingUsuario = await _usuarioService.GetByIdAsync(id);
            if (existingUsuario == null) return NotFound();

            // Update only the properties that can be changed
            existingUsuario.NombreUsuario = usuarioDto.NombreUsuario;
            existingUsuario.Email = usuarioDto.Email;

            // Only update password if provided
            existingUsuario.Genero = usuarioDto.Genero ?? existingUsuario.Genero;
            existingUsuario.FechaNacimiento = usuarioDto.FechaNacimiento ?? existingUsuario.FechaNacimiento;
            existingUsuario.UpdateAt = DateTime.UtcNow;

            // FotoPerfil handling would go here

            // If password is provided, use the special update method that handles password hashing
            if (!string.IsNullOrEmpty(usuarioDto.Password))
            {
                await _usuarioService.UpdateWithPasswordAsync(existingUsuario, usuarioDto.Password);
            }
            else
            {
                await _usuarioService.UpdateAsync(existingUsuario);
            }

            // Check if the current user is updating their own profile
            string? currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId != null && currentUserId == id)
            {
                // Generate a new token with updated user information
                string newToken = _authService.GenerateTokenForUser(existingUsuario);

                // Return the updated token along with basic user info
                return Ok(new
                {
                    Token = newToken,
                    NombreUsuario = existingUsuario.NombreUsuario,
                    Email = existingUsuario.Email
                });
            }

            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            var usuario = await _usuarioService.GetByIdAsync(id);
            if (usuario == null) return NotFound();
            await _usuarioService.DeleteAsync(usuario);
            return NoContent();
        }
    }
}
