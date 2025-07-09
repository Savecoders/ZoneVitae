using api.Models;
using api.Services.Seguimiento;
using api.DTOs.Seguimientos;
using api.DTOs.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SeguimientoReporteController(SeguimientoReporteService seguimientoService) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Administrador, Moderador, Auditor")]
    public async Task<ActionResult<ApiResponse<IEnumerable<SeguimientoReporteDto>>>> GetAll()
    {
        var seguimientos = await seguimientoService.GetAllAsync();
        var seguimientosDto = seguimientos.Select(s => new SeguimientoReporteDto
        {
            Id = s.Id,
            EstadoAnterior = s.EstadoAnterior,
            Estado = s.Estado,
            Comentario = s.Comentario,
            AccionRealizada = s.AccionRealizada,
            Prioridad = s.Prioridad,
            CreateAt = s.CreateAt,
            UpdateAt = s.UpdateAt
        });

        return Ok(new ApiResponse<IEnumerable<SeguimientoReporteDto>>
        {
            Success = true,
            Message = "Seguimientos obtenidos exitosamente",
            Data = seguimientosDto
        });
    }

    [HttpGet("reporte/{reporteId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<SeguimientoReporteDto>>>> GetByReporteId(long reporteId)
    {
        var seguimientos = await seguimientoService.GetByReporteIdAsync(reporteId);
        var seguimientosDto = seguimientos.Select(s => new SeguimientoReporteDto
        {
            Id = s.Id,
            EstadoAnterior = s.EstadoAnterior,
            Estado = s.Estado,
            Comentario = s.Comentario,
            AccionRealizada = s.AccionRealizada,
            Prioridad = s.Prioridad,
            CreateAt = s.CreateAt,
            UpdateAt = s.UpdateAt
        });

        return Ok(new ApiResponse<IEnumerable<SeguimientoReporteDto>>
        {
            Success = true,
            Message = "Seguimientos del reporte obtenidos exitosamente",
            Data = seguimientosDto
        });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<SeguimientoReporteDto>>> GetById(long id)
    {
        var seguimiento = await seguimientoService.GetByIdAsync(id);
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
    public async Task<ActionResult<ApiResponse<SeguimientoReporteDto>>> Create(SeguimientoReporteDto seguimientoDto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                return BadRequest(new ApiResponse<SeguimientoReporteDto>
                {
                    Success = false,
                    Message = "Usuario no válido",
                    Data = default
                });
            }

            var seguimiento = new SeguimientoReporte
            {
                ReporteId = seguimientoDto.ReporteId,
                UsuarioId = userGuid,
                EstadoAnterior = seguimientoDto.EstadoAnterior,
                Estado = seguimientoDto.Estado,
                Comentario = seguimientoDto.Comentario,
                AccionRealizada = seguimientoDto.AccionRealizada,
                Prioridad = seguimientoDto.Prioridad,
                CreateAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow
            };

            await seguimientoService.AddAsync(seguimiento);

            // Actualizar el DTO con el ID generado
            seguimientoDto.Id = seguimiento.Id;
            seguimientoDto.CreateAt = seguimiento.CreateAt;
            seguimientoDto.UpdateAt = seguimiento.UpdateAt;

            return CreatedAtAction(nameof(GetById), new ApiResponse<SeguimientoReporteDto>
            {
                Success = true,
                Message = "Seguimiento creado exitosamente",
                Data = seguimientoDto
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ApiResponse<SeguimientoReporteDto>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<SeguimientoReporteDto>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Administrador, Moderador")]
    public async Task<ActionResult<ApiResponse<SeguimientoReporteDto>>> Update(
        long id,
        SeguimientoReporteDto seguimientoDto)
    {
        try
        {
            var currentSeguimiento = await seguimientoService.GetByIdAsync(id);
            if (currentSeguimiento == null)
                return NotFound(new ApiResponse<SeguimientoReporteDto>
                {
                    Success = false,
                    Message = "Seguimiento no encontrado",
                    Data = default
                });

            // Verificar que el usuario sea el dueño o tenga permisos
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentSeguimiento.UsuarioId.ToString() != userId && 
                !User.IsInRole("Administrador") && 
                !User.IsInRole("Moderador"))
            {
                return StatusCode(403, new ApiResponse<SeguimientoReporteDto>
                {
                    Success = false,
                    Message = "No tienes permisos para modificar este seguimiento",
                    Data = default
                });
            }

            currentSeguimiento.EstadoAnterior = seguimientoDto.EstadoAnterior;
            currentSeguimiento.Estado = seguimientoDto.Estado;
            currentSeguimiento.Comentario = seguimientoDto.Comentario;
            currentSeguimiento.AccionRealizada = seguimientoDto.AccionRealizada;
            currentSeguimiento.Prioridad = seguimientoDto.Prioridad;
            currentSeguimiento.UpdateAt = DateTime.UtcNow;

            await seguimientoService.UpdateAsync(currentSeguimiento);

            // Actualizar el DTO con los datos actualizados
            seguimientoDto.Id = currentSeguimiento.Id;
            seguimientoDto.CreateAt = currentSeguimiento.CreateAt;
            seguimientoDto.UpdateAt = currentSeguimiento.UpdateAt;

            return Ok(new ApiResponse<SeguimientoReporteDto>
            {
                Success = true,
                Message = "Seguimiento actualizado exitosamente",
                Data = seguimientoDto
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ApiResponse<SeguimientoReporteDto>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ApiResponse<SeguimientoReporteDto>
            {
                Success = false,
                Message = ex.Message,
                Data = default
            });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrador")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(long id)
    {
        var seguimiento = await seguimientoService.GetByIdAsync(id);
        if (seguimiento == null)
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Message = "Seguimiento no encontrado",
                Data = default
            });

        try
        {
            await seguimientoService.DeleteAsync(seguimiento);
            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Seguimiento eliminado exitosamente",
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
    }
}