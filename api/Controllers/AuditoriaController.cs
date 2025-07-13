using api.Models;
using api.Services.Seguimiento;
using System.Security.Claims;
using api.DTOs.Seguimientos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using api.DTOs.Common;
using api.Repositories;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeguimientoReporteController : ControllerBase
{
    private readonly SeguimientoReporteService _seguimientoService;
     private readonly IRepository<Comunidade> _comunidadRepository;
    public SeguimientoReporteController(SeguimientoReporteService seguimientoService, IRepository<Comunidade> comunidadRepository)
    {
        _seguimientoService = seguimientoService;
        _comunidadRepository = comunidadRepository;
    }

    [HttpGet]
    //[Authorize]
    public async Task<IActionResult> GetAll()
    {
        var reports = await _seguimientoService.GetAllMappedAsync();

        return Ok(new
        {
            message = "Reportes obtenidos correctamente.",
            data = reports
        });

    }
    [HttpPost("restablecer/{reporteId}")]
[Authorize]
public async Task<IActionResult> RestablecerReporte(long reporteId)
{
    try
    {
        var usuarioIdStr = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(usuarioIdStr) || !Guid.TryParse(usuarioIdStr, out Guid usuarioId))
            return Unauthorized(new { error = "Usuario no autenticado." });

        // Creamos un DTO genérico para el seguimiento
        var dto = new AuditoriaEstadoDto
        {
            EstadoAnterior = "Eliminado", // opcional, no afecta si no se usa
            Estado = "Pendiente de Revision",
            Comentario = "Eliminado lógicamente. Restablecido a estado inicial."
        };

        await _seguimientoService.CambiarEstadoAsync(reporteId, dto, usuarioId);

        return Ok(new { message = "Reporte restablecido exitosamente." });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = ex.Message });
    }
}


