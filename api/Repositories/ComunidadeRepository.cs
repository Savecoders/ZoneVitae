using api.Contexts;
using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace api.Repositories
{
    public class ComunidadeRepository(ZoneVitaeSqlContext _context) : IRepository<Comunidade>
    {
        public async Task<IEnumerable<Comunidade>> GetAllAsync()
        {
            return await _context.Comunidades
                .Include(c => c.Tags)
                .ToListAsync();
        }
           
        public async Task<Comunidade?> GetByIdAsync(object id)
        {
            return await _context.Comunidades
                 .Include(c => c.Tags)
                 .FirstOrDefaultAsync(c => c.Id == (long)id); 
        }

        public async Task<IEnumerable<Comunidade>> FindAsync(Expression<Func<Comunidade, bool>> predicate)
        {
            return await _context.Comunidades
               .Include(c => c.Tags)
               .Where(predicate)
               .ToListAsync();
        }

        public async Task<IEnumerable<Comunidade>> FindWithIncludesAsync(Expression<Func<Comunidade, bool>> predicate, params Expression<Func<Comunidade, object>>[] includes)
        {
            IQueryable<Comunidade> query = _context.Comunidades;

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

        public async Task<Comunidade?> GetByIdWithIncludesAsync(object id, params Expression<Func<Comunidade, object>>[] includes)
        {
            IQueryable<Comunidade> query = _context.Comunidades;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            return await query.FirstOrDefaultAsync(c => c.Id == (long)id);
        }

        public async Task AddAsync(Comunidade entity)
        {
            await _context.Comunidades.AddAsync(entity);
        }

        public void Update(Comunidade entity)
        {
            _context.Comunidades.Update(entity);
        }

        public void Delete(Comunidade entity)
        {
            _context.Comunidades.Remove(entity);
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
