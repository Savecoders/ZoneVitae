using api.DTOs.Actividade;
using api.DTOs.ActividadeUpdate;
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
        Console.WriteLine($"Creating actividad: {actividad.FechaInicio} to {actividad.FechaFin}");
        actividad.CreateAt = DateTime.UtcNow;
        actividad.UpdateAt = DateTime.UtcNow;
        Console.WriteLine($"Creating actividad: {dto.FechaInicio} to {dto.FechaFin}");

        var created = await _repository.AddAsync(actividad);
        return MapToDto(created);
    }

    public async Task<bool> UpdateAsync(long id, ActividadeUpdateDto dto)
    {
        var existing = await _repository.GetByIdAsync(id);
        Console.WriteLine($"Service with ID {id}: {existing?.Nombre}");
        if (existing == null)
            throw new ArgumentException("Actividad no encontrada.");

        var actividad = MapToEntity(id, dto);
        actividad.CreateAt = existing.CreateAt; 
        actividad.UpdateAt = DateTime.UtcNow; 
        if (actividad.FechaInicio > actividad.FechaFin)
            throw new ArgumentException("La fecha de inicio no puede ser mayor que la fecha de fin.");
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
        FechaInicio = a.FechaInicio,
        FechaFin = a.FechaFin,
        Ubicacion = a.Ubicacion,
        Virtual = a.Virtual,
        Frecuencia = a.Frecuencia,
        Fecha = a.Fecha,
        CreateAt = a.CreateAt,
        UpdateAt = a.UpdateAt
    };

    private Actividade MapToEntity(ActividadeDto dto) => new()
    {
        Id = dto.Id,
        Nombre = dto.Nombre,
        Descripcion = dto.Descripcion,
        FechaInicio = dto.FechaInicio,
        FechaFin = dto.FechaFin,
        Ubicacion = dto.Ubicacion,
        Virtual = dto.Virtual,
        Frecuencia = dto.Frecuencia,
        Fecha = dto.Fecha,
        CreateAt = dto.CreateAt,
        UpdateAt = dto.UpdateAt
    };
    private Actividade MapToEntity(long id, ActividadeUpdateDto dto) => new()
    {
        Id = id,
        Nombre = dto.Nombre,
        Descripcion = dto.Descripcion,
        FechaInicio = dto.FechaInicio,
        FechaFin = dto.FechaFin,
        Ubicacion = dto.Ubicacion,
        Virtual = dto.Virtual,
        Frecuencia = dto.Frecuencia,

    };
}
