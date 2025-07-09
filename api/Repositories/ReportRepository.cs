using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using api.Contexts;

namespace api.Repositories
{
    public class ReportRepository(ZoneVitaeSqlContext context) : IRepository<Report>
    {
        public async Task<IEnumerable<Report>> GetAllAsync() => await context.Reports.ToListAsync();
        public async Task<Report?> GetByIdAsync(object id) => await context.Reports.FindAsync(id);
        public Task<IEnumerable<Report>> FindAsync(Expression<Func<Report, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public async Task<Report?> GetByIdWithIncludesAsync(object id, params Expression<Func<Report, object>>[] includes)
        {
            IQueryable<Report> query = context.Reports;

            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return await query.FirstOrDefaultAsync(r => r.Id == (long)id);
        }


        public async Task<IEnumerable<Report>> FindWithIncludesAsync(Expression<Func<Report, bool>> predicate, params Expression<Func<Report, object>>[] includes)
        {
            IQueryable<Report> query = context.Reports.Where(predicate);

            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return await query.ToListAsync();
        }



        public async Task AddAsync(Report entity) => await context.Reports.AddAsync(entity);
        public void Update(Report entity) => context.Reports.Update(entity);
        public void Delete(Report entity) => context.Reports.Remove(entity);
        public async Task SaveChangesAsync() => await context.SaveChangesAsync();
    }
}
