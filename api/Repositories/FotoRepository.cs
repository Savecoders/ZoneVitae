using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using api.Contexts;

namespace api.Repositories
{
    public class FotoRepository : IRepository<Foto>
    {
        private readonly ZoneVitaeSqlContext context;

        public FotoRepository(ZoneVitaeSqlContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<Foto>> GetAllAsync() => await context.Fotos.ToListAsync();

        public async Task<Foto?> GetByIdAsync(object id) => await context.Fotos.FindAsync(id);

        public async Task<IEnumerable<Foto>> FindAsync(Expression<Func<Foto, bool>> predicate)
        {
            return await context.Fotos.Where(predicate).ToListAsync();
        }

        public async Task<Foto?> GetByIdWithIncludesAsync(object id, params Expression<Func<Foto, object>>[] includes)
        {
            IQueryable<Foto> query = context.Fotos;

            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            var key = (long)id;

            return await query.FirstOrDefaultAsync(f => f.Id == key);
        }

        public Task<IEnumerable<Foto>> FindWithIncludesAsync(Expression<Func<Foto, bool>> predicate, params Expression<Func<Foto, object>>[] includes)
        {
            IQueryable<Foto> query = context.Fotos.Where(predicate);

            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return query.ToListAsync().ContinueWith(t => (IEnumerable<Foto>)t.Result);
        }

        public async Task AddAsync(Foto entity) => await context.Fotos.AddAsync(entity);

        public void Update(Foto entity) => context.Fotos.Update(entity);

        public void Delete(Foto entity) => context.Fotos.Remove(entity);

        public async Task SaveChangesAsync() => await context.SaveChangesAsync();
    }
}
