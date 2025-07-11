using api.DTOs.Actividade;
using api.Models;
using api.Repositories;

namespace api.Services;

public class ActividadeService
{
    private readonly ActividadeRepository _repository;

    public ActividadeService(ActividadeRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ActividadeDto>> GetAllAsync()
    {
        var actividades = await _repository.GetAllAsync();
        return actividades.Select(a => MapToDto(a)).ToList();
    }

    public async Task<ActividadeDto?> GetByIdAsync(long id)
    {
        var actividad = await _repository.GetByIdAsync(id);
        return actividad == null ? null : MapToDto(actividad);
    }

    public async Task<ActividadeDto> CreateAsync(ActividadeDto dto)
    {
        if (dto.FechaInicio > dto.FechaFin)
            throw new ArgumentException("La fecha de inicio no puede ser mayor que la fecha de fin.");

        var actividad = MapToEntity(dto);
        actividad.CreateAt = DateTime.UtcNow;
        actividad.UpdateAt = DateTime.UtcNow;

        var created = await _repository.AddAsync(actividad);
        return MapToDto(created);
    }

    public async Task<bool> UpdateAsync(long id, ActividadeDto dto)
    {
        if (id != dto.Id) return false;
        if (dto.FechaInicio > dto.FechaFin)
            throw new ArgumentException("La fecha de inicio no puede ser mayor que la fecha de fin.");

        var actividad = MapToEntity(dto);
        actividad.UpdateAt = DateTime.UtcNow;

        return await _repository.UpdateAsync(actividad);
    }

    public async Task<bool> DeleteAsync(long id)
    {
        return await _repository.DeleteAsync(id);
    }

    private ActividadeDto MapToDto(Actividade a) => new()
    {
        Id = a.Id,
        Nombre = a.Nombre,
        Descripcion = a.Descripcion,
        FechaInicio = a.FechaInicio.ToDateTime(new TimeOnly(0, 0)),
        FechaFin = a.FechaFin.ToDateTime(new TimeOnly(0, 0)),
        Ubicacion = a.Ubicacion,
        Virtual = a.Virtual,
        Frecuencia = a.Frecuencia,
        Cover = a.Cover,
        Fecha = a.Fecha,
        CreateAt = a.CreateAt,
        UpdateAt = a.UpdateAt
    };

    private Actividade MapToEntity(ActividadeDto dto) => new()
    {
        Id = dto.Id,
        Nombre = dto.Nombre,
        Descripcion = dto.Descripcion,
        FechaInicio = DateOnly.FromDateTime(dto.FechaInicio),
        FechaFin = DateOnly.FromDateTime(dto.FechaFin),
        Ubicacion = dto.Ubicacion,
        Virtual = dto.Virtual,
        Frecuencia = dto.Frecuencia,
        Cover = dto.Cover,
        Fecha = dto.Fecha,
        CreateAt = dto.CreateAt,
        UpdateAt = dto.UpdateAt
    };
}
