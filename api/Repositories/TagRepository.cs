using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using api.Contexts;

namespace api.Repositories
{
    public class TagRepository(ZoneVitaeSqlContext context) : IRepository<Tag>
    {
        public async Task<IEnumerable<Tag>> GetAllAsync() => await context.Tags.ToListAsync();
        public async Task<Tag?> GetByIdAsync(object id) => await context.Tags.FindAsync(id);
        public Task<IEnumerable<Tag>> FindAsync(Expression<Func<Tag, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Tag>> FindWithIncludesAsync(Expression<Func<Tag, bool>> predicate, params Expression<Func<Tag, object>>[] includes)
        {
            throw new NotImplementedException();
        }

        public Task<Tag?> GetByIdWithIncludesAsync(object id, params Expression<Func<Tag, object>>[] includes)
        {
            throw new NotImplementedException();
        }

        public async Task AddAsync(Tag entity) => await context.Tags.AddAsync(entity);
        public void Update(Tag entity) => context.Tags.Update(entity);
        public void Delete(Tag entity) => context.Tags.Remove(entity);
        public async Task SaveChangesAsync() => await context.SaveChangesAsync();
    }
}
