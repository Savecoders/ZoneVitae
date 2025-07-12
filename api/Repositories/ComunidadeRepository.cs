using api.Contexts;
using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace api.Repositories
{
    public class ComunidadeRepository(ZoneVitaeSqlContext _context) : IRepository<Comunidad>
    {
        public async Task<IEnumerable<Comunidad>> GetAllAsync()
        {
            return await _context.Comunidades
                .Include(c => c.Tags)
                .ToListAsync();
        }
           
        public async Task<Comunidad?> GetByIdAsync(object id)
        {
            return await _context.Comunidades
                 .Include(c => c.Tags)
                 .FirstOrDefaultAsync(c => c.Id == (long)id); 
        }

        public async Task<IEnumerable<Comunidad>> FindAsync(Expression<Func<Comunidad, bool>> predicate)
        {
            return await _context.Comunidades
               .Include(c => c.Tags)
               .Where(predicate)
               .ToListAsync();
        }

        public async Task<IEnumerable<Comunidad>> FindWithIncludesAsync(Expression<Func<Comunidad, bool>> predicate, params Expression<Func<Comunidad, object>>[] includes)
        {
            IQueryable<Comunidad> query = _context.Comunidades;

            try
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
                return await query.Where(predicate).ToListAsync();
            }
            catch (InvalidOperationException)
            {
                return await _context.Comunidades
                    .Include(c => c.Tags)
                    .Where(predicate)
                    .ToListAsync();
            }
        }

        public async Task<Comunidad?> GetByIdWithIncludesAsync(object id, params Expression<Func<Comunidad, object>>[] includes)
        {
            IQueryable<Comunidad> query = _context.Comunidades;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            return await query.FirstOrDefaultAsync(c => c.Id == (long)id);
        }

        public async Task AddAsync(Comunidad entity)
        {
            await _context.Comunidades.AddAsync(entity);
        }

        public void Update(Comunidad entity)
        {
            _context.Comunidades.Update(entity);
        }

        public void Delete(Comunidad entity)
        {
            _context.Comunidades.Remove(entity);
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
