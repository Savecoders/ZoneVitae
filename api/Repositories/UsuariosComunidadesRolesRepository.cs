using api.Contexts;
using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace api.Repositories
{
    public class UsuariosComunidadesRolesRepository(ZoneVitaeSqlContext _context) : IRepository<UsuariosComunidadesRole>
    {
        public async Task<IEnumerable<UsuariosComunidadesRole>> GetAllAsync()
        {
            return await _context.UsuariosComunidadesRoles.ToListAsync();
        }

        public async Task<UsuariosComunidadesRole?> GetByIdAsync(object id)
        {
            return null;
        }

        public async Task<IEnumerable<UsuariosComunidadesRole>> FindAsync(Expression<Func<UsuariosComunidadesRole, bool>> predicate)
        {
            return await _context.UsuariosComunidadesRoles.Where(predicate).ToListAsync();
        }

        public async Task<IEnumerable<UsuariosComunidadesRole>> FindWithIncludesAsync(
            Expression<Func<UsuariosComunidadesRole, bool>> predicate,
            params Expression<Func<UsuariosComunidadesRole, object>>[] includes)
        {
            IQueryable<UsuariosComunidadesRole> query = _context.UsuariosComunidadesRoles.Where(predicate);
            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return await query.ToListAsync();
        }

        public async Task<UsuariosComunidadesRole?> GetByIdWithIncludesAsync(object id, params Expression<Func<UsuariosComunidadesRole, object>>[] includes)
        {
            return null;
        }

        public async Task AddAsync(UsuariosComunidadesRole entity)
        {
            await _context.UsuariosComunidadesRoles.AddAsync(entity);
        }

        public void Update(UsuariosComunidadesRole entity)
        {
            _context.UsuariosComunidadesRoles.Update(entity);
        }

        public void Delete(UsuariosComunidadesRole entity)
        {
            _context.UsuariosComunidadesRoles.Remove(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
