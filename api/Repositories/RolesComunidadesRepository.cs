using api.Contexts;
using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace api.Repositories
{
    public class RolesComunidadesRepository(ZoneVitaeSqlContext _context) : IRepository<RolesComunidade>
    {
        public async Task<IEnumerable<RolesComunidade>> GetAllAsync()
        {
            return await _context.RolesComunidades.ToListAsync();
        }

        public async Task<RolesComunidade?> GetByIdAsync(object id)
        {
            return await _context.RolesComunidades.FindAsync(id);
        }

        public async Task<IEnumerable<RolesComunidade>> FindAsync(Expression<Func<RolesComunidade, bool>> predicate)
        {
            return await _context.RolesComunidades.Where(predicate).ToListAsync();
        }

        public async Task<IEnumerable<RolesComunidade>> FindWithIncludesAsync(
            Expression<Func<RolesComunidade, bool>> predicate,
            params Expression<Func<RolesComunidade, object>>[] includes)
        {
            IQueryable<RolesComunidade> query = _context.RolesComunidades.Where(predicate);
            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return await query.ToListAsync();
        }

        public async Task<RolesComunidade?> GetByIdWithIncludesAsync(object id, params Expression<Func<RolesComunidade, object>>[] includes)
        {
            IQueryable<RolesComunidade> query = _context.RolesComunidades;

            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return await query.FirstOrDefaultAsync(r => r.Id == (long)id);
        }

        public async Task AddAsync(RolesComunidade entity)
        {
            await _context.RolesComunidades.AddAsync(entity);
        }

        public void Update(RolesComunidade entity)
        {
            _context.RolesComunidades.Update(entity);
        }

        public void Delete(RolesComunidade entity)
        {
            _context.RolesComunidades.Remove(entity);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
