using api.Models;
using api.Repositories;
using System.Security.Cryptography;
using System.Text;

namespace api.Services.Seguimiento;

public class SeguimientoReporteService
{
    private readonly IRepository<SeguimientoReporte> _seguimientoRepository;

    public SeguimientoReporteService(IRepository<SeguimientoReporte> seguimientoRepository)
    {
        _seguimientoRepository = seguimientoRepository;
    }

    public async Task<IEnumerable<SeguimientoReporte>> ObtenerTodosAsync()
    {
        return await _seguimientoRepository.GetAllAsync();
    }    // ...existing code...
    public async Task<IEnumerable<SeguimientoReporte>> GetAllAsync() => await _seguimientoRepository.GetAllAsync();
    public async Task<SeguimientoReporte?> GetByIdAsync(object id) => await _seguimientoRepository.GetByIdAsync(id);
    public async Task AddAsync(SeguimientoReporte reporte)
    {
        await _seguimientoRepository.AddAsync(reporte);
        await _seguimientoRepository.SaveChangesAsync();
    }
    public async Task UpdateAsync(SeguimientoReporte reporte)
    {
        _seguimientoRepository.Update(reporte);
        await _seguimientoRepository.SaveChangesAsync();
    }
    public async Task DeleteAsync(SeguimientoReporte reporte)
    {
        _seguimientoRepository.Delete(reporte);
        await _seguimientoRepository.SaveChangesAsync();
    }
    // ...existing code...

    public async Task<SeguimientoReporte?> ObtenerPorIdAsync(object id)
    {
        return await _seguimientoRepository.GetByIdAsync(id);
    }

    public async Task CrearAsync(SeguimientoReporte reporte)
    {
        await _seguimientoRepository.AddAsync(reporte);
        await _seguimientoRepository.SaveChangesAsync();
    }

    public async Task ActualizarAsync(SeguimientoReporte reporte)
    {
        _seguimientoRepository.Update(reporte);
        await _seguimientoRepository.SaveChangesAsync();
    }

    public async Task EliminarAsync(SeguimientoReporte reporte)
    {
        _seguimientoRepository.Delete(reporte);
        await _seguimientoRepository.SaveChangesAsync();
    }

public async Task<IEnumerable<SeguimientoReporte>> GetByReporteIdAsync(long reporteId)
{
    if (_seguimientoRepository is SeguimientoRepository repo)
        return await repo.GetByReporteIdAsync(reporteId);
    throw new NotSupportedException("Repositorio no soporta esta operación");
}

}