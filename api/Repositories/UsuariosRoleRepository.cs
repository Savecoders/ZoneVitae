using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Repositories
{
    public class UsuariosRoleRepository(ZoneVitaeSqlContext context) : IRepository<UsuariosRole>
    {
        public async Task<IEnumerable<UsuariosRole>> GetAllAsync() => await context.UsuariosRoles.ToListAsync();
        public async Task<UsuariosRole?> GetByIdAsync(object id) => await context.UsuariosRoles.FindAsync(id);
        public async Task AddAsync(UsuariosRole entity) => await context.UsuariosRoles.AddAsync(entity);
        public void Update(UsuariosRole entity) => context.UsuariosRoles.Update(entity);
        public void Delete(UsuariosRole entity) => context.UsuariosRoles.Remove(entity);
        public async Task SaveChangesAsync() => await context.SaveChangesAsync();
    }
}
