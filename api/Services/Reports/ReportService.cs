using api.DTOs;
using api.DTOs.Reports;
using api.DTOs.Usuario;
using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;


namespace api.Services;

public class ReportService
{
    private readonly IRepository<api.Models.Report> _reportRepository;
    private readonly IRepository<api.Models.Usuario> _usuarioRepository;
    private readonly IRepository<api.Models.Foto> _fotoRepository;
    private readonly IRepository<Tag> _tagRepository;


    private readonly IHttpContextAccessor _httpContextAccessor;

    public ReportService(
    IRepository<api.Models.Report> reportRepository,
    IRepository<api.Models.Usuario> usuarioRepository,
    IRepository<api.Models.Foto> fotoRepository,
    IRepository<Tag> tagRepository,
    IHttpContextAccessor httpContextAccessor)
    {
        _reportRepository = reportRepository;
        _usuarioRepository = usuarioRepository;
        _fotoRepository = fotoRepository;
        _tagRepository = tagRepository;
        _httpContextAccessor = httpContextAccessor;
    }
    private Guid GetCurrentUserId()
    {
        var userId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException("No se pudo obtener el ID del usuario desde el token.");

        return Guid.Parse(userId);
    }

    public async Task<Report?> GetByIdAsync(long id)
    {
        return await _reportRepository.GetByIdAsync(id);
    }



    public async Task<IEnumerable<ReportResponseDto>> GetAllMappedAsync()
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


    public async Task<ReportResponseDto?> GetByIdMappedAsync(long id)
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

    public async Task<bool> CanEditReportAsync(Report report)
    {
        var currentUserId = GetCurrentUserId();
        if (report.AutorId == currentUserId) return true;

        var usuarioRepo = _usuarioRepository as UsuarioRepository;
        if (usuarioRepo == null)
            throw new InvalidOperationException("El repositorio de usuario no es UsuarioRepository.");

        var usuario = await usuarioRepo.GetByIdWithRelationshipsAsync(currentUserId);
        var roles = usuario?.UsuariosRoles.Select(ur => ur.IdRolNavigation.Nombre).ToList();

        return roles != null && (roles.Contains("Administrador") || roles.Contains("Join"));
    }


    public async Task<bool> UpdateReportAsync(long id, ReportDto updatedDto)
    {
        var report = await _reportRepository.GetByIdAsync(id);
        if (report == null) return false;

        if (!await CanEditReportAsync(report))
            throw new UnauthorizedAccessException("No tienes permisos para editar este reporte.");

        report.Titulo = updatedDto.Titulo;
        report.Contenido = updatedDto.Contenido;
        report.Estado = updatedDto.Estado;
        report.Direccion = updatedDto.Direccion;
        report.UpdateAt = DateTime.UtcNow;

        _reportRepository.Update(report);
        await _reportRepository.SaveChangesAsync();

        return true;
    }

    public async Task<long> CreateReportAsync(ReportCreateDto dto)
    {
        var currentUserId = GetCurrentUserId();

        var report = new Report
        {
            Titulo = dto.titulo,
            Contenido = dto.contenido,
            Anonimo = dto.anonimo,
            Estado = "Pendiente_Moderacion",
            Direccion = dto.Direccion,
            AutorId = currentUserId,
            ComunidadId = dto.ComunidadId,
            CreateAt = DateTime.UtcNow,
            UpdateAt = DateTime.UtcNow
        };


        // Agrega tags

        if (dto.Tags != null && dto.Tags.Any())
        {
            foreach (var tagNombre in dto.Tags)
            {
                var tagNombreNormalized = tagNombre.Trim().ToLower();
                var existingTag = (await _tagRepository.FindAsync(t => t.Nombre.ToLower() == tagNombreNormalized)).FirstOrDefault();

                Tag tagEntity;
                if (existingTag != null)
                {
                    tagEntity = existingTag;
                }
                else
                {
                    tagEntity = new Tag { Id = Guid.NewGuid(), Nombre = tagNombreNormalized };
                    await _tagRepository.AddAsync(tagEntity);
                }
                report.Tags.Add(tagEntity);
            }
        }

        await _reportRepository.AddAsync(report);
        await _reportRepository.SaveChangesAsync();

        // Crea fotos
        if (dto.FotosUrls != null && dto.FotosUrls.Any())
        {
            foreach (var url in dto.FotosUrls)
            {
                var foto = new Foto
                {
                    Image = url,
                    ReportsId = report.Id
                };
                await _fotoRepository.AddAsync(foto);
            }
            await _fotoRepository.SaveChangesAsync();
        }

        return report.Id;
    }


