using api.Models;
using api.Services.Seguimiento;
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
    // private readonly IRepository<Comunidade> _comunidadRepository;
    public SeguimientoReporteController(SeguimientoReporteService seguimientoService)
    {
        _seguimientoService = seguimientoService;
    }

    [HttpGet]
    // [Authorize(Roles = "Administrador, Moderador")]
    public async Task<ActionResult<ApiResponse<IEnumerable<SeguimientoReporteDto>>>> GetAll()
    {
        var seguimientos = await _seguimientoService.GetAllAsync();
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
    
    
}