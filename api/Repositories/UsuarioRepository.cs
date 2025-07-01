using api.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Repositories
{
    public class UsuarioRepository(ZoneVitaeSqlContext context) : IRepository<Usuario>
    {
        public async Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return await context.Usuarios.ToListAsync();
        }

        public async Task<Usuario?> GetByIdAsync(object id)
        {
            return await context.Usuarios.FindAsync(id);
        }

        public async Task AddAsync(Usuario entity)
        {
            await context.Usuarios.AddAsync(entity);
        }

        public void Update(Usuario entity)
        {
            context.Usuarios.Update(entity);
        }

        public void Delete(Usuario entity)
        {
            context.Usuarios.Remove(entity);
        }

        public async Task SaveChangesAsync()
        {
            await context.SaveChangesAsync();
        }

        public async Task<Usuario?> GetByIdWithRelationshipsAsync(object id)
        {
            return await context.Usuarios
                .Include(u => u.Comentarios)
                .Include(u => u.Comunidades)
                .Include(u => u.ReportsNavigation)
                .Include(u => u.SeguimientoReportes)
                .Include(u => u.UsuariosComunidadesRoles)
                    .ThenInclude(ucr => ucr.Rol)
                .Include(u => u.UsuariosRoles)
                    .ThenInclude(ur => ur.IdRolNavigation)
                .Include(u => u.Comunidads)
                .Include(u => u.Reports)
                .FirstOrDefaultAsync(u => u.Id == (Guid)id);
        }
    }
}
