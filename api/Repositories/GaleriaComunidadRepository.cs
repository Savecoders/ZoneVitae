using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace api.Repositories
{
    public class GaleriaComunidadRepository(ZoneVitaeSqlContext context) : IRepository<GaleriaComunidad>
    {
        public async Task<IEnumerable<GaleriaComunidad>> GetAllAsync() => await context.GaleriaComunidads.ToListAsync();
        public async Task<GaleriaComunidad?> GetByIdAsync(object id) => await context.GaleriaComunidads.FindAsync(id);
        public Task<IEnumerable<GaleriaComunidad>> FindAsync(Expression<Func<GaleriaComunidad, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<GaleriaComunidad>> FindWithIncludesAsync(Expression<Func<GaleriaComunidad, bool>> predicate, params Expression<Func<GaleriaComunidad, object>>[] includes)
        {
            throw new NotImplementedException();
        }

        public Task<GaleriaComunidad?> GetByIdWithIncludesAsync(object id, params Expression<Func<GaleriaComunidad, object>>[] includes)
        {
            throw new NotImplementedException();
        }

        public async Task AddAsync(GaleriaComunidad entity) => await context.GaleriaComunidads.AddAsync(entity);
        public void Update(GaleriaComunidad entity) => context.GaleriaComunidads.Update(entity);
        public void Delete(GaleriaComunidad entity) => context.GaleriaComunidads.Remove(entity);
        public async Task SaveChangesAsync() => await context.SaveChangesAsync();
    }
}
