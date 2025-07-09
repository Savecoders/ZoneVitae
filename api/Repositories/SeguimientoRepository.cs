using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using api.Contexts;

namespace api.Repositories
{
    public class SeguimientoRepository(ZoneVitaeSqlContext context) : IRepository<SeguimientoReporte>
    {
        
        public async Task<IEnumerable<SeguimientoReporte>> GetAllAsync() => await context.SeguimientoReportes.ToListAsync();

        public async Task<SeguimientoReporte?> GetByIdAsync(object id) => await context.SeguimientoReportes.FindAsync(id);

        public Task<IEnumerable<SeguimientoReporte>> FindAsync(Expression<Func<SeguimientoReporte, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<SeguimientoReporte>> FindWithIncludesAsync(Expression<Func<SeguimientoReporte, bool>> predicate, params Expression<Func<SeguimientoReporte, object>>[] includes)
        {
            throw new NotImplementedException();
        }

        public Task<SeguimientoReporte?> GetByIdWithIncludesAsync(object id, params Expression<Func<SeguimientoReporte, object>>[] includes)
        {
            throw new NotImplementedException();
        }
      

      public async Task<IEnumerable<SeguimientoReporte>> GetByReporteIdAsync(long reporteId)
{
    return await context.SeguimientoReportes
        .Where(s => s.ReporteId == reporteId)
        .ToListAsync();
}
        public async Task AddAsync(SeguimientoReporte entity) => await context.SeguimientoReportes.AddAsync(entity);

        public void Update(SeguimientoReporte entity) => context.SeguimientoReportes.Update(entity);

        public void Delete(SeguimientoReporte entity) => context.SeguimientoReportes.Remove(entity);

        public async Task SaveChangesAsync() => await context.SaveChangesAsync();
    }
}