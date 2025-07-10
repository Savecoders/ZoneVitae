using api.DTOs.Actividade;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActividadesController : ControllerBase
{
    private readonly ActividadeService _service;

    public ActividadesController(ActividadeService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ActividadeDto>>> GetAll()
    {
        var actividades = await _service.GetAllAsync();
        return Ok(actividades);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ActividadeDto>> GetById(long id)
    {
        var actividad = await _service.GetByIdAsync(id);
        if (actividad == null) return NotFound();
        return Ok(actividad);
    }

    [HttpPost]
    public async Task<ActionResult<ActividadeDto>> Create(ActividadeDto dto)
    {
        try
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, ActividadeDto dto)
    {
        try
        {
            var updated = await _service.UpdateAsync(id, dto);
            if (!updated) return NotFound();
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
