using api.DTOs;
using api.DTOs.Comunidad;

using api.Models;
using api.Repositories;

namespace api.Services.Tags
{
    public class TagService (IRepository<Tag> tagRepository)
    {
        public Task<IEnumerable<Tag>> GetAllAsync() => tagRepository.GetAllAsync();
        
        public Task<Tag?> GetByIdAsync(object id) => tagRepository.GetByIdAsync(id);

        public async Task<TagDto> AddAsync(Tag tag)
        {
            await tagRepository.AddAsync(tag);
            await tagRepository.SaveChangesAsync();

            return new TagDto
            {
                Id = tag.Id,
                Nombre = tag.Nombre,
            };
        }

        public async Task UpdateAsync(Tag tag)
        {
            tagRepository.Update(tag);
            await tagRepository.SaveChangesAsync();
        }

        public async Task DeleteAsync(Tag tag)
        {
            tagRepository.Delete(tag);
            await tagRepository.SaveChangesAsync();
        }

    }
}
