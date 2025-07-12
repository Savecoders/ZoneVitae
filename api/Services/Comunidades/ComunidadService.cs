using api.DTOs;
using api.DTOs.Comunidad;

using api.Models;
using api.Repositories;
using api.Services.Cloudinary;
using System.Linq.Expressions;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace api.Services.Comunidades
{
    public class ComunidadService 
    {
        private readonly IRepository<Comunidade> _comunidadRepository;
        private readonly CloudinaryService _cloudinaryService;
        private readonly IRepository<Tag> _tagRepository;
        private readonly IRepository<RolesComunidade> _rolesComunidadesRepository;
        private readonly IRepository<UsuariosComunidadesRole> _usuariosComunidadesRolesRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

    public ComunidadService(
        IRepository<Comunidade> comunidadRepository,
        CloudinaryService cloudinaryService,
        IRepository<Tag> tagRepository,
        IRepository<RolesComunidade> rolesComunidadesRepository,
        IRepository<UsuariosComunidadesRole> usuariosComunidadesRolesRepository,
        IHttpContextAccessor httpContextAccessor
    )
    {
        _comunidadRepository = comunidadRepository;
        _cloudinaryService = cloudinaryService;
        _tagRepository = tagRepository;
        _rolesComunidadesRepository = rolesComunidadesRepository;
        _usuariosComunidadesRolesRepository = usuariosComunidadesRolesRepository;
        _httpContextAccessor = httpContextAccessor;
    }

        public Task<IEnumerable<Comunidade>> GetAllAsync() => _comunidadRepository.GetAllAsync();

        public Task<Comunidade?> GetByIdAsync(long id) => _comunidadRepository.GetByIdAsync(id);

        public async Task<IEnumerable<Comunidade>> SearchComunidadesAsync(string? nombre)
        {
            return await _comunidadRepository.FindAsync(c =>
            c.Nombre.ToLower().Contains(nombre.ToLower()));
        }

        public async Task<Comunidade?> GetByNameAsync(string name) =>
        (await _comunidadRepository.FindAsync(c => c.Nombre.ToLower() == name.ToLower())).FirstOrDefault();

        public async Task<Comunidade?> GetByIdWithRelationshipsAsync(object id)
        {
            if (_comunidadRepository is api.Repositories.ComunidadeRepository comunidadRepo)
            {
                return await comunidadRepo.GetByIdWithIncludesAsync(id,
                    c => c.Tags,
                    c => c.Creador,
                    c => c.UsuariosComunidadesRoles);
            }
            return await _comunidadRepository.GetByIdAsync(id);
        }

        public async Task <ComunidadResponseDto> AddAsync(ComunidadCreateDto comunidadDto)
        {
            string? logoUrl = null;
            if (comunidadDto.Logo != null)
            {
                var uploadResult = await _cloudinaryService.UploadImageAsync(comunidadDto.Logo);
                logoUrl = uploadResult?.SecureUrl?.ToString();
            }

            string? coverUrl = null;
            if (comunidadDto.Cover != null)
            {
                var uploadResult = await _cloudinaryService.UploadImageAsync(comunidadDto.Cover);
                coverUrl = uploadResult?.SecureUrl?.ToString();
            }

            var existingTags = await _tagRepository.GetAllAsync();
            var tagsAsociados = existingTags
                .Where(t => comunidadDto.Tags.Contains(t.Id))
                .ToList();

            var user = _httpContextAccessor.HttpContext?.User;
            var userIdString = user?.FindFirst("sub")?.Value ?? user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdString == null)
            {
                throw new UnauthorizedAccessException("No se pudo determinar el usuario actual.");
            }
            
            Guid creadorId = Guid.Parse(userIdString);

            var comunidad = new Comunidade
            {
                Nombre = comunidadDto.Nombre,
                Descripcion = comunidadDto.Descripcion,
                Ubicacion = comunidadDto.Ubicacion,
                TipoComunidad = comunidadDto.TipoComunidad,
                SoloMayoresEdad = comunidadDto.SoloMayoresEdad,
                Estado = "Pendiente de Revision",
                CreateAt = DateTime.UtcNow,
                UpdateAt = DateTime.UtcNow,
                Logo = logoUrl,
                Cover = coverUrl,
                Tags = tagsAsociados,
                CreadorId = creadorId
            };

            await _comunidadRepository.AddAsync(comunidad);
            await _comunidadRepository.SaveChangesAsync();
            
            var rolAdmin = await _rolesComunidadesRepository
                 .FindAsync(r => r.Nombre == "Administrador");
            var rolAdminComunidad = rolAdmin.FirstOrDefault();

            if (rolAdminComunidad != null)
            {
                var usuarioRol = new UsuariosComunidadesRole
                {
                    UsuarioId = creadorId,
                    ComunidadId = comunidad.Id,
                    RolId = rolAdminComunidad.Id,
                    FechaAsignacion = DateTime.UtcNow
                };

                await _usuariosComunidadesRolesRepository.AddAsync(usuarioRol);
                await _usuariosComunidadesRolesRepository.SaveChangesAsync();
            }
            return new ComunidadResponseDto
            {
                Id = comunidad.Id,
                Nombre = comunidad.Nombre,
                Descripcion = comunidad.Descripcion,
                Logo = comunidad.Logo,
                Cover = comunidad.Cover,
                Ubicacion = comunidad.Ubicacion,
                TipoComunidad = comunidad.TipoComunidad,
                SoloMayoresEdad = comunidad.SoloMayoresEdad,
                Estado = comunidad.Estado,
                CreadorId = comunidad.CreadorId,
                Tags = comunidad.Tags.Select(t => new TagDto
                {
                    Id = t.Id,
                    Nombre = t.Nombre
                }).ToList()
            };
        }

        public async Task<IEnumerable<Comunidade>> GetByCreadorIdAsync(Guid creadorId)
        {
            return await _comunidadRepository.FindAsync(c => c.CreadorId == creadorId);
        }

        public async Task<ComunidadResponseDto> UpdateAsync(long id, ComunidadUpdateDto comunidadDto)
        {
            var comunidad = await _comunidadRepository.GetByIdAsync(id);
            if (comunidad == null) throw new KeyNotFoundException("Comunidad no encontrada");

            if (comunidadDto.Nombre != null)
            {
                comunidad.Nombre = comunidadDto.Nombre;
            }

            if (comunidadDto.Descripcion != null) 
            { 
                comunidad.Descripcion = comunidadDto.Descripcion;
            }

            if (comunidadDto.Logo != null)
            {
                var uploadResult = await _cloudinaryService.UploadImageAsync(comunidadDto.Logo);
                comunidad.Logo = uploadResult?.SecureUrl?.ToString();
            }

            if (comunidadDto.Cover != null)
            {
                var uploadResult = await _cloudinaryService.UploadImageAsync(comunidadDto.Cover);
                comunidad.Cover = uploadResult?.SecureUrl?.ToString();
            }

            var existingTags = await _tagRepository.GetAllAsync();
            var tagsAsociados = existingTags
                .Where(t => comunidadDto.Tags.Contains(t.Id))
                .ToList();

            if (comunidadDto.Ubicacion != null)
            {
                comunidad.Ubicacion = comunidadDto.Ubicacion;
            }

            if (comunidadDto.TipoComunidad != null)
            {
                comunidad.TipoComunidad = comunidadDto.TipoComunidad;
            }
            
            comunidad.SoloMayoresEdad = comunidadDto.SoloMayoresEdad ?? false;
            comunidad.Tags = tagsAsociados;
            if (comunidadDto.Estado != null)
            {
               comunidad.Estado = comunidadDto.Estado;
            }

            comunidad.UpdateAt = DateTime.UtcNow;

            _comunidadRepository.Update(comunidad);
            await _comunidadRepository.SaveChangesAsync();

            return new ComunidadResponseDto
            {
                Id = comunidad.Id,
                Nombre = comunidad.Nombre,
                Descripcion = comunidad.Descripcion,
                Logo = comunidad.Logo,
                Cover = comunidad.Cover,
                Ubicacion = comunidad.Ubicacion,
                TipoComunidad = comunidad.TipoComunidad,
                SoloMayoresEdad = comunidad.SoloMayoresEdad,
                Estado = comunidad.Estado,
                CreadorId = comunidad.CreadorId,
                Tags = comunidad.Tags.Select(t => new TagDto
                {
                    Id = t.Id,
                    Nombre = t.Nombre
                }).ToList()
            };
        }

        public async Task DeleteAsync(Comunidade comunidad)
        {
            comunidad.DeletedAt = DateTime.UtcNow;
            _comunidadRepository.Delete(comunidad);
            await _comunidadRepository.SaveChangesAsync();
        }
    }
}
