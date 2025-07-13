using api.DTOs;
using api.DTOs.Reports;
using api.DTOs.Seguimientos;
using api.DTOs.Usuario;
using api.Models;
using api.Repositories;
using System.Security.Cryptography;
using System.Text;

namespace api.Services.Seguimiento;

public class SeguimientoReporteService
{
    private readonly IRepository<SeguimientoReporte> _seguimientoRepository;
    private readonly IRepository<api.Models.Report> _reportRepository;


    public SeguimientoReporteService(IRepository<SeguimientoReporte> seguimientoRepository,
            IRepository<api.Models.Report> reportRepository)
    {
        _seguimientoRepository = seguimientoRepository;
        _reportRepository = reportRepository;
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

    /*public async Task<IEnumerable<SeguimientoReporte>> GetByReporteIdAsync(long reporteId)
    {
        if (_seguimientoRepository is SeguimientoRepository repo)
            return await repo.GetByReporteIdAsync(reporteId);
        throw new NotSupportedException("Repositorio no soporta esta operación");
    }*/

    public async Task<IEnumerable<AuditoriaSeguimientoResponse>> GetAllMappedAsync()
    {
        var repo = _reportRepository as ReportRepository;
        if (repo == null) return [];

        var reports = await repo.FindWithIncludesAsync(r => true,
            r => r.Autor,
            r => r.Fotos,
            r => r.Tags,
            r => r.Comunidad);


        return reports.Select(MapToDto).ToList();
    }


    public async Task<AuditoriaSeguimientoResponse> GetByIdMappedAsync(long id)
    {
        var repo = _reportRepository as ReportRepository;
        if (repo == null) return null;

        var report = await repo.GetByIdWithIncludesAsync(id,
            r => r.Autor,
            r => r.Fotos,
            r => r.Tags,
            r => r.Comunidad);

        return report == null ? null : MapToDto(report);
    }
    public static AuditoriaSeguimientoResponse MapToDto(Report report)
    {
        var autor = report.Autor;
        var esAnonimo = report.Anonimo;

        string? inicial = null;
        if (!esAnonimo && autor != null && string.IsNullOrWhiteSpace(autor.FotoPerfil))
        {
            inicial = !string.IsNullOrEmpty(autor.NombreUsuario)
                ? autor.NombreUsuario.Substring(0, 1).ToUpper()
                : "?";
        }

        return new AuditoriaSeguimientoResponse
        {
            Id = report.Id,
            Titulo = report.Titulo,
            Contenido = report.Contenido,
            Anonimo = esAnonimo,
            Direccion = report.Direccion,
            Estado = report.Estado,
            CreateAt = report.CreateAt,
            UpdateAt = report.UpdateAt,

            Autor = esAnonimo ? new UsuarioResponseDto
            {
                NombreUsuario = "Anónimo",
                FotoPerfil = null
            }
            : autor == null ? null : new UsuarioResponseDto
            {
                Id = autor.Id,
                NombreUsuario = autor.NombreUsuario,
                Email = autor.Email,
                FotoPerfil = autor.FotoPerfil,
                FechaNacimiento = autor.FechaNacimiento,
                Genero = autor.Genero,
                EstadoCuenta = autor.EstadoCuenta,
                CreateAt = autor.CreateAt,
                UpdateAt = autor.UpdateAt
            },

            InicialNombre = inicial,

            Comunidad = report.Comunidad == null ? null : new ComunidadDto
            {
                Id = report.Comunidad.Id,
                Nombre = report.Comunidad.Nombre,
                Descripcion = report.Comunidad.Descripcion,
                Logo = report.Comunidad.Logo,
                Cover = report.Comunidad.Cover,
                Estado = report.Comunidad.Estado
            },

            Fotos = report.Fotos.Select(f => new FotoDto
            {
                Id = f.Id,
                Image = f.Image
            }).ToList(),

            Tags = report.Tags.Select(t => new TagDto
            {
                Id = t.Id,
                Nombre = t.Nombre
            }).ToList()
        };
    }

public async Task CambiarEstadoAsync(long reporteId, AuditoriaEstadoDto dto, Guid usuarioId)
{
    var reporte = await _reportRepository.GetByIdAsync(reporteId);
    if (reporte == null)
        throw new ArgumentException("Reporte no encontrado");

    // Mapea estados si es necesario, asegurándote que coincidan con los CHECK constraints
    string estadoAnteriorMapeado = MapEstadoSeguimiento(dto.EstadoAnterior);
    string estadoMapeado = MapEstadoSeguimiento(dto.Estado);

    var seguimiento = new SeguimientoReporte
    {
        ReporteId = reporteId,
        UsuarioId = usuarioId,
        EstadoAnterior = estadoAnteriorMapeado,
        Estado = estadoMapeado,
        Comentario = dto.Comentario ?? string.Empty,
        CreateAt = DateTime.UtcNow,
        UpdateAt = DateTime.UtcNow,
        AccionRealizada = "Cambio de estado",
        Prioridad = "Media",
        DocumentosAdjuntos = false
    };

    await _seguimientoRepository.AddAsync(seguimiento);

    // Actualizar estado del reporte
    reporte.Estado = dto.Estado;
    _reportRepository.Update(reporte);

    await _reportRepository.SaveChangesAsync();
    await _seguimientoRepository.SaveChangesAsync();
}

private string MapEstadoSeguimiento(string estado)
{
    // Mapear estados del dto a los permitidos en la tabla seguimiento_reportes
    // Ejemplo:
    return estado switch
    {
        "Pendiente_Moderacion" => "Pendiente de Revision",
        "Aprobado" => "Revisado",
        "En_Seguimiento" => "En Progreso",
        "En_Proceso" => "En Progreso",
        "Rechazado" => "Cancelado",
        "Resuelto" => "Resuelto",
        _ => throw new ArgumentException($"Estado inválido: {estado}")
    };
}








}