    public async Task<bool> DeleteReportAsync(long id)
    {
        var report = await _reportRepository.GetByIdAsync(id);
        if (report == null) return false;

        if (!await CanEditReportAsync(report))
            throw new UnauthorizedAccessException("No tienes permisos para eliminar este reporte.");


        // Obtiene fotos relacionadas

        var fotosRelacionadas = await _fotoRepository.FindAsync(f => f.ReportsId == id);

        foreach (var foto in fotosRelacionadas)
        {
            _fotoRepository.Delete(foto);
        }
        await _fotoRepository.SaveChangesAsync();


        // Elimina el reporte
        _reportRepository.Delete(report);
        await _reportRepository.SaveChangesAsync();

        return true;
    }

    public static ReportResponseDto MapToDto(Report report)
    {
        var autor = report.Autor;
        var esAnonimo = report.Anonimo;

        string? inicial = null;

        if (!esAnonimo && autor != null)
        {
            if (string.IsNullOrWhiteSpace(autor.FotoPerfil))
            {

                if (!string.IsNullOrEmpty(autor.NombreUsuario))
                    inicial = autor.NombreUsuario.Substring(0, 1).ToUpper();
                else
                    inicial = "?";
            }
        }

        return new ReportResponseDto
        {
            Id = report.Id,
            Titulo = report.Titulo,
            Contenido = report.Contenido,
            Anonimo = esAnonimo,
            Direccion = report.Direccion,
            Estado = report.Estado,
            CreateAt = report.CreateAt,
            UpdateAt = report.UpdateAt,

            Autor = esAnonimo
                ? new UsuarioResponseDto
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

                ComunidadNombre = report.Comunidad?.Nombre,

            InicialNombre = inicial,

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

    public async Task EditarAsync(long id, ReportEditDto dto)
    {
        var report = await _reportRepository.GetByIdWithIncludesAsync(id,
            r => r.Tags,
            r => r.Fotos,

            r => r.Autor,
            r => r.Comunidad);


        if (report == null)
            throw new Exception("Reporte no encontrado.");


        var userId = GetCurrentUserId();


        if (report.AutorId != userId && !await UserIsAdminOrJoinAsync(userId))
            throw new UnauthorizedAccessException("No tienes permiso para editar este reporte.");

        // Actualiza
        report.Titulo = dto.Titulo;
        report.Contenido = dto.Contenido;
        report.Direccion = dto.Direccion;
        report.ComunidadId = dto.ComunidadId;

        // Limpia tags
        report.Tags.Clear();

        // Añade nuevos tags
        foreach (var tagName in dto.Tags.Distinct())
        {
            var existingTags = await _tagRepository.FindAsync(t => t.Nombre.ToLower() == tagName.ToLower());
            var existingTag = existingTags.FirstOrDefault();

            if (existingTag != null)
            {
                report.Tags.Add(existingTag);
            }
            else
            {
                var newTag = new Tag { Id = Guid.NewGuid(), Nombre = tagName };
                await _tagRepository.AddAsync(newTag);
                report.Tags.Add(newTag);
            }
        }

        _reportRepository.Update(report);
        await _reportRepository.SaveChangesAsync();
    }

    private async Task<bool> UserIsAdminOrJoinAsync(Guid userId)
    {
        var usuario = await _usuarioRepository.GetByIdWithIncludesAsync(userId,
            u => u.UsuariosRoles,
            u => u.UsuariosRoles.Select(ur => ur.IdRolNavigation));

        var roles = usuario?.UsuariosRoles.Select(ur => ur.IdRolNavigation.Nombre).ToList();

        return roles != null && (roles.Contains("Administrador") || roles.Contains("Join"));
    }

    public async Task<IEnumerable<ReportResponseDto>> GetByTagAsync(string tagNombre)
    {
        var repo = _reportRepository as ReportRepository;
        if (repo == null) return Enumerable.Empty<ReportResponseDto>();

        string tagNombreNormalized = tagNombre.Trim().ToLower();

        // Obtener reportes que tienen un tag con ese nombre
        var reports = await repo.FindWithIncludesAsync(
            r => r.Tags.Any(t => t.Nombre.ToLower() == tagNombreNormalized),
            r => r.Autor,
            r => r.Fotos,
            r => r.Tags,
            r => r.Comunidad);


        return reports.Select(MapToDto).ToList();
    }



}
