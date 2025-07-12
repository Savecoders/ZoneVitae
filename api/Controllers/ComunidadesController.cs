using api.DTOs;
using api.DTOs.Common;
using api.DTOs.Comunidad;
using api.DTOs.Tag;
using api.Services.Comunidades;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ComunidadesController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ComunidadService _comunidadService;

        public ComunidadesController(ComunidadService comunidadService,
         IHttpContextAccessor httpContextAccessor)
        {
            _comunidadService = comunidadService;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<IEnumerable<ComunidadResponseDto>>>> GetComunidades()
        {
            var comunidades = await _comunidadService.GetAllAsync();
            var comunidadesDTO = comunidades.Select(comunidad => new ComunidadResponseDto
            {
                Id = comunidad.Id,
                Nombre = comunidad.Nombre,
                Descripcion = comunidad.Descripcion,
                Logo = comunidad.Logo,
                Cover = comunidad.Cover,
                Ubicacion = comunidad.Ubicacion,
                TipoComunidad = comunidad.TipoComunidad,
                SoloMayoresEdad = comunidad.SoloMayoresEdad,
                Tags = comunidad.Tags.Select(t => new TagDto
                {
                    Id = t.Id,
                    Nombre = t.Nombre
                }).ToList(),
                CreadorId = comunidad.CreadorId,
                Estado = comunidad.Estado
            });

            return Ok(new ApiResponse<IEnumerable<ComunidadResponseDto>>
            {
                Success = true,
                Message = "Comunidades obtenidas exitosamente",
                Data = comunidadesDTO
            });
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrador, Usuario")]
        public async Task<ActionResult<ApiResponse<IEnumerable<ComunidadDto>>>> GetComunidadById(long id)
        {
            var comunidad = await _comunidadService.GetByIdWithRelationshipsAsync(id);
            if (comunidad == null)
            {
                return NotFound(new ApiResponse<ComunidadDto>
                {
                    Success = false,
                    Message = "Comunidad no encontrada",
                    Data = default
                });
            }

            var comunidadesDTO = new ComunidadDto
            {
                Id = comunidad.Id,
                Logo = comunidad.Logo,
                Cover = comunidad.Cover,
                Nombre = comunidad.Nombre,
                Descripcion = comunidad.Descripcion,
                Ubicacion = comunidad.Ubicacion,
                TipoComunidad = comunidad.TipoComunidad,
                SoloMayoresEdad = comunidad.SoloMayoresEdad,
                Tags = comunidad.Tags.Select(t => new TagDto
                {
                    Id = t.Id,
                    Nombre = t.Nombre
                }).ToList(),
                Estado = comunidad.Estado
            };

            return Ok(new ApiResponse<ComunidadDto>
            {
                Success = true,
                Message = "Comunidad obtenida exitosamente",
                Data = comunidadesDTO
            });
        }

        [HttpGet("searchCreator")]
        public async Task<ActionResult<ApiResponse<IEnumerable<ComunidadResponseDto>>>> GetComunidadesByCreador()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            var userIdString = user?.FindFirst("sub")?.Value ?? user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdString == null)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    Success = false,
                    Message = "No se pudo identificar al usuario",
                    Data = default
                });
            }

            Guid userId = Guid.Parse(userIdString);

            var comunidades = await _comunidadService.GetByCreadorIdAsync(userId);

            var dto = comunidades.Select(c => new ComunidadResponseDto
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Descripcion = c.Descripcion,
                Logo = c.Logo,
                Cover = c.Cover,
                Ubicacion = c.Ubicacion,
                TipoComunidad = c.TipoComunidad,
                SoloMayoresEdad = c.SoloMayoresEdad,
                Estado = c.Estado,
                Tags = c.Tags.Select(t => new TagDto { Id = t.Id, Nombre = t.Nombre }).ToList(),
                CreadorId = c.CreadorId
            });

            return Ok(new ApiResponse<IEnumerable<ComunidadResponseDto>>
            {
                Success = true,
                Message = "Comunidades del usuario cargadas correctamente",
                Data = dto
            });
        }

        [HttpGet("search")]
        public async Task<ActionResult<ApiResponse<ComunidadResponseDto>>> SearchComunidades(string? nombre)
        {
            var comunidades = await _comunidadService.SearchComunidadesAsync(nombre);
            if (!comunidades.Any())
            {
                return NotFound("No se encontraron comunidades");
            }

            var comunidadesDto = comunidades.Select(c => new ComunidadResponseDto
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Descripcion = c.Descripcion,
                Logo = c.Logo,
                Cover = c.Cover,
                Ubicacion = c.Ubicacion,
                TipoComunidad = c.TipoComunidad,
                SoloMayoresEdad = c.SoloMayoresEdad,
                Estado = c.Estado,
                CreadorId = c.CreadorId,
                Tags = c.Tags?.Select(t => new TagDto
                {
                    Id = t.Id,
                    Nombre = t.Nombre
                }).ToList()
            });

            return Ok(new ApiResponse<IEnumerable<ComunidadResponseDto>>
            {
                Success = true,
                Message = "Comunidades del usuario cargadas correctamente",
                Data = comunidadesDto
            });
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<ComunidadResponseDto>>> CreateComunidad([FromForm] ComunidadCreateDto comunidadCreateDTO)
        {
            try
            {
                var comunidadCreada = await _comunidadService.AddAsync(comunidadCreateDTO);

                return Created(string.Empty, new ApiResponse<ComunidadResponseDto>
                {
                    Success = true,
                    Message = "Comunidad creada exitosamente",
                    Data = comunidadCreada
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new ApiResponse<ComunidadResponseDto>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = default
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new ApiResponse<ComunidadResponseDto>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = default
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<ComunidadResponseDto>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = default
                });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador, Usuario")]
        public async Task<ActionResult<ApiResponse<ComunidadResponseDto>>> UpdateComunidad(long id,
            [FromForm] ComunidadUpdateDto comunidadDto)
        {
            try
            {
                var comunidadActualizada = await _comunidadService.UpdateAsync(id, comunidadDto);
                
                return Ok(new ApiResponse<ComunidadResponseDto>
                {
                    Success = true,
                    Message = "Comunidad actualizada exitosamente",
                    Data = comunidadActualizada
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<ComunidadResponseDto>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = default
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<ComunidadResponseDto>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = default
                });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteComunidad(long id)
        {
            var comunidadAeliminar = await _comunidadService.GetByIdAsync(id);
            if (comunidadAeliminar == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Comunidad no encontrada",
                    Data = default
                });
            }
            
            try
            {
                await _comunidadService.DeleteAsync(comunidadAeliminar);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Comunidad eliminada exitosamente",
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
    }
}
