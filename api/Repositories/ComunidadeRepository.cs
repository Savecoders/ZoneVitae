using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Repositories
{
    public class ComunidadeRepository(ZoneVitaeSqlContext context) : IRepository<Comunidade>
    {
        public async Task<IEnumerable<Comunidade>> GetAllAsync() => await context.Comunidades.ToListAsync();
        public async Task<Comunidade?> GetByIdAsync(object id) => await context.Comunidades.FindAsync(id);
        public async Task AddAsync(Comunidade entity) => await context.Comunidades.AddAsync(entity);
        public void Update(Comunidade entity) => context.Comunidades.Update(entity);
        public void Delete(Comunidade entity) => context.Comunidades.Remove(entity);
        public async Task SaveChangesAsync() => await context.SaveChangesAsync();
    }
}
