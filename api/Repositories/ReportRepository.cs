using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Repositories
{
    public class ReportRepository(ZoneVitaeSqlContext context) : IRepository<Report>
    {
        public async Task<IEnumerable<Report>> GetAllAsync() => await context.Reports.ToListAsync();
        public async Task<Report?> GetByIdAsync(object id) => await context.Reports.FindAsync(id);
        public async Task AddAsync(Report entity) => await context.Reports.AddAsync(entity);
        public void Update(Report entity) => context.Reports.Update(entity);
        public void Delete(Report entity) => context.Reports.Remove(entity);
        public async Task SaveChangesAsync() => await context.SaveChangesAsync();
    }
}
