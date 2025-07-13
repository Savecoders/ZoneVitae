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

    // Mapea para seguimiento (debe respetar CHECK constraint)
    string estadoAnteriorMapeado = MapEstadoParaSeguimiento(dto.EstadoAnterior);
    string estadoSeguimientoMapeado = MapEstadoParaSeguimiento(dto.Estado);

    // Mapea para tabla reports (valores internos)
    string estadoParaReport = MapEstadoParaBD(dto.Estado);

    var seguimiento = new SeguimientoReporte
    {
        ReporteId = reporteId,
        UsuarioId = usuarioId,
        EstadoAnterior = estadoAnteriorMapeado,
        Estado = estadoSeguimientoMapeado,
        Comentario = dto.Comentario ?? string.Empty,
        CreateAt = DateTime.UtcNow,
        UpdateAt = DateTime.UtcNow,
        AccionRealizada = "Cambio de estado",
        Prioridad = "Media",
        DocumentosAdjuntos = false
    };

    await _seguimientoRepository.AddAsync(seguimiento);

    reporte.Estado = estadoParaReport;
    _reportRepository.Update(reporte);

    await _reportRepository.SaveChangesAsync();
    await _seguimientoRepository.SaveChangesAsync();
}




// Mapear estado recibido del cliente (frontend) al valor válido en DB
private string MapEstadoParaBD(string estadoCliente)
{
    return estadoCliente switch
    {
        "Pendiente de Revision" => "Pendiente_Moderacion",
        "Aprobado" => "Aprobado",
        "Denegado" => "Rechazado",
        "Resuelto" => "Resuelto",
        "En Progreso" => "En_Seguimiento",  // Si usas este en frontend
        "En_Proceso" => "En_Proceso",       // Si es que usas este
        _ => throw new ArgumentException($"Estado inválido para la BD: {estadoCliente}")
    };
}

    // Mapear estado desde DB para enviar al cliente (opcional)
    private string MapEstadoParaCliente(string estadoBD)
    {
        return estadoBD switch
        {
            "Pendiente_Moderacion" => "Pendiente de Revision",
            "Aprobado" => "Aprobado",
            "Rechazado" => "Denegado",
            "Resuelto" => "Resuelto",
            "En_Seguimiento" => "En Progreso",
            "En_Proceso" => "En_Proceso",
            _ => estadoBD
        };
    }
private string MapEstadoParaSeguimiento(string estado)
{
    return estado switch
    {
        // Valores que vienen desde frontend o DTO
        "Pendiente de Revision" => "Pendiente de Revision",
        "Pendiente_Moderacion" => "Pendiente de Revision", // si llega así
        "Aprobado" => "Revisado",
        "Rechazado" => "Cancelado",      // si llega valor interno "Rechazado"
        "Denegado" => "Cancelado",       // si llega valor cliente "Denegado"
        "Resuelto" => "Resuelto",
        "En Progreso" => "En Progreso",
        "En_Seguimiento" => "En Progreso",  // si llega valor interno "En_Seguimiento"
        "En_Proceso" => "En Progreso",
        "Revisado" => "Revisado",
        "Cancelado" => "Cancelado",
        _ => throw new ArgumentException($"Estado inválido para seguimiento: {estado}")
    };
}






}