using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using api.Contexts;

namespace api.Repositories
{
    public class UsuariosRoleRepository(ZoneVitaeSqlContext context) : IRepository<UsuariosRole>
    {
        public async Task<IEnumerable<UsuariosRole>> GetAllAsync() => await context.UsuariosRoles.ToListAsync();
        public async Task<UsuariosRole?> GetByIdAsync(object id) => await context.UsuariosRoles.FindAsync(id);
        public Task<IEnumerable<UsuariosRole>> FindAsync(Expression<Func<UsuariosRole, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<UsuariosRole>> FindWithIncludesAsync(Expression<Func<UsuariosRole, bool>> predicate, params Expression<Func<UsuariosRole, object>>[] includes)
        {
            throw new NotImplementedException();
        }

        public Task<UsuariosRole?> GetByIdWithIncludesAsync(object id, params Expression<Func<UsuariosRole, object>>[] includes)
        {
            throw new NotImplementedException();
        }

        public async Task AddAsync(UsuariosRole entity) => await context.UsuariosRoles.AddAsync(entity);
        public void Update(UsuariosRole entity) => context.UsuariosRoles.Update(entity);
        public void Delete(UsuariosRole entity) => context.UsuariosRoles.Remove(entity);
        public async Task SaveChangesAsync() => await context.SaveChangesAsync();
    }
}
