using api.DTOs;
using api.DTOs.Reports;
using api.Models;
using api.Repositories;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly ReportService _reportService;
    private readonly IRepository<Comunidade> _comunidadRepository;

    public ReportsController(ReportService reportService, IRepository<Comunidade> comunidadRepository)
    {
        _reportService = reportService;
        _comunidadRepository = comunidadRepository;
    }


    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll()
    {
        var reports = await _reportService.GetAllMappedAsync();
        return Ok(reports);
    }

    [HttpGet("{id:long}")]
    [Authorize]
    public async Task<IActionResult> GetById(long id)
    {
        var report = await _reportService.GetByIdMappedAsync(id);
        return report == null ? NotFound() : Ok(report);
    }


    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] ReportCreateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var id = await _reportService.CreateReportAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:long}")]
    [Authorize]
    public async Task<IActionResult> EditarReporte(long id, [FromBody] ReportEditDto dto)
    {
        try
        {
            await _reportService.EditarAsync(id, dto);
            return Ok();     
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }

    [HttpDelete("{id:long}")]
    [Authorize]
    public async Task<IActionResult> Delete(long id)
    {
        try
        {
            var deleted = await _reportService.DeleteReportAsync(id);
            return deleted ? NoContent() : NotFound();
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    [HttpGet("filtrar-por-tag")]
    [Authorize]
    public async Task<IActionResult> FiltrarPorTag([FromQuery] string tag)
    {
        if (string.IsNullOrEmpty(tag))
            return BadRequest("El parámetro tag es obligatorio.");

        var reports = await _reportService.GetByTagAsync(tag);
        return Ok(reports);
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
}
