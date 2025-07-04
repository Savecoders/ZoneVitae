using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using api.Contexts;

namespace api.Repositories
{
    public class ComunidadeRepository(ZoneVitaeSqlContext context) : IRepository<Comunidade>
    {
        public async Task<IEnumerable<Comunidade>> GetAllAsync() => await context.Comunidades.ToListAsync();
        public async Task<Comunidade?> GetByIdAsync(object id) => await context.Comunidades.FindAsync(id);
        public Task<IEnumerable<Comunidade>> FindAsync(Expression<Func<Comunidade, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Comunidade>> FindWithIncludesAsync(Expression<Func<Comunidade, bool>> predicate, params Expression<Func<Comunidade, object>>[] includes)
        {
            throw new NotImplementedException();
        }

        public Task<Comunidade?> GetByIdWithIncludesAsync(object id, params Expression<Func<Comunidade, object>>[] includes)
        {
            throw new NotImplementedException();
        }

        public async Task AddAsync(Comunidade entity) => await context.Comunidades.AddAsync(entity);
        public void Update(Comunidade entity) => context.Comunidades.Update(entity);
        public void Delete(Comunidade entity) => context.Comunidades.Remove(entity);
        public async Task SaveChangesAsync() => await context.SaveChangesAsync();
    }
}
