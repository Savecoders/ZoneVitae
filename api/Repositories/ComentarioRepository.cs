using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace api.Repositories
{
    public class ComentarioRepository(ZoneVitaeSqlContext context) : IRepository<Comentario>
    {
        public async Task<IEnumerable<Comentario>> GetAllAsync() => await context.Comentarios.ToListAsync();
        public async Task<Comentario?> GetByIdAsync(object id) => await context.Comentarios.FindAsync(id);
        public Task<IEnumerable<Comentario>> FindAsync(Expression<Func<Comentario, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Comentario>> FindWithIncludesAsync(Expression<Func<Comentario, bool>> predicate, params Expression<Func<Comentario, object>>[] includes)
        {
            throw new NotImplementedException();
        }

        public Task<Comentario?> GetByIdWithIncludesAsync(object id, params Expression<Func<Comentario, object>>[] includes)
        {
            throw new NotImplementedException();
        }

        public async Task AddAsync(Comentario entity) => await context.Comentarios.AddAsync(entity);
        public void Update(Comentario entity) => context.Comentarios.Update(entity);
        public void Delete(Comentario entity) => context.Comentarios.Remove(entity);
        public async Task SaveChangesAsync() => await context.SaveChangesAsync();
    }
}