[HttpPost("cambiar-estado/{reporteId}")]
[Authorize] // requiere usuario autenticado
public async Task<IActionResult> CambiarEstado(long reporteId, [FromBody] AuditoriaEstadoDto dto)
{
    try
    {
        // Obtén usuario actual desde claims
        var usuarioIdString = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(usuarioIdString) || !Guid.TryParse(usuarioIdString, out Guid usuarioId))
            return Unauthorized(new { error = "Usuario no autenticado." });

        await _seguimientoService.CambiarEstadoAsync(reporteId, dto, usuarioId);

        return Ok(new { message = "Estado actualizado correctamente." });
    }
    catch (Exception ex)
    {
        return BadRequest(new { error = ex.Message });
    }
}





    [HttpGet("{id}")]
    // [Authorize(Roles = "Administrador, Moderador")]
    public async Task<ActionResult<ApiResponse<SeguimientoReporteDto>>> GetById(long id)
    {
        var seguimiento = await _seguimientoService.GetByIdAsync(id);
        if (seguimiento == null)
            return NotFound(new ApiResponse<SeguimientoReporteDto>
            {
                Success = false,
                Message = "Seguimiento no encontrado",
                Data = default
            });

        var seguimientoDto = new SeguimientoReporteDto
        {
            Id = seguimiento.Id,
            EstadoAnterior = seguimiento.EstadoAnterior,
            Estado = seguimiento.Estado,
            Comentario = seguimiento.Comentario,
            AccionRealizada = seguimiento.AccionRealizada,
            Prioridad = seguimiento.Prioridad,
            CreateAt = seguimiento.CreateAt,
            UpdateAt = seguimiento.UpdateAt
        };

        return Ok(new ApiResponse<SeguimientoReporteDto>
        {
            Success = true,
            Message = "Seguimiento obtenido exitosamente",
            Data = seguimientoDto
        });
    }

    [HttpPost]
    // [Authorize(Roles = "Administrador, Moderador")]
    public async Task<ActionResult<ApiResponse<SeguimientoReporteDto>>> Create(SeguimientoReporteCreateDto seguimientoCreateDto)
    {
        try
        {
            // Verificar si el reporte existe (necesitarías inyectar el servicio/repositorio de Reporte)
            // var reporteExiste = await _reporteService.ExistsAsync(seguimientoCreateDto.ReporteId);
            // if (!reporteExiste)
            //     return BadRequest(new ApiResponse<SeguimientoReporteDto>
            //     {
            //         Success = false,
            //         Message = "El reporte especificado no existe",
            //         Data = default
            //     });

            var seguimiento = new SeguimientoReporte
            {
                UsuarioId = seguimientoCreateDto.UsuarioId, // Asignar el UsuarioId
                ReporteId = seguimientoCreateDto.ReporteId, // Asignar el ReporteId
                EstadoAnterior = seguimientoCreateDto.EstadoAnterior,
                Estado = seguimientoCreateDto.Estado,
                Comentario = seguimientoCreateDto.Comentario,
                AccionRealizada = seguimientoCreateDto.AccionRealizada,
                Prioridad = seguimientoCreateDto.Prioridad,
                CreateAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow
            };

            await _seguimientoService.AddAsync(seguimiento);

            // Crear el DTO de respuesta
            var seguimientoDto = new SeguimientoReporteDto
            {
                Id = seguimiento.Id,
                ReporteId = seguimiento.ReporteId,
                EstadoAnterior = seguimiento.EstadoAnterior,
                Estado = seguimiento.Estado,
                Comentario = seguimiento.Comentario,
                AccionRealizada = seguimiento.AccionRealizada,
                Prioridad = seguimiento.Prioridad,
                CreateAt = seguimiento.CreateAt,
                UpdateAt = seguimiento.UpdateAt
            };

            return CreatedAtAction(nameof(GetById), new { id = seguimiento.Id }, new ApiResponse<SeguimientoReporteDto>
            {
                Success = true,
                Message = "Seguimiento creado exitosamente",
                Data = seguimientoDto
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<SeguimientoReporteDto>
            {
                Success = false,
                Message = $"Error al crear el seguimiento: {ex.Message}",
                Data = default
            });
        }
    }

    [HttpPut("{id}")]
    // [Authorize(Roles = "Administrador, Moderador")]
    public async Task<ActionResult<ApiResponse<SeguimientoReporteDto>>> Update(long id, SeguimientoReporteDto seguimientoDto)
    {
        try
        {
            var seguimientoExistente = await _seguimientoService.GetByIdAsync(id);
            if (seguimientoExistente == null)
                return NotFound(new ApiResponse<SeguimientoReporteDto>
                {
                    Success = false,
                    Message = "Seguimiento no encontrado",
                    Data = default
                });

            // Actualizar propiedades
            seguimientoExistente.EstadoAnterior = seguimientoDto.EstadoAnterior;
            seguimientoExistente.Estado = seguimientoDto.Estado;
            seguimientoExistente.Comentario = seguimientoDto.Comentario;
            seguimientoExistente.AccionRealizada = seguimientoDto.AccionRealizada;
            seguimientoExistente.Prioridad = seguimientoDto.Prioridad;
            seguimientoExistente.UpdateAt = DateTime.UtcNow;

            await _seguimientoService.UpdateAsync(seguimientoExistente);

            // Actualizar el DTO para la respuesta
            seguimientoDto.Id = seguimientoExistente.Id;
            seguimientoDto.CreateAt = seguimientoExistente.CreateAt;
            seguimientoDto.UpdateAt = seguimientoExistente.UpdateAt;

            return Ok(new ApiResponse<SeguimientoReporteDto>
            {
                Success = true,
                Message = "Seguimiento actualizado exitosamente",
                Data = seguimientoDto
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<SeguimientoReporteDto>
            {
                Success = false,
                Message = $"Error al actualizar el seguimiento: {ex.Message}",
                Data = default
            });
        }
    }
       [HttpGet("comunidades")]
    public async Task<IActionResult> GetComunidadesParaReportes()
    {
        var comunidades = await _comunidadRepository.GetAllAsync();

        var resultado = comunidades
            .Where(c => c.DeletedAt == null)
            .Select(c => new
            {
                c.Id,
                c.Nombre
            });

        return Ok(resultado);
    }
    [HttpDelete("{id}")]
    // [Authorize(Roles = "Administrador")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(long id)
    {
        try
        {
            var seguimiento = await _seguimientoService.GetByIdAsync(id);
            if (seguimiento == null)
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Seguimiento no encontrado",
                    Data = default
                });

            await _seguimientoService.DeleteAsync(seguimiento);

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Seguimiento eliminado exitosamente",
                Data = default
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Message = $"Error al eliminar el seguimiento: {ex.Message}",
                Data = default
            });
        }
    }

   // [HttpPut("Reportes")]
    // [Authorize
    /*public async Task<IActionResult> EditarReport([FromBody] AuditoriaEstadoDto dto)
    {
        return "fsfs";
    }*/
}