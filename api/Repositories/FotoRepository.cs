using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using api.Contexts;

namespace api.Repositories
{
    public class FotoRepository(ZoneVitaeSqlContext context) : IRepository<Foto>
    {
        public async Task<IEnumerable<Foto>> GetAllAsync() => await context.Fotos.ToListAsync();
        public async Task<Foto?> GetByIdAsync(object id) => await context.Fotos.FindAsync(id);
        public Task<IEnumerable<Foto>> FindAsync(Expression<Func<Foto, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Foto>> FindWithIncludesAsync(Expression<Func<Foto, bool>> predicate, params Expression<Func<Foto, object>>[] includes)
        {
            throw new NotImplementedException();
        }

        public Task<Foto?> GetByIdWithIncludesAsync(object id, params Expression<Func<Foto, object>>[] includes)
        {
            throw new NotImplementedException();
        }

        public async Task AddAsync(Foto entity) => await context.Fotos.AddAsync(entity);
        public void Update(Foto entity) => context.Fotos.Update(entity);
        public void Delete(Foto entity) => context.Fotos.Remove(entity);
        public async Task SaveChangesAsync() => await context.SaveChangesAsync();
    }
}
